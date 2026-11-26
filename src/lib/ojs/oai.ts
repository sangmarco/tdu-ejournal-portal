import { SaxesParser } from 'saxes';

const OAI = 'http://www.openarchives.org/OAI/2.0/';
const OAI_DC = 'http://www.openarchives.org/OAI/2.0/oai_dc/';
const DC = 'http://purl.org/dc/elements/1.1/';
const XML = 'http://www.w3.org/XML/1998/namespace';
export type OaiValue = { value: string; lang?: string };
export type OaiRecord = { identifier: string; deleted: boolean; fields: Record<string, OaiValue[]> };
export type OaiPage = { records: OaiRecord[]; resumptionToken?: string };
type Node = { uri: string; name: string; text: string; lang?: string; status?: string; code?: string; children: Node[] };
const children = (node: Node, uri: string, name: string) => node.children.filter(n => n.uri === uri && n.name === name);
function single(node: Node, uri: string, name: string): Node {
  const matches = children(node, uri, name);
  if (matches.length !== 1) throw new Error('Invalid OAI structure');
  return matches[0];
}

/** Strict namespace-aware XML parser. No DTDs, entities, nested DC markup or unbounded trees. */
export function parseOaiPage(xml: string, maxBytes = 2_000_000): OaiPage {
  if (Buffer.byteLength(xml, 'utf8') > maxBytes || /<!DOCTYPE/i.test(xml)) throw new Error('Unsafe or oversized OAI XML');
  const parser = new SaxesParser({ xmlns: true });
  const stack: Node[] = [];
  let root: Node | undefined;
  let count = 0;
  parser.on('doctype', () => { throw new Error('OAI DTD forbidden'); });
  parser.on('error', () => { throw new Error('Invalid OAI XML'); });
  parser.on('opentag', tag => {
    if (++count > 50_000 || stack.length >= 32) throw new Error('OAI XML complexity limit');
    const parent = stack[stack.length - 1];
    const node: Node = { uri: tag.uri, name: tag.local, text: '', children: [], lang: parent?.lang };
    for (const attr of Object.values(tag.attributes)) {
      if (attr.uri === XML && attr.local === 'lang') node.lang = attr.value || undefined;
      if (!attr.uri && attr.local === 'status') node.status = attr.value;
      if (!attr.uri && attr.local === 'code') node.code = attr.value;
    }
    if (parent) parent.children.push(node); else root = node;
    stack.push(node);
  });
  parser.on('text', text => { if (stack.length) stack[stack.length - 1].text += text; });
  parser.on('cdata', text => { if (stack.length) stack[stack.length - 1].text += text; });
  parser.on('closetag', () => { stack.pop(); });
  parser.write(xml).close();
  if (!root || root.uri !== OAI || root.name !== 'OAI-PMH') throw new Error('Invalid OAI namespace');
  const errors = children(root, OAI, 'error');
  if (errors.length) {
    if (errors.length === 1 && errors[0].code === 'noRecordsMatch' && !children(root, OAI, 'ListRecords').length) return { records: [] };
    throw new Error('OAI protocol error');
  }
  const list = single(root, OAI, 'ListRecords');
  if (list.children.some(n => n.uri !== OAI || !['record', 'resumptionToken'].includes(n.name))) throw new Error('Invalid OAI list child');
  const records = children(list, OAI, 'record').map(record => {
    const header = single(record, OAI, 'header');
    const identifier = single(header, OAI, 'identifier').text.trim();
    if (!identifier || (header.status && header.status !== 'deleted')) throw new Error('Invalid OAI header');
    const deleted = header.status === 'deleted';
    const fields: Record<string, OaiValue[]> = Object.create(null);
    if (!deleted) {
      const metadata = single(record, OAI, 'metadata');
      const dc = single(metadata, OAI_DC, 'dc');
      for (const field of dc.children) {
        if (field.uri !== DC || field.children.length) throw new Error('Invalid Dublin Core namespace or markup');
        if (!['title', 'creator', 'subject', 'description', 'publisher', 'contributor', 'date', 'type', 'format', 'identifier', 'source', 'language', 'relation', 'coverage', 'rights'].includes(field.name)) throw new Error('Invalid Dublin Core element');
        const value = field.text.trim();
        if (!value) continue;
        const values = fields[field.name] ??= [];
        if (!values.some(v => v.value === value && v.lang === field.lang)) values.push({ value, ...(field.lang ? { lang: field.lang } : {}) });
      }
    }
    return { identifier, deleted, fields };
  });
  const tokens = children(list, OAI, 'resumptionToken');
  if (tokens.length > 1 || (tokens[0]?.text.length ?? 0) > 4096) throw new Error('Invalid OAI token');
  return { records, resumptionToken: tokens[0]?.text.trim() || undefined };
}

export type OaiClientOptions = { maxBytes?: number; maxPages?: number; timeoutMs?: number; fetch?: typeof fetch };
/** Caller MUST validate endpoint against its approved journal registry. Redirects are never followed. */
export async function fetchOaiRecords(approvedEndpoint: string, options: OaiClientOptions = {}): Promise<OaiRecord[]> {
  const endpoint = new URL(approvedEndpoint);
  if (!['http:', 'https:'].includes(endpoint.protocol) || endpoint.username || endpoint.password || endpoint.search || endpoint.hash) throw new Error('Invalid OAI endpoint');
  const maxBytes = options.maxBytes ?? 2_000_000;
  const maxPages = options.maxPages ?? 10;
  const timeoutMs = options.timeoutMs ?? 10_000;
  for (const [value, ceiling] of [[maxBytes, 10_000_000], [maxPages, 100], [timeoutMs, 60_000]]) {
    if (!Number.isSafeInteger(value) || value <= 0 || value > ceiling) throw new Error('Invalid OAI limit');
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const records = new Map<string, OaiRecord>();
  const tokens = new Set<string>();
  let token: string | undefined;
  let bytes = 0;
  try {
    for (let page = 0; page < maxPages; page++) {
      const url = new URL(endpoint);
      url.searchParams.set('verb', 'ListRecords');
      if (token) url.searchParams.set('resumptionToken', token);
      else url.searchParams.set('metadataPrefix', 'oai_dc');
      const response = await (options.fetch ?? fetch)(url, { signal: controller.signal, redirect: 'error', credentials: 'omit', cache: 'no-store', headers: { Accept: 'application/xml, text/xml' } });
      if (!response.ok || !response.body) throw new Error('OAI request failed');
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8', { fatal: true });
      let xml = '';
      try {
        while (true) {
          const chunk = await reader.read();
          if (chunk.done) break;
          bytes += chunk.value.byteLength;
          if (bytes > maxBytes) throw new Error('OAI byte limit exceeded');
          xml += decoder.decode(chunk.value, { stream: true });
        }
        xml += decoder.decode();
      } finally { await reader.cancel(); }
      const parsed = parseOaiPage(xml, maxBytes);
      for (const record of parsed.records) {
        const previous = records.get(record.identifier);
        // Tombstones dominate duplicates, independent of ordering.
        if (previous && !previous.deleted && !record.deleted && JSON.stringify(previous.fields) !== JSON.stringify(record.fields)) throw new Error('Conflicting OAI duplicate');
        if (!previous || record.deleted) records.set(record.identifier, record);
      }
      token = parsed.resumptionToken;
      if (!token) return [...records.values()];
      if (tokens.has(token)) throw new Error('Repeated OAI token');
      tokens.add(token);
    }
    throw new Error('OAI page limit exceeded');
  } finally { clearTimeout(timer); }
}
