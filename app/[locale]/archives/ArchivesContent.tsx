'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Locale, dict } from '@/lib/i18n';
import { useIssues } from '@/hooks/useOJS';
import { Card } from '@/components/ui/Card';
import Image from 'next/image';

function YearFilter({ locale, selectedYear, years, onYearChange }: {
  locale: Locale;
  selectedYear: string | undefined;
  years: number[];
  onYearChange: (year: string | undefined) => void;
}) {
  const t = dict[locale];
  return (
    <div className="mb-6">
      <label htmlFor="year-filter" className="sr-only">{t.filterByYear}</label>
      <select
        id="year-filter"
        value={selectedYear || ''}
        onChange={(e) => onYearChange(e.target.value || undefined)}
        className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">{t.allYears}</option>
        {years.map((year) => (
          <option key={year} value={String(year)}>{year}</option>
        ))}
      </select>
    </div>
  );
}

export default function ArchivesContent({ locale, year }: { locale: Locale; year?: string }) {
  const issueParams = useMemo(() => ({
    filter: { [year ? 'year' : 'published']: year || 'true' },
    sortField: 'year',
    sortDirection: 'desc' as const,
    perPage: 100,
  }), [year]);
  const { issues, loading, error } = useIssues(issueParams);
  const t = dict[locale];

  const allYears = issues?.data
    ?.map((i) => i.year)
    .filter((y, i, arr) => arr.indexOf(y) === i)
    .sort((a, b) => b - a) || [];

  const filteredIssues = issues?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href={`/${locale}`} className="hover:text-primary-600">{t.home}</Link>
          </li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-900 font-medium">{t.archives}</li>
        </ol>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.archivesTitle}</h1>
        <p className="text-gray-600">{t.archivesDescription}</p>
      </header>

      <YearFilter
        locale={locale}
        selectedYear={year}
        years={allYears}
        onYearChange={(selectedYear) => {
          const url = new URL(window.location.href);
          if (selectedYear) {
            url.searchParams.set('year', selectedYear);
          } else {
            url.searchParams.delete('year');
          }
          window.history.pushState({}, '', url);
          window.location.reload();
        }}
      />

      {loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <Card className="p-6 text-center">
          <p className="text-gray-500">{t.errorLoadingIssues}</p>
        </Card>
      )}

      {!loading && !error && filteredIssues.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">{t.noIssuesFound}</p>
        </Card>
      )}

      {!loading && !error && filteredIssues.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredIssues.map((issue) => (
            <Link key={issue.id} href={`/${locale}/issues/${issue.id}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
                {issue.coverImage && (
                  <div className="aspect-[4/3] w-full rounded-lg overflow-hidden mb-4 bg-gray-100 relative">
                    <Image fill unoptimized
                      src={`${process.env.OJS_BASE_URL || 'http://localhost/ojs'}/public/journals/1/${issue.coverImage.fileName}`}
                      alt={issue.title?.[locale] || issue.title?.vi || ''}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {issue.title?.[locale] || issue.title?.vi || t.untitledIssue}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <span>{issue.volume && `Vol. ${issue.volume}`}</span>
                    <span>{issue.number && `No. ${issue.number}`}</span>
                    <span className="font-medium text-gray-900">({issue.year})</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                    {issue.description?.[locale] || issue.description?.vi || ''}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-gray-500">
                      {issue.articles?.length || 0} {t.articles}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${issue.openAccess ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {issue.openAccess ? t.openAccess : t.subscriptionAccess}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
