import assert from 'node:assert/strict';
import test from 'node:test';
import { fetchOaiRecords, parseOaiPage } from './oai';
import { mergeOaiMetadata } from './metadataMerge';
const wrap = (body: string) => `<o:OAI-PMH xmlns:o="http://www.openarchives.org/OAI/2.0/" xmlns:m="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:d="http://purl.org/dc/elements/1.1/"><o:ListRecords>${body}</o:ListRecords></o:OAI-PMH>`;
const record = (id = 'opaque:a', fields = '<d:identifier>https://example.org/j/article/view/slug</d:identifier><d:description xml:lang="vi">Tóm tắt</d:description><d:description>Unlabelled</d:description><d:subject xml:lang="en">Science</d:subject>') => `<o:record><o:header><o:identifier>${id}</o:identifier></o:header><o:metadata><m:dc>${fields}</m:dc></o:metadata></o:record>`;
const tombstone = '<o:record><o:header status="deleted"><o:identifier>opaque:a</o:identifier></o:header></o:record>';
const fake = (pages: string[], urls: string[] = []): typeof fetch => async (url, init) => {
  urls.push(String(url));
  assert.equal(init?.redirect, 'error');
  assert.equal(init?.credentials, 'omit');
  return new Response(pages.shift(), { headers: { 'content-type': 'text/xml' } });
};
test('namespaces rather than prefixes; language preserved including unlabelled values', () => {
  const parsed = parseOaiPage(wrap(record()));
  assert.deepEqual(parsed.records[0].fields.description, [{ value: 'Tóm tắt', lang: 'vi' }, { value: 'Unlabelled' }]);
  assert.throws(() => parseOaiPage(wrap(record()).replace('http://purl.org/dc/elements/1.1/', 'https://evil.invalid/')));
  assert.throws(() => parseOaiPage(wrap(record()).replace('http://www.openarchives.org/OAI/2.0/', 'https://evil.invalid/')));
});
test('reject DTD, external entities, malformed XML, nested fields and byte overflow', () => {
  for (const xml of ['<!DOCTYPE x [<!ENTITY x SYSTEM "file:///secret">]>' + wrap(record()), wrap(record()).slice(0, -4), wrap(record('a', '<d:description><d:title>x</d:title></d:description>'))]) assert.throws(() => parseOaiPage(xml));
  assert.throws(() => parseOaiPage(wrap(record()), 10));
});
test('pagination uses opaque encoded tokens alone; duplicates and tombstones', async () => {
  const urls: string[] = [];
  const records = await fetchOaiRecords('https://example.org/j/vi/oai', { fetch: fake([wrap(record() + '<o:resumptionToken>a&amp;b</o:resumptionToken>'), wrap(record() + tombstone)], urls) });
  assert.equal(records.length, 1);
  assert.equal(records[0].deleted, true);
  const second = new URL(urls[1]);
  assert.equal(second.searchParams.get('resumptionToken'), 'a&b');
  assert.equal(second.searchParams.has('metadataPrefix'), false);
});
test('repeated token, pages, total bytes, HTTP errors, redirects and timeout fail closed', async () => {
  const page = wrap(record() + '<o:resumptionToken>next</o:resumptionToken>');
  await assert.rejects(fetchOaiRecords('https://example.org/j/oai', { fetch: fake([page, page]) }), /Repeated/);
  await assert.rejects(fetchOaiRecords('https://example.org/j/oai', { fetch: fake([page]), maxPages: 1 }), /page limit/);
  await assert.rejects(fetchOaiRecords('https://example.org/j/oai', { fetch: fake([page]), maxBytes: 20 }), /byte limit/);
  await assert.rejects(fetchOaiRecords('https://example.org/j/oai', { fetch: async () => new Response('', { status: 302 }) }));
  await assert.rejects(fetchOaiRecords('https://example.org/j/oai', { timeoutMs: 5, fetch: async (_, init) => new Promise((_, reject) => init?.signal?.addEventListener('abort', () => reject(new Error('aborted')))) }), /aborted/);
});
test('noRecordsMatch is empty, other protocol errors fail', () => {
  const error = (code: string) => `<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/"><error code="${code}">safe</error></OAI-PMH>`;
  assert.deepEqual(parseOaiPage(error('noRecordsMatch')).records, []);
  assert.throws(() => parseOaiPage(error('badArgument')));
});
test('merge exact URLs only, REST authority, no guessed locale and no ambiguity', () => {
  const records = parseOaiPage(wrap(record())).records;
  const articles: Array<{ urlPublished: string; abstract: Record<string, string> }> = [{ urlPublished: 'https://example.org/j/article/view/slug', abstract: { vi: 'REST' } }, { urlPublished: 'https://example.org/j/article/view/1', abstract: {} }];
  const merged = mergeOaiMetadata(articles, records);
  assert.equal(merged.length, 2);
  assert.equal(merged[0].abstract?.vi, 'REST');
  assert.equal(merged[0].oaiMetadata?.descriptions[1].lang, undefined);
  assert.equal(merged[1].oaiMetadata, undefined);
  assert.equal(mergeOaiMetadata([], records).length, 0);
  assert.equal(mergeOaiMetadata(articles, [...records, { ...records[0], identifier: 'another' }])[0].oaiMetadata, undefined);
  assert.equal(mergeOaiMetadata(articles, [...records, { ...records[0], deleted: true }])[0].oaiMetadata, undefined);
  assert.equal(mergeOaiMetadata([{ urlPublished: articles[0].urlPublished }], records)[0].abstract?.vi, 'Tóm tắt');
});
