import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Locale, locales, dict } from '@/lib/i18n';
import ArticleContent from './ArticleContent';

interface ArticlePageProps {
  params: Promise<{ locale: Locale; id: string }>;
}

export async function generateStaticParams() {
  const params: { locale: Locale; id: string }[] = [];
  locales.forEach((locale) => {
    for (let i = 1; i <= 200; i++) {
      params.push({ locale, id: String(i) });
    }
  });
  return params;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { locale, id } = await params;
  if (!locales.includes(locale)) notFound();
  const t = dict[locale as Locale];
  return {
    title: `${t.article} #${id}`,
    description: t.articleDescription,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, id } = await params;
  if (!locales.includes(locale)) notFound();

  const articleId = parseInt(id, 10);
  if (isNaN(articleId)) notFound();
  return <ArticleContent locale={locale} articleId={articleId} />;
}
