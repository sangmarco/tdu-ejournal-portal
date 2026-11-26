/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { journals, journalArticles } from '@/lib/ojs/multiJournal';
import { label } from '@/lib/ojs/publicModel';

type SearchParams = Record<string, string | string[] | undefined>;
const scalar = (value: string | string[] | undefined) => typeof value === 'string' ? value : '';
const languageKey = (value: string) => value.toLowerCase().split(/[-_]/)[0];

export default async function SearchPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<SearchParams> }) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const vi = locale === 'vi';
  const q = scalar(query.q).trim().slice(0, 200);
  const directory = await journals(locale);
  const journal = scalar(query.journal).slice(0, 100);
  const selected = journal ? directory.filter(j => j.path === journal) : directory;
  const year = /^\d{4}$/.test(scalar(query.year)) ? scalar(query.year) : '';
  const language = /^[a-z]{2,3}$/.test(scalar(query.language)) ? scalar(query.language) : '';
  const sort = scalar(query.sort) === 'oldest' ? 'oldest' : 'newest';
  const requestedPage = /^\d{1,4}$/.test(scalar(query.page)) ? Math.max(1, Math.min(1000, Number(query.page))) : 1;
  // Bound concurrent journal reads; a failing journal never removes healthy results.
  const results: PromiseSettledResult<Awaited<ReturnType<typeof journalArticles>>>[] = [];
  for (let i = 0; i < selected.length; i += 4) {
    results.push(...await Promise.allSettled(selected.slice(i, i + 4).map(j => journalArticles(j.path))));
  }
  const failed = selected.filter((_, index) => results[index].status === 'rejected');
  const all = results.flatMap(result => result.status === 'fulfilled' ? result.value : []);
  const years = [...new Set(all.map(a => a.datePublished.slice(0, 4)).filter(y => /^\d{4}$/.test(y)))].sort().reverse();
  if (year && !years.includes(year)) years.push(year);
  const languages = [...new Set(all.map(a => languageKey(a.language)).filter(Boolean))].sort();
  if (language && !languages.includes(language)) languages.push(language);
  const needle = q.toLocaleLowerCase(locale === 'vi' ? 'vi' : 'en');
  const matches = all.filter(a => (!year || a.datePublished.startsWith(year)) && (!language || languageKey(a.language) === language) && (!needle || [...Object.values(a.title), a.authorsString, ...Object.values(a.abstract), ...(a.oaiMetadata?.subjects.map(s => s.value) || []), ...Object.values(a.sectionName)].join(' ').toLocaleLowerCase(locale === 'vi' ? 'vi' : 'en').includes(needle)))
    .sort((a, b) => (sort === 'oldest' ? 1 : -1) * a.datePublished.localeCompare(b.datePublished) || a.journalPath.localeCompare(b.journalPath) || a.id - b.id);
  const pages = Math.max(1, Math.ceil(matches.length / 20));
  const page = Math.min(requestedPage, pages);
  const pageUrl = (target: number) => `/${locale}/search?${new URLSearchParams({ q, journal, year, language, sort, page: String(target) })}`;
  return <section className="mx-auto max-w-7xl space-y-6 px-4 py-12">
    <h1 className="text-3xl font-bold">{vi ? 'Tìm kiếm bài báo liên tạp chí' : 'Search across journals'}</h1>
    <form action={`/${locale}/search`} method="get" className="space-y-4 rounded border bg-slate-50 p-5">
      <div><label htmlFor="search-query" className="mb-1 block font-semibold">{vi ? 'Từ khóa, tiêu đề hoặc tác giả' : 'Keywords, title or author'}</label><input id="search-query" type="search" name="q" defaultValue={q} maxLength={200} className="w-full rounded border bg-white p-3"/></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div><label className="mb-1 block" htmlFor="search-journal">{vi ? 'Tạp chí' : 'Journal'}</label><select id="search-journal" name="journal" defaultValue={journal} className="w-full rounded border bg-white p-2"><option value="">{vi ? 'Tất cả tạp chí' : 'All journals'}</option>{journal && !selected.length && <option value={journal}>{vi ? 'Tạp chí không hợp lệ' : 'Unknown journal'}</option>}{directory.map(j => <option key={j.path} value={j.path}>{j.name}</option>)}</select></div>
        <div><label className="mb-1 block" htmlFor="search-year">{vi ? 'Năm xuất bản' : 'Publication year'}</label><select id="search-year" name="year" defaultValue={year} className="w-full rounded border bg-white p-2"><option value="">{vi ? 'Tất cả năm' : 'All years'}</option>{years.map(y => <option key={y}>{y}</option>)}</select></div>
        <div><label className="mb-1 block" htmlFor="search-language">{vi ? 'Ngôn ngữ' : 'Language'}</label><select id="search-language" name="language" defaultValue={language} className="w-full rounded border bg-white p-2"><option value="">{vi ? 'Tất cả ngôn ngữ' : 'All languages'}</option>{languages.map(l => <option key={l} value={l}>{l === 'vi' ? (vi ? 'Tiếng Việt' : 'Vietnamese') : l === 'en' ? (vi ? 'Tiếng Anh' : 'English') : l}</option>)}</select></div>
        <div><label className="mb-1 block" htmlFor="search-sort">{vi ? 'Sắp xếp' : 'Sort'}</label><select id="search-sort" name="sort" defaultValue={sort} className="w-full rounded border bg-white p-2"><option value="newest">{vi ? 'Mới nhất' : 'Newest first'}</option><option value="oldest">{vi ? 'Cũ nhất' : 'Oldest first'}</option></select></div>
      </div>
      <div className="flex flex-wrap items-center gap-4"><button className="rounded bg-[#205778] px-5 py-2 text-white">{vi ? 'Tìm kiếm' : 'Search'}</button><Link className="text-blue-700 underline" href={`/${locale}/search`}>{vi ? 'Xóa bộ lọc' : 'Clear filters'}</Link></div>
    </form>
    {!!failed.length && <p role="alert" className="rounded border border-amber-300 p-4">{vi ? 'Kết quả chưa đầy đủ. Không thể tải các tạp chí:' : 'Results are incomplete. Unable to load journals:'} {failed.map(j => j.name).join(', ')}</p>}
    <p role="status">{matches.length} {vi ? 'kết quả trong dữ liệu công khai đã tải' : 'results in loaded public data'}</p>
    {!matches.length && <p>{vi ? 'Không tìm thấy bài báo phù hợp trong dữ liệu đã tải.' : 'No matching articles in the loaded data.'}</p>}
    <div className="space-y-4">
      {matches.slice((page - 1) * 20, page * 20).map(a => {
        const articleCover = label(a.coverUrl, locale);
        return (
          <article key={`${a.journalPath}:${a.id}`} className="flex flex-col sm:flex-row gap-4 rounded border p-5">
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
              <Link href={`/${locale}/journals/${a.journalPath}`} className="text-sm text-[#205778] underline">{directory.find(j => j.path === a.journalPath)?.name || a.journalPath}</Link>
              <h2 className="text-xl font-semibold"><Link href={`/${locale}/journals/${a.journalPath}/articles/${a.id}`} className="text-[#205778] hover:underline">{label(a.title, locale)}</Link></h2>
              {a.authorsString && <p className="text-sm text-slate-700">{a.authorsString}</p>}
              <p className="text-sm text-slate-600">{[label(a.sectionName, locale), a.language, a.datePublished].filter(Boolean).join(' · ')}</p>
            </div>
          </article>
        );
      })}
    </div>
    {pages > 1 && <nav aria-label={vi ? 'Phân trang kết quả' : 'Search pagination'} className="flex flex-wrap gap-5">{page > 1 && <Link rel="prev" className="text-blue-700 underline" href={pageUrl(page - 1)}>{vi ? 'Trang trước' : 'Previous'}</Link>}<span>{vi ? 'Trang' : 'Page'} {page} / {pages}</span>{page < pages && <Link rel="next" className="text-blue-700 underline" href={pageUrl(page + 1)}>{vi ? 'Trang sau' : 'Next'}</Link>}</nav>}
  </section>;
}
