import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserPreferences } from '../types';
import { preferencesService } from '../services/preferencesService';
import { useAuth } from './AuthContext';

interface PreferencesContextType {
  preferences: UserPreferences | null;
  favorites: string[];
  loading: boolean;
  toggleFavorite: (activityId: string) => Promise<void>;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  reducedMotion: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [favorites, setFavorites] = useState<string[]>(['breathing', 'grounding']);
  const [loading, setLoading] = useState(true);

  const loadPreferences = useCallback(async () => {
    if (!user) {
      setPreferences(null);
      setFavorites(['breathing', 'grounding']);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [prefs, favs] = await Promise.all([
        preferencesService.getPreferences(user.id),
        preferencesService.getFavorites(user.id),
      ]);
      setPreferences(prefs);
      setFavorites(favs);
    } catch (err) {
      console.warn('[PreferencesContext] Falha ao carregar preferências:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const toggleFavorite = async (activityId: string) => {
    if (!user) return;
    const updated = await preferencesService.toggleFavorite(user.id, activityId);
    setFavorites(updated);
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user || !preferences) return;
    const updated = await preferencesService.updatePreferences(user.id, updates);
    setPreferences(updated);
  };

  const reducedMotion = preferences?.reduced_motion ?? false;

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        favorites,
        loading,
        toggleFavorite,
        updatePreferences,
        reducedMotion,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences deve ser utilizado dentro de um PreferencesProvider');
  }
  return context;
}
