import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Locale, locales, dict } from '@/lib/i18n';
import ArchivesContent from './ArchivesContent';

interface ArchivesPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ year?: string }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: ArchivesPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  const t = dict[locale];
  return {
    title: t.archivesTitle,
    description: t.archivesDescription,
  };
}

export default async function ArchivesPage({ params, searchParams }: ArchivesPageProps) {
  const { locale } = await params;
  const { year } = await searchParams;
  if (!locales.includes(locale)) notFound();
  return <ArchivesContent locale={locale} year={year} />;
}
