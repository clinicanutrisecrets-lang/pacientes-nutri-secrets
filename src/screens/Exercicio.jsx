import { useEffect, useMemo, useState } from 'react';
import { firstEpisodeDate, getExercicioAtual, saveExercicio } from '../lib/db.js';
import { exercicioDaSemana } from '../lib/exercises.js';
import { buzz } from '../lib/haptic.js';
import { startOfWeek } from '../lib/date.js';

export default function Exercicio({ onBack }) {
  const [resposta, setResposta] = useState('');
  const [weeks, setWeeks] = useState(0);
  const [carregado, setCarregado] = useState(false);
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    let cancel = false;
    Promise.all([firstEpisodeDate(), getExercicioAtual()]).then(([first, atual]) => {
      if (cancel) return;
      const ref = first ? startOfWeek(first) : startOfWeek();
      const now = startOfWeek();
      const diffMs = now - ref;
      const w = Math.max(0, Math.round(diffMs / (7 * 86_400_000)));
      setWeeks(w);
      if (atual?.resposta) {
        setResposta(atual.resposta);
        setSalvo(true);
      }
      setCarregado(true);
    });
    return () => {
      cancel = true;
    };
  }, []);

  const exercicio = useMemo(() => exercicioDaSemana(weeks), [weeks]);

  const salvar = async () => {
    const t = resposta.trim();
    if (!t) return;
    buzz(40);
    await saveExercicio(exercicio.id, t);
    setSalvo(true);
  };

  if (!carregado) return <div className="screen safe-top safe-bottom" />;

  return (
    <div className="screen safe-top safe-bottom overflow-y-auto">
      <div className="flex items-center gap-3 pb-4">
        <button onClick={onBack} aria-label="Voltar" className="text-muted p-2 -ml-2">
          <BackIcon />
        </button>
        <h1 className="h-display">Exercício</h1>
      </div>
      <p className="text-muted text-xs uppercase tracking-wider pb-1">
        Semana de {formatWeek()} · {exercicio.abordagem}
      </p>
      <h2 className="font-serif text-2xl leading-tight pb-3">{exercicio.titulo}</h2>
      <p className="text-body text-base leading-relaxed pb-4">{exercicio.descricao}</p>

      <textarea
        value={resposta}
        onChange={(e) => {
          setResposta(e.target.value);
          if (salvo) setSalvo(false);
        }}
        placeholder={exercicio.placeholder}
        rows={8}
        className="w-full rounded-2xl surface p-4 text-base resize-none mb-3"
      />
      <button
        onClick={salvar}
        disabled={!resposta.trim()}
        className={`btn-primary ${!resposta.trim() ? 'opacity-40 pointer-events-none' : ''}`}
      >
        {salvo ? 'Salvo · atualizar' : 'Salvar'}
      </button>
      {salvo && <p className="text-xs text-muted text-center pt-3">Você pode voltar e editar a qualquer momento.</p>}
    </div>
  );
}

function formatWeek() {
  return startOfWeek().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
