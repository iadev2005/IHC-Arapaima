import { useState, useEffect, useCallback } from 'react';
import { cacheService, localStorageService } from '../services/cacheService';

interface UseCacheOptions {
  ttl?: number; // Tiempo de vida en milisegundos
  useLocalStorage?: boolean; // Usar localStorage en lugar de IndexedDB
  key: string;
}

export function useCache<T>(
  options: UseCacheOptions
) {
  const { ttl = 24 * 60 * 60 * 1000, useLocalStorage = false, key } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCachedData = useCallback(async (): Promise<T | null> => {
    try {
      if (useLocalStorage) {
        return localStorageService.get(key);
      } else {
        return await cacheService.get(key);
      }
    } catch (err) {
      console.error('Error getting cached data:', err);
      return null;
    }
  }, [key, useLocalStorage]);

  const setCachedData = useCallback(async (newData: T): Promise<void> => {
    try {
      if (useLocalStorage) {
        localStorageService.set(key, newData, ttl);
      } else {
        await cacheService.set(key, newData, ttl);
      }
    } catch (err) {
      console.error('Error setting cached data:', err);
    }
  }, [key, ttl, useLocalStorage]);

  const clearCache = useCallback(async (): Promise<void> => {
    try {
      if (useLocalStorage) {
        localStorageService.delete(key);
      } else {
        await cacheService.delete(key);
      }
      setData(null);
    } catch (err) {
      console.error('Error clearing cache:', err);
    }
  }, [key, useLocalStorage]);

  const loadData = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const cachedData = await getCachedData();
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }

      // Si no hay datos en caché, se debe cargar desde la fuente original
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading cached data');
      setLoading(false);
    }
  }, [getCachedData]);

  const updateData = useCallback(async (newData: T): Promise<void> => {
    try {
      await setCachedData(newData);
      setData(newData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating cached data');
    }
  }, [setCachedData]);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    updateData,
    clearCache,
    reload: loadData
  };
}

// Hook para datos que se cargan una sola vez y se cachean
export function useCachedData<T>(
  key: string,
  fetchFunction: () => Promise<T>,
  options: Omit<UseCacheOptions, 'key'> = {}
) {
  const { ttl = 24 * 60 * 60 * 1000, useLocalStorage = false } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Intentar obtener datos del caché
      let cachedData: T | null = null;
      
      if (useLocalStorage) {
        cachedData = localStorageService.get(key);
      } else {
        cachedData = await cacheService.get(key);
      }

      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }

      // Si no hay datos en caché, cargar desde la fuente original
      const freshData = await fetchFunction();
      
      // Guardar en caché
      if (useLocalStorage) {
        localStorageService.set(key, freshData, ttl);
      } else {
        await cacheService.set(key, freshData, ttl);
      }

      setData(freshData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading data');
    } finally {
      setLoading(false);
    }
  }, [key, fetchFunction, ttl, useLocalStorage]);

  const clearCache = useCallback(async () => {
    try {
      if (useLocalStorage) {
        localStorageService.delete(key);
      } else {
        await cacheService.delete(key);
      }
      setData(null);
    } catch (err) {
      console.error('Error clearing cache:', err);
    }
  }, [key, useLocalStorage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    reload: loadData,
    clearCache
  };
} 