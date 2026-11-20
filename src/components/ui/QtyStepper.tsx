import React from 'react';
import { Minus, Plus } from 'lucide-react';

export interface QtyStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function QtyStepper({
  value,
  onChange,
  min = 1,
  max = 10,
}: QtyStepperProps): React.ReactElement {
  return (
    <div className="inline-flex items-center border border-line rounded-btn bg-surface p-1">
      <button
        type="button"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        aria-label="Decrease quantity"
        className="w-10 h-10 inline-flex items-center justify-center rounded-full text-ink hover:bg-bg disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-10 text-center font-semibold text-sm tabular-nums">
        {value}
      </span>
      <button
        type="button"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        aria-label="Increase quantity"
        className="w-10 h-10 inline-flex items-center justify-center rounded-full text-ink hover:bg-bg disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
