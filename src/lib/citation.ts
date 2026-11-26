export interface CitationData {
  title: string;
  authors: string; // e.g. "Nguyen Van A, Tran Thi B"
  journalName: string;
  year?: string | number;
  volume?: string;
  number?: string;
  pages?: string;
  url?: string;
  doi?: string;
}

/** Formats citation according to APA 7th edition guidelines. */
export function formatAPA(data: CitationData): string {
  const authors = data.authors.trim();
  const year = data.year ? `(${data.year})` : '(n.d.)';
  const title = data.title.trim().replace(/\.$/, '');
  const journal = data.journalName.trim();
  
  let issueInfo = '';
  if (data.volume && data.number) {
    issueInfo = `, ${data.volume}(${data.number})`;
  } else if (data.volume) {
    issueInfo = `, ${data.volume}`;
  } else if (data.number) {
    issueInfo = `, (${data.number})`;
  }

  const pages = data.pages ? `, ${data.pages}` : '';
  const link = data.doi ? ` https://doi.org/${data.doi.replace(/^https?:\/\/doi\.org\//, '')}` : (data.url ? ` ${data.url}` : '');

  const authorPrefix = authors ? `${authors} ` : '';
  return `${authorPrefix}${year}. ${title}. ${journal}${issueInfo}${pages}.${link}`.trim();
}

/** Formats citation according to BibTeX format. */
export function formatBibTeX(data: CitationData): string {
  const firstAuthor = data.authors.split(/[,;&]/)[0]?.trim().replace(/\s+/g, '') || 'article';
  const yearStr = data.year ? String(data.year) : 'year';
  const key = `${firstAuthor.toLowerCase()}${yearStr}`;

  const fields: string[] = [
    `  title = {${data.title}}`,
    data.authors ? `  author = {${data.authors}}` : '',
    `  journal = {${data.journalName}}`,
    data.year ? `  year = {${data.year}}` : '',
    data.volume ? `  volume = {${data.volume}}` : '',
    data.number ? `  number = {${data.number}}` : '',
    data.pages ? `  pages = {${data.pages}}` : '',
    data.doi ? `  doi = {${data.doi}}` : '',
    data.url ? `  url = {${data.url}}` : '',
  ].filter(Boolean);

  return `@article{${key},\n${fields.join(',\n')}\n}`;
}

/** Formats citation according to Research Information Systems (RIS) format. */
export function formatRIS(data: CitationData): string {
  const lines: string[] = ['TY  - JOUR', `TI  - ${data.title}`];

  if (data.authors) {
    const authors = data.authors.split(/[,;&]/).map(a => a.trim()).filter(Boolean);
    for (const author of authors) {
      lines.push(`AU  - ${author}`);
    }
  }

  lines.push(`JO  - ${data.journalName}`);
  if (data.year) lines.push(`PY  - ${data.year}`);
  if (data.volume) lines.push(`VL  - ${data.volume}`);
  if (data.number) lines.push(`IS  - ${data.number}`);
  if (data.pages) {
    const parts = data.pages.split(/[-–—]/).map(p => p.trim());
    if (parts[0]) lines.push(`SP  - ${parts[0]}`);
    if (parts[1]) lines.push(`EP  - ${parts[1]}`);
  }
  if (data.doi) lines.push(`DO  - ${data.doi}`);
  if (data.url) lines.push(`UR  - ${data.url}`);
  lines.push('ER  - ');

  return lines.join('\n');
}
