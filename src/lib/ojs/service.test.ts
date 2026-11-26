import assert from 'node:assert/strict';
import test, { beforeEach, afterEach } from 'node:test';
import { journals, issueList, issueDetail, journalArticles } from './multiJournal';
import { GET } from '../../../app/api/ojs/[...path]/route';

const issue = { id: 2, journalId: 7, published: true, year: 2026 };
const publication = { id: 11, submissionId: 1, status: 3, datePublished: '2026-01-01', title: { en: 'Synthetic' }, urlPublished: 'https://upstream.example/sample/article/view/custom' };
const detail = { ...issue, articles: [{ id: 1, contextId: 7, status: 3, currentPublicationId: 11, publications: [publication] }] };
const env = { ...process.env };
const originalFetch = globalThis.fetch;
beforeEach(() => {
  process.env.OJS_BASE_URL = 'https://upstream.example';
  process.env.OJS_PUBLIC_BASE_URL = 'https://public.example';
  process.env.OJS_PUBLIC_JOURNALS = 'sample,second,sample,../bad,index,_';
  process.env.OJS_OAI_ENABLED = 'false';
  process.env.OJS_PUBLIC_PROJECTION = 'false';
});
afterEach(() => { process.env = { ...env }; globalThis.fetch = originalFetch; });
function mock(handler: (url: URL) => unknown) {
  const urls: URL[] = [];
  globalThis.fetch = async (input, init) => {
    const url = new URL(String(input)); urls.push(url);
    assert.equal(init?.redirect, 'error');
    assert.equal(init?.credentials, 'omit');
    assert.equal(new Headers(init?.headers).has('authorization'), false);
    assert.equal(new Headers(init?.headers).has('cookie'), false);
    const value = handler(url);
    return value instanceof Response ? value : Response.json(value);
  };
  return urls;
}
test('projection opt-in pins path, requires version and disables persistent cache', async () => {
  process.env.OJS_PUBLIC_PROJECTION = 'true';
  globalThis.fetch = async (input, init) => {
    assert.equal(new URL(String(input)).pathname, '/sample/api/v1/publicPublications/issues');
    assert.equal(init?.cache, 'no-store');
    assert.equal(init?.credentials, 'omit');
    assert.equal((init as { next?: unknown }).next, undefined);
    return Response.json({ contract: 'public-publications-v1', items: [issue], itemsMax: 1 });
  };
  assert.equal((await issueList('sample')).length, 1);
  mock(() => ({ items: [issue], itemsMax: 1 }));
  await assert.rejects(issueList('sample'), /Unexpected projection contract/);
});
const proxy = (path: string, query = '') => GET(new Request(`https://portal.example/api/ojs/${path}?journal=sample&${query}`), { params: Promise.resolve({ path: path.split('/') }) });

test('registry deduplicates approved paths and rejects unknown journal before fetching', async () => {
  const calls = mock(() => { throw new Error('must not fetch'); });
  assert.deepEqual((await journals('en')).map(j => j.path), ['sample', 'second']);
  await assert.rejects(issueList('unknown'), /Unknown journal/);
  assert.equal((await proxy('users')).status, 404);
  assert.equal(calls.length, 0);
});
test('REST pagination advances offsets, filters unpublished issues and deduplicates', async () => {
  const calls = mock(url => url.searchParams.get('offset') === '0'
    ? { items: [issue, { ...issue, id: 3, published: false }], itemsMax: 4 }
    : { items: [issue, { ...issue, id: 4 }], itemsMax: 4 });
  assert.deepEqual((await issueList('sample')).map(i => i.id), [2, 4]);
  assert.deepEqual(calls.map(u => u.searchParams.get('offset')), ['0', '2']);
  assert.ok(calls.every(u => u.searchParams.get('isPublished') === '1'));
});
test('malformed totals, incomplete pages, invalid JSON and oversized responses fail closed', async () => {
  for (const body of [{ items: [], itemsMax: -1 }, { items: [], itemsMax: 0.5 }, { items: [], itemsMax: 1 }, { items: null, itemsMax: 0 }]) {
    mock(() => body); await assert.rejects(issueList('sample'));
  }
  mock(() => new Response('not json')); await assert.rejects(issueList('sample'));
  mock(() => new Response('x'.repeat(4 * 1024 * 1024 + 1)));
  await assert.rejects(issueList('sample'), /limit exceeded/);
});
test('REST pagination stops at its request cap even when upstream repeats a page', async () => {
  const calls = mock(() => ({ items: [issue], itemsMax: 101 }));
  await assert.rejects(issueList('sample'), /pagination limit exceeded/);
  assert.equal(calls.length, 100);
  assert.equal(calls[99].searchParams.get('offset'), '99');
});
test('REST pagination accepts a complete final page at the cap', async () => {
  const calls = mock(url => ({ items: [{ ...issue, id: Number(url.searchParams.get('offset')) + 1 }], itemsMax: 100 }));
  assert.equal((await issueList('sample')).length, 100);
  assert.equal(calls.length, 100);
});
test('service enriches exact custom-slug identity after public-base translation only', async () => {
  process.env.OJS_OAI_ENABLED = 'true';
  process.env.OJS_OAI_LOCALE = 'vi';
  for (const slug of ['custom', '1']) {
    const xml = `<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/"><ListRecords><record><header><identifier>synthetic:1</identifier></header><metadata><oai_dc:dc><dc:identifier>https://upstream.example/sample/article/view/${slug}</dc:identifier><dc:description xml:lang="vi">Synthetic abstract</dc:description><dc:subject xml:lang="en">Science</dc:subject></oai_dc:dc></metadata></record></ListRecords></OAI-PMH>`;
    const calls = mock(url => url.pathname.endsWith('/issues') ? { items: [issue], itemsMax: 1 } : url.pathname.endsWith('/issues/2') ? detail : new Response(xml));
    const articles = await journalArticles('sample');
    assert.equal(articles.length, 1);
    assert.equal(articles[0].urlPublished, 'https://public.example/sample/article/view/custom');
    assert.equal(articles[0].abstract?.vi, slug === 'custom' ? 'Synthetic abstract' : undefined);
    assert.equal(Boolean(articles[0].oaiMetadata), slug === 'custom');
    assert.ok(calls.some(url => url.pathname === '/sample/vi/oai'));
    assert.ok(calls.every(url => url.origin === 'https://upstream.example'));
  }
});
test('detail requires listed publication and matching journal ownership', async () => {
  const calls = mock(() => ({ items: [issue], itemsMax: 1 }));
  assert.equal(await issueDetail('sample', 9), null);
  assert.equal(calls.length, 1);
  for (const patch of [{ journalId: 8 }, { id: 9 }, { published: false }]) {
    mock(url => url.pathname.endsWith('/issues') ? { items: [issue], itemsMax: 1 } : { ...detail, ...patch });
    assert.equal(await issueDetail('sample', 2), null);
  }
});
test('proxy paginates projected public data and never returns upstream error payloads', async () => {
  mock(() => ({ items: [issue, { ...issue, id: 3 }], itemsMax: 2 }));
  const response = await proxy('issues', 'page=2&perPage=1');
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const body = await response.json();
  assert.equal(body.total, 2); assert.equal(body.data[0].id, 3);
  for (const status of [401, 403, 500, 302]) {
    mock(() => new Response('synthetic-private-error', { status }));
    const failure = await proxy('issues');
    assert.equal(failure.status, 502);
    assert.deepEqual(await failure.json(), { message: 'Cannot load public OJS data' });
  }
});
test('optional OAI failure including invalid locale preserves REST-confirmed articles', async () => {
  process.env.OJS_OAI_ENABLED = 'true';
  for (const locale of ['vi', '../invalid']) {
    process.env.OJS_OAI_LOCALE = locale;
    mock(url => url.pathname.endsWith('/issues') ? { items: [issue], itemsMax: 1 } : url.pathname.endsWith('/issues/2') ? detail : new Response('', { status: 503 }));
    const articles = await journalArticles('sample');
    assert.equal(articles.length, 1);
    assert.equal(articles[0].urlPublished, 'https://public.example/sample/article/view/custom');
    assert.equal(articles[0].oaiMetadata, undefined);
  }
});
