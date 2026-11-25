import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Locale, locales, dict } from '@/lib/i18n';
import CurrentIssueContent from './CurrentIssueContent';

interface CurrentIssuePageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: CurrentIssuePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  const t = dict[locale];
  return {
    title: t.currentIssueTitle,
    description: t.currentIssueDescription,
  };
}

export default async function CurrentIssuePage({ params }: CurrentIssuePageProps) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  return <CurrentIssueContent locale={locale} />;
}
