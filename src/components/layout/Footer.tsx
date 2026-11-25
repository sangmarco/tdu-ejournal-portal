// Footer Component
'use client';

import Link from 'next/link';
import { t } from '@/lib/i18n';

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const currentLocale = locale as 'vi' | 'en';
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    journal: [
      { href: `/${currentLocale}/about`, label: t('common', 'about', currentLocale) },
      { href: `/${currentLocale}/current-issue`, label: t('common', 'currentIssue', currentLocale) },
      { href: `/${currentLocale}/archives`, label: t('common', 'archives', currentLocale) },
      { href: `/${currentLocale}/editorial-board`, label: t('common', 'editors', currentLocale) },
      { href: `/${currentLocale}/peer-review`, label: t('common', 'peerReview', currentLocale) },
    ],
    forAuthors: [
      { href: `/${currentLocale}/submissions`, label: t('common', 'submitArticle', currentLocale) },
      { href: `/${currentLocale}/author-guidelines`, label: t('common', 'authorGuidelines', currentLocale) },
      { href: `/${currentLocale}/open-access`, label: t('common', 'openAccess', currentLocale) },
      { href: `/${currentLocale}/copyright`, label: t('common', 'copyright', currentLocale) },
    ],
    forReviewers: [
      { href: `/${currentLocale}/reviewers`, label: t('common', 'reviewers', currentLocale) },
      { href: `/${currentLocale}/review-guidelines`, label: 'Hướng dẫn đánh giá' },
    ],
    contact: [
      { href: `/${currentLocale}/contact`, label: t('common', 'contact', currentLocale) },
      { href: '/privacy', label: t('common', 'privacy', currentLocale) },
      { href: '/terms', label: t('common', 'terms', currentLocale) },
    ],
  };

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1">
            <Link href={`/${currentLocale}`} className="flex items-center gap-3" aria-label="TDU eJournal Portal Home">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-white font-bold text-lg">TDU</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">Tạp Chí Khoa Học</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Trường Đại Học Thành Đông</p>
              </div>
            </Link>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {currentLocale === 'vi'
                ? 'Nơi công bố các nghiên cứu khoa học chất lượng cao đa ngành'
                : 'Publishing high-quality multidisciplinary scientific research'}
            </p>
          </div>

          {/* Journal Links */}
          <nav aria-label="Journal links">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              {currentLocale === 'vi' ? 'Tạp chí' : 'Journal'}
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.journal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* For Authors */}
          <nav aria-label="For authors">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              {currentLocale === 'vi' ? 'Dành cho tác giả' : 'For Authors'}
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.forAuthors.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* For Reviewers */}
          <nav aria-label="For reviewers">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              {currentLocale === 'vi' ? 'Dành cho người đánh giá' : 'For Reviewers'}
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.forReviewers.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <address className="not-italic" aria-label="Contact information">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              {currentLocale === 'vi' ? 'Liên hệ' : 'Contact'}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li>Trường Đại Học Thành Đông</li>
              <li>Số 1, Đại lộ Đại học, P. Linh Chiểu, TP. Thủ Đức</li>
              <li>Thành phố Hồ Chí Minh, Việt Nam</li>
              <li className="mt-2">
                <a href="mailto:tapchi@thanhdong.edu.vn" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  tapchi@thanhdong.edu.vn
                </a>
              </li>
              <li>
                <a href="http://thanhdong.edu.vn" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  thanhdong.edu.vn
                </a>
              </li>
            </ul>
          </address>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} TDU eJournal Portal. {currentLocale === 'vi' ? 'Bản quyền thuộc về Trường Đại Học Thành Đông.' : 'All rights reserved.'}
            </p>
            <div className="flex items-center gap-6">
              <Link href={`/${currentLocale}/privacy`} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                {t('common', 'privacy', currentLocale)}
              </Link>
              <Link href={`/${currentLocale}/terms`} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                {t('common', 'terms', currentLocale)}
              </Link>
              <a href="http://thanhdong.edu.vn" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                thanhdong.edu.vn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}