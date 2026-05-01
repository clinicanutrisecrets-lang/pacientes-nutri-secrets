import { cx } from '@/lib/util';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (next: T) => void;
  label?: string;
}

export function Segmented<T extends string>({ options, value, onChange, label }: Props<T>) {
  return (
    <div className="py-2">
      {label ? <div className="text-app font-medium mb-2">{label}</div> : null}
      <div
        role="radiogroup"
        className="grid auto-cols-fr grid-flow-col gap-1 rounded-2xl bg-[var(--color-surface-soft)] p-1 border border-app"
      >
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt.value)}
              className={cx(
                'min-h-[44px] rounded-xl text-sm transition-colors duration-300 ease-out',
                selected
                  ? 'bg-[var(--color-surface)] text-app shadow-sm'
                  : 'text-soft hover:text-app',
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
