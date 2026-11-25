import Link from 'next/link';
import { notFound } from 'next/navigation';
import { journals, issues, publicJournalUrl } from '@/lib/ojs/multiJournal';

export const dynamic = 'force-dynamic';
export default async function JournalPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const vi = locale === 'vi';
  const directory = await journals(locale).catch(() => null);
  if (!directory) return <p role="alert" className="p-8">{vi ? 'Không thể tải danh mục OJS.' : 'Unable to load OJS directory.'}</p>;
  const journal = directory.find(j => j.path === slug);
  if (!journal) notFound();
  const result = await issues(slug, locale).then(items => ({ items, failed: false })).catch(() => ({ items: [], failed: true }));
  const url = publicJournalUrl(slug);
  return <section className="mx-auto max-w-7xl px-4 py-12 space-y-6">
    <Link href={`/${locale}/journals`} className="text-blue-600">{vi ? '← Danh mục tạp chí' : '← Journals'}</Link>
    <h1 className="text-3xl font-bold">{journal.name}</h1>
    <div className="flex gap-4"><a href={url} className="text-blue-600 underline">{vi ? 'Website OJS' : 'OJS website'}</a><a href={url + '/about/submissions'} className="text-blue-600 underline">{vi ? 'Gửi bài' : 'Submit article'}</a></div>
    <h2 className="text-xl font-semibold">{vi ? 'Các số đã xuất bản' : 'Published issues'}</h2>
    {result.failed ? <p role="alert">{vi ? 'Không thể tải số tạp chí.' : 'Unable to load issues.'}</p> : result.items.length === 0 ? <p>{vi ? 'Chưa có số đã xuất bản.' : 'No published issues.'}</p> :
      <div className="grid gap-4 sm:grid-cols-2">{result.items.map(i => <article key={i.id} className="rounded-xl border p-5"><h3 className="font-semibold">{i.title || [i.volume, i.number, i.year].filter(Boolean).join(' / ') || String(i.id)}</h3><p>{i.year} {i.current ? (vi ? '· Số hiện tại' : '· Current issue') : ''}</p><a href={`/${locale}/journals/${slug}/issues/${i.id}`} className="text-blue-600 underline">{vi ? 'Xem mục lục và bài báo' : 'View contents and articles'}</a></article>)}</div>}
  </section>;
}
