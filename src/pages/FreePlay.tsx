import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Segmented } from '@/components/ui/Segmented';
import { PuzzleCard } from '@/components/puzzles/PuzzleCard';
import { pickPuzzle } from '@/hooks/usePuzzleBank';
import { useSettings } from '@/hooks/useSettings';
import { useProgress } from '@/hooks/useProgress';
import { cx } from '@/lib/util';
import type { DifficultyMode, Puzzle, PuzzleCategory } from '@/lib/types';

type CategoryFilter = PuzzleCategory | 'all';

const CATEGORIES: CategoryFilter[] = ['all', 'trivia', 'word', 'logic', 'number', 'visual'];

export function FreePlayPage() {
  const { t } = useTranslation();
  const { language, settings } = useSettings();
  const { progress } = useProgress();
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [difficulty, setDifficulty] = useState<DifficultyMode>(settings.difficulty);
  const [current, setCurrent] = useState<Puzzle | null>(null);
  const [used, setUsed] = useState<string[]>([]);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    setCurrent(null);
    setUsed([]);
    setEmpty(false);
  }, [category, difficulty, language]);

  const next = () => {
    const pick = pickPuzzle(language, {
      category,
      difficulty,
      excludeIds: used,
      recent: progress.recent,
      fallbackCategory: category === 'all' ? undefined : category,
    });
    if (!pick) {
      setEmpty(true);
      setCurrent(null);
      return;
    }
    setEmpty(false);
    setCurrent(pick);
    setUsed((prev) => [...prev, pick.id]);
  };

  if (current) {
    return (
      <PuzzleCard
        key={current.id}
        puzzle={current}
        onComplete={() => next()}
        nextLabel={t('puzzle.next')}
      />
    );
  }

  const difficultyOptions: { value: DifficultyMode; label: string }[] = [
    { value: 'easy', label: t('difficulty.easy') },
    { value: 'medium', label: t('difficulty.medium') },
    { value: 'hard', label: t('difficulty.hard') },
    { value: 'adaptive', label: t('difficulty.adaptive') },
  ];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-serif text-2xl text-app">{t('freeplay.title')}</h1>
      </header>

      <Card>
        <div className="space-y-5">
          <div>
            <p className="text-app font-medium mb-2">{t('freeplay.pick_category')}</p>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={cx(
                    'min-h-[48px] rounded-2xl text-sm border transition-colors duration-300 ease-out',
                    category === c
                      ? 'border-[var(--color-primary)] bg-[color:var(--color-primary)]/10 text-app'
                      : 'border-app text-soft hover:text-app',
                  )}
                >
                  {t(`categories.${c}`)}
                </button>
              ))}
            </div>
          </div>

          <Segmented
            label={t('freeplay.pick_difficulty')}
            options={difficultyOptions}
            value={difficulty}
            onChange={(v) => setDifficulty(v)}
          />

          <Button onClick={next} size="lg" className="w-full">
            {t('freeplay.start')}
          </Button>

          {empty ? (
            <p className="text-soft text-sm text-center">{t('freeplay.out_of_puzzles')}</p>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
