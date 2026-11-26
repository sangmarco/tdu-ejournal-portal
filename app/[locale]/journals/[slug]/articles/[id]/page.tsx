/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { journals, journalArticles, issueDetail } from '@/lib/ojs/multiJournal';
import { label, id as validId } from '@/lib/ojs/publicModel';
import { ArticleActions } from '@/components/article/ArticleActions';

export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string; id: string }> }) {
  const { locale, slug, id } = await params;
  const vi = locale === 'vi';
  const journal = (await journals(locale)).find(j => j.path === slug);
  if (!journal || !/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) notFound();
  const result = await journalArticles(slug).then(articles => ({ articles, failed: false })).catch(() => ({ articles: [], failed: true }));
  if (result.failed) return <p role="alert" className="p-8">{vi ? 'Không thể tải bài báo từ OJS. Vui lòng thử lại.' : 'Unable to load the article from OJS. Please try again.'}</p>;
  const article = result.articles.find(a => a.id === Number(id));
  if (!article) notFound();
  const issue = validId(article.issueId) ? await issueDetail(slug, article.issueId).catch(() => null) : null;

  const citationData = {
    title: label(article.title, locale),
    authors: article.authorsString,
    journalName: journal.name,
    year: article.datePublished ? article.datePublished.slice(0, 4) : (issue?.year ? String(issue.year) : ''),
    volume: issue?.volume,
    number: issue?.number,
    pages: article.pages,
    url: article.urlPublished,
  };

  return <article className="mx-auto w-full max-w-6xl space-y-8 px-4 py-12 [overflow-wrap:anywhere]">
    <nav aria-label={vi ? 'Đường dẫn' : 'Breadcrumb'} className="flex flex-wrap gap-3 text-blue-700 underline">
      <Link href={`/${locale}/journals/${slug}`}>{journal.name}</Link>
      <Link href={`/${locale}/journals/${slug}/issues/${article.issueId}`}>{issue ? issue.identification || label(issue.title, locale) || (vi ? 'Mục lục' : 'Contents') : (vi ? 'Mục lục' : 'Contents')}</Link>
    </nav>
    <header className="space-y-4">
      <p className="text-sm text-slate-600">{label(article.sectionName, locale)}</p>
      <h1 className="text-3xl font-bold leading-tight text-[#205778]">{label(article.title, locale)}</h1>
      {Object.entries(article.title).filter(([, title]) => title && title !== label(article.title, locale)).map(([language, title]) => <p key={language} lang={language.replace('_', '-')} className="text-xl text-slate-700">{title}</p>)}
      {article.authorsString && <p className="text-lg font-medium text-slate-800">{article.authorsString}</p>}
      <div className="flex flex-wrap gap-3 pt-2">
        {article.urlPublished && <a className="inline-block rounded bg-[#205778] px-4 py-2 text-white font-medium hover:bg-[#18445e] transition-colors" href={article.urlPublished}>{vi ? 'Đọc toàn văn trên OJS ↗' : 'Read full text on OJS ↗'}</a>}
      </div>
    </header>
    <div className="grid min-w-0 max-w-full gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <section className="min-w-0 space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">{vi ? 'Tóm tắt' : 'Abstract'}</h2>
          {Object.values(article.abstract).some(Boolean) ? Object.entries(article.abstract).filter(([, text]) => text).map(([language, text]) => <p key={language} lang={language.replace('_', '-')} className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] leading-relaxed text-slate-700">{text}</p>) : <p className="text-slate-600">{vi ? 'Nguồn công khai hiện chưa cung cấp tóm tắt.' : 'An abstract is not currently available from the public source.'}</p>}
        </div>
        {!!article.oaiMetadata?.subjects.length && <div className="min-w-0 space-y-3"><h2 className="text-xl font-semibold text-slate-900">{vi ? 'Từ khóa' : 'Keywords'}</h2><ul className="flex flex-wrap gap-2">{article.oaiMetadata.subjects.map((subject, index) => <li key={index} lang={subject.lang?.replace('_', '-')} className="max-w-full break-words rounded bg-slate-100 px-3 py-1 text-sm text-slate-700 [overflow-wrap:anywhere]">{subject.value}</li>)}</ul></div>}
        <ArticleActions citation={citationData} locale={locale} />
      </section>
      <aside className="min-w-0 rounded border bg-slate-50 p-5 space-y-5">
        {label(article.coverUrl, locale) && (
          <div>
            <img
              src={label(article.coverUrl, locale)}
              alt=""
              className="w-full max-w-[200px] h-auto rounded border object-cover shadow-xs mx-auto"
              loading="lazy"
            />
          </div>
        )}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-slate-900">{vi ? 'Thông tin bài báo' : 'Article information'}</h2>
          <dl className="space-y-3 text-sm">
            {article.datePublished && <div><dt className="font-medium text-slate-700">{vi ? 'Ngày xuất bản' : 'Published'}</dt><dd className="text-slate-600">{article.datePublished}</dd></div>}
            {article.language && <div><dt className="font-medium text-slate-700">{vi ? 'Ngôn ngữ' : 'Language'}</dt><dd className="text-slate-600">{article.language}</dd></div>}
            {article.pages && <div><dt className="font-medium text-slate-700">{vi ? 'Trang' : 'Pages'}</dt><dd className="text-slate-600">{article.pages}</dd></div>}
            {issue && <div><dt className="font-medium text-slate-700">{vi ? 'Số tạp chí' : 'Issue'}</dt><dd className="text-slate-600"><Link href={`/${locale}/journals/${slug}/issues/${issue.id}`} className="text-[#205778] underline">{issue.identification || label(issue.title, locale)}</Link></dd></div>}
          </dl>
        </div>
      </aside>
    </div>
  </article>;
}
