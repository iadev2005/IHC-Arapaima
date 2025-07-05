import { useState, useEffect, useCallback } from 'react';
import { localStorageService } from '../services/cacheService';

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'es' | 'en';
  notifications: boolean;
  autoSave: boolean;
  cacheEnabled: boolean;
  lastVisit: string;
}

const defaultPreferences: UserPreferences = {
  theme: 'dark',
  language: 'es',
  notifications: true,
  autoSave: true,
  cacheEnabled: true,
  lastVisit: new Date().toISOString()
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);

  // Cargar preferencias al inicializar
  useEffect(() => {
    const loadPreferences = () => {
      try {
        const savedPreferences = localStorageService.get('user_preferences');
        if (savedPreferences) {
          setPreferences({ ...defaultPreferences, ...savedPreferences });
        }
      } catch (error) {
        console.error('Error loading user preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // Guardar preferencias
  const savePreferences = useCallback(async (newPreferences: Partial<UserPreferences>) => {
    try {
      const updatedPreferences = {
        ...preferences,
        ...newPreferences,
        lastVisit: new Date().toISOString()
      };
      
      setPreferences(updatedPreferences);
      localStorageService.set('user_preferences', updatedPreferences, 30 * 24 * 60 * 60 * 1000); // 30 días
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }, [preferences]);

  // Cambiar tema
  const setTheme = useCallback((theme: UserPreferences['theme']) => {
    savePreferences({ theme });
  }, [savePreferences]);

  // Cambiar idioma
  const setLanguage = useCallback((language: UserPreferences['language']) => {
    savePreferences({ language });
  }, [savePreferences]);

  // Toggle notificaciones
  const toggleNotifications = useCallback(() => {
    savePreferences({ notifications: !preferences.notifications });
  }, [preferences.notifications, savePreferences]);

  // Toggle auto-save
  const toggleAutoSave = useCallback(() => {
    savePreferences({ autoSave: !preferences.autoSave });
  }, [preferences.autoSave, savePreferences]);

  // Toggle caché
  const toggleCache = useCallback(() => {
    savePreferences({ cacheEnabled: !preferences.cacheEnabled });
  }, [preferences.cacheEnabled, savePreferences]);

  // Resetear preferencias
  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
    localStorageService.delete('user_preferences');
  }, []);

  return {
    preferences,
    loading,
    setTheme,
    setLanguage,
    toggleNotifications,
    toggleAutoSave,
    toggleCache,
    resetPreferences,
    savePreferences
  };
} 