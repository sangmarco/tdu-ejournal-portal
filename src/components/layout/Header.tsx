'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function Header({ locale }: { locale: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const vi = locale === 'vi';
  const other = vi ? 'en' : 'vi';
  const suffix = searchParams.toString();
  const languageHref = pathname.replace(/^\/(vi|en)(?=\/|$)/, `/${other}`) + (suffix ? `?${suffix}` : '');
  const links = [
    { href: `/${locale}`, label: vi ? 'Trang chủ' : 'Home' },
    { href: `/${locale}/journals`, label: vi ? 'Tạp chí' : 'Journals' },
    { href: `/${locale}/search`, label: vi ? 'Tìm kiếm' : 'Search' },
  ];
  const navigation = links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpenPath(null)} aria-current={pathname === link.href ? 'page' : undefined} className="rounded px-3 py-2 hover:bg-slate-100 aria-[current=page]:bg-slate-100">{link.label}</Link>);
  return <header className="border-b bg-white text-[#172B3B]">
    <a href="#main-content" className="sr-only focus:not-sr-only">{vi ? 'Đến nội dung chính' : 'Skip to content'}</a>
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4">
      <Link href={`/${locale}`} className="font-bold text-[#205778]">TDU <span className="hidden sm:inline">eJournal Portal</span></Link>
      <nav aria-label={vi ? 'Điều hướng chính' : 'Main navigation'} className="hidden gap-2 md:flex">{navigation}</nav>
      <div className="flex items-center gap-3">
        <Link href={languageHref} hrefLang={other} lang={other} aria-label={vi ? 'Switch to English' : 'Chuyển sang tiếng Việt'} className="rounded border px-3 py-2">{other.toUpperCase()}</Link>
        <button type="button" className="rounded border px-3 py-2 md:hidden" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpenPath(open ? null : pathname)}>{vi ? 'Danh mục' : 'Menu'}</button>
      </div>
    </div>
    <nav id="mobile-navigation" hidden={!open} aria-label={vi ? 'Điều hướng di động' : 'Mobile navigation'} className="border-t px-4 py-3 md:hidden"><div className="flex flex-col">{navigation}</div></nav>
  </header>;
}
