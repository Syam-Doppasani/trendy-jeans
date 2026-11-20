import React from 'react';

export interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  count?: number;
}

export function Chip({ label, active = false, onClick, count }: ChipProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center min-h-[44px] px-5 py-2 rounded-btn text-sm font-medium transition-all duration-150 cursor-pointer ${
        active
          ? 'bg-ink text-surface shadow-soft'
          : 'bg-surface text-ink border border-line hover:border-ink/40'
      }`}
    >
      <span>{label}</span>
      {typeof count === 'number' && (
        <span
          className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
            active ? 'bg-surface/20 text-surface' : 'bg-bg text-muted'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
