import { cx } from '@/lib/util';

interface Props {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
  id?: string;
}

export function Toggle({ checked, onChange, label, description, id }: Props) {
  const inputId = id ?? `toggle-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <label htmlFor={inputId} className="flex items-center justify-between gap-4 py-2 cursor-pointer">
      <span className="flex flex-col">
        <span className="text-app font-medium">{label}</span>
        {description ? <span className="text-soft text-sm">{description}</span> : null}
      </span>
      <button
        id={inputId}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cx(
          'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
          checked ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-surface-soft)] border border-app',
        )}
      >
        <span
          className={cx(
            'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ease-out',
            checked ? 'translate-x-6' : 'translate-x-1',
          )}
        />
      </button>
    </label>
  );
}
