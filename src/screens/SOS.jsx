import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { loadConfig } from '../lib/config.js';
import { buzz } from '../lib/haptic.js';

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

export default function SOS({ onBack }) {
  const [view, setView] = useState('menu');
  const config = loadConfig();
  const lista = (config.listaSOS || []).filter(Boolean);
  const frase = (config.fraseAncora || '').trim();

  return (
    <div className="screen safe-top safe-bottom">
      <div className="flex items-center gap-3 pb-2">
        <button
          aria-label="Voltar"
          onClick={onBack}
          className="text-muted hover:text-body p-2 -ml-2 transition-colors"
        >
          <BackIcon />
        </button>
        <h1 className="h-display">Pausa SOS</h1>
      </div>

      <AnimatePresence mode="wait">
        {view === 'menu' && (
          <motion.div key="menu" {...fade} className="flex-1 flex flex-col">
            {frase && (
              <div className="card mt-2 mb-4">
                <p className="font-serif italic text-base leading-relaxed text-body">
                  “{frase}”
                </p>
              </div>
            )}

            <p className="text-muted text-sm mb-3">Técnica TIPP da DBT — escolhe uma:</p>
            <div className="space-y-3">
              <SOSOption
                titulo="Água gelada no rosto"
                hint="Ativa o reflexo de mergulho, baixa o sistema nervoso em segundos."
                onClick={() => {
                  buzz(40);
                  setView('agua');
                }}
              />
              <SOSOption
                titulo="Respiração diafragmática (90s)"
                hint="Inspira 4s pelo nariz, segura 2s, solta 8s pela boca."
                onClick={() => {
                  buzz(40);
                  setView('respiracao');
                }}
              />
              <SOSOption
                titulo="Exercício intenso (60s)"
                hint="Polichinelo, agachamento, corrida no lugar. Descarrega adrenalina."
                onClick={() => {
                  buzz(40);
                  setView('exercicio');
                }}
              />
            </div>

            {lista.length > 0 && (
              <div className="mt-6">
                <p className="text-muted text-sm mb-3">Coisas que já te ajudaram antes:</p>
                <ul className="space-y-2">
                  {lista.map((item, i) => (
                    <li
                      key={i}
                      className="card text-body text-base leading-snug"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {lista.length === 0 && (
              <p className="mt-6 text-sm text-muted leading-relaxed">
                Você pode preencher uma lista de 5 coisas que já te ajudaram antes nas configurações. Em momento calmo, claro.
              </p>
            )}
          </motion.div>
        )}
        {view === 'agua' && <AguaGelada onBack={() => setView('menu')} key="a" />}
        {view === 'respiracao' && <RespiracaoSOS onBack={() => setView('menu')} key="r" />}
        {view === 'exercicio' && <ExercicioSOS onBack={() => setView('menu')} key="e" />}
      </AnimatePresence>
    </div>
  );
}

function SOSOption({ titulo, hint, onClick }) {
  return (
    <button onClick={onClick} className="card w-full text-left active:scale-[0.98] transition-transform">
      <div className="text-base font-medium text-body">{titulo}</div>
      <div className="text-sm text-muted mt-1 leading-snug">{hint}</div>
    </button>
  );
}

function AguaGelada({ onBack }) {
  return (
    <motion.div {...fade} className="flex-1 flex flex-col">
      <h2 className="font-serif text-2xl leading-tight mt-4">Água gelada no rosto</h2>
      <ol className="mt-4 space-y-3 text-body text-base leading-relaxed list-decimal pl-5">
        <li>Vai até a pia.</li>
        <li>Abre a torneira no mais frio possível.</li>
        <li>Forma uma concha com as mãos e mergulha o rosto por 15 a 30 segundos. Pode ser o pano gelado se preferir.</li>
        <li>Foco especial em testa, têmporas e abaixo dos olhos.</li>
        <li>Respira fundo. Espera 1 minuto antes de qualquer decisão.</li>
      </ol>
      <button onClick={onBack} className="btn-secondary mt-auto">Voltar</button>
    </motion.div>
  );
}

function RespiracaoSOS({ onBack }) {
  // 4s in, 2s hold, 8s out — 90s total
  const total = 90;
  const inhale = 4, hold = 2, exhale = 8;
  const cycle = inhale + hold + exhale;
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState('Inspira');
  const startRef = useRef(0);
  const lastPhaseRef = useRef('');

  useEffect(() => {
    let raf;
    startRef.current = performance.now();
    const tick = () => {
      const e = (performance.now() - startRef.current) / 1000;
      const pos = e % cycle;
      const next = pos < inhale ? 'Inspira' : pos < inhale + hold ? 'Segura' : 'Solta';
      if (next !== lastPhaseRef.current) {
        lastPhaseRef.current = next;
        setPhase(next);
        buzz(15);
      }
      setElapsed(e);
      if (e < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const remaining = Math.max(0, Math.ceil(total - elapsed));
  const scale = phase === 'Inspira' ? 1.4 : phase === 'Segura' ? 1.4 : 0.7;
  const dur = phase === 'Inspira' ? inhale : phase === 'Segura' ? hold : exhale;

  return (
    <motion.div {...fade} className="flex-1 flex flex-col items-center">
      <h2 className="font-serif text-2xl mt-4 self-start">Respiração 4-2-8</h2>
      <p className="text-muted text-sm self-start mt-1">{phase}…</p>

      <div className="flex-1 flex items-center justify-center">
        <motion.div
          className="w-44 h-44 rounded-full"
          style={{ backgroundColor: 'var(--cool)' }}
          animate={{ scale }}
          transition={{ duration: dur, ease: 'easeInOut' }}
        />
      </div>
      <p className="text-muted tabular-nums text-sm mb-4">{remaining}s</p>
      <button onClick={onBack} className="btn-secondary w-full">Voltar</button>
    </motion.div>
  );
}

function ExercicioSOS({ onBack }) {
  const total = 60;
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);

  useEffect(() => {
    let raf;
    startRef.current = performance.now();
    const tick = () => {
      const e = (performance.now() - startRef.current) / 1000;
      setElapsed(e);
      if (e < total) raf = requestAnimationFrame(tick);
      else buzz(60);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const remaining = Math.max(0, Math.ceil(total - elapsed));
  const pct = Math.min(100, (elapsed / total) * 100);

  return (
    <motion.div {...fade} className="flex-1 flex flex-col">
      <h2 className="font-serif text-2xl mt-4">Exercício intenso</h2>
      <p className="text-body text-base mt-3 leading-relaxed">
        Escolhe um e faz por 60 segundos. O suficiente pra acelerar a respiração.
      </p>
      <ul className="mt-3 space-y-2 text-body list-disc pl-5">
        <li>Polichinelo no lugar</li>
        <li>Agachamento contínuo</li>
        <li>Corrida estacionária com joelhos altos</li>
        <li>Subir e descer escada</li>
      </ul>

      <div className="mt-8 mb-4">
        <div className="h-2 rounded-full bg-[var(--border)] overflow-hidden">
          <div
            className="h-full transition-all duration-100 ease-linear"
            style={{ width: `${pct}%`, backgroundColor: 'var(--warm)' }}
          />
        </div>
        <p className="text-muted tabular-nums text-sm mt-2 text-right">{remaining}s</p>
      </div>

      <button onClick={onBack} className="btn-secondary mt-auto">Voltar</button>
    </motion.div>
  );
}

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
