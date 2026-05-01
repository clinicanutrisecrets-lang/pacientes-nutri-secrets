export type PuzzleCategory = 'trivia' | 'word' | 'logic' | 'number' | 'visual';
export type PuzzleDifficulty = 'easy' | 'medium' | 'hard';
export type PuzzleType = 'multiple-choice' | 'text-input';

export interface Puzzle {
  id: string;
  category: PuzzleCategory;
  difficulty: PuzzleDifficulty;
  question: string;
  type: PuzzleType;
  options?: string[];
  answer: string;
  explanation: string;
  funFact?: string;
}

export type AppLanguage = 'en' | 'pt-BR';
export type ThemeMode = 'light' | 'dark' | 'system';
export type SoundOption = 'off' | 'brown' | 'drone' | 'rain';
export type ReducedMotionMode = 'system' | 'on' | 'off';
export type DifficultyMode = PuzzleDifficulty | 'adaptive';
export type BreathingPattern = 'coherence' | '478' | 'box';

export interface Settings {
  theme: ThemeMode;
  sound: SoundOption;
  volume: number;
  haptics: boolean;
  reducedMotion: ReducedMotionMode;
  difficulty: DifficultyMode;
  breathingPattern: BreathingPattern;
}

export interface CategoryAccuracy {
  attempted: number;
  correct: number;
}

export interface RecentResult {
  category: PuzzleCategory;
  difficulty: PuzzleDifficulty;
  correct: boolean;
  at: number;
}

export interface Progress {
  totalSolved: number;
  totalAttempted: number;
  streak: number;
  lastPlayedDate: string | null;
  byCategory: Record<PuzzleCategory, CategoryAccuracy>;
  recent: RecentResult[];
  seenPuzzleIds: string[];
  dailyCompleted: Record<string, boolean>;
}
