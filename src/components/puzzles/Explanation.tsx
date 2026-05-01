import { useTranslation } from 'react-i18next';
import type { Puzzle } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cx } from '@/lib/util';

interface Props {
  puzzle: Puzzle;
  correct: boolean;
  onNext: () => void;
  nextLabel?: string;
}

export function Explanation({ puzzle, correct, onNext, nextLabel }: Props) {
  const { t } = useTranslation();
  const heading = correct ? t('puzzle.correct') : t('puzzle.incorrect');
  return (
    <Card
      className={cx(
        'mt-6 animate-fadeIn',
        correct
          ? 'border-[color:var(--color-correct)]/60'
          : 'border-[color:var(--color-incorrect)]/60',
      )}
    >
      <div className="space-y-3">
        <p className="font-serif text-xl text-app">{heading}</p>
        {!correct ? (
          <p className="text-app">
            <span className="text-soft text-sm">{t('puzzle.answer_was')}: </span>
            <span className="font-medium">{puzzle.answer}</span>
          </p>
        ) : null}
        <div>
          <p className="text-soft text-xs uppercase tracking-wider">{t('puzzle.explanation')}</p>
          <p className="text-app leading-relaxed">{puzzle.explanation}</p>
        </div>
        {puzzle.funFact ? (
          <div>
            <p className="text-soft text-xs uppercase tracking-wider">{t('puzzle.fun_fact')}</p>
            <p className="text-app leading-relaxed">{puzzle.funFact}</p>
          </div>
        ) : null}
        <div className="pt-2">
          <Button onClick={onNext} size="lg" className="w-full">
            {nextLabel ?? t('puzzle.next')}
          </Button>
        </div>
      </div>
    </Card>
  );
}
