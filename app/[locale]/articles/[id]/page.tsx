import { notFound, redirect, RedirectType } from 'next/navigation';
import { Locale, locales } from '@/lib/i18n';
import { journals, journalArticles } from '@/lib/ojs/multiJournal';

interface ArticlePageProps {
  params: Promise<{ locale: Locale; id: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, id } = await params;
  if (!locales.includes(locale)) notFound();

  const articleId = parseInt(id, 10);
  if (isNaN(articleId) || articleId < 1) notFound();

  const registeredJournals = await journals(locale);
  for (const j of registeredJournals) {
    const articles = await journalArticles(j.path).catch(() => []);
    if (articles.some(a => a.id === articleId)) {
      redirect(`/${locale}/journals/${j.path}/articles/${articleId}`, RedirectType.replace);
    }
  }

  notFound();
}
