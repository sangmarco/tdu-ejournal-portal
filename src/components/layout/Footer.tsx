import Link from 'next/link';

export function Footer({ locale }: { locale: string }) {
  const vi = locale === 'vi';
  return <footer className="border-t bg-slate-50">
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2">
      <div className="space-y-2">
        <Link href={`/${locale}`} className="font-semibold text-[#205778]">TDU eJournal Portal</Link>
        <p>{vi ? 'Trường Đại học Thành Đông' : 'Thanh Dong University'}</p>
        <p className="text-sm text-slate-600">{vi ? 'Dữ liệu xuất bản được cung cấp bởi các tạp chí trên OJS.' : 'Publication data is supplied by journals on OJS.'}</p>
      </div>
      <nav aria-label={vi ? 'Liên kết cuối trang' : 'Footer navigation'} className="flex flex-wrap items-start gap-5">
        <Link href={`/${locale}/journals`} className="underline">{vi ? 'Danh mục tạp chí' : 'Journal directory'}</Link>
        <Link href={`/${locale}/search`} className="underline">{vi ? 'Tìm kiếm bài báo' : 'Article search'}</Link>
      </nav>
    </div>
  </footer>;
}
