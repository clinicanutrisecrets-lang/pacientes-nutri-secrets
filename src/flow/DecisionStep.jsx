import { useState, useEffect } from 'react';
import { accentForIntensity } from '../lib/colors.js';
import { buzz } from '../lib/haptic.js';

export default function DecisionStep({
  intensidadeAntes,
  intensidadeDepois,
  onChangeDepois,
  onDecide,
  dark = false
}) {
  const [valor, setValor] = useState(intensidadeDepois);
  const [notas, setNotas] = useState('');

  useEffect(() => {
    onChangeDepois(valor);
  }, [valor, onChangeDepois]);

  const accent = accentForIntensity(valor, dark);
  const delta = valor - intensidadeAntes;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="pt-8 pb-2">
        <h2 className="h-display">E agora, como você tá?</h2>
        <p className="text-muted text-base mt-2">Mesma escala, sem pressa.</p>
      </div>

      <div className="py-6 flex flex-col items-center gap-4">
        <div className="flex items-baseline gap-3">
          <span className="text-muted font-serif text-2xl">{intensidadeAntes}</span>
          <span className="text-muted">→</span>
          <span
            className="font-serif text-6xl leading-none transition-colors duration-500 tabular-nums"
            style={{ color: accent }}
          >
            {valor}
          </span>
        </div>
        <div className="w-full px-2" style={{ color: accent }}>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={valor}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v !== valor) buzz(10);
              setValor(v);
            }}
            aria-label="Intensidade depois da pausa"
          />
        </div>
        {delta < 0 && (
          <p className="text-sm" style={{ color: 'var(--primary-strong)' }}>
            Caiu {Math.abs(delta)} {Math.abs(delta) === 1 ? 'ponto' : 'pontos'}. Curioso, né?
          </p>
        )}
        {delta === 0 && (
          <p className="text-sm text-muted">Continua igual. Isso também é dado.</p>
        )}
        {delta > 0 && (
          <p className="text-sm text-muted">Subiu um pouco. Tudo bem.</p>
        )}
      </div>

      <textarea
        value={notas}
        onChange={(e) => setNotas(e.target.value.slice(0, 280))}
        placeholder="Quer escrever alguma coisa? (opcional)"
        rows={2}
        className="w-full rounded-2xl surface p-4 text-sm resize-none mb-4"
      />

      <div className="space-y-3 pb-2">
        <p className="text-sm text-muted text-center">As três opções são vitória.</p>
        <button
          onClick={() => onDecide('comer', notas)}
          className="btn-primary w-full"
        >
          Vou comer com consciência
        </button>
        <button
          onClick={() => onDecide('esperar', notas)}
          className="btn-secondary w-full"
        >
          Vou esperar 10 minutos
        </button>
        <button
          onClick={() => onDecide('substituir', notas)}
          className="btn-secondary w-full"
        >
          Vou substituir por água, chá ou atividade
        </button>
      </div>
    </div>
  );
}
