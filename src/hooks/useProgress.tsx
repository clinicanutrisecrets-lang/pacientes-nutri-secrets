import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Progress, PuzzleCategory, PuzzleDifficulty } from '@/lib/types';
import { defaultProgress, loadProgress, resetProgress as clearStorage, saveProgress } from '@/lib/storage';
import { daysBetween, todayKey } from '@/lib/util';

interface ProgressContextValue {
  progress: Progress;
  recordResult: (puzzleId: string, category: PuzzleCategory, difficulty: PuzzleDifficulty, correct: boolean) => void;
  markDailyComplete: (dateKey: string) => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

const RECENT_LIMIT = 30;
const SEEN_LIMIT = 400;

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const recordResult = useCallback(
    (puzzleId: string, category: PuzzleCategory, difficulty: PuzzleDifficulty, correct: boolean) => {
      setProgress((prev) => {
        const today = todayKey();
        let streak = prev.streak;
        if (prev.lastPlayedDate === null) {
          streak = 1;
        } else if (prev.lastPlayedDate !== today) {
          const gap = daysBetween(prev.lastPlayedDate, today);
          streak = gap === 1 ? prev.streak + 1 : 1;
        } else if (prev.streak === 0) {
          streak = 1;
        }
        const cat = prev.byCategory[category] ?? { attempted: 0, correct: 0 };
        const seenSet = new Set(prev.seenPuzzleIds);
        seenSet.add(puzzleId);
        const seen = Array.from(seenSet).slice(-SEEN_LIMIT);
        return {
          ...prev,
          totalAttempted: prev.totalAttempted + 1,
          totalSolved: prev.totalSolved + (correct ? 1 : 0),
          streak,
          lastPlayedDate: today,
          byCategory: {
            ...prev.byCategory,
            [category]: {
              attempted: cat.attempted + 1,
              correct: cat.correct + (correct ? 1 : 0),
            },
          },
          recent: [
            ...prev.recent,
            { category, difficulty, correct, at: Date.now() },
          ].slice(-RECENT_LIMIT),
          seenPuzzleIds: seen,
        };
      });
    },
    [],
  );

  const markDailyComplete = useCallback((dateKey: string) => {
    setProgress((prev) => ({
      ...prev,
      dailyCompleted: { ...prev.dailyCompleted, [dateKey]: true },
    }));
  }, []);

  const reset = useCallback(() => {
    clearStorage();
    setProgress(structuredClone(defaultProgress));
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({ progress, recordResult, markDailyComplete, reset }),
    [progress, recordResult, markDailyComplete, reset],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
