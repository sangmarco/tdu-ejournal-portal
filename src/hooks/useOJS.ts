// React Hooks for OJS Data Fetching
'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  OJSJournal,
  OJSIssue,
  OJSArticle,
  OJSSection,
  OJSCategory,
  OJSSearchParams,
} from '@/lib/ojs';
import {
  getJournal,
  getIssues,
  getCurrentIssue,
  getIssue,
  getIssueArticles,
  getPublishedArticles,
  getArticle,
  getSections,
  getCategories,
  getUsers,
  searchArticles,
  getSupportedLocales,
} from '@/lib/ojs';

// Keep loading derived from the request identity so effects only publish async results.
function useRequest<T>(request: () => Promise<T>, enabled = true) {
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<{
    request: () => Promise<T>;
    revision: number;
    data: T | null;
    error: Error | null;
  } | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    request().then(
      data => {
        if (active) setResult({ request, revision, data, error: null });
      },
      error => {
        if (active) setResult({ request, revision, data: null, error: error instanceof Error ? error : new Error(String(error)) });
      },
    );
    return () => { active = false; };
  }, [request, revision, enabled]);

  const refetch = useCallback(() => setRevision(value => value + 1), []);
  const current = result?.request === request && result.revision === revision;
  return {
    data: enabled ? result?.data ?? null : null,
    loading: enabled && !current,
    error: current ? result.error : null,
    refetch,
  };
}

// ==================== Journal Hook ====================

export function useJournal() {
  const [journal, setJournal] = useState<OJSJournal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    getJournal()
      .then(data => {
        if (mounted) setJournal(data);
      })
      .catch((err: Error) => {
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  return { journal, loading, error, refetch: getJournal };
}

export function useSupportedLocales() {
  const { journal } = useJournal();
  return journal ? getSupportedLocales(journal) : ['vi', 'en'];
}

// ==================== Issues Hooks ====================

export function useIssues(params?: OJSSearchParams) {
  const request = useCallback(() => getIssues(params), [params]);
  const { data: issues, ...state } = useRequest(request);
  return { issues, ...state };
}

export function useCurrentIssue() {
  const [issue, setIssue] = useState<OJSIssue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    getCurrentIssue()
      .then(data => {
        if (mounted) setIssue(data);
      })
      .catch((err: Error) => {
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  return { issue, loading, error };
}

export function useIssue(issueId: number) {
  const [issue, setIssue] = useState<OJSIssue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!issueId) return;
    let mounted = true;
    getIssue(issueId)
      .then(data => {
        if (mounted) setIssue(data);
      })
      .catch((err: Error) => {
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [issueId]);

  return { issue, loading, error };
}

export function useIssueArticles(issueId: number, params?: OJSSearchParams) {
  const request = useCallback(() => getIssueArticles(issueId, params), [issueId, params]);
  const { data: articles, ...state } = useRequest(request, Boolean(issueId));
  return { articles, ...state };
}

// ==================== Articles Hooks ====================

export function usePublishedArticles(params?: OJSSearchParams) {
  const request = useCallback(() => getPublishedArticles(params), [params]);
  const { data: articles, ...state } = useRequest(request);
  return { articles, ...state };
}

export function useArticle(articleId: number) {
  const [article, setArticle] = useState<OJSArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!articleId) return;
    let mounted = true;
    getArticle(articleId)
      .then(data => {
        if (mounted) setArticle(data);
      })
      .catch((err: Error) => {
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [articleId]);

  return { article, loading, error };
}

export function useArticleSearch(query: string, params?: OJSSearchParams) {
  const request = useCallback(() => searchArticles(query, params), [query, params]);
  const { data: articles, loading, error } = useRequest(request, Boolean(query.trim()));
  return { articles, loading, error };
}

// ==================== Sections & Categories ====================

export function useSections() {
  const [sections, setSections] = useState<OJSSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    getSections()
      .then(data => {
        if (mounted) setSections(data);
      })
      .catch((err: Error) => {
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  return { sections, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState<OJSCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    getCategories()
      .then(data => {
        if (mounted) setCategories(data);
      })
      .catch((err: Error) => {
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  return { categories, loading, error };
}

// ==================== Users ====================

export function useUsers(params?: OJSSearchParams) {
  const request = useCallback(() => getUsers(params), [params]);
  const { data: users, ...state } = useRequest(request);
  return { users, ...state };
}