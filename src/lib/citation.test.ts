import test from 'node:test';
import assert from 'node:assert/strict';
import { formatAPA, formatBibTeX, formatRIS, CitationData } from './citation';

const sample: CitationData = {
  title: 'Học máy và Xử lý ngôn ngữ tự nhiên trong xuất bản học thuật',
  authors: 'Nguyễn Văn A, Trần Thị B',
  journalName: 'Tạp chí Khoa học Trường Đại học Thành Đông',
  year: 2026,
  volume: '1',
  number: '2',
  pages: '15-28',
  url: 'http://localhost/ojs/index.php/tapchi1/article/view/1',
  doi: '10.1234/tdu.2026.1.2.15',
};

test('formatAPA formats complete academic citation with APA 7th rules', () => {
  const result = formatAPA(sample);
  assert.equal(
    result,
    'Nguyễn Văn A, Trần Thị B (2026). Học máy và Xử lý ngôn ngữ tự nhiên trong xuất bản học thuật. Tạp chí Khoa học Trường Đại học Thành Đông, 1(2), 15-28. https://doi.org/10.1234/tdu.2026.1.2.15'
  );

  // Fallback when volume/number or authors are missing
  const minimal: CitationData = {
    title: 'Nghiên cứu cơ bản.',
    authors: '',
    journalName: 'Tạp chí TDU',
    url: 'http://example.com/view/1',
  };
  assert.equal(
    formatAPA(minimal),
    '(n.d.). Nghiên cứu cơ bản. Tạp chí TDU. http://example.com/view/1'
  );
});

test('formatBibTeX formats structured BibTeX entry correctly', () => {
  const result = formatBibTeX(sample);
  assert(result.startsWith('@article{nguyễnvăna2026,'));
  assert(result.includes('  title = {Học máy và Xử lý ngôn ngữ tự nhiên trong xuất bản học thuật}'));
  assert(result.includes('  author = {Nguyễn Văn A, Trần Thị B}'));
  assert(result.includes('  journal = {Tạp chí Khoa học Trường Đại học Thành Đông}'));
  assert(result.includes('  year = {2026}'));
  assert(result.includes('  volume = {1}'));
  assert(result.includes('  number = {2}'));
  assert(result.includes('  pages = {15-28}'));
  assert(result.includes('  doi = {10.1234/tdu.2026.1.2.15}'));
  assert(result.endsWith('\n}'));
});

test('formatRIS formats standard RIS tags for reference managers', () => {
  const result = formatRIS(sample);
  const lines = result.split('\n');
  assert.equal(lines[0], 'TY  - JOUR');
  assert.equal(lines[1], 'TI  - Học máy và Xử lý ngôn ngữ tự nhiên trong xuất bản học thuật');
  assert(lines.includes('AU  - Nguyễn Văn A'));
  assert(lines.includes('AU  - Trần Thị B'));
  assert(lines.includes('JO  - Tạp chí Khoa học Trường Đại học Thành Đông'));
  assert(lines.includes('PY  - 2026'));
  assert(lines.includes('VL  - 1'));
  assert(lines.includes('IS  - 2'));
  assert(lines.includes('SP  - 15'));
  assert(lines.includes('EP  - 28'));
  assert(lines.includes('DO  - 10.1234/tdu.2026.1.2.15'));
  assert.equal(lines[lines.length - 1], 'ER  - ');
});
