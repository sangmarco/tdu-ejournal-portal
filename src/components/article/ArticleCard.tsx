// Article Card Component
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getArticleStatusLabel, getArticleStatusColor, getLocalizedValue } from '@/lib/ojs';
import { t } from '@/lib/i18n';
import type { OJSArticle } from '@/lib/ojs';

interface ArticleCardProps {
  article: OJSArticle;
  locale: string;
  variant?: 'default' | 'compact' | 'featured';
  showJournal?: boolean;
}

export function ArticleCard({ article, locale, variant = 'default' }: ArticleCardProps) {
  const currentLocale = locale as 'vi' | 'en';
  const title = getLocalizedValue(article.title, currentLocale);
  const abstract = getLocalizedValue(article.abstract, currentLocale);
  const statusLabel = getArticleStatusLabel(article.status, currentLocale);
  const statusColor = getArticleStatusColor(article.status);
  const authors = article.authors
    .filter(a => a.includeInBrowse)
    .slice(0, 3)
    .map(a => `${getLocalizedValue(a.lastName, currentLocale)} ${getLocalizedValue(a.firstName, currentLocale).charAt(0)}.`)
    .join(', ');
  const etAl = article.authors.filter(a => a.includeInBrowse).length > 3 ? ' et al.' : '';
  const year = article.datePublished ? new Date(article.datePublished).getFullYear() : '';
  const volume = article.issue?.volume || '';
  const number = article.issue?.number || '';
  const pages = article.pages || '';

  if (variant === 'compact') {
    return (
      <Link
        href={`/${currentLocale}/articles/${article.id}`}
        className="flex gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
        aria-label={`${title} - ${statusLabel}`}
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2 text-sm">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{authors}{etAl}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" size="sm">{statusLabel}</Badge>
            {year && <span className="text-xs text-gray-400">{year}</span>}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <article className="group">
        <Link href={`/${currentLocale}/articles/${article.id}`} className="block">
          <div className="aspect-video relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
            {article.galleys?.[0]?.file?.downloadUrl && (
              <Image fill unoptimized
                src={article.galleys[0].file.downloadUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="success">{statusLabel}</Badge>
                {article.sectionName && (
                  <Badge variant="outline" size="sm">
                    {getLocalizedValue(article.sectionName, currentLocale)}
                  </Badge>
                )}
              </div>
              <h2 className="text-2xl font-bold text-white line-clamp-2">{title}</h2>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-600 dark:text-gray-300 text-sm">{authors}{etAl}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              {year && <span>{year}</span>}
              {(volume || number) && <span>{volume} ({number})</span>}
              {pages && <span>{pages}</span>}
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1">
            {article.sectionName && (
              <Badge variant="outline" size="sm" className="mb-2">
                {getLocalizedValue(article.sectionName, currentLocale)}
              </Badge>
            )}
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              <Link href={`/${currentLocale}/articles/${article.id}`} className="hover:underline">
                {title}
              </Link>
            </h3>
          </div>
          <Badge variant="default" className={statusColor} size="sm">
            {statusLabel}
          </Badge>
        </div>

        {abstract && (
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 flex-1">{abstract}</p>
        )}

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          <p className="line-clamp-1">{authors}{etAl}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500 mt-auto">
          {year && <span>{year}</span>}
          {(volume || number) && <span>{volume} ({number})</span>}
          {pages && <span>{pages}</span>}
          {article.doi && <span>DOI: {article.doi}</span>}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Link
          href={`/${currentLocale}/articles/${article.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
        >
          {t('common', 'readMore', currentLocale)}
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </CardFooter>
    </Card>
  );
}