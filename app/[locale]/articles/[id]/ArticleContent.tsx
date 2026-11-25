'use client';

import Link from 'next/link';
import { Locale, dict } from '@/lib/i18n';
import { useArticle, useJournal } from '@/hooks/useOJS';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatArticleCitation, getArticleStatusLabel, getLocalizedValue } from '@/lib/ojs/client';

function AuthorList({ authors, locale }: { authors: any[]; locale: Locale }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {authors
        .filter((a) => a.includeInBrowse)
        .map((author, index) => (
          <span key={author.id} className="flex items-center gap-1">
            {index > 0 && <span className="text-gray-400">,</span>}
            <span className="font-medium">
              {getLocalizedValue(author.firstName, locale)} {getLocalizedValue(author.lastName, locale)}
            </span>
            {author.orcid && (
              <a
                href={`https://orcid.org/${author.orcid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-primary-600"
                title="ORCID"
              >
                🔗
              </a>
            )}
          </span>
        ))}
    </div>
  );
}

function GalleyLinks({ galleys, locale }: { galleys: any[]; locale: Locale }) {
  const pdfGalley = galleys?.find((g) => g.file?.mimeType === 'application/pdf');
  const htmlGalley = galleys?.find((g) => g.html);
  const xmlGalley = galleys?.find((g) => g.file?.mimeType?.includes('xml'));

  return (
    <div className="flex flex-wrap gap-3">
      {pdfGalley && pdfGalley.file?.downloadUrl && (
        <a
          href={pdfGalley.file.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051V17a1 1 0 001 1h5.5a1 1 0 100-2h-4.5a1 1 0 01-1-1V8.05l4.614-4.127a1 1 0 000-1.84l-7-3zM9 11a1 1 0 112 0v3a1 1 0 11-2 0v-3zM5 6a1 1 0 011-1h6a1 1 0 110 2H6a1 1 0 01-1-1V6z" />
          </svg>
          <span>{dict[locale].downloadPDF}</span>
        </a>
      )}
      {htmlGalley && (
        <a
          href={`#article-fulltext`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 10h8a1 1 0 110 2H7a1 1 0 110-2z" clipRule="evenodd" />
          </svg>
          <span>{dict[locale].fullText}</span>
        </a>
      )}
      {xmlGalley && xmlGalley.file?.downloadUrl && (
        <a
          href={xmlGalley.file.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051V17a1 1 0 001 1h5.5a1 1 0 100-2h-4.5a1 1 0 01-1-1V8.05l4.614-4.127a1 1 0 000-1.84l-7-3zM9 11a1 1 0 112 0v3a1 1 0 11-2 0v-3zM5 6a1 1 0 011-1h6a1 1 0 110 2H6a1 1 0 01-1-1V6z" />
          </svg>
          <span>XML</span>
        </a>
      )}
    </div>
  );
}

export default function ArticleContent({ locale, articleId }: { locale: Locale; articleId: number }) {
  const { article, loading, error } = useArticle(articleId);
  const { journal } = useJournal();
  const t = dict[locale];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Card className="max-w-2xl mx-auto p-8">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t.articleNotFound}</h2>
          <p className="text-gray-600 mb-6">{t.articleNotFoundDesc}</p>
          <Link href={`/${locale}/archives`}>
            <Button variant="outline">{t.browseArchives}</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const citation = formatArticleCitation(article, locale);
  const statusLabel = getArticleStatusLabel(article.status, locale);

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <li>
            <Link href={`/${locale}`} className="hover:text-primary-600">{t.home}</Link>
          </li>
          <li className="text-gray-300">/</li>
          <li>
            <Link href={`/${locale}/archives`} className="hover:text-primary-600">{t.archives}</Link>
          </li>
          <li className="text-gray-300">/</li>
          {article.issue && (
            <>
              <li>
                <Link href={`/${locale}/issues/${article.issue.id}`} className="hover:text-primary-600">
                  {article.issue.title?.[locale] || article.issue.title?.vi || t.untitledIssue}
                </Link>
              </li>
              <li className="text-gray-300">/</li>
            </>
          )}
          <li className="text-gray-900 font-medium truncate max-w-xs">
            {getLocalizedValue(article.title, locale)}
          </li>
        </ol>
      </nav>

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {article.sectionName && (
            <Badge variant="outline">{getLocalizedValue(article.sectionName, locale)}</Badge>
          )}
          <Badge variant={article.openAccess ? 'success' : 'default'}>
            {article.openAccess ? t.openAccess : t.subscriptionAccess}
          </Badge>
          <Badge variant="default">{statusLabel}</Badge>
          {article.doi && (
            <Badge variant="outline">DOI: {article.doi}</Badge>
          )}
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
          {getLocalizedValue(article.title, locale)}
        </h1>

        <AuthorList authors={article.authors} locale={locale} />

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span>{article.datePublished ? new Date(article.datePublished).toLocaleDateString(locale) : ''}</span>
          {article.pages && <span>| {article.pages}</span>}
          {article.issue?.volume && <span>| Vol. {article.issue?.volume}</span>}
          {article.issue?.number && <span>| No. {article.issue?.number}</span>}
        </div>
      </header>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Abstract */}
          {article.abstract?.[locale] || article.abstract?.vi && (
            <section id="abstract" className="prose prose-gray max-w-none">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{t.abstract}</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  {article.abstract?.[locale] || article.abstract?.vi}
                </p>
              </div>
            </section>
          )}

          {/* Keywords */}
          {article.keywords?.[locale] || article.keywords?.vi && (
            <section className="prose prose-gray max-w-none">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{t.keywords}</h2>
              <div className="flex flex-wrap gap-2">
                {(article.keywords?.[locale] || article.keywords?.vi)
                  .split(',')
                  .map((k) => k.trim())
                  .filter(Boolean)
                  .map((keyword) => (
                    <Badge key={keyword} variant="outline">{keyword}</Badge>
                  ))}
              </div>
            </section>
          )}

          {/* Full Text */}
          {article.galleys?.some((g) => g.html) && (
            <section id="article-fulltext" className="prose prose-gray max-w-none">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{t.fullText}</h2>
              <div className="bg-white border rounded-lg p-6">
                {article.galleys
                  ?.filter((g) => g.html)
                  .map((galley) => (
                    <div key={galley.id} dangerouslySetInnerHTML={{ __html: galley.html || '' }} />
                  ))}
              </div>
            </section>
          )}

          {/* Download Links */}
          {article.galleys?.length && (
            <section className="prose prose-gray max-w-none">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{t.downloadOptions}</h2>
              <GalleyLinks galleys={article.galleys} locale={locale} />
            </section>
          )}

          {/* Citations */}
          <section className="prose prose-gray max-w-none border-t pt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{t.citation}</h2>
            <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm text-gray-700 whitespace-pre-wrap">
              {citation}
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(citation)}>
                {t.copyCitation}
              </Button>
            </div>
          </section>

          {/* References */}
          {article.citations?.length && (
            <section className="prose prose-gray max-w-none">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{t.references}</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                {article.citations.map((citation, index) => (
                  <li key={index} className="text-sm">{citation}</li>
                ))}
              </ol>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <Card className="p-6 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">{t.articleInfo}</h3>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-gray-500">{t.doi}</dt>
                <dd className="font-medium text-sm break-all">
                  {article.doi ? (
                    <a href={`https://doi.org/${article.doi}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                      {article.doi}
                    </a>
                  ) : (
                    '—'
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">{t.status}</dt>
                <dd className="font-medium">
                  <Badge variant="default">{statusLabel}</Badge>
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">{t.section}</dt>
                <dd className="font-medium">{article.sectionName?.[locale] || article.sectionName?.vi || '—'}</dd>
              </div>
              <div>
                <dt className="text-gray-500">{t.language}</dt>
                <dd className="font-medium">{article.language?.toUpperCase() || '—'}</dd>
              </div>
              {article.issue && (
                <div>
                  <dt className="text-gray-500">{t.issue}</dt>
                  <dd className="font-medium">
                    <Link href={`/${locale}/issues/${article.issue.id}`} className="text-primary-600 hover:underline">
                      {article.issue.title?.[locale] || article.issue.title?.vi || t.untitledIssue}
                    </Link>
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-gray-500">{t.dateSubmitted}</dt>
                <dd className="font-medium">{article.dateSubmitted ? new Date(article.dateSubmitted).toLocaleDateString(locale) : '—'}</dd>
              </div>
              {article.datePublished && (
                <div>
                  <dt className="text-gray-500">{t.datePublished}</dt>
                  <dd className="font-medium">{new Date(article.datePublished).toLocaleDateString(locale)}</dd>
                </div>
              )}
            </dl>
          </Card>

          {article.authors.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">{t.authors}</h3>
              <div className="space-y-4">
                {article.authors.filter((a) => a.includeInBrowse).map((author) => (
                  <div key={author.id} className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-500">
                      {getLocalizedValue(author.firstName, locale).charAt(0)}{getLocalizedValue(author.lastName, locale).charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">
                        {getLocalizedValue(author.firstName, locale)} {getLocalizedValue(author.lastName, locale)}
                      </p>
                      {author.affiliation?.[locale] || author.affiliation?.vi && (
                        <p className="text-sm text-gray-500">{author.affiliation?.[locale] || author.affiliation?.vi}</p>
                      )}
                      {author.orcid && (
                        <a href={`https://orcid.org/${author.orcid}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline">
                          ORCID: {author.orcid}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </aside>
      </div>
    </article>
  );
}
