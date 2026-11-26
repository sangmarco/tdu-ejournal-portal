import type { OaiRecord, OaiValue } from './oai';

export type PublicMetadataArticle = { urlPublished: string; abstract?: Record<string, string> };
export type OaiEnrichment = { descriptions: OaiValue[]; subjects: OaiValue[] };

/** No URL rewriting, slug guessing, numeric-ID matching, or title matching. */
function publicUrl(value: string): string | undefined {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.hash) return;
    // Require canonical spelling so normalization cannot silently broaden identity.
    return url.href === value ? value : undefined;
  } catch { return; }
}

/** Input articles MUST already be the REST public projection for this journal.
 * OAI never adds articles, changes visibility, or replaces REST metadata.
 * Language-less values stay language-less; their order carries no locale meaning.
 */
export function mergeOaiMetadata<T extends PublicMetadataArticle>(articles: readonly T[], records: readonly OaiRecord[]): Array<T & { abstract?: Record<string, string>; oaiMetadata?: OaiEnrichment }> {
  const byUrl = new Map<string, OaiRecord | null>();
  const deleted = new Set(records.filter(r => r.deleted).map(r => r.identifier));
  for (const record of records) {
    if (record.deleted || deleted.has(record.identifier)) continue;
    for (const { value } of record.fields.identifier ?? []) {
      const url = publicUrl(value);
      if (!url) continue;
      const previous = byUrl.get(url);
      // Ambiguous identities fail closed, even if their titles happen to match.
      byUrl.set(url, previous === undefined || previous === record ? record : null);
    }
  }
  return articles.map(article => {
    const url = publicUrl(article.urlPublished);
    const record = url ? byUrl.get(url) : undefined;
    if (!record) return { ...article };
    const descriptions = (record.fields.description ?? []).map(v => ({ ...v }));
    const subjects = (record.fields.subject ?? []).map(v => ({ ...v }));
    const abstract = { ...article.abstract };
    for (const { value, lang } of descriptions) {
      // Only explicitly labelled, unambiguous language values fill REST gaps.
      if (lang && !abstract[lang] && descriptions.filter(v => v.lang === lang).length === 1) {
        Object.defineProperty(abstract, lang, { value, enumerable: true, writable: true, configurable: true });
      }
    }
    return { ...article, abstract, oaiMetadata: { descriptions, subjects } };
  });
}
