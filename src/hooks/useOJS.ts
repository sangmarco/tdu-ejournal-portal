// React Hooks for OJS Data Fetching
'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  OJSJournal,
  OJSIssue,
  OJSArticle,
  OJSSection,
  OJSCategory,
  OJSUser,
  OJSPaginatedResponse,
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
  const [issues, setIssues] = useState<OJSPaginatedResponse<OJSIssue> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getIssues(params);
      setIssues(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return { issues, loading, error, refetch: fetchIssues };
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
  const [articles, setArticles] = useState<OJSPaginatedResponse<OJSArticle> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchArticles = useCallback(async () => {
    if (!issueId) return;
    setLoading(true);
    try {
      const data = await getIssueArticles(issueId, params);
      setArticles(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [issueId, params]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return { articles, loading, error, refetch: fetchArticles };
}

// ==================== Articles Hooks ====================

export function usePublishedArticles(params?: OJSSearchParams) {
  const [articles, setArticles] = useState<OJSPaginatedResponse<OJSArticle> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPublishedArticles(params);
      setArticles(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return { articles, loading, error, refetch: fetchArticles };
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
  const [articles, setArticles] = useState<OJSPaginatedResponse<OJSArticle> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setArticles(null);
      return;
    }
    let mounted = true;
    setLoading(true);
    searchArticles(query, params)
      .then(data => {
        if (mounted) setArticles(data);
      })
      .catch((err: Error) => {
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [query, params]);

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
  const [users, setUsers] = useState<OJSPaginatedResponse<OJSUser> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers(params);
      setUsers(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
}