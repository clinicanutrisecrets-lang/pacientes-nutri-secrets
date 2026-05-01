import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Puzzle } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { answersMatch, cx } from '@/lib/util';

interface Props {
  puzzle: Puzzle;
  disabled: boolean;
  onSubmit: (answer: string, correct: boolean) => void;
}

export function AnswerOptions({ puzzle, disabled, onSubmit }: Props) {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    setText('');
    setPicked(null);
  }, [puzzle.id]);

  if (puzzle.type === 'multiple-choice') {
    const options = puzzle.options ?? [];
    return (
      <div className="grid gap-3">
        {options.map((opt) => {
          const isPicked = picked === opt;
          const isCorrect = answersMatch(opt, puzzle.answer);
          const showState = disabled && (isPicked || isCorrect);
          return (
            <button
              key={opt}
              type="button"
              disabled={disabled}
              onClick={() => {
                setPicked(opt);
                onSubmit(opt, answersMatch(opt, puzzle.answer));
              }}
              className={cx(
                'w-full text-left min-h-[56px] px-5 rounded-2xl border transition-colors duration-300 ease-out',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
                showState && isCorrect
                  ? 'bg-[color:var(--color-correct)]/20 border-[color:var(--color-correct)] text-app'
                  : showState && isPicked && !isCorrect
                  ? 'bg-[color:var(--color-incorrect)]/20 border-[color:var(--color-incorrect)] text-app'
                  : 'bg-surface border-app text-app hover:bg-[var(--color-surface-soft)]',
                disabled && !showState ? 'opacity-70' : '',
              )}
            >
              <span className="text-base">{opt}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (disabled || !text.trim()) return;
        onSubmit(text, answersMatch(text, puzzle.answer));
      }}
      className="grid gap-3"
    >
      <label className="block">
        <span className="text-soft text-sm">{t('puzzle.your_answer')}</span>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          autoComplete="off"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          placeholder={t('puzzle.type_here')}
          className="mt-2 w-full min-h-[56px] px-5 rounded-2xl border border-app bg-surface text-app text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </label>
      <Button type="submit" size="lg" disabled={disabled || !text.trim()}>
        {t('puzzle.submit')}
      </Button>
    </form>
  );
}
