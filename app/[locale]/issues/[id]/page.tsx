import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Locale, locales, dict } from '@/lib/i18n';
import IssueContent from './IssueContent';

interface IssuePageProps {
  params: Promise<{ locale: Locale; id: string }>;
}

export async function generateStaticParams() {
  const params: { locale: Locale; id: string }[] = [];
  locales.forEach((locale) => {
    for (let i = 1; i <= 50; i++) {
      params.push({ locale, id: String(i) });
    }
  });
  return params;
}

export async function generateMetadata({ params }: IssuePageProps): Promise<Metadata> {
  const { locale, id } = await params;
  if (!locales.includes(locale)) notFound();
  const t = dict[locale as Locale];
  return {
    title: `${t.issue} #${id}`,
    description: t.issueDescription,
  };
}

export default async function IssuePage({ params }: IssuePageProps) {
  const { locale, id } = await params;
  if (!locales.includes(locale)) notFound();

  const issueId = parseInt(id, 10);
  if (isNaN(issueId)) notFound();
  return <IssueContent locale={locale} issueId={issueId} />;
}
