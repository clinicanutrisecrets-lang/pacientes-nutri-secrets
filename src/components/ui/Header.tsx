import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/hooks/useSettings';
import { cx } from '@/lib/util';

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage } = useSettings();

  const isHome = location.pathname === '/';
  const langShort = language.toLowerCase().startsWith('pt') ? 'PT' : 'EN';
  const nextLang = langShort === 'PT' ? 'en' : 'pt-BR';

  return (
    <header className="safe-top sticky top-0 z-20 bg-app/85 backdrop-blur border-b border-app">
      <div className="mx-auto max-w-2xl flex items-center justify-between px-5 py-3">
        {isHome ? (
          <Link to="/" className="font-serif text-xl text-app">
            {t('app.title')}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) navigate(-1);
              else navigate('/');
            }}
            className="text-soft hover:text-app text-sm min-h-[44px] -ml-2 px-2 rounded-lg"
            aria-label={t('nav.back')}
          >
            ← {t('nav.back')}
          </button>
        )}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setLanguage(nextLang)}
            className={cx(
              'rounded-full px-3 min-h-[36px] text-xs font-medium border border-app text-soft hover:text-app',
              'transition-colors duration-300 ease-out',
            )}
            aria-label={t('settings.language')}
          >
            {langShort}
          </button>
          <Link
            to="/settings"
            className="rounded-full px-3 min-h-[36px] inline-flex items-center text-xs text-soft hover:text-app"
          >
            {t('nav.settings')}
          </Link>
        </div>
      </div>
    </header>
  );
}
