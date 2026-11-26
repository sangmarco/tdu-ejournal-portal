import Link from 'next/link';
import { notFound } from 'next/navigation';
import { journals, journalArticles, issueDetail } from '@/lib/ojs/multiJournal';
import { label, id as validId } from '@/lib/ojs/publicModel';

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
  return <article className="mx-auto w-full max-w-6xl space-y-8 px-4 py-12 [overflow-wrap:anywhere]">
    <nav aria-label={vi ? 'Đường dẫn' : 'Breadcrumb'} className="flex flex-wrap gap-3 text-blue-700 underline">
      <Link href={`/${locale}/journals/${slug}`}>{journal.name}</Link>
      <Link href={`/${locale}/journals/${slug}/issues/${article.issueId}`}>{issue ? issue.identification || label(issue.title, locale) || (vi ? 'Mục lục' : 'Contents') : (vi ? 'Mục lục' : 'Contents')}</Link>
    </nav>
    <header className="space-y-4">
      <p className="text-sm text-slate-600">{label(article.sectionName, locale)}</p>
      <h1 className="text-3xl font-bold leading-tight">{label(article.title, locale)}</h1>
      {Object.entries(article.title).filter(([, title]) => title && title !== label(article.title, locale)).map(([language, title]) => <p key={language} lang={language.replace('_', '-')} className="text-xl">{title}</p>)}
      {article.authorsString && <p>{article.authorsString}</p>}
      {article.urlPublished && <a className="inline-block rounded bg-[#205778] px-4 py-2 text-white" href={article.urlPublished}>{vi ? 'Đọc bài trên OJS' : 'Read on OJS'}</a>}
    </header>
    <div className="grid min-w-0 max-w-full gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <section className="min-w-0 space-y-4"><h2 className="text-xl font-semibold">{vi ? 'Tóm tắt' : 'Abstract'}</h2>
        {Object.values(article.abstract).some(Boolean) ? Object.entries(article.abstract).filter(([, text]) => text).map(([language, text]) => <p key={language} lang={language.replace('_', '-')} className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{text}</p>) : <p className="text-slate-600">{vi ? 'Nguồn công khai hiện chưa cung cấp tóm tắt.' : 'An abstract is not currently available from the public source.'}</p>}
        {!!article.oaiMetadata?.subjects.length && <div className="min-w-0"><h2 className="text-xl font-semibold">{vi ? 'Từ khóa' : 'Keywords'}</h2><ul className="flex flex-wrap gap-2">{article.oaiMetadata.subjects.map((subject, index) => <li key={index} lang={subject.lang?.replace('_', '-')} className="max-w-full break-words rounded bg-slate-100 px-3 py-1 [overflow-wrap:anywhere]">{subject.value}</li>)}</ul></div>}
      </section>
      <aside className="min-w-0 rounded border bg-slate-50 p-5"><h2 className="mb-4 text-xl font-semibold">{vi ? 'Thông tin bài báo' : 'Article information'}</h2><dl className="space-y-3">
        {article.datePublished && <div><dt className="font-medium">{vi ? 'Ngày xuất bản' : 'Published'}</dt><dd>{article.datePublished}</dd></div>}
        {article.language && <div><dt className="font-medium">{vi ? 'Ngôn ngữ' : 'Language'}</dt><dd>{article.language}</dd></div>}
        {article.pages && <div><dt className="font-medium">{vi ? 'Trang' : 'Pages'}</dt><dd>{article.pages}</dd></div>}
      </dl></aside>
    </div>
  </article>;
}
