import React from 'react';
import { ProductColor } from '../../data/products';

export interface SwatchProps {
  color: ProductColor;
  selected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function Swatch({
  color,
  selected = false,
  onClick,
  size = 'md',
}: SwatchProps): React.ReactElement {
  const sizeClass = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';

  return (
    <button
      type="button"
      onClick={onClick}
      title={color.name}
      aria-label={`Select color ${color.name}`}
      className={`relative rounded-full transition-transform duration-150 min-h-[44px] min-w-[44px] inline-flex items-center justify-center cursor-pointer ${
        selected ? 'scale-110' : 'hover:scale-105'
      }`}
    >
      <span
        className={`rounded-full border border-black/10 transition-all ${sizeClass} ${
          selected ? 'ring-2 ring-gold ring-offset-2 ring-offset-bg' : ''
        }`}
        style={{ backgroundColor: color.hex }}
      />
    </button>
  );
}
