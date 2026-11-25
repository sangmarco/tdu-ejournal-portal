'use client';

import Image from 'next/image';
import { Locale, dict } from '@/lib/i18n';
import { useCurrentIssue, useIssueArticles } from '@/hooks/useOJS';
import { ArticleCard } from '@/components/article/ArticleCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const issueArticlesParams = { perPage: 50 } as const;

export default function CurrentIssueContent({ locale }: { locale: Locale }) {
  const { issue, loading: issueLoading, error: issueError } = useCurrentIssue();
  const { articles, loading: articlesLoading, error: articlesError } = useIssueArticles(issue?.id || 0, issueArticlesParams);
  const t = dict[locale];

  if (issueLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="aspect-[4/3] bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (issueError || !issue) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Card className="max-w-2xl mx-auto p-8">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t.noCurrentIssue}</h2>
          <p className="text-gray-600 mb-6">{t.noCurrentIssueDesc}</p>
          <Link href={`/${locale}/archives`}>
            <Button variant="outline">{t.browseArchives}</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href={`/${locale}`} className="hover:text-primary-600">{t.home}</Link>
          </li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-900 font-medium">{t.currentIssue}</li>
        </ol>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cover & Info */}
        <div className="lg:col-span-1 space-y-6">
          {issue.coverImage && (
            <Card className="overflow-hidden p-0">
              <Image
                src={`${process.env.OJS_BASE_URL || 'http://localhost/ojs'}/public/journals/1/${issue.coverImage.fileName}`}
                alt={issue.title?.[locale] || issue.title?.vi || ''}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
                priority
              />
            </Card>
          )}

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t.issueInfo}</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">{t.volume}</dt>
                <dd className="font-medium">{issue.volume || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">{t.number}</dt>
                <dd className="font-medium">{issue.number || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">{t.year}</dt>
                <dd className="font-medium">{issue.year}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">{t.datePublished}</dt>
                <dd className="font-medium">{issue.datePublished ? new Date(issue.datePublished).toLocaleDateString(locale) : '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">{t.articlesCount}</dt>
                <dd className="font-medium">{issue.articles?.length || 0}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">{t.accessType}</dt>
                <dd className="font-medium">
                  <span className={`px-2 py-1 rounded text-xs ${issue.openAccess ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {issue.openAccess ? t.openAccess : t.subscriptionAccess}
                  </span>
                </dd>
              </div>
            </dl>
          </Card>

          {issue.description?.[locale] || issue.description?.vi && (
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">{t.issueDescription}</h3>
              <p className="text-sm text-gray-600">{issue.description?.[locale] || issue.description?.vi}</p>
            </Card>
          )}
        </div>

        {/* Articles List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{t.articlesInIssue}</h2>
            {issue.openAccess && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                {t.allArticlesOpenAccess}
              </span>
            )}
          </div>

          {articlesLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-24 h-32 bg-gray-200 rounded flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {articlesError && (
            <Card className="p-6 text-center">
              <p className="text-gray-500">{t.errorLoadingArticles}</p>
            </Card>
          )}

          {!articlesLoading && !articlesError && articles?.data?.length ? (
            <div className="space-y-4">
              {articles.data.map((article) => (
                <ArticleCard key={article.id} article={article} locale={locale} variant="default" />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-500">{t.noArticlesInIssue}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
