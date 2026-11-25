// Server-side public read model. Never attach an administrative token.
type Row = Record<string, unknown>;
export type Journal = { path: string; name: string };
export type Issue = { id: number; title: string; year: string; volume: string; number: string; current: boolean };
const validPath = (s: string) => /^[A-Za-z0-9_-]+$/.test(s) && s !== 'index';
const row = (v: unknown): v is Row => !!v && typeof v === 'object' && !Array.isArray(v);
function local(v: unknown, locale: string): string {
  if (typeof v === 'string') return v;
  if (!row(v)) return '';
  const candidate = v[locale] ?? v[locale === 'vi' ? 'vi_VN' : 'en_US'] ?? Object.values(v).find(x => typeof x === 'string');
  return typeof candidate === 'string' ? candidate : '';
}
function base() {
  if (typeof window !== 'undefined') throw new Error('Server only');
  const url = new URL(process.env.OJS_BASE_URL || 'http://localhost/ojs/index.php');
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error('Invalid OJS base URL');
  return url.toString().replace(/\/$/, '');
}
async function list(path: string, resource: 'contexts' | 'issues'): Promise<Row[]> {
  const output: Row[] = [];
  for (let offset = 0; offset < 10000; offset += 100) {
    const url = new URL(base() + '/' + path + '/api/v1/' + resource);
    url.searchParams.set('count', '100');
    url.searchParams.set('offset', String(offset));
    if (resource === 'issues') url.searchParams.set('isPublished', 'true');
    const response = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(10000), redirect: 'error', next: { revalidate: 60 } });
    if (!response.ok) throw new Error('OJS HTTP ' + response.status);
    const body: unknown = await response.json();
    if (!row(body) || !Array.isArray(body.items) || !body.items.every(row)) throw new Error('Unexpected OJS list schema');
    output.push(...body.items);
    if (body.items.length === 0 || (typeof body.itemsMax === 'number' && output.length >= body.itemsMax) || body.items.length < 100) return output;
  }
  throw new Error('OJS pagination limit exceeded');
}
export async function journals(locale: string): Promise<Journal[]> {
  // Explicit operator-approved fallback for installations that restrict contexts.
  const configured = [...new Set((process.env.OJS_PUBLIC_JOURNALS || '').split(',').map(s => s.trim()).filter(validPath))];
  if (configured.length) return configured.map(path => ({ path, name: path }));
  const items = await list('index', 'contexts');
  return items.flatMap(item => typeof item.path === 'string' && validPath(item.path) && (item.enabled === true || item.enabled === 1) ? [{ path: item.path, name: local(item.name, locale) || item.path }] : []);
}
export async function issues(path: string, locale: string): Promise<Issue[]> {
  if (!validPath(path)) throw new Error('Invalid journal');
  if (!(await journals(locale)).some(j => j.path === path)) throw new Error('Unknown journal');
  const items = await list(path, 'issues');
  return items.flatMap(item => {
    if (!(item.published === true || item.published === 1) || typeof item.id !== 'number' || !Number.isSafeInteger(item.id) || item.id <= 0) return [];
    const scalar = (v: unknown) => typeof v === 'string' || typeof v === 'number' ? String(v) : '';
    return [{ id: item.id, title: local(item.title, locale), year: scalar(item.year), volume: scalar(item.volume), number: scalar(item.number), current: item.current === true || item.current === 1 }];
  });
}
export function publicJournalUrl(path: string) {
  if (!validPath(path)) throw new Error('Invalid journal');
  const origin = process.env.OJS_PUBLIC_BASE_URL?.replace(/\/$/, '') || base();
  const url = new URL(origin + '/' + path);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid public URL');
  return url.toString();
}
