// Header Component
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { locales, defaultLocale, localeNames } from '@/lib/i18n';
import { t } from '@/lib/i18n';

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps) {
  const pathname = usePathname();
  const currentLocale = locale as 'vi' | 'en';

  const navItems = [
    { href: '/', label: t('common', 'home', currentLocale) },
    { href: '/about', label: t('common', 'about', currentLocale) },
    { href: '/current-issue', label: t('common', 'currentIssue', currentLocale) },
    { href: '/archives', label: t('common', 'archives', currentLocale) },
    { href: '/submissions', label: t('common', 'submissions', currentLocale) },
    { href: '/authors', label: t('common', 'authors', currentLocale) },
    { href: '/reviewers', label: t('common', 'reviewers', currentLocale) },
    { href: '/editors', label: t('common', 'editors', currentLocale) },
    { href: '/contact', label: t('common', 'contact', currentLocale) },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:dark:bg-gray-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Journal Name */}
          <Link href={`/${currentLocale}`} className="flex items-center gap-3" aria-label="TDU eJournal Portal Home">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-white font-bold text-lg">TDU</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                Tạp Chí Khoa Học
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Trường Đại Học Thành Đông</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map((item) => {
              const href = `/${currentLocale}${item.href === '/' ? '' : item.href}`;
              const isActive = pathname === href || (item.href !== '/' && pathname.startsWith(href + '/'));
              return (
                <Link
                  key={item.href}
                  href={href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Side: Language Switcher + Submit Button */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative" role="group" aria-label="Language selection">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 px-2 py-1.5"
                aria-haspopup="listbox"
                aria-expanded="false"
              >
                <span className="text-sm font-medium capitalize">{currentLocale}</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
              {/* In a real implementation, this would be a dropdown with locale options */}
            </div>

            {/* Submit Article Button */}
            <Link href={`/${currentLocale}/submissions`}>
              <Button size="sm" className="hidden sm:inline-flex">
                {t('common', 'submitArticle', currentLocale)}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
              aria-expanded="false"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation (simplified - would need state management for full implementation) */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4">
        <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
          {navItems.map((item) => {
            const href = `/${currentLocale}${item.href === '/' ? '' : item.href}`;
            const isActive = pathname === href || (item.href !== '/' && pathname.startsWith(href + '/'));
            return (
              <Link
                key={item.href}
                href={href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}