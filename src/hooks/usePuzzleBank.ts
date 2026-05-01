import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import puzzlesEN from '@/data/puzzles_en.json';
import puzzlesPT from '@/data/puzzles_pt.json';
import type { Puzzle, PuzzleCategory, PuzzleDifficulty, RecentResult } from '@/lib/types';
import { hashString, seededShuffle, todayKey } from '@/lib/util';

const DIFFICULTIES: PuzzleDifficulty[] = ['easy', 'medium', 'hard'];

function bankFor(language: string): Puzzle[] {
  if (language.toLowerCase().startsWith('pt')) return puzzlesPT as Puzzle[];
  return puzzlesEN as Puzzle[];
}

export function getDailySet(language: string, dateKey = todayKey()): Puzzle[] {
  const bank = bankFor(language);
  const seed = hashString(`${language}:${dateKey}`);
  const shuffled = seededShuffle(bank, seed);
  const picked: Puzzle[] = [];
  const usedCategories = new Set<PuzzleCategory>();
  for (const puzzle of shuffled) {
    if (picked.length >= 5) break;
    if (!usedCategories.has(puzzle.category)) {
      picked.push(puzzle);
      usedCategories.add(puzzle.category);
    }
  }
  if (picked.length < 5) {
    for (const puzzle of shuffled) {
      if (picked.length >= 5) break;
      if (!picked.find((p) => p.id === puzzle.id)) picked.push(puzzle);
    }
  }
  return picked;
}

function adaptDifficulty(
  base: PuzzleDifficulty,
  recent: RecentResult[],
  category: PuzzleCategory,
): PuzzleDifficulty {
  const ofCategory = recent.filter((r) => r.category === category).slice(-5);
  if (ofCategory.length < 2) return base;
  const lastThree = ofCategory.slice(-3);
  const lastTwo = ofCategory.slice(-2);
  const idx = DIFFICULTIES.indexOf(base);
  if (lastThree.length === 3 && lastThree.every((r) => r.correct)) {
    return DIFFICULTIES[Math.min(DIFFICULTIES.length - 1, idx + 1)];
  }
  if (lastTwo.length === 2 && lastTwo.every((r) => !r.correct)) {
    return DIFFICULTIES[Math.max(0, idx - 1)];
  }
  return base;
}

export interface PickOptions {
  category?: PuzzleCategory | 'all';
  difficulty: PuzzleDifficulty | 'adaptive';
  excludeIds?: string[];
  recent?: RecentResult[];
  fallbackCategory?: PuzzleCategory;
}

export function pickPuzzle(language: string, options: PickOptions): Puzzle | null {
  const bank = bankFor(language);
  const exclude = new Set(options.excludeIds ?? []);
  const targetCategory = options.category && options.category !== 'all' ? options.category : null;
  let pool = bank.filter((p) => !exclude.has(p.id));
  if (targetCategory) pool = pool.filter((p) => p.category === targetCategory);
  if (pool.length === 0) return null;

  let targetDifficulty: PuzzleDifficulty;
  if (options.difficulty === 'adaptive') {
    const cat = targetCategory ?? options.fallbackCategory ?? 'trivia';
    targetDifficulty = adaptDifficulty('medium', options.recent ?? [], cat);
  } else {
    targetDifficulty = options.difficulty;
  }

  const exact = pool.filter((p) => p.difficulty === targetDifficulty);
  const seed = hashString(`${language}:${Date.now()}:${Math.random()}`);
  if (exact.length > 0) return seededShuffle(exact, seed)[0];
  return seededShuffle(pool, seed)[0];
}

export function usePuzzleBank() {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const bank = useMemo(() => bankFor(lang), [lang]);
  return { bank, language: lang };
}
