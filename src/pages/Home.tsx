import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProgress } from '@/hooks/useProgress';
import { Card } from '@/components/ui/Card';
import { InstallCard } from '@/components/ui/InstallCard';
import { todayKey } from '@/lib/util';

function greetingKey(hour: number): 'home.greeting_morning' | 'home.greeting_afternoon' | 'home.greeting_evening' {
  if (hour < 12) return 'home.greeting_morning';
  if (hour < 18) return 'home.greeting_afternoon';
  return 'home.greeting_evening';
}

function IconSparkle() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
      <circle cx="12" cy="12" r="3.5" />
    </svg>
  );
}

function IconShuffle() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  );
}

function IconFlame() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17a3 3 0 0 0 3-3c0-1.5-1-2.7-2.4-3.7A6 6 0 0 1 12 2a8 8 0 0 1 5.6 13.5C16.5 17.7 14.4 19 12 19c-3.3 0-6-2.7-6-6 0-1 .2-2 .6-2.8" />
    </svg>
  );
}

export function HomePage() {
  const { t } = useTranslation();
  const { progress } = useProgress();
  const today = todayKey();
  const dailyDone = Boolean(progress.dailyCompleted[today]);
  const hour = new Date().getHours();
  const greeting = t(greetingKey(hour));

  return (
    <div className="space-y-5">
      <header className="space-y-1 pt-2">
        <p className="text-soft text-sm">{greeting}</p>
        <h1 className="font-serif text-3xl text-app">{t('app.title')}</h1>
        <p className="text-soft">{t('app.tagline')}</p>
      </header>

      <InstallCard />

      <Link to="/daily" className="block focus-visible:outline-none">
        <Card className="hover:border-[var(--color-primary)] transition-colors duration-300 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-[var(--color-primary)]/8 pointer-events-none" />
          <div className="relative flex items-start gap-4">
            <div className="shrink-0 mt-1 w-10 h-10 rounded-2xl bg-[var(--color-primary)]/15 text-[var(--color-primary)] flex items-center justify-center">
              <IconSparkle />
            </div>
            <div className="space-y-1">
              <p className="text-soft text-xs uppercase tracking-wider">{t('nav.daily')}</p>
              <h2 className="font-serif text-2xl text-app">{t('home.todays_set')}</h2>
              <p className="text-soft">
                {dailyDone ? t('home.completed_today') : t('home.todays_set_desc')}
              </p>
            </div>
          </div>
        </Card>
      </Link>

      <Link to="/play" className="block focus-visible:outline-none">
        <Card className="hover:border-[var(--color-primary)] transition-colors duration-300 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-[var(--color-secondary)]/10 pointer-events-none" />
          <div className="relative flex items-start gap-4">
            <div className="shrink-0 mt-1 w-10 h-10 rounded-2xl bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] flex items-center justify-center">
              <IconShuffle />
            </div>
            <div className="space-y-1">
              <p className="text-soft text-xs uppercase tracking-wider">{t('nav.play')}</p>
              <h2 className="font-serif text-2xl text-app">{t('home.free_play')}</h2>
              <p className="text-soft">{t('home.free_play_desc')}</p>
            </div>
          </div>
        </Card>
      </Link>

      <Link to="/stats" className="block focus-visible:outline-none">
        <Card className="hover:border-[var(--color-primary)] transition-colors duration-300">
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-10 h-10 rounded-2xl bg-[var(--color-primary)]/15 text-[var(--color-primary)] flex items-center justify-center">
              <IconFlame />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-soft text-xs uppercase tracking-wider">{t('stats.current_streak')}</p>
              <p className="font-serif text-2xl text-app">
                {progress.streak}{' '}
                <span className="text-soft text-base">
                  {progress.streak === 1 ? t('stats.day') : t('stats.days')}
                </span>
              </p>
            </div>
            <p className="text-soft text-sm shrink-0">→</p>
          </div>
        </Card>
      </Link>
    </div>
  );
}
