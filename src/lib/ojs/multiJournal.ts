// Server-only public OJS service; no privileged credentials or arbitrary proxy URLs.
import { record, rows, mapIssue, mapArticles, label, id } from './publicModel';
export type Journal = { path: string; name: string };
const validPath = (s: string) => /^[A-Za-z0-9_-]+$/.test(s) && s !== 'index' && s !== '_';
function base() {
  if (typeof window !== 'undefined') throw new Error('Server only');
  const url = new URL(process.env.OJS_BASE_URL || 'http://localhost/ojs/index.php');
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error('Invalid OJS base URL');
  return url.toString().replace(/\/$/, '');
}
export async function journals(_locale: string): Promise<Journal[]> {
  void _locale;
  const paths = [...new Set((process.env.OJS_PUBLIC_JOURNALS || '').split(',').map(s => s.trim()).filter(validPath))];
  return paths.map(path => ({path, name: path}));
}
async function request(path: string, endpoint: string, params?: Record<string,string>) {
  if (!(await journals('vi')).some(j => j.path === path)) throw new Error('Unknown journal');
  const url = new URL(base() + '/' + path + '/api/v1/' + endpoint);
  for (const [k,v] of Object.entries(params || {})) url.searchParams.set(k,v);
  const res = await fetch(url,{headers:{Accept:'application/json'}, redirect:'error', signal:AbortSignal.timeout(10000), next:{revalidate:60}});
  if (!res.ok) throw new Error('OJS HTTP ' + res.status);
  return record(await res.json());
}
export function safePublicUrl(path:string, value:string) {
  if (!value) return '';
  try {
    const upstream = new URL(base() + '/' + path + '/');
    const url = new URL(value);
    if (url.origin !== upstream.origin || !url.pathname.startsWith(upstream.pathname) || url.username || url.password) return '';
    const target = new URL(publicJournalUrl(path) + '/');
    return new URL(url.pathname.slice(upstream.pathname.length) + url.search + url.hash, target).toString();
  } catch { return ''; }
}
export async function issueList(path:string) {
  const result: NonNullable<ReturnType<typeof mapIssue>>[] = [];
  const seen = new Set<number>();
  let offset = 0;
  for (let page=0; page<100; page++) {
    const body = await request(path,'issues',{count:'100',offset:String(offset),isPublished:'1'});
    if (!Array.isArray(body.items) || typeof body.itemsMax !== 'number') throw new Error('Unexpected OJS list');
    const items = rows(body.items);
    for (const raw of items) {
      const issue = mapIssue(raw,path);
      if (issue && !seen.has(issue.id)) { seen.add(issue.id); result.push({...issue,publishedUrl:safePublicUrl(path,issue.publishedUrl)}); }
    }
    offset += items.length;
    if (offset >= body.itemsMax) return result;
    if (!items.length) throw new Error('Incomplete OJS pagination');
  }
  throw new Error('OJS pagination limit exceeded');
}
export async function issueDetail(path:string, issueId:number) {
  if (!id(issueId)) return null;
  const raw = await request(path,'issues/'+issueId);
  const issue = mapIssue(raw,path);
  if (!issue || issue.id !== issueId) return null;
  return {...issue,publishedUrl:safePublicUrl(path,issue.publishedUrl),articles:mapArticles(raw,path).map(a=>({...a,urlPublished:safePublicUrl(path,a.urlPublished)}))};
}
export async function issues(path:string,locale:string) {
  return (await issueList(path)).map(i=>({...i,title:label(i.title,locale),year:String(i.year)}));
}
export async function journalArticles(path:string) {
  const all = await issueList(path);
  const result: NonNullable<Awaited<ReturnType<typeof issueDetail>>>['articles'] = [];
  for (let i=0;i<all.length;i+=4) {
    const group = await Promise.all(all.slice(i,i+4).map(issue=>issueDetail(path,issue.id)));
    for (const issue of group) if(issue) result.push(...issue.articles);
  }
  return [...new Map(result.map(a=>[a.id,a])).values()].sort((a,b)=>b.datePublished.localeCompare(a.datePublished));
}
export function publicJournalUrl(path:string) {
  if (!validPath(path)) throw new Error('Invalid journal');
  const origin = process.env.OJS_PUBLIC_BASE_URL?.replace(/\/$/,'') || base();
  const url = new URL(origin+'/'+path);
  if (!['http:','https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error('Invalid public URL');
  return url.toString();
}
