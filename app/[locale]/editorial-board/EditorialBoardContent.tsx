'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Locale, dict } from '@/lib/i18n';
import { useUsers } from '@/hooks/useOJS';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const usersParams = { perPage: 100 } as const;

function EditorCard({ editor, locale, role }: { editor: any; locale: Locale; role: string }) {
  const t = dict[locale];
  const name = `${editor.firstName?.[locale] || editor.firstName?.vi} ${editor.lastName?.[locale] || editor.lastName?.vi}`;
  const affiliation = editor.affiliation?.[locale] || editor.affiliation?.vi;
  const initials = `${editor.firstName?.[locale]?.charAt(0) || 'E'}${editor.lastName?.[locale]?.charAt(0) || 'D'}`;

  return (
    <Card className="p-4 text-center h-full">
      <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-medium text-primary-700 mx-auto mb-3">
        {initials}
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{name}</h3>
      {affiliation && <p className="text-sm text-gray-500 mb-2">{affiliation}</p>}
      <Badge variant="outline" className="mb-2">{role}</Badge>
      {editor.orcid && (
        <a href={`https://orcid.org/${editor.orcid}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline block mb-2">
          ORCID: {editor.orcid}
        </a>
      )}
      {editor.email && (
        <a href={`mailto:${editor.email}`} className="text-xs text-gray-500 hover:text-primary-600">
          {editor.email}
        </a>
      )}
    </Card>
  );
}

function EditorSection({ title, editors, locale, role }: { title: string; editors: any[]; locale: Locale; role: string }) {
  if (!editors.length) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {editors.map((editor) => (
          <EditorCard key={editor.id} editor={editor} locale={locale} role={role} />
        ))}
      </div>
    </section>
  );
}

export default function EditorialBoardContent({ locale }: { locale: Locale }) {
  const { users, loading, error } = useUsers(usersParams);
  const t = dict[locale];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-8 max-w-3xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="p-4">
                <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Card className="max-w-2xl mx-auto p-8">
          <p className="text-gray-500">{t.errorLoadingBoard}</p>
        </Card>
      </div>
    );
  }

  const allUsers = users?.data || [];

  const chiefEditors = allUsers.filter((u: any) =>
    u.roles?.some((r: any) => r.name?.[locale]?.includes('Chief Editor') || r.name?.vi?.includes('Chủ biên'))
  );
  const deputyEditors = allUsers.filter((u: any) =>
    u.roles?.some((r: any) => r.name?.[locale]?.includes('Deputy Editor') || r.name?.vi?.includes('Phó chủ biên'))
  );
  const editors = allUsers.filter((u: any) =>
    u.roles?.some((r: any) => (r.name?.[locale]?.includes('Editor') || r.name?.vi?.includes('Biên tập')) && !r.name?.[locale]?.includes('Chief') && !r.name?.vi?.includes('Chủ'))
  );
  const internationalEditors = allUsers.filter((u: any) =>
    u.roles?.some((r: any) => r.name?.[locale]?.includes('International') || r.name?.vi?.includes('Quốc tế'))
  );
  const reviewers = allUsers.filter((u: any) =>
    u.roles?.some((r: any) => r.name?.[locale]?.includes('Reviewer') || r.name?.vi?.includes('Đánh giá'))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href={`/${locale}`} className="hover:text-primary-600">{t.home}</Link>
          </li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-900 font-medium">{t.editorialBoard}</li>
        </ol>
      </nav>

      <header className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{t.editorialBoardTitle}</h1>
        <p className="text-lg text-gray-600">{t.editorialBoardDescription}</p>
      </header>

      <EditorSection
        title={t.chiefEditors}
        editors={chiefEditors}
        locale={locale}
        role={t.chiefEditorRole}
      />
      <EditorSection
        title={t.deputyEditors}
        editors={deputyEditors}
        locale={locale}
        role={t.deputyEditorRole}
      />
      <EditorSection
        title={t.editors}
        editors={editors}
        locale={locale}
        role={t.editorRole}
      />
      <EditorSection
        title={t.internationalEditors}
        editors={internationalEditors}
        locale={locale}
        role={t.internationalEditorRole}
      />
      <EditorSection
        title={t.reviewers}
        editors={reviewers}
        locale={locale}
        role={t.reviewerRole}
      />

      {(!chiefEditors.length && !deputyEditors.length && !editors.length && !internationalEditors.length && !reviewers.length) && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">{t.noBoardMembers}</p>
        </Card>
      )}
    </div>
  );
}
