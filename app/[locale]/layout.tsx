import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Locale, locales, defaultLocale, dict } from '@/lib/i18n';
import { MainLayout } from '@/components/layout/MainLayout';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = dict[locale];
  return {
    title: {
      default: t.siteName,
      template: `%s | ${t.siteName}`,
    },
    description: t.siteDescription,
    keywords: t.siteKeywords,
    authors: [{ name: 'Thanh Dong University' }],
    publisher: 'Thanh Dong University',
    robots: 'index, follow',
    openGraph: {
      type: 'website',
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      siteName: t.siteName,
      title: t.siteName,
      description: t.siteDescription,
    },
    alternates: {
      languages: {
        vi: '/vi',
        en: '/en',
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();

  return (
    <html lang={locale} dir="ltr">
      <head>
        <link rel="alternate" hrefLang="vi" href={`/vi`} />
        <link rel="alternate" hrefLang="en" href={`/en`} />
        <link rel="alternate" hrefLang="x-default" href={`/vi`} />
      </head>
      <body className="font-sans antialiased">
        <MainLayout locale={locale}>{children}</MainLayout>
      </body>
    </html>
  );
}