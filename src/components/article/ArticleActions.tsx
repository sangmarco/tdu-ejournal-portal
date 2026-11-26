'use client';

import { useState } from 'react';
import { formatAPA, formatBibTeX, formatRIS, CitationData } from '@/lib/citation';

interface ArticleActionsProps {
  citation: CitationData;
  locale: string;
}

export function ArticleActions({ citation, locale }: ArticleActionsProps) {
  const vi = locale === 'vi';
  const [activeTab, setActiveTab] = useState<'apa' | 'bibtex' | 'ris'>('apa');
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const getCitationText = () => {
    switch (activeTab) {
      case 'apa':
        return formatAPA(citation);
      case 'bibtex':
        return formatBibTeX(citation);
      case 'ris':
        return formatRIS(citation);
    }
  };

  const handleCopyCitation = async () => {
    try {
      await navigator.clipboard.writeText(getCitationText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API is unavailable
    }
  };

  const handleCopyLink = async () => {
    try {
      const url = typeof window !== 'undefined' ? window.location.href : (citation.url || '');
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleDownloadFile = () => {
    const ext = activeTab === 'bibtex' ? 'bib' : 'ris';
    const mime = activeTab === 'bibtex' ? 'application/x-bibtex' : 'application/x-research-info-systems';
    const content = getCitationText();
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `citation-${citation.year || 'article'}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareEmailUrl = () => {
    const subject = encodeURIComponent(citation.title);
    const body = encodeURIComponent(
      `${citation.title}\n${citation.authors}\n${citation.journalName}\n\n${citation.url || ''}`
    );
    return `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6 rounded-lg border bg-slate-50 p-5">
      {/* Share & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          {vi ? 'Trích dẫn & Chia sẻ' : 'Citation & Share'}
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 rounded border bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-100 transition-colors"
            aria-label={vi ? 'Sao chép liên kết bài báo' : 'Copy article link'}
          >
            <span>🔗</span>
            <span>{linkCopied ? (vi ? 'Đã sao chép liên kết!' : 'Link copied!') : (vi ? 'Sao chép liên kết' : 'Copy link')}</span>
          </button>
          <a
            href={shareEmailUrl()}
            className="inline-flex items-center gap-1.5 rounded border bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-100 transition-colors"
            aria-label={vi ? 'Gửi bài viết qua email' : 'Share article via email'}
          >
            <span>✉️</span>
            <span>{vi ? 'Email' : 'Email'}</span>
          </a>
        </div>
      </div>

      {/* Citation Box */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Format Tabs */}
          <div role="tablist" aria-label={vi ? 'Định dạng trích dẫn' : 'Citation format'} className="flex rounded-md border bg-slate-200/60 p-0.5">
            {(['apa', 'bibtex', 'ris'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                role="tab"
                id={`tab-${tab}`}
                aria-controls={`panel-${tab}`}
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded px-3 py-1 text-xs font-semibold transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-[#205778] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {activeTab !== 'apa' && (
              <button
                type="button"
                onClick={handleDownloadFile}
                className="rounded border bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-100 transition-colors"
              >
                {vi ? `Tải .${activeTab === 'bibtex' ? 'bib' : 'ris'}` : `Download .${activeTab === 'bibtex' ? 'bib' : 'ris'}`}
              </button>
            )}
            <button
              type="button"
              onClick={handleCopyCitation}
              className="rounded bg-[#205778] px-3 py-1 text-xs font-semibold text-white shadow-2xs hover:bg-[#18445e] transition-colors"
            >
              {copied ? (vi ? '✓ Đã sao chép' : '✓ Copied!') : (vi ? 'Sao chép' : 'Copy')}
            </button>
          </div>
        </div>

        {/* Citation Display */}
        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          className="rounded border bg-white p-3 font-mono text-xs leading-relaxed text-slate-800 break-words [overflow-wrap:anywhere]"
        >
          {activeTab === 'apa' ? (
            <p className="font-sans text-sm leading-normal">{getCitationText()}</p>
          ) : (
            <pre className="whitespace-pre-wrap font-mono text-xs">{getCitationText()}</pre>
          )}
        </div>
      </div>

      {/* License Statement */}
      <div className="border-t pt-3 text-xs text-slate-600 leading-relaxed">
        <p>
          {vi
            ? 'Tác phẩm được công bố theo giấy phép Creative Commons Ghi nhận công của tác giả - Phi thương mại 4.0 Quốc tế (CC BY-NC 4.0).'
            : 'This work is licensed under a Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0).'}
        </p>
      </div>
    </div>
  );
}
