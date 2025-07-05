import { useState, useEffect } from 'react';
import { cacheService } from '../services/cacheService';
import { forumData } from '../data/forum';
import { articlesData, booksData } from '../data/culture';
import { fishesData } from '../data/water';

interface UseLoadingOptions {
  // Tiempo mínimo de carga para evitar parpadeos
  minLoadingTime?: number;
  // Verificar si hay datos en caché para mostrar loading más rápido
  checkCache?: boolean;
}

// Lista de todos los recursos que necesitan ser precargados
const RESOURCES_TO_PRELOAD = [
  // Imágenes de fondo
  '/assets/background/background-desktop.webp',
  '/assets/background/background-library.png',
  '/assets/background/background-culture.png',
  '/assets/background/fire.svg',
  '/assets/background/sun.svg',
  '/assets/background/leaf.svg',
  '/assets/background/leaf-background.svg',
  
  // Logos e iconos
  '/assets/logo/logo.svg',
  '/assets/icons/forum-icon.png',
  '/assets/icons/culture-icon.png',
  '/assets/icons/library-icon.png',
  '/assets/icons/fish-icon.png',
  '/assets/icons/library.png',
  '/assets/icons/culture.png',
  '/assets/icons/mask-library.svg',
  
  // Chatbot
  '/assets/chatbot/kuai-mare-1.svg',
  '/assets/chatbot/kuai-mare-2.svg',
  
  // Iconos adicionales
  '/assets/icons/fire.svg',
];

// Función para precargar una imagen
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

// Función para precargar todos los datos
const preloadData = async () => {
  const dataToCache = [
    { key: 'forum_data', data: forumData },
    { key: 'articles_data', data: articlesData },
    { key: 'books_data', data: booksData },
    { key: 'fishes_data', data: fishesData },
  ];

  const promises = dataToCache.map(async ({ key, data }) => {
    try {
      await cacheService.set(key, data);
      return true;
    } catch (error) {
      console.error(`Error caching ${key}:`, error);
      return false;
    }
  });

  return Promise.all(promises);
};

export function useLoading(options: UseLoadingOptions = {}) {
  const { minLoadingTime = 2000, checkCache = true } = options;
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasCachedData, setHasCachedData] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Inicializando...');

  useEffect(() => {
    const startTime = Date.now();
    
    const initializeLoading = async () => {
      try {
        // Paso 1: Verificar caché existente (10%)
        setLoadingMessage('Verificando datos en caché...');
        setProgress(10);
        
        const cachedData = await Promise.all([
          cacheService.get('forum_data'),
          cacheService.get('articles_data'),
          cacheService.get('books_data'),
          cacheService.get('fishes_data'),
        ]);
        
        const hasCached = cachedData.some(data => data !== null);
        setHasCachedData(hasCached);
        
        if (hasCached) {
          setProgress(30);
          setLoadingMessage('Datos en caché encontrados...');
        } else {
          setProgress(20);
          setLoadingMessage('Preparando datos...');
        }

        // Paso 2: Precargar datos (30%)
        if (!hasCached) {
          setLoadingMessage('Cargando datos de la aplicación...');
          await preloadData();
          setProgress(50);
        } else {
          setProgress(40);
        }

        // Paso 3: Precargar imágenes (40%)
        setLoadingMessage('Cargando recursos visuales...');
        const imagePromises = RESOURCES_TO_PRELOAD.map(preloadImage);
        
        // Simular progreso de carga de imágenes
        let loadedImages = 0;
        const totalImages = imagePromises.length;
        
        const imageProgressInterval = setInterval(() => {
          if (loadedImages < totalImages) {
            loadedImages++;
            const imageProgress = (loadedImages / totalImages) * 40; // 40% del progreso total
            const currentProgress = hasCached ? 40 + imageProgress : 50 + imageProgress;
            setProgress(Math.min(currentProgress, 90));
          }
        }, 50);

        // Esperar a que todas las imágenes se carguen
        await Promise.all(imagePromises);
        clearInterval(imageProgressInterval);
        setProgress(90);

        // Paso 4: Tiempo mínimo restante
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        if (remainingTime > 0) {
          setLoadingMessage('Finalizando carga...');
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }

        // Paso 5: Completar
        setProgress(100);
        setLoadingMessage('¡Listo!');
        
        // Pequeña pausa para mostrar 100%
        setTimeout(() => {
          setIsLoading(false);
        }, 300);

      } catch (error) {
        console.error('Error during loading:', error);
        // En caso de error, continuar después del tiempo mínimo
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
        
        setProgress(100);
        setIsLoading(false);
      }
    };

    initializeLoading();
  }, [minLoadingTime, checkCache]);

  const resetLoading = () => {
    setIsLoading(true);
    setProgress(0);
    setHasCachedData(false);
    setLoadingMessage('Inicializando...');
  };

  return {
    isLoading,
    progress,
    hasCachedData,
    loadingMessage,
    resetLoading
  };
} 