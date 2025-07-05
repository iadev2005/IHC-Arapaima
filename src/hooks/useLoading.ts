import { useState, useEffect } from 'react';
import { cacheService, localStorageService } from '../services/cacheService';

interface UseLoadingOptions {
  // Tiempo mínimo de carga para evitar parpadeos
  minLoadingTime?: number;
  // Verificar si hay datos en caché para mostrar loading más rápido
  checkCache?: boolean;
}

export function useLoading(options: UseLoadingOptions = {}) {
  const { minLoadingTime = 1000, checkCache = true } = options;
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasCachedData, setHasCachedData] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    
    // Verificar si hay datos en caché para mostrar progreso más rápido
    const checkCachedData = async () => {
      if (checkCache) {
        try {
          // Verificar varios tipos de datos en caché
          const booksCache = await cacheService.get('books_data');
          const articlesCache = await cacheService.get('articles_data');
          const userPreferences = localStorageService.get('user_preferences');
          
          if (booksCache || articlesCache || userPreferences) {
            setHasCachedData(true);
            setProgress(50); // Si hay caché, empezar con 50%
          }
        } catch (error) {
          console.error('Error checking cache:', error);
        }
      }
    };

    const initializeLoading = async () => {
      // Iniciar verificación de caché
      await checkCachedData();

      // Simular progreso de carga
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (hasCachedData ? 10 : 5);
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 100);

      // Esperar tiempo mínimo
      const remainingTime = Math.max(0, minLoadingTime - (Date.now() - startTime));
      await new Promise(resolve => setTimeout(resolve, remainingTime));

      // Completar carga
      setProgress(100);
      clearInterval(progressInterval);

      // Pequeña pausa para mostrar 100%
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    };

    initializeLoading();
  }, [minLoadingTime, checkCache, hasCachedData]);

  const resetLoading = () => {
    setIsLoading(true);
    setProgress(0);
    setHasCachedData(false);
  };

  return {
    isLoading,
    progress,
    hasCachedData,
    resetLoading
  };
} 