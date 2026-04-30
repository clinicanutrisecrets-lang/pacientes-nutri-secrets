import { buzz } from '../lib/haptic.js';

export default function Menu({ perfil, onBack, onCompromisso, onRefeicao, onDiarioLivre, onExercicio, onInsights, onSettings }) {
  const items = [];

  if (perfil === 'reflexao' || perfil === 'diario') {
    items.push({ key: 'compromisso', label: 'Compromisso da semana', hint: 'ACT · binário, sem streak', onClick: onCompromisso });
  }
  if (perfil === 'diario') {
    items.push({ key: 'refeicao', label: 'Registrar refeição', hint: 'Onde, com quem, satisfação', onClick: onRefeicao });
    items.push({ key: 'diario', label: 'Diário livre', hint: 'Sem regras, só registrar', onClick: onDiarioLivre });
    items.push({ key: 'exercicio', label: 'Exercício da semana', hint: 'TCC / ACT · 3-5min', onClick: onExercicio });
  }
  items.push({ key: 'insights', label: 'Meus padrões', hint: 'Insights dos seus dados', onClick: onInsights });
  items.push({ key: 'settings', label: 'Configurações', hint: 'Perfil, frase, dados', onClick: onSettings });

  return (
    <div className="screen safe-top safe-bottom overflow-y-auto">
      <div className="flex items-center gap-3 pb-4">
        <button
          aria-label="Voltar"
          onClick={onBack}
          className="text-muted hover:text-body p-2 -ml-2 transition-colors"
        >
          <BackIcon />
        </button>
        <h1 className="h-display">Mais</h1>
      </div>

      <div className="space-y-2 pt-2">
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => {
              buzz(15);
              it.onClick();
            }}
            className="card w-full text-left active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="text-base font-medium text-body">{it.label}</div>
                <div className="text-sm text-muted mt-0.5">{it.hint}</div>
              </div>
              <ChevronIcon />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
      <path d="M9 6l6 6-6 6" />
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
