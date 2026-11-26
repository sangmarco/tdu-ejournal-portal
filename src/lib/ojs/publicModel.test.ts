import test from 'node:test';
import assert from 'node:assert/strict';
import { mapArticles, mapIssue } from './publicModel';
import { safePublicUrl } from './multiJournal';

const publication = { id: 11, submissionId: 1, status: 3, datePublished: '2026-01-01', urlPublished: 'http://localhost/ojs/index.php/sample/article/view/custom', title: { en: 'Synthetic article' } };
const submission = { id: 1, contextId: 7, currentPublicationId: 11, status: 3, publications: [publication] };
const issue = { id: 2, journalId: 7, published: true, articles: [submission] };

test('only exact current published publication in issue context is projected', () => {
  assert.equal(mapArticles(issue, 'sample').length, 1);
  for (const patch of [{ status: 1 }, { contextId: 9 }, { currentPublicationId: 12 }, { publications: [{ ...publication, submissionId: 9 }] }, { publications: [{ ...publication, status: 1 }] }]) {
    assert.deepEqual(mapArticles({ ...issue, articles: [{ ...submission, ...patch }] }, 'sample'), []);
  }
  assert.equal(mapIssue({ ...issue, published: false }, 'sample'), null);
  assert.deepEqual(mapArticles({ ...issue, published: false }, 'sample'), []);
});

test('projection excludes privileged data and does not invent current issue or PDF', () => {
  const article = mapArticles({ ...issue, articles: [{ ...submission, apiKey: 'synthetic-secret', workflowUrl: 'private', publications: [{ ...publication, galleys: [{ label: 'PDF', isApproved: false }] }] }] }, 'sample')[0];
  assert.equal('apiKey' in article, false);
  assert.equal('workflowUrl' in article, false);
  assert.deepEqual(article.galleys, []);
  assert.equal(mapIssue(issue, 'sample')?.current, false);
});

test('public links reject other contexts, workflows, query strings and credentials', () => {
  process.env.OJS_BASE_URL = 'http://localhost/ojs/index.php';
  process.env.OJS_PUBLIC_BASE_URL = 'https://journals.example/index.php';
  assert.equal(safePublicUrl('sample', publication.urlPublished), 'https://journals.example/index.php/sample/article/view/custom');
  for (const path of ['other/article/view/1', 'sample/workflow/access/1', 'sample/article/view/1?token=secret', 'sample/article/view/1#secret', 'sample/article/view/../workflow']) {
    assert.equal(safePublicUrl('sample', `http://localhost/ojs/index.php/${path}`), '');
  }
  assert.equal(safePublicUrl('sample', 'http://user:pass@localhost/ojs/index.php/sample/article/view/1'), '');
});
