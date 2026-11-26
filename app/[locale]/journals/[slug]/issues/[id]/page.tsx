import Link from 'next/link';
import { notFound } from 'next/navigation';
import { journals, issueDetail } from '@/lib/ojs/multiJournal';
import { label } from '@/lib/ojs/publicModel';
export default async function Page({params}:{params:Promise<{locale:string;slug:string;id:string}>}) {
  const {locale,slug,id}=await params;
  const vi=locale==='vi';
  if (!(await journals(locale)).some(j=>j.path===slug) || !/^\d+$/.test(id)) notFound();
  const result=await issueDetail(slug,Number(id)).then(issue=>({issue,failed:false})).catch(()=>({issue:null,failed:true}));
  if(result.failed) return <p role="alert" className="p-8">{vi?'Không thể tải mục lục OJS.':'Unable to load OJS contents.'}</p>;
  if(!result.issue) notFound();
  const issue=result.issue;
  return <section className="mx-auto max-w-6xl space-y-6 px-4 py-12">
    <Link href={`/${locale}/journals/${slug}`} className="text-blue-700">{vi?'← Tạp chí':'← Journal'}</Link>
    <h1 className="text-3xl font-bold">{issue.identification || label(issue.title,locale)}</h1>
    <h2 className="text-xl font-semibold">{vi?'Mục lục':'Table of contents'}</h2>
    {issue.articles.length===0 && <p>{vi?'Chưa có bài báo công khai.':'No public articles.'}</p>}
    {issue.articles.map(a=><article key={a.id} className="space-y-2 rounded border p-5">
      <p className="text-sm text-gray-500">{label(a.sectionName,locale)} · {a.language} · {a.datePublished}</p>
      <h3 className="text-lg font-semibold"><Link className="text-blue-700 underline" href={`/${locale}/journals/${slug}/articles/${a.id}`}>{label(a.title,locale)}</Link></h3><p>{a.authorsString}</p>
      {a.urlPublished && <a href={a.urlPublished} className="text-blue-700 underline">{vi?'Đọc bài trên OJS':'Read on OJS'}</a>}
    </article>)}
  </section>;
}
