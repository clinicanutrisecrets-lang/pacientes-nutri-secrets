const OPTIONS = [
  { id: '<2h', label: 'Faz menos de 2h' },
  { id: '2-4h', label: 'Entre 2h e 4h' },
  { id: '+4h', label: 'Mais de 4h' },
  { id: 'naoLembro', label: 'Não lembro' }
];

export default function MealStep({ value, onChange }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="pt-8 pb-2">
        <h2 className="h-display">Quando foi sua última refeição?</h2>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-3 py-6">
        {OPTIONS.map((opt) => {
          const ativo = value === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`w-full rounded-2xl p-5 text-left transition-all duration-300 ease-calm border ${
                ativo
                  ? 'bg-salvia text-white border-salvia shadow-soft'
                  : 'bg-neve text-grafite border-grafite/10 active:scale-[0.98]'
              }`}
            >
              <span className="text-base font-medium">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
