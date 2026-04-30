import { useEffect, useState } from 'react';
import { getCompromissoAtual, saveCompromisso, toggleCompromissoDia } from '../lib/db.js';
import { isoDate, startOfWeek, weekdayShort } from '../lib/date.js';
import { buzz } from '../lib/haptic.js';

export default function Compromisso({ onBack }) {
  const [compromisso, setCompromisso] = useState(null);
  const [editando, setEditando] = useState(false);
  const [texto, setTexto] = useState('');
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    let cancel = false;
    getCompromissoAtual().then((c) => {
      if (cancel) return;
      setCompromisso(c || null);
      setTexto(c?.texto || '');
      setEditando(!c);
      setCarregado(true);
    });
    return () => {
      cancel = true;
    };
  }, []);

  const salvar = async () => {
    const t = texto.trim();
    if (!t) return;
    buzz(40);
    await saveCompromisso(t);
    const c = await getCompromissoAtual();
    setCompromisso(c);
    setEditando(false);
  };

  const toggle = async (date) => {
    buzz(20);
    const updated = await toggleCompromissoDia(date);
    if (updated) setCompromisso(updated);
  };

  if (!carregado) return <div className="screen safe-top safe-bottom" />;

  const inicio = startOfWeek();
  const dias = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(inicio);
    d.setDate(d.getDate() + i);
    return d;
  });
  const hoje = isoDate();
  const feitos = new Set(compromisso?.diasFeitos || []);

  return (
    <div className="screen safe-top safe-bottom overflow-y-auto">
      <div className="flex items-center gap-3 pb-4">
        <button onClick={onBack} aria-label="Voltar" className="text-muted p-2 -ml-2">
          <BackIcon />
        </button>
        <h1 className="h-display">Compromisso</h1>
      </div>
      <p className="text-muted text-sm pb-6">
        Uma ação alinhada aos seus valores, pra essa semana. Não é sobre peso.
      </p>

      {editando ? (
        <div className="space-y-3">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value.slice(0, 140))}
            placeholder='Ex: "Comer sentado, sem tela, no almoço."'
            rows={3}
            className="w-full rounded-2xl surface p-4 text-base resize-none"
          />
          <p className="text-xs text-muted text-right">{texto.length}/140</p>
          <button
            onClick={salvar}
            disabled={!texto.trim()}
            className={`btn-primary w-full ${!texto.trim() ? 'opacity-40 pointer-events-none' : ''}`}
          >
            Definir compromisso
          </button>
          {compromisso && (
            <button onClick={() => { setEditando(false); setTexto(compromisso.texto); }} className="btn-secondary w-full">
              Cancelar
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="card mb-6">
            <p className="font-serif text-xl leading-snug text-body">“{compromisso.texto}”</p>
            <button onClick={() => setEditando(true)} className="text-sm text-muted underline mt-3">
              Editar
            </button>
          </div>

          <p className="text-sm text-body font-medium pb-3">Essa semana</p>
          <div className="grid grid-cols-7 gap-2">
            {dias.map((d) => {
              const data = isoDate(d);
              const fez = feitos.has(data);
              const isHoje = data === hoje;
              const futuro = data > hoje;
              return (
                <button
                  key={data}
                  disabled={futuro}
                  onClick={() => toggle(d)}
                  className="flex flex-col items-center gap-1 rounded-2xl py-3 transition-all border"
                  style={{
                    backgroundColor: fez ? 'var(--primary)' : 'var(--surface)',
                    borderColor: isHoje ? 'var(--primary)' : 'var(--border)',
                    color: fez ? '#fff' : 'var(--text)',
                    opacity: futuro ? 0.4 : 1
                  }}
                >
                  <span className="text-[10px] uppercase tracking-wider opacity-80">{weekdayShort(d)}</span>
                  <span className="text-base font-medium">{d.getDate()}</span>
                  {fez && <CheckIcon />}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-muted pt-4 text-center leading-relaxed">
            Sem streak. Recaída é dado, não fracasso.
          </p>
        </>
      )}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
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
