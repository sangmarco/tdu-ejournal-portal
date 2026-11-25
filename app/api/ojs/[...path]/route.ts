type Row = Record<string, unknown>;

function row(value: unknown): Row {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Row : {};
}

function fields(source: Row, names: string[]): Row {
  return Object.fromEntries(names.filter(key => key in source).map(key => [key, source[key]]));
}

function issue(item: Row) {
  return {
    ...fields(item, ['id', 'title', 'description', 'volume', 'number', 'year', 'datePublished', 'current', 'published']),
    articles: [],
  };
}

function article(item: Row) {
  const publications = Array.isArray(item.publications) ? item.publications.map(row) : [];
  const publication = publications.find(p => p.id === item.currentPublicationId && p.status === 3)
    ?? publications.findLast(p => p.status === 3);
  if (!publication || item.status !== 3) return null;
  const authors = Array.isArray(publication.authors) ? publication.authors.map(row) : [];
  return {
    id: item.id,
    status: 7, // The portal's display model uses 7 for published.
    ...fields(publication, ['title', 'abstract', 'datePublished', 'pages']),
    authors: authors.map(a => ({
      id: a.id, firstName: a.givenName, lastName: a.familyName, includeInBrowse: a.includeInBrowse !== false,
    })),
  };
}

function json(value: unknown, status = 200) {
  return Response.json(value, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function GET(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const path = (await context.params).path.join('/');
  const input = new URL(request.url).searchParams;
  const issueArticles = /^issues\/(\d+)\/articles$/.exec(path);
  const isArticle = path === 'articles' || path === 'articles/search' || !!issueArticles || /^articles\/\d+$/.test(path);
  const isIssue = /^issues(?:\/(?:current|\d+))?$/.test(path);
  const isJournal = path === 'journals/1' || path === 'journals/1/settings';
  // User directory reads retain the upstream's anonymous access rules.
  const isUser = /^users(?:\/\d+)?$/.test(path);
  if (!isJournal && !isIssue && !isArticle && !isUser) return json({ message: 'Unknown portal resource' }, 404);

  const base = (process.env.OJS_BASE_URL || 'http://localhost/ojs').replace(/\/+$/, '');
  const version = process.env.OJS_API_VERSION || 'v1';
  const journalId = process.env.OJS_JOURNAL_ID || '1';
  const endpoint = isJournal ? `contexts/${encodeURIComponent(journalId)}`
    : isArticle ? (/^articles\/\d+$/.test(path) ? path.replace('articles/', 'submissions/') : 'submissions')
    : path;
  const upstream = new URL(`${base}/api/${version}/${endpoint}`);
  const list = ['issues', 'submissions', 'users'].includes(endpoint);
  const count = Math.min(100, Math.max(1, Number.parseInt(input.get('perPage') || '20', 10) || 20));
  const offset = (Math.max(1, Number.parseInt(input.get('page') || '1', 10) || 1) - 1) * count;
  if (list) {
    upstream.searchParams.set('count', String(count));
    upstream.searchParams.set('offset', String(offset));
  }
  if (list && (isArticle || isIssue)) {
    upstream.searchParams.set('orderBy', 'datePublished');
    upstream.searchParams.set('orderDirection', input.get('sortDirection') === 'asc' ? 'ASC' : 'DESC');
    if (isArticle) upstream.searchParams.set('status', '3');
    if (isIssue) upstream.searchParams.set('isPublished', '1');
    if (issueArticles) upstream.searchParams.set('issueIds', issueArticles[1]);
    const year = input.get('filter[year]');
    if (isIssue && year && /^\d{4}$/.test(year)) upstream.searchParams.set('years', year);
    const query = input.get('filter[q]');
    if (query) upstream.searchParams.set('searchPhrase', query);
  }
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (process.env.OJS_API_KEY && !isUser) headers.Authorization = `Bearer ${process.env.OJS_API_KEY}`;
  try {
    const response = await fetch(upstream, { headers, cache: 'no-store', redirect: 'manual', signal: AbortSignal.timeout(12000) });
    if (response.status === 404 && path === 'issues/current') return json(null);
    if (!response.ok) {
      const status = response.status >= 400 ? response.status : 502;
      return json({ message: `OJS HTTP ${response.status} (${endpoint})` }, status);
    }
    if (!response.headers.get('content-type')?.includes('json')) {
      return json({ message: 'OJS returned non-JSON content. Check OJS_BASE_URL and the journal path.' }, 502);
    }
    const body: unknown = await response.json();
    const item = row(body);
    if (isJournal) return json(fields(item, ['id', 'name', 'description', 'abbreviation', 'primaryLocale', 'supportedLocales', 'issnPrint', 'issnOnline', 'contactName', 'contactEmail', 'contactPhone']));
    if (isUser && !list) return json(body);
    if (list) {
      const items = Array.isArray(body) ? body : item.items;
      if (!Array.isArray(items)) return json({ message: 'Unexpected OJS collection format' }, 502);
      const rows = items.map(row);
      const data = isArticle ? rows.map(article).filter(Boolean)
        : isIssue ? rows.filter(i => i.published === true || i.published === 1).map(issue) : rows;
      return json({ data, total: item.itemsMax ?? data.length, limit: count, offset });
    }
    const result = isArticle ? article(item) : (item.published === true || item.published === 1) ? issue(item) : null;
    return result ? json(result) : json({ message: 'Published resource not found' }, 404);
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'TimeoutError';
    return json({ message: timedOut ? 'OJS request timed out' : 'Cannot read the OJS API. Check OJS_BASE_URL and the OJS server.' }, timedOut ? 504 : 502);
  }
}
