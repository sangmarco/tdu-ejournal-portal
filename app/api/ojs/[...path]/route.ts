import { journals, issueList, issueDetail, journalArticles } from '@/lib/ojs/multiJournal';
import { label } from '@/lib/ojs/publicModel';
const json=(value:unknown,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(request:Request,context:{params:Promise<{path:string[]}>}) {
  const path=(await context.params).path.join('/');
  const q=new URL(request.url).searchParams;
  const registry=await journals('vi');
  const slug=q.get('journal') || registry[0]?.path;
  if(!slug || !registry.some(j=>j.path===slug)) return json({message:'Configure OJS_PUBLIC_JOURNALS or select a known journal'},404);
  const journal=registry.find(j=>j.path===slug)!;
  const limit=Math.min(100,Math.max(1,Number.parseInt(q.get('perPage')||'20',10)||20));
  const offset=(Math.max(1,Number.parseInt(q.get('page')||'1',10)||1)-1)*limit;
  const page=<T,>(data:T[])=>({data:data.slice(offset,offset+limit),total:data.length,limit,offset});
  const legacyArticle=(a:Awaited<ReturnType<typeof journalArticles>>[number])=>({...a,status:7}); // compatibility with old display model only
  try {
    if(path==='journals/1'||path==='journals/1/settings') return json({name:{vi:journal.name,en:journal.name},issues:await issueList(slug),sections:[],categories:[],supportedLocales:['vi','en']});
    if(path==='issues') {
      const year=q.get('filter[year]');
      return json(page((await issueList(slug)).filter(i=>!year||String(i.year)===year)));
    }
    if(path==='issues/current') {
      const current=(await issueList(slug)).find(i=>i.current);
      if(!current) return json(null);
      const detail=await issueDetail(slug,current.id);
      return json(detail?{...detail,articles:detail.articles.map(legacyArticle)}:null);
    }
    const issue=/^issues\/(\d+)(\/articles)?$/.exec(path);
    if(issue) {
      const data=await issueDetail(slug,Number(issue[1]));
      if(!data) return json({message:'Published issue not found'},404);
      return json(issue[2]?page(data.articles.map(legacyArticle)):{...data,articles:data.articles.map(legacyArticle)});
    }
    const article=/^articles\/(\d+)$/.exec(path);
    if(article || path==='articles' || path==='articles/search') {
      const all=await journalArticles(slug);
      if(article) {const a=all.find(a=>a.id===Number(article[1]));return a?json(legacyArticle(a)):json({message:'Published article not found'},404);}
      const term=(q.get('filter[q]')||'').toLocaleLowerCase();
      return json(page(all.filter(a=>!term||[label(a.title,'vi'),label(a.title,'en'),a.authorsString].join(' ').toLocaleLowerCase().includes(term)).map(legacyArticle)));
    }
    return json({message:'Unsupported public resource'},404);
  }catch{return json({message:'Cannot load public OJS data'},502);}
}
