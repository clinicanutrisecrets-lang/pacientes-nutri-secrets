import type { ChangeEvent } from 'react';

interface Props {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (next: number) => void;
  label: string;
  formatValue?: (value: number) => string;
}

export function Slider({
  value,
  min = 0,
  max = 1,
  step = 0.05,
  onChange,
  label,
  formatValue,
}: Props) {
  const handle = (e: ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value));
  const display = formatValue ? formatValue(value) : `${Math.round(value * 100)}%`;
  return (
    <label className="block py-2">
      <div className="flex items-center justify-between gap-4">
        <span className="text-app font-medium">{label}</span>
        <span className="text-soft text-sm tabular-nums">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handle}
        className="mt-2 w-full accent-[var(--color-primary)]"
      />
    </label>
  );
}
