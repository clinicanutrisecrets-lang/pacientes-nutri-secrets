import { useEffect, useRef, useState } from 'react';
import type { BreathingPattern } from '@/lib/types';
import { softPulse } from '@/lib/haptics';
import { useSettings } from './useSettings';

export type BreathPhase = 'in' | 'hold' | 'out' | 'hold-out';

interface PhaseStep {
  phase: BreathPhase;
  seconds: number;
}

const PATTERNS: Record<BreathingPattern, PhaseStep[]> = {
  coherence: [
    { phase: 'in', seconds: 5.5 },
    { phase: 'out', seconds: 5.5 },
  ],
  '478': [
    { phase: 'in', seconds: 4 },
    { phase: 'hold', seconds: 7 },
    { phase: 'out', seconds: 8 },
  ],
  box: [
    { phase: 'in', seconds: 4 },
    { phase: 'hold', seconds: 4 },
    { phase: 'out', seconds: 4 },
    { phase: 'hold-out', seconds: 4 },
  ],
};

interface BreathingState {
  phase: BreathPhase;
  scale: number;
  cycleSeconds: number;
}

export function useBreathing(pattern: BreathingPattern, active: boolean): BreathingState {
  const steps = PATTERNS[pattern];
  const [phase, setPhase] = useState<BreathPhase>(steps[0].phase);
  const [scale, setScale] = useState<number>(0.7);
  const stepIndexRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const phaseStartRef = useRef<number>(0);
  const { settings } = useSettings();
  const cycleSeconds = steps.reduce((sum, s) => sum + s.seconds, 0);

  useEffect(() => {
    stepIndexRef.current = 0;
    setPhase(steps[0].phase);
    setScale(0.7);
  }, [pattern, steps]);

  useEffect(() => {
    if (!active) {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      timerRef.current = null;
      rafRef.current = null;
      return;
    }

    function targetScaleFor(phase: BreathPhase): number {
      switch (phase) {
        case 'in': return 1;
        case 'hold': return 1;
        case 'out': return 0.7;
        case 'hold-out': return 0.7;
      }
    }

    function startScaleFor(phase: BreathPhase): number {
      switch (phase) {
        case 'in': return 0.7;
        case 'hold': return 1;
        case 'out': return 1;
        case 'hold-out': return 0.7;
      }
    }

    const tick = () => {
      const now = performance.now();
      const step = steps[stepIndexRef.current];
      const elapsed = (now - phaseStartRef.current) / 1000;
      const t = Math.min(1, elapsed / step.seconds);
      const start = startScaleFor(step.phase);
      const target = targetScaleFor(step.phase);
      setScale(start + (target - start) * t);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const advance = () => {
      stepIndexRef.current = (stepIndexRef.current + 1) % steps.length;
      const next = steps[stepIndexRef.current];
      setPhase(next.phase);
      phaseStartRef.current = performance.now();
      if (settings.haptics) softPulse();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(tick);
      timerRef.current = window.setTimeout(advance, next.seconds * 1000);
    };

    phaseStartRef.current = performance.now();
    setPhase(steps[stepIndexRef.current].phase);
    rafRef.current = requestAnimationFrame(tick);
    timerRef.current = window.setTimeout(advance, steps[stepIndexRef.current].seconds * 1000);

    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      timerRef.current = null;
      rafRef.current = null;
    };
  }, [active, pattern, steps, settings.haptics]);

  return { phase, scale, cycleSeconds };
}
