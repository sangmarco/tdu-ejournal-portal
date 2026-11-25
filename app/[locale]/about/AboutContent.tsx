'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Locale, dict } from '@/lib/i18n';
import { useJournal, useUsers } from '@/hooks/useOJS';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const usersParams = { filter: { role: 'editor' }, perPage: 5 } as const;

function ScopeSection({ locale, journal }: { locale: Locale; journal: any }) {
  const t = dict[locale];
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.scope}</h2>
      <div className="prose prose-gray max-w-none">
        {journal?.mastheadDescription?.[locale] || journal?.mastheadDescription?.vi || t.defaultScope}
      </div>
      {journal?.categories?.length && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.categories}</h3>
          <div className="flex flex-wrap gap-2">
            {journal.categories.map((cat: any) => (
              <Badge key={cat.id} variant="outline">
                {cat.name?.[locale] || cat.name?.vi}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function EditorialBoardPreview({ locale, journal }: { locale: Locale; journal: any }) {
  const t = dict[locale];
  const { users, loading } = useUsers(usersParams);

  if (loading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t.editorialBoard}</h2>
          <Link href={`/${locale}/editorial-board`} className="text-sm text-primary-600 hover:underline">
            {t.viewAll} →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  const editors = users?.data?.filter((u: any) =>
    u.roles?.some((r: any) => r.name?.[locale]?.includes('Editor') || r.name?.vi?.includes('Editor'))
  ) || [];

  if (editors.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t.editorialBoard}</h2>
        <Link href={`/${locale}/editorial-board`} className="text-sm text-primary-600 hover:underline">
          {t.viewAll} →
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {editors.slice(0, 6).map((editor: any) => (
          <Card key={editor.id} className="p-4 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center text-2xl">
              {editor.firstName?.[locale]?.charAt(0) || 'E'}{editor.lastName?.[locale]?.charAt(0) || 'D'}
            </div>
            <h3 className="font-medium text-gray-900">
              {editor.firstName?.[locale] || editor.firstName?.vi} {editor.lastName?.[locale] || editor.lastName?.vi}
            </h3>
            <p className="text-sm text-gray-500">{editor.affiliation?.[locale] || editor.affiliation?.vi || ''}</p>
            {editor.orcid && (
              <a href={`https://orcid.org/${editor.orcid}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline">
                ORCID: {editor.orcid}
              </a>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}

function JournalInfo({ locale, journal }: { locale: Locale; journal: any }) {
  const t = dict[locale];
  const info = [
    { label: t.publisher, value: journal?.publisher?.[locale] || journal?.publisher?.vi },
    { label: t.publisherInstitution, value: journal?.publisherInstitution?.[locale] || journal?.publisherInstitution?.vi },
    { label: t.issnPrint, value: journal?.issnPrint },
    { label: t.issnOnline, value: journal?.issnOnline },
    { label: t.doiPrefix, value: journal?.doiPrefix },
    { label: t.languages, value: journal?.languages?.join(', ') },
    { label: t.frequency, value: journal?.frequency?.[locale] || journal?.frequency?.vi },
  ].filter((i) => i.value);

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-gray-900 mb-4">{t.journalInfo}</h3>
      <dl className="space-y-3 text-sm">
        {info.map((item, i) => (
          <div key={i} className="flex justify-between">
            <dt className="text-gray-500">{item.label}</dt>
            <dd className="font-medium text-gray-900">{item.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

export default function AboutContent({ locale }: { locale: Locale }) {
  const { journal, loading, error } = useJournal();
  const t = dict[locale];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-8 max-w-3xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !journal) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Card className="max-w-2xl mx-auto p-8">
          <p className="text-gray-500">{t.errorLoadingJournal}</p>
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
          <li className="text-gray-900 font-medium">{t.about}</li>
        </ol>
      </nav>

      <header className="mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          {journal.name?.[locale] || journal.name?.vi || t.siteName}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          {journal.description?.[locale] || journal.description?.vi || t.defaultDescription}
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-12">
          <ScopeSection locale={locale} journal={journal} />
          <EditorialBoardPreview locale={locale} journal={journal} />
        </div>

        <aside className="lg:col-span-1">
          <JournalInfo locale={locale} journal={journal} />
        </aside>
      </div>
    </div>
  );
}
