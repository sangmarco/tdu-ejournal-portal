// Public DTOs only. OJS 3.5.0.6 sample: published submission/publication status = 3.
export type Row = Record<string, unknown>;
export const record = (v: unknown): Row => v !== null && typeof v === 'object' && !Array.isArray(v) ? v as Row : {};
export const rows = (v: unknown): Row[] => Array.isArray(v) ? v.map(record) : [];
export const str = (v: unknown): string => typeof v === 'string' ? v : '';
export const id = (v: unknown): v is number => typeof v === 'number' && Number.isSafeInteger(v) && v > 0;
export const published = (v: unknown) => v === true || v === 1;
export function localized(v: unknown): Record<string,string> {
  return Object.fromEntries(Object.entries(record(v)).filter((entry): entry is [string,string] => typeof entry[1] === 'string'));
}
export function label(v: unknown, locale: string) {
  const values = localized(v);
  return str(v) || values[locale] || values[locale === 'vi' ? 'vi_VN' : 'en_US'] || Object.values(values).find(Boolean) || '';
}
export function mapIssue(item: Row, path: string) {
  if (!published(item.published) || !id(item.id) || !id(item.journalId)) return null;
  return { id: item.id, journalId: item.journalId, journalPath: path, title: localized(item.title), description: localized(item.description), identification: str(item.identification), volume: String(item.volume ?? ''), number: String(item.number ?? ''), year: typeof item.year === 'number' ? item.year : 0, datePublished: str(item.datePublished), published: true, current: published(item.current), publishedUrl: str(item.publishedUrl), coverUrl: localized(item.coverUrl), articles: [] };
}
export function mapArticles(issue: Row, path: string) {
  if (!mapIssue(issue,path)) return [];
  return rows(issue.articles).flatMap(a => {
    if (!id(a.id) || !id(a.currentPublicationId) || a.status !== 3 || a.contextId !== issue.journalId) return [];
    const p = rows(a.publications).find(p => p.id === a.currentPublicationId && p.submissionId === a.id && p.status === 3);
    if (!p || !str(p.datePublished) || !str(p.urlPublished)) return [];
    const section = rows(issue.sections).find(s => s.id === p.sectionId && s.contextId === a.contextId);
    return [{ id: a.id, publicationId: a.currentPublicationId, journalId: a.contextId, journalPath: path, issueId: issue.id, status: 3, title: localized(p.fullTitle ?? p.title), sectionId: p.sectionId, sectionName: localized(section?.title), authorsString: str(p.authorsStringIncludeInBrowse), datePublished: str(p.datePublished), language: str(p.locale) || str(a.locale), pages: str(p.pages), urlPublished: str(p.urlPublished), coverUrl: localized(p.coverUrl), abstract: localized(p.abstract), authors: [], galleys: [], identifiers: [], categories: [] }];
  });
}
