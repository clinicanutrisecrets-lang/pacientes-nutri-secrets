import { useTranslation } from 'react-i18next';
import { useBreathing } from '@/hooks/useBreathing';
import { useSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/Button';
import { Segmented } from '@/components/ui/Segmented';
import type { BreathingPattern } from '@/lib/types';

interface Props {
  onClose: () => void;
}

const SIZE = 280;
const CENTER = SIZE / 2;
const RING_RADIUS = 124;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const INNER_RADIUS = 92;

export function BreathingFullscreen({ onClose }: Props) {
  const { t } = useTranslation();
  const { settings, update, prefersReducedMotion } = useSettings();
  const pattern = settings.breathingPattern;
  const { phase, scale, progress } = useBreathing(pattern, true);

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

  const safeScale = prefersReducedMotion ? 0.85 : scale;
  const safeProgress = prefersReducedMotion ? 0 : progress;
  const dashOffset = RING_CIRCUMFERENCE * (1 - safeProgress);
  const innerR = INNER_RADIUS * safeScale;

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

      <div className="flex flex-col items-center gap-8">
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-hidden
          className="drop-shadow-sm"
        >
          <defs>
            <radialGradient id="breath-fill" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.95" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.6" />
            </radialGradient>
          </defs>

          {/* Outer faint ring (background track) */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RING_RADIUS}
            fill="none"
            stroke="var(--color-primary)"
            strokeOpacity="0.18"
            strokeWidth="6"
          />

          {/* Progress ring — fills clockwise during each phase */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RING_RADIUS}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
            style={{
              transition: prefersReducedMotion ? 'none' : 'stroke-dashoffset 0.18s linear',
            }}
          />

          {/* Filled inner circle that scales with the breath */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={innerR}
            fill="url(#breath-fill)"
            style={{
              transition: prefersReducedMotion ? 'none' : 'r 0.18s linear',
            }}
          />

          {/* Soft glow ring around the inner circle */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={innerR + 12}
            fill="none"
            stroke="var(--color-primary)"
            strokeOpacity="0.18"
            strokeWidth="2"
            style={{
              transition: prefersReducedMotion ? 'none' : 'r 0.18s linear',
            }}
          />
        </svg>

        <div className="font-serif text-3xl text-app text-center" aria-live="polite">
          {phaseLabel}
        </div>
      </div>

      <Button onClick={onClose} variant="secondary" size="lg" className="w-full max-w-sm">
        {t('breathe.done')}
      </Button>
    </div>
  );
}
