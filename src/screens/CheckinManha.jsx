import { useEffect, useState } from 'react';
import { getCheckinHoje, saveCheckin } from '../lib/db.js';
import { buzz } from '../lib/haptic.js';

const HUMORES = [
  { v: 1, label: 'Pesado' },
  { v: 2, label: 'Baixo' },
  { v: 3, label: 'Neutro' },
  { v: 4, label: 'Bom' },
  { v: 5, label: 'Leve' }
];

export default function CheckinManha({ onDone, onBack }) {
  const [humor, setHumor] = useState(3);
  const [sono, setSono] = useState(6);
  const [fome, setFome] = useState(5);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    let cancel = false;
    getCheckinHoje('manha').then((c) => {
      if (cancel || !c) {
        setCarregado(true);
        return;
      }
      if (c.humor) setHumor(c.humor);
      if (typeof c.sono === 'number') setSono(c.sono);
      if (typeof c.fomeAcordar === 'number') setFome(c.fomeAcordar);
      setCarregado(true);
    });
    return () => {
      cancel = true;
    };
  }, []);

  const salvar = async () => {
    buzz(40);
    await saveCheckin('manha', { humor, sono, fomeAcordar: fome });
    onDone();
  };

  if (!carregado) return <div className="screen safe-top safe-bottom" />;

  return (
    <div className="screen safe-top safe-bottom overflow-y-auto">
      <div className="flex items-center gap-3 pb-4">
        <button onClick={onBack} aria-label="Voltar" className="text-muted p-2 -ml-2">
          <BackIcon />
        </button>
        <h1 className="h-display">Bom dia.</h1>
      </div>
      <p className="text-muted text-sm pb-6">30 segundos. Sem certo nem errado.</p>

      <Section label="Como você acordou?">
        <div className="grid grid-cols-5 gap-2">
          {HUMORES.map((h) => {
            const ativo = humor === h.v;
            return (
              <button
                key={h.v}
                onClick={() => {
                  setHumor(h.v);
                  buzz(15);
                }}
                className={`rounded-2xl p-3 flex flex-col items-center gap-1 border transition-colors ${
                  ativo ? 'border-transparent text-white' : 'border-[var(--border)] text-body'
                }`}
                style={{ backgroundColor: ativo ? 'var(--primary)' : 'var(--surface)' }}
              >
                <FaceIcon v={h.v} active={ativo} />
                <span className={`text-[11px] ${ativo ? 'opacity-90' : 'text-muted'}`}>{h.label}</span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section label={`Como foi seu sono? (${sono}/10)`}>
        <input
          type="range"
          min="0"
          max="10"
          value={sono}
          onChange={(e) => {
            setSono(Number(e.target.value));
            buzz(8);
          }}
          style={{ color: 'var(--cool)' }}
        />
        <div className="flex justify-between text-xs text-muted">
          <span>terrível</span>
          <span>ótimo</span>
        </div>
      </Section>

      <Section label={`Fome ao acordar (${fome}/10)`}>
        <input
          type="range"
          min="0"
          max="10"
          value={fome}
          onChange={(e) => {
            setFome(Number(e.target.value));
            buzz(8);
          }}
          style={{ color: 'var(--primary)' }}
        />
        <div className="flex justify-between text-xs text-muted">
          <span>nenhuma</span>
          <span>muita</span>
        </div>
      </Section>

      <button onClick={salvar} className="btn-primary mt-auto">Salvar</button>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div className="pb-6">
      <p className="text-sm text-body font-medium pb-3">{label}</p>
      {children}
    </div>
  );
}

function FaceIcon({ v, active }) {
  const color = active ? '#fff' : 'currentColor';
  const eyes = (
    <>
      <circle cx="9" cy="10" r="0.8" fill={color} />
      <circle cx="15" cy="10" r="0.8" fill={color} />
    </>
  );
  let mouth;
  if (v === 1) mouth = <path d="M9 16c1-2 5-2 6 0" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" />;
  else if (v === 2) mouth = <path d="M9 15c1-1 5-1 6 0" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" />;
  else if (v === 3) mouth = <path d="M9 14h6" stroke={color} strokeWidth="1.4" strokeLinecap="round" />;
  else if (v === 4) mouth = <path d="M9 14c1 1 5 1 6 0" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" />;
  else mouth = <path d="M9 13c1 2 5 2 6 0" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" />;
  return (
    <svg width="28" height="28" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9.5" fill="none" stroke={color} strokeWidth="1.4" />
      {eyes}
      {mouth}
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
