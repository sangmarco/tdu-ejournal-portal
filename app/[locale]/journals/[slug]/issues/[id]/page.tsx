/* eslint-disable @next/next/no-img-element */
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
  const issueCover = label(issue.coverUrl, locale);
  return <section className="mx-auto max-w-6xl space-y-8 px-4 py-12">
    <div>
      <Link href={`/${locale}/journals/${slug}`} className="text-[#205778] underline">{vi?'← Tạp chí':'← Journal'}</Link>
    </div>

    <div className="flex flex-col sm:flex-row gap-6 items-start border-b pb-6">
      {issueCover && (
        <div className="shrink-0">
          <img
            src={issueCover}
            alt=""
            className="h-52 w-auto max-w-[160px] rounded border object-cover shadow-xs"
            loading="lazy"
          />
        </div>
      )}
      <div className="space-y-3 min-w-0 flex-1">
        <h1 className="text-3xl font-bold text-[#205778]">{issue.identification || label(issue.title,locale)}</h1>
        {issue.datePublished && <p className="text-sm text-slate-600">{vi ? 'Ngày xuất bản: ' : 'Published: '}{issue.datePublished}</p>}
        {issue.publishedUrl && <a href={issue.publishedUrl} className="inline-block text-[#205778] underline text-sm">{vi ? 'Xem số này trên OJS ↗' : 'View this issue on OJS ↗'}</a>}
      </div>
    </div>

    <h2 className="text-2xl font-semibold">{vi?'Mục lục các bài báo':'Table of contents'}</h2>
    {issue.articles.length===0 && <p>{vi?'Chưa có bài báo công khai.':'No public articles.'}</p>}
    <div className="space-y-4">
      {issue.articles.map(a=>{
        const articleCover = label(a.coverUrl, locale);
        return (
          <article key={a.id} className="flex flex-col sm:flex-row gap-4 rounded border p-5">
            {articleCover && (
              <div className="shrink-0">
                <img
                  src={articleCover}
                  alt=""
                  className="h-28 w-auto max-w-[90px] rounded border object-cover shadow-2xs"
                  loading="lazy"
                />
              </div>
            )}
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-sm text-gray-500">{label(a.sectionName,locale)} · {a.language} · {a.datePublished}</p>
              <h3 className="text-lg font-semibold"><Link className="text-[#205778] underline" href={`/${locale}/journals/${slug}/articles/${a.id}`}>{label(a.title,locale)}</Link></h3>
              {a.authorsString && <p className="text-sm text-slate-700">{a.authorsString}</p>}
              {a.urlPublished && <div><a href={a.urlPublished} className="text-[#205778] underline text-sm">{vi?'Đọc bài trên OJS ↗':'Read on OJS ↗'}</a></div>}
            </div>
          </article>
        );
      })}
    </div>
  </section>;
}
