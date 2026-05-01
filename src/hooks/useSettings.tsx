import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { Settings } from '@/lib/types';
import { defaultSettings, loadSettings, saveSettings, saveLang } from '@/lib/storage';

interface SettingsContextValue {
  settings: Settings;
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  setLanguage: (lang: 'en' | 'pt-BR') => void;
  language: string;
  prefersReducedMotion: boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function readSystemReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function readSystemDark(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const [systemReducedMotion, setSystemReducedMotion] = useState<boolean>(readSystemReducedMotion);
  const [systemDark, setSystemDark] = useState<boolean>(readSystemDark);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const dark = window.matchMedia('(prefers-color-scheme: dark)');
    const onMotion = (e: MediaQueryListEvent) => setSystemReducedMotion(e.matches);
    const onDark = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    motion.addEventListener('change', onMotion);
    dark.addEventListener('change', onDark);
    return () => {
      motion.removeEventListener('change', onMotion);
      dark.removeEventListener('change', onDark);
    };
  }, []);

  useEffect(() => {
    const isDark =
      settings.theme === 'dark' || (settings.theme === 'system' && systemDark);
    document.documentElement.classList.toggle('dark', isDark);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isDark ? '#1C1F26' : '#7BA89C');
  }, [settings.theme, systemDark]);

  useEffect(() => {
    const reduce =
      settings.reducedMotion === 'on' ||
      (settings.reducedMotion === 'system' && systemReducedMotion);
    document.documentElement.classList.toggle('reduce-motion', reduce);
  }, [settings.reducedMotion, systemReducedMotion]);

  const update = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setLanguage = useCallback(
    (lang: 'en' | 'pt-BR') => {
      void i18n.changeLanguage(lang);
      saveLang(lang);
    },
    [i18n],
  );

  const prefersReducedMotion =
    settings.reducedMotion === 'on' ||
    (settings.reducedMotion === 'system' && systemReducedMotion);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      update,
      setLanguage,
      language: i18n.language || 'en',
      prefersReducedMotion,
    }),
    [settings, update, setLanguage, i18n.language, prefersReducedMotion],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}

export { defaultSettings };
