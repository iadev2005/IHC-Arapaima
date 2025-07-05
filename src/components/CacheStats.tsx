import { useState, useEffect } from 'react';
import { cacheService, localStorageService } from '../services/cacheService';

interface CacheStatsProps {
  className?: string;
}

export function CacheStats({ className = '' }: CacheStatsProps) {
  const [stats, setStats] = useState({
    booksCache: false,
    articlesCache: false,
    userPreferences: false,
    totalItems: 0
  });

  useEffect(() => {
    const checkCacheStatus = async () => {
      try {
        const booksCache = await cacheService.get('books_data');
        const articlesCache = await cacheService.get('articles_data');
        const userPreferences = localStorageService.get('user_preferences');

        setStats({
          booksCache: !!booksCache,
          articlesCache: !!articlesCache,
          userPreferences: !!userPreferences,
          totalItems: [booksCache, articlesCache, userPreferences].filter(Boolean).length
        });
      } catch (error) {
        console.error('Error checking cache status:', error);
      }
    };

    checkCacheStatus();
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className={`bg-black/20 backdrop-blur-sm rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-3">
        📊 Estado del Caché
      </h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Libros:</span>
          <span className={stats.booksCache ? 'text-green-400' : 'text-red-400'}>
            {stats.booksCache ? '✓ Cargado' : '✗ No disponible'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Artículos:</span>
          <span className={stats.articlesCache ? 'text-green-400' : 'text-red-400'}>
            {stats.articlesCache ? '✓ Cargado' : '✗ No disponible'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Preferencias:</span>
          <span className={stats.userPreferences ? 'text-green-400' : 'text-red-400'}>
            {stats.userPreferences ? '✓ Guardadas' : '✗ No guardadas'}
          </span>
        </div>
        
        <div className="border-t border-gray-600 pt-2 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Total en caché:</span>
            <span className="text-blue-400 font-semibold">
              {stats.totalItems} elementos
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-600">
        <button
          onClick={async () => {
            try {
              await cacheService.clear();
              localStorageService.clear();
              setStats({
                booksCache: false,
                articlesCache: false,
                userPreferences: false,
                totalItems: 0
              });
              console.log('Caché limpiado');
            } catch (error) {
              console.error('Error clearing cache:', error);
            }
          }}
          className="w-full bg-red-600 hover:bg-red-700 text-white text-xs py-2 px-3 rounded transition-colors"
        >
          🗑️ Limpiar Caché
        </button>
      </div>
    </div>
  );
} 