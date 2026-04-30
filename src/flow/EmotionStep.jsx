const EMOCOES = [
  { id: 'fome', label: 'Fome real', icon: FomeIcon },
  { id: 'ansiedade', label: 'Ansiedade', icon: AnsiedadeIcon },
  { id: 'tedio', label: 'Tédio', icon: TedioIcon },
  { id: 'raiva', label: 'Raiva', icon: RaivaIcon },
  { id: 'tristeza', label: 'Tristeza', icon: TristezaIcon },
  { id: 'cansaco', label: 'Cansaço', icon: CansacoIcon }
];

export default function EmotionStep({ value, onChange }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="pt-8 pb-2">
        <h2 className="h-display">O que tá rolando aí?</h2>
        <p className="text-cinza text-base mt-2">Escolhe a que mais bate agora.</p>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-3 content-center py-6">
        {EMOCOES.map(({ id, label, icon: Icon }) => {
          const ativo = value === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`rounded-2xl p-5 flex flex-col items-center justify-center gap-3 transition-all duration-300 ease-calm border ${
                ativo
                  ? 'bg-salvia text-white border-salvia shadow-soft scale-[0.98]'
                  : 'bg-neve text-grafite border-grafite/10 active:scale-95'
              }`}
            >
              <Icon active={ativo} />
              <span className="text-base font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const stroke = 1.6;

function FomeIcon({ active }) {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : '#7A9B7E'} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a4 4 0 0 1 4 4v3a4 4 0 1 1-8 0V7a4 4 0 0 1 4-4z" />
      <path d="M8 17v3" />
      <path d="M16 17v3" />
    </svg>
  );
}
function AnsiedadeIcon({ active }) {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : '#C97B5C'} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
      <path d="M3 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
    </svg>
  );
}
function TedioIcon({ active }) {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : '#8FA7B5'} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 14h8" />
      <path d="M9 9h.01" />
      <path d="M15 9h.01" />
    </svg>
  );
}
function RaivaIcon({ active }) {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : '#C97B5C'} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5l4 2" />
      <path d="M21 5l-4 2" />
      <circle cx="12" cy="14" r="7" />
      <path d="M9 16c1-1 5-1 6 0" />
    </svg>
  );
}
function TristezaIcon({ active }) {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : '#8FA7B5'} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 16c1-1.5 5-1.5 6 0" />
      <path d="M9 9h.01" />
      <path d="M15 9h.01" />
    </svg>
  );
}
function CansacoIcon({ active }) {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : '#7A9B7E'} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
