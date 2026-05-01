import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Puzzle } from '@/lib/types';
import { useProgress } from '@/hooks/useProgress';
import { useSettings } from '@/hooks/useSettings';
import { softDoublePulse, softPulse } from '@/lib/haptics';
import { cx } from '@/lib/util';
import { Card } from '@/components/ui/Card';
import { AnswerOptions } from './AnswerOptions';
import { Explanation } from './Explanation';

interface Props {
  puzzle: Puzzle;
  onComplete: (correct: boolean) => void;
  progressLabel?: string;
  nextLabel?: string;
}

export function PuzzleCard({ puzzle, onComplete, progressLabel, nextLabel }: Props) {
  const { t } = useTranslation();
  const { recordResult } = useProgress();
  const { settings, prefersReducedMotion } = useSettings();
  const [resolved, setResolved] = useState<{ correct: boolean } | null>(null);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setResolved(null);
    setShake(false);
  }, [puzzle.id]);

  const handleSubmit = (_answer: string, correct: boolean) => {
    if (resolved) return;
    setResolved({ correct });
    recordResult(puzzle.id, puzzle.category, puzzle.difficulty, correct);
    if (settings.haptics) {
      if (correct) softPulse();
      else softDoublePulse();
    }
    if (!correct && !prefersReducedMotion) {
      setShake(true);
      window.setTimeout(() => setShake(false), 240);
    }
  };

  return (
    <div className="space-y-4">
      {progressLabel ? (
        <div className="text-soft text-xs tracking-wider uppercase">{progressLabel}</div>
      ) : null}

      <Card
        className={cx(
          'transition-shadow duration-500',
          resolved?.correct && !prefersReducedMotion ? 'animate-glow' : '',
          shake ? 'animate-softShake' : '',
        )}
      >
        <div className="space-y-2">
          <div className="text-soft text-xs uppercase tracking-wider">
            {t(`categories.${puzzle.category}`)} · {t(`difficulty.${puzzle.difficulty}`)}
          </div>
          <h2 className="font-serif text-2xl text-app leading-snug">
            {puzzle.question}
          </h2>
        </div>
        <div className="mt-6">
          <AnswerOptions
            puzzle={puzzle}
            disabled={resolved !== null}
            onSubmit={handleSubmit}
          />
        </div>
      </Card>

      {resolved ? (
        <Explanation
          puzzle={puzzle}
          correct={resolved.correct}
          onNext={() => onComplete(resolved.correct)}
          nextLabel={nextLabel}
        />
      ) : null}
    </div>
  );
}
