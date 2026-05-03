import { useTranslation } from 'react-i18next';
import { useBreathing, type BreathPhase } from '@/hooks/useBreathing';
import { useSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/Button';
import { Segmented } from '@/components/ui/Segmented';
import type { BreathingPattern } from '@/lib/types';

interface Props {
  onClose: () => void;
}

const SIZE = 280;
const CENTER = SIZE / 2;
const SHAPE_R = 96;

function makeStarPath(cx: number, cy: number, outerR: number, innerR: number): string {
  const points = 5;
  let d = '';
  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI * i) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    d += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ',' + y.toFixed(2);
  }
  return d + 'Z';
}

function makeTrianglePath(cx: number, cy: number, r: number): string {
  const points: string[] = [];
  for (let i = 0; i < 3; i++) {
    const a = -Math.PI / 2 + i * ((Math.PI * 2) / 3);
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return `M${points[0]} L${points[1]} L${points[2]} Z`;
}

const STAR_PATH = makeStarPath(CENTER, CENTER, SHAPE_R, SHAPE_R * 0.42);
const STAR_LENGTH = 760;
const TRIANGLE_PATH = makeTrianglePath(CENTER, CENTER, SHAPE_R);

interface ShapeProps {
  phase: BreathPhase;
  progress: number;
  reduce: boolean;
}

function PhaseShape({ phase, progress, reduce }: ShapeProps) {
  const t = reduce ? 0.6 : Math.max(0, Math.min(1, progress));

  if (phase === 'in') {
    const r = 8 + (SHAPE_R - 8) * t;
    return (
      <g>
        <circle
          cx={CENTER}
          cy={CENTER}
          r={SHAPE_R}
          fill="none"
          stroke="var(--color-primary)"
          strokeOpacity="0.18"
          strokeWidth="3"
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={r}
          fill="url(#breath-fill)"
          style={{ transition: reduce ? 'none' : 'r 0.16s linear' }}
        />
      </g>
    );
  }

  if (phase === 'hold') {
    return (
      <g>
        <circle
          cx={CENTER}
          cy={CENTER}
          r={SHAPE_R}
          fill="none"
          stroke="var(--color-primary)"
          strokeOpacity="0.08"
          strokeWidth="1"
        />
        <path
          d={STAR_PATH}
          fill="url(#breath-fill)"
          fillOpacity={0.05 + t * 0.55}
          stroke="var(--color-primary)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={STAR_LENGTH}
          strokeDashoffset={STAR_LENGTH * (1 - t)}
          style={{
            transition: reduce ? 'none' : 'stroke-dashoffset 0.16s linear, fill-opacity 0.16s linear',
          }}
        />
      </g>
    );
  }

  if (phase === 'out') {
    const scale = 1 - t;
    return (
      <g>
        <path
          d={TRIANGLE_PATH}
          fill="none"
          stroke="var(--color-primary)"
          strokeOpacity="0.18"
          strokeWidth="3"
        />
        <g
          style={{
            transformOrigin: `${CENTER}px ${CENTER}px`,
            transform: `scale(${scale})`,
            transition: reduce ? 'none' : 'transform 0.16s linear',
          }}
        >
          <path d={TRIANGLE_PATH} fill="url(#breath-fill)" />
        </g>
      </g>
    );
  }

  // hold-out — soft square at the bottom of the cycle (box pattern only)
  const SQ = SHAPE_R * 1.45;
  const x = CENTER - SQ / 2;
  const y = CENTER - SQ / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={SQ}
        height={SQ}
        rx="14"
        fill="url(#breath-fill)"
        fillOpacity={0.18 + t * 0.18}
        stroke="var(--color-primary)"
        strokeOpacity="0.4"
        strokeWidth="2"
        style={{ transition: reduce ? 'none' : 'fill-opacity 0.16s linear' }}
      />
    </g>
  );
}

export function BreathingFullscreen({ onClose }: Props) {
  const { t } = useTranslation();
  const { settings, update, prefersReducedMotion } = useSettings();
  const pattern = settings.breathingPattern;
  const { phase, progress } = useBreathing(pattern, true);

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
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.65" />
            </radialGradient>
          </defs>
          <PhaseShape phase={phase} progress={progress} reduce={prefersReducedMotion} />
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
