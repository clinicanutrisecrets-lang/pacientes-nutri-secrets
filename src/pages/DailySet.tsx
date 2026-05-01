import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProgress } from '@/hooks/useProgress';
import { useSettings } from '@/hooks/useSettings';
import { getDailySet } from '@/hooks/usePuzzleBank';
import { PuzzleCard } from '@/components/puzzles/PuzzleCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { todayKey } from '@/lib/util';

export function DailySetPage() {
  const { t } = useTranslation();
  const { language } = useSettings();
  const { markDailyComplete } = useProgress();
  const date = todayKey();
  const puzzles = useMemo(() => getDailySet(language, date), [language, date]);
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const isLast = index >= puzzles.length;

  useEffect(() => {
    if (isLast) markDailyComplete(date);
  }, [isLast, markDailyComplete, date]);

  if (isLast) {
    return (
      <div className="space-y-6">
        <Card className="text-center space-y-3">
          <h1 className="font-serif text-2xl text-app">{t('puzzle.done_title')}</h1>
          <p className="text-soft">{t('puzzle.done_subtitle')}</p>
          <p className="text-app">
            {t('puzzle.score_summary', { correct: correctCount, total: puzzles.length })}
          </p>
        </Card>
        <Link to="/" className="block">
          <Button variant="secondary" size="lg" className="w-full">
            {t('nav.home')}
          </Button>
        </Link>
      </div>
    );
  }

  const current = puzzles[index];
  const progressLabel = t('puzzle.progress', { current: index + 1, total: puzzles.length });
  const isFinal = index === puzzles.length - 1;

  return (
    <PuzzleCard
      key={current.id}
      puzzle={current}
      progressLabel={progressLabel}
      nextLabel={isFinal ? t('puzzle.done_title') : t('puzzle.next')}
      onComplete={(correct) => {
        if (correct) setCorrectCount((c) => c + 1);
        setIndex((i) => i + 1);
      }}
    />
  );
}
