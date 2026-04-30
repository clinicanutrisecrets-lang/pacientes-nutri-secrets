import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { loadConfig, saveConfig, markOnboarded } from '../lib/config.js';
import { buzz } from '../lib/haptic.js';

const slide = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
};

const PERFIS = [
  {
    id: 'pausa',
    titulo: 'Pausa',
    tempo: '~30s por dia',
    descricao: 'Só a pausa. Um botão. Nada mais.'
  },
  {
    id: 'reflexao',
    titulo: 'Reflexão',
    tempo: '~2-3min por dia',
    descricao: 'Pausa + check-ins curtos de manhã e à noite.'
  },
  {
    id: 'diario',
    titulo: 'Diário',
    tempo: '~5min por dia',
    descricao: 'Pausa, check-ins, registro de refeições e exercícios.'
  }
];

export default function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [perfil, setPerfil] = useState('pausa');
  const [frase, setFrase] = useState('');

  const next = () => {
    buzz(30);
    setStep((s) => s + 1);
  };

  const finish = () => {
    const cfg = loadConfig();
    saveConfig({ ...cfg, perfil, fraseAncora: frase.trim() });
    markOnboarded();
    buzz(60);
    onDone();
  };

  return (
    <div className="screen safe-top safe-bottom">
      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="0" {...slide} className="space-y-6">
              <h1 className="h-display">Oi.</h1>
              <p className="text-lg text-body leading-relaxed">
                O Pausa é uma ferramenta pra te ajudar a sair do automático com a comida.
              </p>
              <p className="text-lg text-body leading-relaxed">
                Sem cobrança, sem culpa, sem dieta.
              </p>
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="1" {...slide} className="space-y-6">
              <h2 className="h-display">Privacidade</h2>
              <p className="text-lg text-body leading-relaxed">
                Tudo o que você registrar fica só no seu celular.
              </p>
              <p className="text-base text-muted leading-relaxed">
                Nem sua nutri tem acesso, a menos que você exporte e mostre.
              </p>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="2" {...slide} className="space-y-5">
              <h2 className="h-display">Como você quer usar?</h2>
              <p className="text-base text-muted">Pode trocar depois nas configurações.</p>
              <div className="space-y-3 pt-2">
                {PERFIS.map((p) => {
                  const ativo = perfil === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        buzz(20);
                        setPerfil(p.id);
                      }}
                      className="w-full text-left rounded-2xl p-5 transition-all duration-300 ease-calm border"
                      style={{
                        backgroundColor: ativo ? 'var(--primary)' : 'var(--surface)',
                        borderColor: ativo ? 'transparent' : 'var(--border)',
                        color: ativo ? '#fff' : 'var(--text)',
                        boxShadow: ativo ? '0 4px 20px rgba(122, 155, 126, 0.18)' : 'none'
                      }}
                    >
                      <div className="flex items-baseline justify-between">
                        <span className="font-serif text-xl">{p.titulo}</span>
                        <span className="text-sm opacity-80">
                          {p.tempo}
                        </span>
                      </div>
                      <p className="text-sm mt-1 opacity-90">
                        {p.descricao}
                      </p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="3" {...slide} className="space-y-5">
              <h2 className="h-display">Frase âncora</h2>
              <p className="text-base text-body leading-relaxed">
                Escreve uma frase que te lembra por que você começou. Pode mudar depois.
              </p>
              <textarea
                value={frase}
                onChange={(e) => setFrase(e.target.value.slice(0, 140))}
                placeholder="(opcional)"
                rows={3}
                className="w-full rounded-2xl surface p-4 text-base resize-none"
              />
              <p className="text-xs text-muted text-right">{frase.length}/140</p>
            </motion.div>
          )}
          {step === 4 && (
            <motion.div key="4" {...slide} className="space-y-6">
              <h2 className="h-display">Pronto.</h2>
              <p className="text-lg text-body leading-relaxed">
                É só tocar no botão quando precisar.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3 pt-6">
        <Dots total={5} active={step} />
        <div className="flex-1" />
        {step < 4 ? (
          <button onClick={next} className="btn-primary">
            Continuar
          </button>
        ) : (
          <button onClick={finish} className="btn-primary">
            Começar
          </button>
        )}
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
          className="h-1.5 rounded-full transition-all duration-300"
          style={{
            width: i === active ? '24px' : '6px',
            backgroundColor: i === active ? 'var(--primary)' : 'var(--border)'
          }}
        />
      ))}
    </div>
  );
}
