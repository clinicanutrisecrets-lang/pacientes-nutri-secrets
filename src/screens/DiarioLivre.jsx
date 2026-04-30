import { useEffect, useState } from 'react';
import { addDiario, listDiario } from '../lib/db.js';
import { buzz } from '../lib/haptic.js';

export default function DiarioLivre({ onBack }) {
  const [texto, setTexto] = useState('');
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const recarregar = async () => {
    setHistorico(await listDiario(20));
    setCarregando(false);
  };

  useEffect(() => {
    recarregar();
  }, []);

  const salvar = async () => {
    const t = texto.trim();
    if (!t) return;
    buzz(40);
    await addDiario(t);
    setTexto('');
    await recarregar();
  };

  return (
    <div className="screen safe-top safe-bottom overflow-y-auto">
      <div className="flex items-center gap-3 pb-4">
        <button onClick={onBack} aria-label="Voltar" className="text-muted p-2 -ml-2">
          <BackIcon />
        </button>
        <h1 className="h-display">Diário</h1>
      </div>
      <p className="text-muted text-sm pb-4">Sem regras. Sem certo. Só registrar.</p>

      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Hoje…"
        rows={6}
        className="w-full rounded-2xl surface p-4 text-base resize-none mb-3"
      />
      <button
        onClick={salvar}
        disabled={!texto.trim()}
        className={`btn-primary ${!texto.trim() ? 'opacity-40 pointer-events-none' : ''}`}
      >
        Salvar
      </button>

      <div className="pt-8">
        <p className="text-xs uppercase tracking-wider text-muted pb-3">Anteriores</p>
        {carregando ? null : historico.length === 0 ? (
          <p className="text-sm text-muted">Nada por aqui ainda.</p>
        ) : (
          <ul className="space-y-3">
            {historico.map((e) => (
              <li key={e.id} className="card">
                <p className="text-xs text-muted mb-2">{formatStamp(e.timestamp)}</p>
                <p className="text-base text-body whitespace-pre-wrap leading-relaxed">{e.texto}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function formatStamp(iso) {
  const d = new Date(iso);
  return d.toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
