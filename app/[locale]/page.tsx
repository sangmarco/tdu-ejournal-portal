import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Locale, locales, dict } from '@/lib/i18n';
import HomeContent from './HomeContent';

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  const t = dict[locale];
  return {
    title: t.heroTitle,
    description: t.heroSubtitle,
    openGraph: {
      title: t.heroTitle,
      description: t.heroSubtitle,
      type: 'website',
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  return <HomeContent locale={locale} />;
}
