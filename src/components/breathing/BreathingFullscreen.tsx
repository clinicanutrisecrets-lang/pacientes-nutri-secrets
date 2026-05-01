import { useTranslation } from 'react-i18next';
import { useBreathing } from '@/hooks/useBreathing';
import { useSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/Button';
import { Segmented } from '@/components/ui/Segmented';
import type { BreathingPattern } from '@/lib/types';

interface Props {
  onClose: () => void;
}

export function BreathingFullscreen({ onClose }: Props) {
  const { t } = useTranslation();
  const { settings, update, prefersReducedMotion } = useSettings();
  const pattern = settings.breathingPattern;
  const { phase, scale } = useBreathing(pattern, true);

  const phaseLabel =
    phase === 'in'
      ? t('breathe.in')
      : phase === 'out'
      ? t('breathe.out')
      : t('breathe.hold');

  const patternOptions: { value: BreathingPattern; label: string }[] = [
    { value: 'coherence', label: t('breathe.patterns.coherence') },
    { value: '478', label: t('breathe.patterns.478') },
    { value: 'box', label: t('breathe.patterns.box') },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-40 bg-app safe-top safe-bottom flex flex-col items-center justify-between px-6 py-6 animate-fadeIn"
    >
      <div className="w-full max-w-sm">
        <Segmented
          options={patternOptions}
          value={pattern}
          onChange={(next) => update('breathingPattern', next)}
          label={t('breathe.pattern')}
        />
      </div>

      <div className="flex flex-col items-center gap-6">
        <div
          aria-hidden
          className="rounded-full bg-[var(--color-primary)]/30"
          style={{
            width: 240,
            height: 240,
            transform: prefersReducedMotion ? 'scale(0.9)' : `scale(${scale})`,
            transition: prefersReducedMotion ? undefined : 'transform 0.2s linear',
          }}
        />
        <div className="font-serif text-2xl text-app text-center" aria-live="polite">
          {phaseLabel}
        </div>
      </div>

      <Button onClick={onClose} variant="secondary" size="lg" className="w-full max-w-sm">
        {t('breathe.done')}
      </Button>
    </div>
  );
}
