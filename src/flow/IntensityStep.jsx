import { accentForIntensity } from '../lib/colors.js';
import { buzz } from '../lib/haptic.js';

export default function IntensityStep({ title, value, onChange, onContinue, dark = false }) {
  const accent = accentForIntensity(value, dark);

  return (
    <div className="flex-1 flex flex-col">
      <div className="pt-8 pb-2">
        <h2 className="h-display">{title}</h2>
        <p className="text-muted text-base mt-2">0 é nada, 10 é insuportável.</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div
          className="font-serif text-[120px] leading-none transition-colors duration-500 tabular-nums"
          style={{ color: accent }}
        >
          {value}
        </div>
        <div className="w-full px-2" style={{ color: accent }}>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={value}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v !== value) buzz(10);
              onChange(v);
            }}
            aria-label="Intensidade do impulso"
          />
          <div className="flex justify-between text-xs text-muted mt-2">
            <span>0</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>
      </div>

      <button onClick={onContinue} className="btn-primary mt-6">
        Continuar
      </button>
    </div>
  );
}
