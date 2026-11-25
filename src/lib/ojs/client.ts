// OJS REST API Client
// Handles authentication, requests, and error handling

import type {
  OJSJournal,
  OJSIssue,
  OJSArticle,
  OJSSection,
  OJSCategory,
  OJSUser,
  OJSSearchParams,
  OJSPaginatedResponse,
  OJSError,
  OJSLocale,
} from './types';

const OJS_BASE_URL = process.env.OJS_BASE_URL || 'http://localhost/ojs';
const OJS_API_KEY = process.env.OJS_API_KEY || '';
const OJS_API_VERSION = process.env.OJS_API_VERSION || 'v1';

const API_BASE = `${OJS_BASE_URL}/api/${OJS_API_VERSION}`;

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

function flattenParams(params: OJSSearchParams): Record<string, string | number | boolean | undefined> {
  const result: Record<string, string | number | boolean | undefined> = {};

  if (params.page !== undefined) result.page = params.page;
  if (params.perPage !== undefined) result.perPage = params.perPage;
  if (params.sortField !== undefined) result.sortField = params.sortField;
  if (params.sortDirection !== undefined) result.sortDirection = params.sortDirection;
  if (params.locale !== undefined) result.locale = params.locale;
  if (params.filter) {
    Object.entries(params.filter).forEach(([key, value]) => {
      result[`filter[${key}]`] = value;
    });
  }

  return result;
}

function buildUrl(endpoint: string, params?: Record<string, unknown>): string {
  const url = new URL(`${API_BASE}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

async function fetchWithAuth<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, headers, ...fetchOptions } = options;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${OJS_API_KEY}`,
    ...headers,
  };

  const url = buildUrl(endpoint, params);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: defaultHeaders,
    });

    if (!response.ok) {
      const error: OJSError = await response.json().catch(() => ({
        errorCode: response.status,
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown API error');
  }
}

// ==================== Journal Endpoints ====================

export async function getJournal(): Promise<OJSJournal> {
  return fetchWithAuth<OJSJournal>('/journals/1');
}

export async function getJournalSettings(): Promise<OJSJournal> {
  return fetchWithAuth<OJSJournal>('/journals/1/settings');
}

// ==================== Issue Endpoints ====================

export async function getIssues(params?: OJSSearchParams): Promise<OJSPaginatedResponse<OJSIssue>> {
  return fetchWithAuth<OJSPaginatedResponse<OJSIssue>>('/issues', { params: params ? flattenParams(params) : undefined });
}

export async function getCurrentIssue(): Promise<OJSIssue | null> {
  const journal = await getJournal();
  if (journal.currentIssue) {
    return journal.currentIssue;
  }
  // Fallback: get latest published issue
  const issues = await getIssues({ filter: { published: 'true' }, sortField: 'year', sortDirection: 'desc', perPage: 1 });
  return issues.data[0] || null;
}

export async function getIssue(issueId: number): Promise<OJSIssue> {
  return fetchWithAuth<OJSIssue>(`/issues/${issueId}`);
}

export async function getIssueArticles(issueId: number, params?: OJSSearchParams): Promise<OJSPaginatedResponse<OJSArticle>> {
  return fetchWithAuth<OJSPaginatedResponse<OJSArticle>>(`/issues/${issueId}/articles`, { params: params ? flattenParams(params) : undefined });
}

// ==================== Article Endpoints ====================

export async function getArticles(params?: OJSSearchParams): Promise<OJSPaginatedResponse<OJSArticle>> {
  return fetchWithAuth<OJSPaginatedResponse<OJSArticle>>('/articles', { params: params ? flattenParams(params) : undefined });
}

export async function getPublishedArticles(params?: OJSSearchParams): Promise<OJSPaginatedResponse<OJSArticle>> {
  const mergedParams: OJSSearchParams = {
    ...params,
    filter: { ...params?.filter, status: '7' }, // 7 = PUBLISHED
  };
  return fetchWithAuth<OJSPaginatedResponse<OJSArticle>>('/articles', { params: flattenParams(mergedParams) });
}

export async function getArticle(articleId: number): Promise<OJSArticle> {
  return fetchWithAuth<OJSArticle>(`/articles/${articleId}`);
}

export async function getArticleGalleys(articleId: number): Promise<any[]> {
  return fetchWithAuth<any[]>(`/articles/${articleId}/galleys`);
}

export async function getArticleFiles(articleId: number): Promise<any[]> {
  return fetchWithAuth<any[]>(`/articles/${articleId}/files`);
}

// ==================== Section & Category Endpoints ====================

export async function getSections(): Promise<OJSSection[]> {
  const journal = await getJournal();
  return journal.sections || [];
}

export async function getCategories(): Promise<OJSCategory[]> {
  const journal = await getJournal();
  return journal.categories || [];
}

// ==================== User Endpoints ====================

export async function getUsers(params?: OJSSearchParams): Promise<OJSPaginatedResponse<OJSUser>> {
  return fetchWithAuth<OJSPaginatedResponse<OJSUser>>('/users', { params: params ? flattenParams(params) : undefined });
}

export async function getUser(userId: number): Promise<OJSUser> {
  return fetchWithAuth<OJSUser>(`/users/${userId}`);
}

// ==================== Search Endpoints ====================

export async function searchArticles(query: string, params?: OJSSearchParams): Promise<OJSPaginatedResponse<OJSArticle>> {
  const mergedParams: OJSSearchParams = {
    ...params,
    filter: { ...params?.filter, q: query },
  };
  return fetchWithAuth<OJSPaginatedResponse<OJSArticle>>('/articles/search', { params: flattenParams(mergedParams) });
}

// ==================== Locale Helpers ====================

export function getLocalizedValue<T extends Record<string, string>>(
  field: T | undefined,
  locale: string,
  fallbackLocale = 'vi'
): string {
  if (!field) return '';
  return field[locale] || field[fallbackLocale] || Object.values(field)[0] || '';
}

export function getSupportedLocales(journal: OJSJournal): string[] {
  return journal.supportedLocales || journal.languages || ['vi', 'en'];
}

// ==================== Utility Functions ====================

export function formatArticleCitation(article: OJSArticle, locale = 'vi'): string {
  const authors = article.authors
    .filter(a => a.includeInBrowse)
    .slice(0, 3)
    .map(a => `${getLocalizedValue(a.lastName, locale)} ${getLocalizedValue(a.firstName, locale).charAt(0)}.`)
    .join(', ');

  const etAl = article.authors.filter(a => a.includeInBrowse).length > 3 ? ' et al.' : '';
  const title = getLocalizedValue(article.title, locale);
  const year = article.datePublished ? new Date(article.datePublished).getFullYear() : '';

  return `${authors}${etAl}. ${title}. ${year}.`;
}

export function getArticleStatusLabel(status: number, locale = 'vi'): string {
  const labels: Record<number, Record<string, string>> = {
    1: { vi: 'Đã nộp', en: 'Submitted' },
    2: { vi: 'Đang xem xét', en: 'In Review' },
    3: { vi: 'Xem xét hoàn tất', en: 'Review Complete' },
    4: { vi: 'Đang chờ xuất bản', en: 'Queued' },
    5: { vi: 'Đang biên tập', en: 'Copyediting' },
    6: { vi: 'Đang sản xuất', en: 'Production' },
    7: { vi: 'Đã xuất bản', en: 'Published' },
    8: { vi: 'Đã từ chối', en: 'Declined' },
    9: { vi: 'Đã lưu trữ', en: 'Archived' },
    10: { vi: 'Đã rút lại', en: 'Withdrawn' },
  };
  return labels[status]?.[locale] || labels[status]?.en || `Status ${status}`;
}

export function getArticleStatusColor(status: number): string {
  const colors: Record<number, string> = {
    1: 'bg-blue-100 text-blue-800',
    2: 'bg-yellow-100 text-yellow-800',
    3: 'bg-orange-100 text-orange-800',
    4: 'bg-purple-100 text-purple-800',
    5: 'bg-indigo-100 text-indigo-800',
    6: 'bg-pink-100 text-pink-800',
    7: 'bg-green-100 text-green-800',
    8: 'bg-red-100 text-red-800',
    9: 'bg-gray-100 text-gray-800',
    10: 'bg-gray-100 text-gray-600',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}