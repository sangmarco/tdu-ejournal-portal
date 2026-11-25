import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Locale, locales, dict } from '@/lib/i18n';
import EditorialBoardContent from './EditorialBoardContent';

interface EditorialBoardPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: EditorialBoardPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  const t = dict[locale];
  return {
    title: t.editorialBoardTitle,
    description: t.editorialBoardDescription,
  };
}

export default async function EditorialBoardPage({ params }: EditorialBoardPageProps) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  return <EditorialBoardContent locale={locale} />;
}
