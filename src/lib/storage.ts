import type { Progress, Settings } from './types';

const KEY_PROGRESS = 'mindspark_progress';
const KEY_SETTINGS = 'mindspark_settings';
const KEY_LANG = 'mindspark_lang';
const KEY_VISITS = 'mindspark_visit_count';
const KEY_INSTALL_DISMISSED = 'mindspark_install_dismissed';

export const defaultSettings: Settings = {
  theme: 'system',
  sound: 'off',
  volume: 0.15,
  haptics: true,
  reducedMotion: 'system',
  difficulty: 'adaptive',
  breathingPattern: 'coherence',
};

export const defaultProgress: Progress = {
  totalSolved: 0,
  totalAttempted: 0,
  streak: 0,
  lastPlayedDate: null,
  byCategory: {
    trivia: { attempted: 0, correct: 0 },
    word: { attempted: 0, correct: 0 },
    logic: { attempted: 0, correct: 0 },
    number: { attempted: 0, correct: 0 },
    visual: { attempted: 0, correct: 0 },
  },
  recent: [],
  seenPuzzleIds: [],
  dailyCompleted: {},
};

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or storage disabled — silently ignore
  }
}

export function loadSettings(): Settings {
  const stored = safeGet<Partial<Settings> | null>(KEY_SETTINGS, null);
  if (!stored) return { ...defaultSettings };
  return { ...defaultSettings, ...stored };
}

export function saveSettings(settings: Settings): void {
  safeSet(KEY_SETTINGS, settings);
}

export function loadProgress(): Progress {
  const stored = safeGet<Partial<Progress> | null>(KEY_PROGRESS, null);
  if (!stored) return structuredClone(defaultProgress);
  return {
    ...defaultProgress,
    ...stored,
    byCategory: { ...defaultProgress.byCategory, ...(stored.byCategory ?? {}) },
    recent: stored.recent ?? [],
    seenPuzzleIds: stored.seenPuzzleIds ?? [],
    dailyCompleted: stored.dailyCompleted ?? {},
  };
}

export function saveProgress(progress: Progress): void {
  safeSet(KEY_PROGRESS, progress);
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(KEY_PROGRESS);
}

export function loadLang(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(KEY_LANG);
}

export function saveLang(lang: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY_LANG, lang);
}

export function bumpVisitCount(): number {
  if (typeof window === 'undefined') return 0;
  const current = Number(window.localStorage.getItem(KEY_VISITS) ?? '0');
  const next = current + 1;
  window.localStorage.setItem(KEY_VISITS, String(next));
  return next;
}

export function isInstallDismissed(): boolean {
  if (typeof window === 'undefined') return true;
  return window.localStorage.getItem(KEY_INSTALL_DISMISSED) === '1';
}

export function dismissInstall(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY_INSTALL_DISMISSED, '1');
}
