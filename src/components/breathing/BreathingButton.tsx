import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/hooks/useSettings';
import { BreathingFullscreen } from './BreathingFullscreen';

export function BreathingButton() {
  const { t } = useTranslation();
  const { prefersReducedMotion } = useSettings();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={t('breathe.open')}
        title={t('breathe.label')}
        onClick={() => setOpen(true)}
        className="fixed z-30 right-4 bottom-4 safe-bottom h-14 w-14 rounded-full flex items-center justify-center bg-[var(--color-surface)] border border-app shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] transition-shadow duration-300"
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        <span
          aria-hidden
          className="block rounded-full bg-[var(--color-primary)]"
          style={{
            width: 36,
            height: 36,
            opacity: 0.55,
            animation: prefersReducedMotion ? 'none' : 'breathe 11s ease-in-out infinite',
          }}
        />
      </button>
      {open ? <BreathingFullscreen onClose={() => setOpen(false)} /> : null}
    </>
  );
}
