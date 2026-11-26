// Server-only public OJS service; no privileged credentials or arbitrary proxy URLs.
import { record, rows, mapIssue, mapArticles, label, id } from './publicModel';
import { fetchOaiRecords } from './oai';
import { mergeOaiMetadata } from './metadataMerge';
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
  const projection = process.env.OJS_PUBLIC_PROJECTION === 'true';
  const url = new URL(base() + '/' + path + '/api/v1/' + (projection ? 'publicPublications/' : '') + endpoint);
  for (const [k,v] of Object.entries(params || {})) url.searchParams.set(k,v);
  const res = await fetch(url,{headers:{Accept:'application/json'}, redirect:'error', credentials:'omit', signal:AbortSignal.timeout(10000), ...(projection ? {cache:'no-store' as const} : {next:{revalidate:60}})});
  if (!res.ok) throw new Error('OJS HTTP ' + res.status);
  const reader = res.body?.getReader();
  if (!reader) throw new Error('Empty OJS response');
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4 * 1024 * 1024) throw new Error('OJS response limit exceeded');
      chunks.push(value);
    }
  } finally { await reader.cancel(); }
  const body = record(JSON.parse(Buffer.concat(chunks).toString('utf8')));
  if (projection && body.contract !== 'public-publications-v1') throw new Error('Unexpected projection contract');
  return body;
}
export function safePublicUrl(path:string, value:string) {
  if (!value) return '';
  try {
    const upstream = new URL(base() + '/' + path + '/');
    const url = new URL(value);
    if (url.origin !== upstream.origin || !url.pathname.startsWith(upstream.pathname) || url.username || url.password) return '';
    const relative = url.pathname.slice(upstream.pathname.length);
    // Only reader-facing article/issue views; never workflow or arbitrary query links.
    if (!/^(?:[a-z]{2}(?:_[A-Z]{2})?\/)?(?:article|issue)\/view\/[^/]+\/?$/.test(relative) || url.search || url.hash) return '';
    const target = new URL(publicJournalUrl(path) + '/');
    return new URL(relative, target).toString();
  } catch { return ''; }
}
export function safeCoverUrl(value: string) {
  if (!value) return '';
  try {
    const upstream = new URL(base() + '/');
    const url = new URL(value);
    if (url.origin !== upstream.origin || url.username || url.password || url.search || url.hash) return '';
    if (!/^\/.*\/public\/journals\/\d+\/[a-zA-Z0-9._-]+\.(?:jpe?g|png|webp)$/i.test(url.pathname)) return '';
    return url.toString();
  } catch { return ''; }
}
export async function issueList(path:string) {
  const result: NonNullable<ReturnType<typeof mapIssue>>[] = [];
  const seen = new Set<number>();
  let offset = 0;
  for (let page=0; page<100; page++) {
    const body = await request(path,'issues',{count:'100',offset:String(offset),isPublished:'1'});
    if (!Array.isArray(body.items) || !Number.isSafeInteger(body.itemsMax) || (body.itemsMax as number) < 0) throw new Error('Unexpected OJS list');
    const items = rows(body.items);
    for (const raw of items) {
      const issue = mapIssue(raw,path);
      if (issue && !seen.has(issue.id)) {
        seen.add(issue.id);
        const cleanCovers = Object.fromEntries(
          Object.entries(issue.coverUrl).map(([k, v]) => [k, safeCoverUrl(v)]).filter(([, v]) => Boolean(v))
        );
        result.push({...issue,publishedUrl:safePublicUrl(path,issue.publishedUrl),coverUrl:cleanCovers});
      }
    }
    offset += items.length;
    if (offset >= (body.itemsMax as number)) return result;
    if (!items.length) throw new Error('Incomplete OJS pagination');
  }
  throw new Error('OJS pagination limit exceeded');
}
export async function issueDetail(path:string, issueId:number) {
  if (!id(issueId)) return null;
  const listed = (await issueList(path)).find(issue => issue.id === issueId);
  if (!listed) return null;
  const raw = await request(path,'issues/'+issueId);
  const issue = mapIssue(raw,path);
  if (!issue || issue.id !== issueId || issue.journalId !== listed.journalId) return null;
  const cleanIssueCovers = Object.fromEntries(
    Object.entries(issue.coverUrl).map(([k, v]) => [k, safeCoverUrl(v)]).filter(([, v]) => Boolean(v))
  );
  return {
    ...issue,
    publishedUrl:safePublicUrl(path,issue.publishedUrl),
    coverUrl: cleanIssueCovers,
    articles:mapArticles(raw,path).map(a=>{
      const cleanArticleCovers = Object.fromEntries(
        Object.entries(a.coverUrl).map(([k, v]) => [k, safeCoverUrl(v)]).filter(([, v]) => Boolean(v))
      );
      return {...a,urlPublished:safePublicUrl(path,a.urlPublished),coverUrl:cleanArticleCovers};
    })
  };
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
  const articles = [...new Map(result.map(a=>[a.id,a])).values()].sort((a,b)=>b.datePublished.localeCompare(a.datePublished));
  if (!articles.length || process.env.OJS_OAI_ENABLED !== 'true') return mergeOaiMetadata(articles, []);
  const locale = process.env.OJS_OAI_LOCALE || '';
  try {
    if (locale && !/^[a-z]{2}(?:_[A-Z]{2})?$/.test(locale)) throw new Error('Invalid OAI locale');
    const records = await fetchOaiRecords(`${base()}/${path}/${locale ? locale + '/' : ''}oai`);
    // Apply the same approved public-base translation to both identity sources.
    const publicRecords = records.map(record => ({ ...record, fields: { ...record.fields,
      identifier: (record.fields.identifier || []).map(value => ({ ...value, value: safePublicUrl(path, value.value) }))
    } }));
    return mergeOaiMetadata(articles, publicRecords);
  } catch {
    // Optional metadata failure must not hide REST-confirmed published articles.
    console.warn('OAI enrichment unavailable for configured journal');
    return mergeOaiMetadata(articles, []);
  }
}
export function publicJournalUrl(path:string) {
  if (!validPath(path)) throw new Error('Invalid journal');
  const origin = process.env.OJS_PUBLIC_BASE_URL?.replace(/\/$/,'') || base();
  const url = new URL(origin+'/'+path);
  if (!['http:','https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error('Invalid public URL');
  return url.toString();
}
