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
        onClick={() => setOpen(true)}
        className="fixed z-30 right-4 bottom-4 safe-bottom h-14 w-14 rounded-full flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <span
          aria-hidden
          className="block rounded-full bg-[var(--color-primary)]"
          style={{
            width: 44,
            height: 44,
            opacity: 0.32,
            animation: prefersReducedMotion ? 'none' : 'breathe 11s ease-in-out infinite',
          }}
        />
      </button>
      {open ? <BreathingFullscreen onClose={() => setOpen(false)} /> : null}
    </>
  );
}
