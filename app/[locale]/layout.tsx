import '../globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, locales, dict } from '@/lib/i18n';
import { MainLayout } from '@/components/layout/MainLayout';

const sans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const mono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const t = dict[locale];
  return {
    title: {
      default: t.heroTitle,
      template: `%s | ${t.heroTitle}`,
    },
    description: t.heroSubtitle,
    authors: [{ name: 'Thanh Dong University' }],
    publisher: 'Thanh Dong University',
    robots: 'index, follow',
    openGraph: {
      type: 'website',
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      siteName: t.heroTitle,
      title: t.heroTitle,
      description: t.heroSubtitle,
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
  if (!isValidLocale(locale)) notFound();

  return (
    <html lang={locale} dir="ltr" className={`${sans.variable} ${mono.variable}`}>
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
