import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProgress } from '@/hooks/useProgress';
import { Card } from '@/components/ui/Card';
import { todayKey } from '@/lib/util';

function greetingKey(hour: number): 'home.greeting_morning' | 'home.greeting_afternoon' | 'home.greeting_evening' {
  if (hour < 12) return 'home.greeting_morning';
  if (hour < 18) return 'home.greeting_afternoon';
  return 'home.greeting_evening';
}

export function HomePage() {
  const { t } = useTranslation();
  const { progress } = useProgress();
  const today = todayKey();
  const dailyDone = Boolean(progress.dailyCompleted[today]);
  const hour = new Date().getHours();
  const greeting = t(greetingKey(hour));

  return (
    <div className="space-y-6">
      <header className="space-y-1 pt-2">
        <p className="text-soft text-sm">{greeting}</p>
        <h1 className="font-serif text-3xl text-app">{t('app.title')}</h1>
        <p className="text-soft">{t('app.tagline')}</p>
      </header>

      <Link to="/daily" className="block focus-visible:outline-none">
        <Card className="hover:border-[var(--color-primary)] transition-colors duration-300">
          <div className="space-y-2">
            <p className="text-soft text-xs uppercase tracking-wider">{t('nav.daily')}</p>
            <h2 className="font-serif text-2xl text-app">{t('home.todays_set')}</h2>
            <p className="text-soft">
              {dailyDone ? t('home.completed_today') : t('home.todays_set_desc')}
            </p>
          </div>
        </Card>
      </Link>

      <Link to="/play" className="block focus-visible:outline-none">
        <Card className="hover:border-[var(--color-primary)] transition-colors duration-300">
          <div className="space-y-2">
            <p className="text-soft text-xs uppercase tracking-wider">{t('nav.play')}</p>
            <h2 className="font-serif text-2xl text-app">{t('home.free_play')}</h2>
            <p className="text-soft">{t('home.free_play_desc')}</p>
          </div>
        </Card>
      </Link>

      <Link to="/stats" className="block focus-visible:outline-none">
        <Card className="hover:border-[var(--color-primary)] transition-colors duration-300">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-soft text-xs uppercase tracking-wider">{t('stats.current_streak')}</p>
              <p className="font-serif text-2xl text-app">
                {progress.streak}{' '}
                <span className="text-soft text-base">
                  {progress.streak === 1 ? t('stats.day') : t('stats.days')}
                </span>
              </p>
            </div>
            <p className="text-soft text-sm">{t('home.view_stats')} →</p>
          </div>
        </Card>
      </Link>
    </div>
  );
}
