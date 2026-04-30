import { useEffect, useState } from 'react';
import { getCheckinHoje, saveCheckin } from '../lib/db.js';
import { buzz } from '../lib/haptic.js';

const ESCALA = [1, 2, 3, 4, 5];

export default function CheckinNoite({ onDone, onBack }) {
  const [diaGeral, setDiaGeral] = useState(3);
  const [vitoria, setVitoria] = useState('');
  const [dificuldade, setDificuldade] = useState('');
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    let cancel = false;
    getCheckinHoje('noite').then((c) => {
      if (cancel || !c) {
        setCarregado(true);
        return;
      }
      if (typeof c.diaGeral === 'number') setDiaGeral(c.diaGeral);
      if (c.vitoria) setVitoria(c.vitoria);
      if (c.dificuldade) setDificuldade(c.dificuldade);
      setCarregado(true);
    });
    return () => {
      cancel = true;
    };
  }, []);

  const salvar = async () => {
    buzz(40);
    await saveCheckin('noite', { diaGeral, vitoria: vitoria.trim(), dificuldade: dificuldade.trim() });
    onDone();
  };

  if (!carregado) return <div className="screen safe-top safe-bottom" />;

  return (
    <div className="screen safe-top safe-bottom overflow-y-auto">
      <div className="flex items-center gap-3 pb-4">
        <button onClick={onBack} aria-label="Voltar" className="text-muted p-2 -ml-2">
          <BackIcon />
        </button>
        <h1 className="h-display">Como foi o dia?</h1>
      </div>
      <p className="text-muted text-sm pb-6">Um minuto. Sem precisar de muito.</p>

      <div className="pb-6">
        <p className="text-sm text-body font-medium pb-3">Dia em geral</p>
        <div className="grid grid-cols-5 gap-2">
          {ESCALA.map((v) => {
            const ativo = diaGeral === v;
            return (
              <button
                key={v}
                onClick={() => {
                  setDiaGeral(v);
                  buzz(15);
                }}
                className="rounded-2xl py-4 text-base font-medium transition-all border"
                style={{
                  backgroundColor: ativo ? 'var(--primary)' : 'var(--surface)',
                  borderColor: ativo ? 'transparent' : 'var(--border)',
                  color: ativo ? '#fff' : 'var(--text)'
                }}
              >
                {v}
              </button>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-muted mt-2 px-1">
          <span>difícil</span>
          <span>leve</span>
        </div>
      </div>

      <div className="pb-6">
        <p className="text-sm text-body font-medium pb-2">Uma vitória pequena</p>
        <textarea
          value={vitoria}
          onChange={(e) => setVitoria(e.target.value.slice(0, 100))}
          placeholder="Algo que foi bom hoje. Pode ser bobinho."
          rows={2}
          className="w-full rounded-2xl surface p-4 text-base resize-none"
        />
        <p className="text-xs text-muted text-right mt-1">{vitoria.length}/100</p>
      </div>

      <div className="pb-6">
        <p className="text-sm text-body font-medium pb-2">Uma dificuldade</p>
        <textarea
          value={dificuldade}
          onChange={(e) => setDificuldade(e.target.value.slice(0, 100))}
          placeholder="Algo que pesou. Sem julgamento."
          rows={2}
          className="w-full rounded-2xl surface p-4 text-base resize-none"
        />
        <p className="text-xs text-muted text-right mt-1">{dificuldade.length}/100</p>
      </div>

      <button onClick={salvar} className="btn-primary mt-auto">Salvar</button>
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
