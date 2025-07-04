'use client';

import { useState, useEffect } from 'react';
import { getRestsAction, getRestByIdAction, getRestByHrefAction, RestsParams, RestsResponse, Rest } from '@/lib/api/restActions';

// Hook for fetching all rests
export const useRests = (params: RestsParams = {}) => {
  const [data, setData] = useState<RestsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRests = async (newParams?: RestsParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getRestsAction(newParams || params);
      
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.message || 'Failed to fetch rests');
        setData(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRests();
  }, [JSON.stringify(params)]);

  return {
    data,
    loading,
    error,
    refetch: fetchRests,
    rests: data?.rests || [],
    pagination: data?.pagination || null
  };
};

// Hook for fetching a single rest by ID
export const useRest = (id: string, locale?: string) => {
  const [data, setData] = useState<Rest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRest = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await getRestByIdAction(id, locale);
      
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.message || 'Failed to fetch rest');
        setData(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRest();
  }, [id, locale]);

  return {
    rest: data,
    loading,
    error,
    refetch: fetchRest
  };
};

// Hook for fetching a single rest by href (slug)
export const useRestByHref = (href: string, locale?: string) => {
  const [data, setData] = useState<Rest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRest = async () => {
    if (!href) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await getRestByHrefAction(href, locale);
      
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.message || 'Failed to fetch rest');
        setData(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRest();
  }, [href, locale]);

  return {
    rest: data,
    loading,
    error,
    refetch: fetchRest
  };
};

// Hook for searching rests
export const useRestsSearch = (initialQuery = '') => {
  const [query, setQuery] = useState(initialQuery);
  const [data, setData] = useState<RestsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (searchQuery?: string) => {
    const queryToUse = searchQuery !== undefined ? searchQuery : query;
    
    if (!queryToUse.trim()) {
      setData(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await getRestsAction({
        search: queryToUse,
        limit: 20
      });
      
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.message || 'Search failed');
        setData(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setData(null);
    setError(null);
  };

  return {
    query,
    setQuery,
    results: data?.rests || [],
    pagination: data?.pagination || null,
    loading,
    error,
    search,
    clearSearch
  };
};

// Hook for managing rest filters
export const useRestsFilters = () => {
  const [filters, setFilters] = useState<RestsParams>({
    page: 1,
    limit: 12
  });
  
  const updateFilter = (key: keyof RestsParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset to first page when changing filters
    }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 12
    });
  };

  const { data, loading, error, refetch } = useRests(filters);

  return {
    filters,
    updateFilter,
    resetFilters,
    data,
    loading,
    error,
    refetch,
    rests: data?.rests || [],
    pagination: data?.pagination || null
  };
}; 