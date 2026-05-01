import { useTranslation } from 'react-i18next';
import { useProgress } from '@/hooks/useProgress';
import { Card } from '@/components/ui/Card';
import type { PuzzleCategory } from '@/lib/types';

const CATEGORIES: PuzzleCategory[] = ['trivia', 'word', 'logic', 'number', 'visual'];

export function StatsPage() {
  const { t } = useTranslation();
  const { progress } = useProgress();

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-app">{t('stats.title')}</h1>

      <Card>
        <p className="text-soft text-xs uppercase tracking-wider">{t('stats.current_streak')}</p>
        <p className="font-serif text-3xl text-app mt-1">
          {progress.streak}{' '}
          <span className="text-soft text-base">
            {progress.streak === 1 ? t('stats.day') : t('stats.days')}
          </span>
        </p>
      </Card>

      <Card>
        <p className="text-soft text-xs uppercase tracking-wider">{t('stats.total_solved')}</p>
        <p className="font-serif text-3xl text-app mt-1">{progress.totalSolved}</p>
      </Card>

      <Card>
        <p className="text-soft text-xs uppercase tracking-wider mb-3">{t('stats.accuracy')}</p>
        {progress.totalAttempted === 0 ? (
          <p className="text-soft text-sm">{t('stats.no_data')}</p>
        ) : (
          <ul className="space-y-3">
            {CATEGORIES.map((c) => {
              const cat = progress.byCategory[c];
              const pct = cat.attempted === 0 ? 0 : Math.round((cat.correct / cat.attempted) * 100);
              return (
                <li key={c}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-app">{t(`categories.${c}`)}</span>
                    <span className="text-soft tabular-nums">
                      {cat.attempted === 0 ? '—' : `${pct}%`}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-[var(--color-surface-soft)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-primary)] transition-all duration-500 ease-out"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
