import React from 'react';

export interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string | null;
  outOfStock?: string[];
  onSelect: (size: string) => void;
  isShaking?: boolean;
}

export function SizeSelector({
  sizes,
  selectedSize,
  outOfStock = [],
  onSelect,
  isShaking = false,
}: SizeSelectorProps): React.ReactElement {
  return (
    <div
      className={`flex flex-wrap gap-2.5 transition-transform ${
        isShaking ? 'animate-[shake_200ms_ease-in-out]' : ''
      }`}
      role="group"
      aria-label="Select Size"
    >
      {sizes.map((size) => {
        const isOutOfStock = outOfStock.includes(size);
        const isSelected = selectedSize === size;

        return (
          <button
            key={size}
            type="button"
            disabled={isOutOfStock}
            onClick={() => onSelect(size)}
            aria-pressed={isSelected}
            aria-disabled={isOutOfStock}
            className={`min-w-[48px] min-h-[44px] px-3.5 py-2 rounded-btn text-sm font-medium transition-all duration-150 cursor-pointer ${
              isOutOfStock
                ? 'opacity-40 line-through bg-bg border border-line cursor-not-allowed text-muted'
                : isSelected
                ? 'bg-ink text-surface shadow-soft'
                : 'bg-surface text-ink border border-line hover:border-ink/50'
            }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
