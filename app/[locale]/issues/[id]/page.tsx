import { notFound, redirect, RedirectType } from 'next/navigation';
import { Locale, locales } from '@/lib/i18n';
import { journals, issueDetail } from '@/lib/ojs/multiJournal';

interface IssuePageProps {
  params: Promise<{ locale: Locale; id: string }>;
}

export default async function IssuePage({ params }: IssuePageProps) {
  const { locale, id } = await params;
  if (!locales.includes(locale)) notFound();

  const issueId = parseInt(id, 10);
  if (isNaN(issueId) || issueId < 1) notFound();

  const registeredJournals = await journals(locale);
  for (const j of registeredJournals) {
    const detail = await issueDetail(j.path, issueId).catch(() => null);
    if (detail) {
      redirect(`/${locale}/journals/${j.path}/issues/${issueId}`, RedirectType.replace);
    }
  }

  notFound();
}
