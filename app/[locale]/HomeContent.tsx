'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Locale, dict } from '@/lib/i18n';
import { useCurrentIssue, usePublishedArticles, useJournal } from '@/hooks/useOJS';
import { ArticleCard } from '@/components/article/ArticleCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const publishedArticlesParams = { perPage: 6, sortField: 'datePublished', sortDirection: 'desc' } as const;

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <Card className="text-center p-6">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-primary-600">{value}</div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
    </Card>
  );
}

function LatestIssueSection({ locale }: { locale: Locale }) {
  const { issue, loading, error } = useCurrentIssue();
  const t = dict[locale];

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </Card>
    );
  }

  if (error || !issue) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">{t.noCurrentIssue}</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{t.latestIssue}</h2>
        <Link href={`/${locale}/current-issue`} className="text-sm text-primary-600 hover:underline">
          {t.viewDetails} →
        </Link>
      </div>
      <div className="flex gap-6">
        {issue.coverImage && (
          <div className="w-48 h-64 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={`${process.env.OJS_BASE_URL || 'http://localhost/ojs'}/public/journals/1/${issue.coverImage.fileName}`}
              alt={issue.title?.[locale] || issue.title?.vi || ''}
              fill
              className="object-cover"
              sizes="192px"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {issue.title?.[locale] || issue.title?.vi || ''}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {issue.volume && `Vol. ${issue.volume}`} {issue.number && `No. ${issue.number}`} ({issue.year})
          </p>
          <p className="text-sm text-gray-600 line-clamp-3 mb-4">
            {issue.description?.[locale] || issue.description?.vi || ''}
          </p>
          <div className="flex flex-wrap gap-2">
            {issue.articles?.slice(0, 3).map((article) => (
              <span key={article.id} className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded">
                {article.title?.[locale] || article.title?.vi || ''}
              </span>
            ))}
            {issue.articles && issue.articles.length > 3 && (
              <span className="px-2 py-1 bg-primary-100 text-xs text-primary-700 rounded">
                +{issue.articles.length - 3} {t.moreArticles}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function RecentArticlesSection({ locale }: { locale: Locale }) {
  const { articles, loading, error } = usePublishedArticles(publishedArticlesParams);
  const t = dict[locale];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-32 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !articles?.data?.length) {
    return <p className="text-center text-gray-500 py-8">{t.noArticles}</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {articles.data.map((article) => (
        <ArticleCard key={article.id} article={article} locale={locale} variant="default" />
      ))}
    </div>
  );
}

function StatsSection({ locale }: { locale: Locale }) {
  const { journal } = useJournal();
  const t = dict[locale];

  const stats = [
    { label: t.statIssues, value: journal?.issues?.length || 0, icon: '📚' },
    { label: t.statArticles, value: journal?.issues?.reduce((sum, i) => sum + (i.articles?.length || 0), 0) || 0, icon: '📄' },
    { label: t.statAuthors, value: '500+', icon: '👥' },
    { label: t.statYears, value: journal?.issues?.length ? new Date().getFullYear() - Math.min(...journal.issues.map(i => i.year)) + 1 : 0, icon: '📅' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <StatCard key={i} label={stat.label} value={stat.value} icon={stat.icon} />
      ))}
    </div>
  );
}

export default function HomeContent({ locale }: { locale: Locale }) {
  const t = dict[locale];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
              {t.heroBadge}
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              {t.heroTitle}
            </h1>
            <p className="text-lg lg:text-xl text-white/90 mb-8 leading-relaxed">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={`/${locale}/current-issue`}>
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  {t.currentIssue}
                </Button>
              </Link>
              <Link href={`/${locale}/archives`}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                  {t.archives}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4">
        <StatsSection locale={locale} />
      </section>

      {/* Latest Issue */}
      <section className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t.latestIssue}</h2>
        </div>
        <LatestIssueSection locale={locale} />
      </section>

      {/* Recent Articles */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t.recentArticles}</h2>
          <Link href={`/${locale}/archives`} className="text-sm text-primary-600 hover:underline">
            {t.viewAll} →
          </Link>
        </div>
        <RecentArticlesSection locale={locale} />
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{t.ctaTitle}</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">{t.ctaDescription}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href={`/${locale}/submissions`}>
              <Button size="lg" className="w-full sm:w-auto">
                {t.submitArticle}
              </Button>
            </Link>
            <Link href={`/${locale}/author-guidelines`}>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                {t.authorGuidelines}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
