import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import IntensityStep from '../flow/IntensityStep.jsx';
import EmotionStep from '../flow/EmotionStep.jsx';
import MealStep from '../flow/MealStep.jsx';
import BreathingStep from '../flow/BreathingStep.jsx';
import DecisionStep from '../flow/DecisionStep.jsx';
import { addEpisodio } from '../lib/db.js';
import { buzz } from '../lib/haptic.js';
import { bgForIntensity } from '../lib/colors.js';

const slide = {
  initial: { opacity: 0, x: 28 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -28 },
  transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
};

export default function ImpulseFlow({ config, onDone }) {
  const [step, setStep] = useState(0);
  const [intensidadeAntes, setIntensidadeAntes] = useState(5);
  const [emocao, setEmocao] = useState(null);
  const [ultimaRefeicao, setUltimaRefeicao] = useState(null);
  const [fezRespiracao, setFezRespiracao] = useState(false);
  const [intensidadeDepois, setIntensidadeDepois] = useState(null);

  // Animated background tied to intensity in the first screen
  const bg = bgForIntensity(step === 0 ? intensidadeAntes : intensidadeDepois ?? intensidadeAntes);

  useEffect(() => {
    document.body.style.transition = 'background-color 500ms ease';
    document.body.style.backgroundColor = bg;
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [bg]);

  const advance = () => {
    buzz(20);
    setStep((s) => s + 1);
  };

  const back = () => {
    buzz(15);
    if (step === 0) {
      onDone();
      return;
    }
    setStep((s) => s - 1);
  };

  const finish = async (decisao, notas) => {
    buzz(60);
    await addEpisodio({
      intensidadeAntes,
      emocao,
      ultimaRefeicao,
      fezRespiracao,
      intensidadeDepois: intensidadeDepois ?? intensidadeAntes,
      decisao,
      notas: notas || ''
    });
    onDone();
  };

  return (
    <div className="screen safe-top safe-bottom">
      <div className="flex items-center gap-3">
        <button
          aria-label="Voltar"
          onClick={back}
          className="text-cinza hover:text-grafite p-2 -ml-2 transition-colors"
        >
          <BackIcon />
        </button>
        <Dots total={5} active={step} />
      </div>

      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="0" {...slide} className="flex-1 flex flex-col">
              <IntensityStep
                title="O quão forte tá o impulso?"
                value={intensidadeAntes}
                onChange={setIntensidadeAntes}
                onContinue={advance}
              />
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="1" {...slide} className="flex-1 flex flex-col">
              <EmotionStep
                value={emocao}
                onChange={(v) => {
                  setEmocao(v);
                  setTimeout(advance, 180);
                }}
              />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="2" {...slide} className="flex-1 flex flex-col">
              <MealStep
                value={ultimaRefeicao}
                onChange={(v) => {
                  setUltimaRefeicao(v);
                  setTimeout(advance, 180);
                }}
              />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="3" {...slide} className="flex-1 flex flex-col">
              <BreathingStep
                turbo={config.modoTurbo}
                claustro={config.modoClaustro}
                onComplete={() => {
                  setFezRespiracao(true);
                  advance();
                }}
                onSkip={() => advance()}
              />
            </motion.div>
          )}
          {step === 4 && (
            <motion.div key="4" {...slide} className="flex-1 flex flex-col">
              <DecisionStep
                intensidadeAntes={intensidadeAntes}
                intensidadeDepois={intensidadeDepois ?? intensidadeAntes}
                onChangeDepois={setIntensidadeDepois}
                onDecide={finish}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Dots({ total, active }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === active ? 'w-6 bg-salvia' : 'w-1.5 bg-grafite/15'
          }`}
        />
      ))}
    </div>
  );
}

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
