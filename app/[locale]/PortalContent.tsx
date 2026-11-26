/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { journals, journalArticles } from '@/lib/ojs/multiJournal';
import { label } from '@/lib/ojs/publicModel';

export default async function PortalContent({ locale }: { locale: string }) {
  const vi = locale === 'vi';
  const directory = await journals(locale);
  // Limit concurrent journal reads; a failed journal never hides healthy results.
  const articles: Awaited<ReturnType<typeof journalArticles>> = [];
  const failed: string[] = [];
  for (let i = 0; i < directory.length; i += 4) {
    const group = directory.slice(i, i + 4);
    const results = await Promise.allSettled(group.map(j => journalArticles(j.path)));
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') articles.push(...result.value);
      else failed.push(group[index].name);
    });
  }
  articles.sort((a, b) => b.datePublished.localeCompare(a.datePublished));
  return <section className="mx-auto max-w-7xl space-y-8 px-4 py-10">
    <header className="space-y-3 border-b pb-6">
      <h1 className="text-3xl font-bold text-[#205778]">{vi ? 'Cổng tạp chí khoa học TDU' : 'TDU scholarly journals'}</h1>
      <p>{vi ? 'Khám phá tạp chí và các bài báo đã xuất bản.' : 'Explore journals and published research.'}</p>
      <form action={`/${locale}/search`} className="flex flex-wrap gap-2">
        <label htmlFor="portal-query" className="sr-only">{vi ? 'Tìm bài báo' : 'Search articles'}</label>
        <input id="portal-query" name="q" type="search" maxLength={200} placeholder={vi ? 'Tiêu đề, tác giả, từ khóa' : 'Title, author, keywords'} className="min-w-0 flex-1 rounded border p-3" />
        <button className="rounded bg-[#205778] px-5 py-3 text-white">{vi ? 'Tìm kiếm' : 'Search'}</button>
      </form>
    </header>
    <section aria-labelledby="journal-directory" className="space-y-4">
      <h2 id="journal-directory" className="text-2xl font-semibold">{vi ? 'Danh mục tạp chí' : 'Journal directory'}</h2>
      {!directory.length && <p>{vi ? 'Chưa cấu hình tạp chí công khai.' : 'No public journals configured.'}</p>}
      <div className="grid gap-4 md:grid-cols-2">{directory.map(j => <article key={j.path} className="rounded border p-5"><h3 className="text-xl font-semibold"><Link href={`/${locale}/journals/${j.path}`} className="text-[#205778] underline">{j.name}</Link></h3></article>)}</div>
    </section>
    <section aria-labelledby="recent-articles" className="space-y-4">
      <h2 id="recent-articles" className="text-2xl font-semibold">{vi ? 'Bài báo mới xuất bản' : 'Recently published articles'}</h2>
      {failed.length > 0 && <p role="alert">{vi ? 'Chưa tải được dữ liệu từ: ' : 'Unable to load data from: '}{failed.join(', ')}. {vi ? 'Vui lòng thử lại sau.' : 'Please try again later.'}</p>}
      {!articles.length && !failed.length && <p>{vi ? 'Chưa có bài báo công khai.' : 'No public articles.'}</p>}
      {articles.slice(0, 12).map(a => {
        const cover = label(a.coverUrl, locale);
        return (
          <article key={`${a.journalPath}:${a.id}`} className="flex flex-col sm:flex-row gap-4 rounded border p-5">
            {cover && (
              <div className="shrink-0">
                <img
                  src={cover}
                  alt=""
                  className="h-24 w-auto max-w-[80px] rounded border object-cover shadow-2xs"
                  loading="lazy"
                />
              </div>
            )}
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-sm text-gray-600">{a.journalPath} · {a.datePublished}</p>
              <h3 className="text-lg font-semibold"><Link href={`/${locale}/journals/${a.journalPath}/articles/${a.id}`} className="text-[#205778] underline">{label(a.title, locale)}</Link></h3>
              {a.authorsString && <p className="text-sm text-slate-700">{a.authorsString}</p>}
            </div>
          </article>
        );
      })}
      <Link href={`/${locale}/search`} className="text-[#205778] underline">{vi ? 'Tìm kiếm liên tạp chí' : 'Search across journals'}</Link>
    </section>
  </section>;
}
