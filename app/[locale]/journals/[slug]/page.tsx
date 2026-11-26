import Link from 'next/link';
import { notFound } from 'next/navigation';
import { journals, issueList, journalArticles, publicJournalUrl } from '@/lib/ojs/multiJournal';
import { label } from '@/lib/ojs/publicModel';

export default async function JournalPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const vi = locale === 'vi';
  const journal = (await journals(locale)).find(j => j.path === slug);
  if (!journal) notFound();
  const [issueResult, articleResult] = await Promise.allSettled([issueList(slug), journalArticles(slug)]);
  const issues = issueResult.status === 'fulfilled' ? issueResult.value : [];
  const articles = articleResult.status === 'fulfilled' ? articleResult.value : [];
  const featured = issues.find(i => i.current) || [...issues].sort((a, b) => b.datePublished.localeCompare(a.datePublished))[0];
  const issueName = (i: typeof issues[number]) => i.identification || label(i.title, locale) || [i.volume, i.number, i.year || ''].filter(Boolean).join(' / ') || String(i.id);
  return <section className="mx-auto max-w-7xl space-y-8 px-4 py-12">
    <Link href={`/${locale}/journals`} className="text-blue-700 underline">{vi ? '← Danh mục tạp chí' : '← Journal directory'}</Link>
    <header className="space-y-4 border-b pb-6"><h1 className="text-3xl font-bold">{journal.name}</h1>
      <nav className="flex flex-wrap gap-5" aria-label={vi ? 'Tạp chí' : 'Journal'}><a href="#issues" className="text-blue-700 underline">{vi ? 'Các số xuất bản' : 'Published issues'}</a><a href="#articles" className="text-blue-700 underline">{vi ? 'Bài báo mới' : 'Recent articles'}</a><a href={publicJournalUrl(slug)} className="text-blue-700 underline">{vi ? 'Website OJS' : 'OJS website'}</a></nav>
      <form action={`/${locale}/search`} method="get" className="flex flex-wrap items-end gap-3"><input type="hidden" name="journal" value={slug}/><div className="min-w-0 flex-1"><label htmlFor="journal-query" className="mb-1 block font-medium">{vi ? 'Tìm bài báo trong tạp chí' : 'Search this journal'}</label><input id="journal-query" name="q" maxLength={200} className="w-full rounded border p-3" type="search"/></div><button className="rounded bg-[#205778] px-5 py-3 text-white">{vi ? 'Tìm kiếm' : 'Search'}</button></form>
    </header>
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <section id="issues" className="space-y-4"><h2 className="text-xl font-semibold">{vi ? 'Các số đã xuất bản' : 'Published issues'}</h2>
        {issueResult.status === 'rejected' ? <p role="alert">{vi ? 'Không thể tải số tạp chí.' : 'Unable to load issues.'}</p> : !issues.length ? <p>{vi ? 'Chưa có số đã xuất bản.' : 'No published issues.'}</p> : <>
          {featured && <article className="space-y-3 rounded border bg-slate-50 p-5"><p className="text-sm font-semibold">{featured.current ? (vi ? 'Số hiện tại' : 'Current issue') : (vi ? 'Số xuất bản gần nhất' : 'Most recently published issue')}</p><h3 className="text-xl font-semibold">{issueName(featured)}</h3>{featured.datePublished && <p>{featured.datePublished}</p>}<Link className="text-blue-700 underline" href={`/${locale}/journals/${slug}/issues/${featured.id}`}>{vi ? 'Xem mục lục' : 'View contents'}</Link></article>}
          <ul className="divide-y">{issues.filter(i => i.id !== featured?.id).map(i => <li key={i.id} className="py-3"><Link className="text-blue-700 underline" href={`/${locale}/journals/${slug}/issues/${i.id}`}>{issueName(i)}</Link></li>)}</ul>
        </>}
      </section>
      <section id="articles" className="space-y-4"><h2 className="text-xl font-semibold">{vi ? 'Bài báo mới' : 'Recent articles'}</h2>
        {articleResult.status === 'rejected' ? <p role="alert">{vi ? 'Không thể tải bài báo.' : 'Unable to load articles.'}</p> : !articles.length ? <p>{vi ? 'Chưa có bài báo công khai.' : 'No public articles.'}</p> : articles.slice(0, 10).map(a => <article key={a.id} className="space-y-2 rounded border p-5"><p className="text-sm text-slate-600">{[label(a.sectionName, locale), a.language, a.datePublished].filter(Boolean).join(' · ')}</p><h3 className="text-lg font-semibold"><Link className="text-blue-700 hover:underline" href={`/${locale}/journals/${slug}/articles/${a.id}`}>{label(a.title, locale)}</Link></h3>{a.authorsString && <p>{a.authorsString}</p>}</article>)}
      </section>
    </div>
  </section>;
}
