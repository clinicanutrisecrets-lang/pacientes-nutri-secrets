import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isTourSeen, markTourSeen } from '@/lib/storage';
import { useSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/Button';
import { cx } from '@/lib/util';

const STEPS = ['language', 'welcome', 'breathe', 'daily', 'play', 'settings'] as const;
type Step = typeof STEPS[number];

interface Props {
  onClose?: () => void;
  forceOpen?: boolean;
}

function StepIcon({ step }: { step: Step }) {
  const common = 'w-12 h-12';
  if (step === 'language') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </svg>
    );
  }
  if (step === 'welcome') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={common}>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
        <circle cx="12" cy="12" r="3.5" />
      </svg>
    );
  }
  if (step === 'breathe') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={common}>
        <circle cx="12" cy="12" r="9" strokeOpacity="0.3" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (step === 'daily') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={common}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="8" y1="3" x2="8" y2="7" />
        <line x1="16" y1="3" x2="16" y2="7" />
        <circle cx="12" cy="14" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (step === 'play') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={common}>
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
        <polyline points="21 16 21 21 16 21" />
        <line x1="15" y1="15" x2="21" y2="21" />
        <line x1="4" y1="4" x2="9" y2="9" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={common}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function OnboardingTour({ onClose, forceOpen = false }: Props) {
  const { t } = useTranslation();
  const { setLanguage, language } = useSettings();
  const [open, setOpen] = useState<boolean>(() => forceOpen || !isTourSeen());
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (forceOpen) {
      setOpen(true);
      setStepIndex(0);
    }
  }, [forceOpen]);

  if (!open) return null;

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;
  const isFirst = stepIndex === 0;
  const isLanguageStep = step === 'language';

  const finish = () => {
    markTourSeen();
    setOpen(false);
    onClose?.();
  };

  const handleNext = () => {
    if (isLast) finish();
    else setStepIndex((i) => i + 1);
  };

  const handleBack = () => {
    if (!isFirst) setStepIndex((i) => i - 1);
  };

  const handleSkip = () => {
    finish();
  };

  const handlePickLanguage = (lang: 'en' | 'pt-BR') => {
    setLanguage(lang);
    setStepIndex(1);
  };

  const currentLangIsPT = language.toLowerCase().startsWith('pt');

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[color:var(--color-charcoal,#1C1F26)]/40 backdrop-blur-sm animate-fadeIn"
    >
      <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-surface border border-app shadow-xl p-6 m-0 sm:m-6 safe-bottom">
        <div className="flex items-center justify-between mb-4">
          <span className="text-soft text-xs uppercase tracking-wider">
            {isLanguageStep
              ? `${stepIndex + 1} / ${STEPS.length}`
              : t('tour.step', { current: stepIndex + 1, total: STEPS.length })}
          </span>
          <button
            type="button"
            onClick={handleSkip}
            className="text-soft text-sm hover:text-app rounded-lg px-2 py-1"
          >
            {isLanguageStep ? 'Skip · Pular' : t('tour.skip')}
          </button>
        </div>

        {isLanguageStep ? (
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-[var(--color-primary)]/15 text-[var(--color-primary)] flex items-center justify-center">
                <StepIcon step="language" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <h2 className="font-serif text-2xl text-app leading-snug">
                  Language · Idioma
                </h2>
                <p className="text-soft text-sm">
                  Choose your language · Escolha seu idioma
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handlePickLanguage('en')}
                className={cx(
                  'w-full flex items-center justify-between min-h-[56px] px-5 rounded-2xl border transition-colors duration-300 ease-out',
                  !currentLangIsPT
                    ? 'border-[var(--color-primary)] bg-[color:var(--color-primary)]/10 text-app'
                    : 'border-app text-app hover:bg-[var(--color-surface-soft)]',
                )}
              >
                <span className="text-base font-medium">English</span>
                <span className="text-soft text-sm">EN</span>
              </button>
              <button
                type="button"
                onClick={() => handlePickLanguage('pt-BR')}
                className={cx(
                  'w-full flex items-center justify-between min-h-[56px] px-5 rounded-2xl border transition-colors duration-300 ease-out',
                  currentLangIsPT
                    ? 'border-[var(--color-primary)] bg-[color:var(--color-primary)]/10 text-app'
                    : 'border-app text-app hover:bg-[var(--color-surface-soft)]',
                )}
              >
                <span className="text-base font-medium">Português</span>
                <span className="text-soft text-sm">PT</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-4 mb-4">
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-[var(--color-primary)]/15 text-[var(--color-primary)] flex items-center justify-center">
                <StepIcon step={step} />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <h2 className="font-serif text-2xl text-app leading-snug">
                  {t(`tour.${step}.title`)}
                </h2>
              </div>
            </div>

            <p className="text-app leading-relaxed mb-6">{t(`tour.${step}.body`)}</p>
          </>
        )}

        <div className="flex items-center gap-2 mb-5 mt-5" aria-hidden>
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={cx(
                'h-1.5 rounded-full transition-all duration-300 ease-out',
                i === stepIndex
                  ? 'w-8 bg-[var(--color-primary)]'
                  : i < stepIndex
                  ? 'w-2 bg-[var(--color-primary)]/40'
                  : 'w-2 bg-[var(--color-surface-soft)] border border-app',
              )}
            />
          ))}
        </div>

        {!isLanguageStep ? (
          <div className="flex gap-2">
            {!isFirst ? (
              <Button variant="secondary" size="md" onClick={handleBack} className="flex-1">
                {t('tour.back')}
              </Button>
            ) : null}
            <Button size="md" onClick={handleNext} className="flex-1">
              {isLast ? t('tour.done') : t('tour.next')}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
