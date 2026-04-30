import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { buzz } from '../lib/haptic.js';

export default function BreathingStep({ turbo, claustro, onComplete, onSkip }) {
  // Default: 60s total, 4s in, 6s out. Turbo: 30s. Claustro: skip after 30s.
  const total = turbo ? 30 : 60;
  const skipAfter = claustro ? 30 : turbo ? 10 : 30;
  const inhaleSec = turbo ? 3 : 4;
  const exhaleSec = turbo ? 4 : 6;
  const cycleSec = inhaleSec + exhaleSec;

  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState('inspira');
  const startRef = useRef(performance.now());
  const lastPhaseRef = useRef('inspira');

  useEffect(() => {
    let raf;
    const tick = () => {
      const now = performance.now();
      const e = (now - startRef.current) / 1000;
      const cyclePos = e % cycleSec;
      const next = cyclePos < inhaleSec ? 'inspira' : 'expira';
      if (next !== lastPhaseRef.current) {
        lastPhaseRef.current = next;
        setPhase(next);
        buzz(15);
      }
      setElapsed(e);
      if (e < total) raf = requestAnimationFrame(tick);
      else onComplete();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remaining = Math.max(0, Math.ceil(total - elapsed));
  const canSkip = elapsed >= skipAfter;

  return (
    <div className="flex-1 flex flex-col">
      <div className="pt-8 pb-2">
        <h2 className="h-display">Respira comigo</h2>
        <p className="text-cinza text-base mt-2">
          {phase === 'inspira' ? 'Inspira pelo nariz…' : 'Solta pela boca…'}
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-10">
        <div className="relative w-72 h-72 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full bg-salvia/15"
            animate={{
              scale: phase === 'inspira' ? 1 : 0.55
            }}
            transition={{
              duration: phase === 'inspira' ? inhaleSec : exhaleSec,
              ease: 'easeInOut'
            }}
          />
          <motion.div
            className="absolute inset-6 rounded-full bg-salvia/30"
            animate={{
              scale: phase === 'inspira' ? 1 : 0.6
            }}
            transition={{
              duration: phase === 'inspira' ? inhaleSec : exhaleSec,
              ease: 'easeInOut'
            }}
          />
          <motion.div
            className="relative w-32 h-32 rounded-full bg-salvia"
            animate={{
              scale: phase === 'inspira' ? 1.4 : 0.8
            }}
            transition={{
              duration: phase === 'inspira' ? inhaleSec : exhaleSec,
              ease: 'easeInOut'
            }}
          />
        </div>
        <p className="text-cinza tabular-nums text-sm">{remaining}s</p>
      </div>

      <div className="pt-4 min-h-[60px] flex justify-center">
        {canSkip ? (
          <button onClick={onSkip} className="btn-ghost">
            Pular
          </button>
        ) : (
          <p className="text-xs text-cinza/60">Sem pressa.</p>
        )}
      </div>
    </div>
  );
}
