import Link from 'next/link';
import { journals } from '@/lib/ojs/multiJournal';

export const dynamic = 'force-dynamic';
export default async function JournalsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const vi = locale === 'vi';
  const result = await journals(locale).then(items => ({ items, failed: false })).catch(() => ({ items: [], failed: true }));
  return <section className="mx-auto max-w-7xl px-4 py-12">
    <h1 className="mb-6 text-3xl font-bold">{vi ? 'Danh mục tạp chí' : 'Journal directory'}</h1>
    {result.failed ? <p role="alert">{vi ? 'Không thể kết nối danh mục OJS.' : 'Unable to load OJS directory.'}</p> : result.items.length === 0 ? <p>{vi ? 'Chưa có tạp chí công khai.' : 'No public journals.'}</p> :
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{result.items.map(j => <Link key={j.path} href={`/${locale}/journals/${j.path}`} className="rounded-xl border p-6 hover:border-blue-600"><h2 className="text-xl font-semibold">{j.name}</h2><p className="mt-2 text-sm">{j.path}</p></Link>)}</div>}
  </section>;
}
