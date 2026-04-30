import { useState } from 'react';
import { addRefeicao } from '../lib/db.js';
import { buzz } from '../lib/haptic.js';

const ONDE = [
  { id: 'casa', label: 'Em casa' },
  { id: 'trabalho', label: 'Trabalho' },
  { id: 'rua', label: 'Na rua' },
  { id: 'outros', label: 'Outro' }
];

const COM_QUEM = [
  { id: 'sozinho', label: 'Sozinho(a)' },
  { id: 'familia', label: 'Família' },
  { id: 'amigos', label: 'Amigos' },
  { id: 'colegas', label: 'Colegas' }
];

export default function Refeicao({ onDone, onBack }) {
  const [onde, setOnde] = useState(null);
  const [comQuem, setComQuem] = useState(null);
  const [comPressa, setComPressa] = useState(false);
  const [comTela, setComTela] = useState(false);
  const [satisfacao, setSatisfacao] = useState(3);

  const podeSalvar = onde && comQuem;

  const salvar = async () => {
    if (!podeSalvar) return;
    buzz(40);
    await addRefeicao({ onde, comQuem, comPressa, comTela, satisfacao });
    onDone();
  };

  return (
    <div className="screen safe-top safe-bottom overflow-y-auto">
      <div className="flex items-center gap-3 pb-4">
        <button onClick={onBack} aria-label="Voltar" className="text-muted p-2 -ml-2">
          <BackIcon />
        </button>
        <h1 className="h-display">Refeição</h1>
      </div>
      <p className="text-muted text-sm pb-6">Sem calorias. Só contexto.</p>

      <Section label="Onde?">
        <ChipGrid options={ONDE} value={onde} onChange={(v) => { setOnde(v); buzz(15); }} />
      </Section>

      <Section label="Com quem?">
        <ChipGrid options={COM_QUEM} value={comQuem} onChange={(v) => { setComQuem(v); buzz(15); }} />
      </Section>

      <Section label="Como foi?">
        <Toggle label="Com pressa" value={comPressa} onChange={setComPressa} />
        <Toggle label="Com tela (TV, celular)" value={comTela} onChange={setComTela} />
      </Section>

      <Section label={`Satisfação (${satisfacao}/5)`}>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((v) => {
            const ativo = satisfacao === v;
            return (
              <button
                key={v}
                onClick={() => {
                  setSatisfacao(v);
                  buzz(12);
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
          <span>vazia</span>
          <span>plena</span>
        </div>
      </Section>

      <button
        onClick={salvar}
        disabled={!podeSalvar}
        className={`btn-primary mt-auto ${!podeSalvar ? 'opacity-40 pointer-events-none' : ''}`}
      >
        Salvar
      </button>
    </div>
  );
}

function ChipGrid({ options, value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => {
        const ativo = value === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className="rounded-2xl px-3 py-3 text-sm font-medium transition-all border"
            style={{
              backgroundColor: ativo ? 'var(--primary)' : 'var(--surface)',
              borderColor: ativo ? 'transparent' : 'var(--border)',
              color: ativo ? '#fff' : 'var(--text)'
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <button
      onClick={() => {
        onChange(!value);
        buzz(12);
      }}
      className="w-full flex items-center justify-between py-2"
    >
      <span className="text-base text-body">{label}</span>
      <div
        className="relative w-12 h-7 rounded-full transition-colors duration-300"
        style={{ backgroundColor: value ? 'var(--primary)' : 'var(--border)' }}
      >
        <div
          className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300"
          style={{ transform: value ? 'translateX(20px)' : 'translateX(0)' }}
        />
      </div>
    </button>
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

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
