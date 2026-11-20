import React from 'react';
import { GarmentType } from '../../data/products';

export interface GarmentFallbackProps {
  type: GarmentType;
  colorHex: string;
  name?: string;
  className?: string;
}

export function GarmentFallback({
  type,
  colorHex,
  name,
  className = '',
}: GarmentFallbackProps): React.ReactElement {
  return (
    <div
      role="img"
      aria-label={`Illustration of ${name || type}`}
      className={`relative w-full h-full flex items-center justify-center p-6 ${className}`}
    >
      <svg
        viewBox="0 0 200 220"
        className="w-full h-full max-h-[85%] drop-shadow-md transition-colors duration-300"
        fill={colorHex}
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="2"
      >
        {type === 'jeans' && (
          <path d="M 50 20 L 150 20 L 160 80 L 145 200 L 115 200 L 100 90 L 85 200 L 55 200 L 40 80 Z" />
        )}
        {type === 'tshirt' && (
          <path d="M 70 20 Q 100 40 130 20 L 185 55 L 165 95 L 145 80 L 145 200 L 55 200 L 55 80 L 35 95 L 15 55 Z" />
        )}
        {type === 'shirt' && (
          <path d="M 75 25 L 100 45 L 125 25 L 180 50 L 170 150 L 150 145 L 145 205 L 55 205 L 50 145 L 30 150 L 20 50 Z" />
        )}
        {type === 'hoodie' && (
          <path d="M 80 15 Q 100 5 120 15 L 180 50 L 170 155 L 150 150 L 148 200 L 52 200 L 50 150 L 30 155 L 20 50 Z" />
        )}
        {type === 'jacket' && (
          <path d="M 70 25 L 100 45 L 130 25 L 185 55 L 175 160 L 150 155 L 145 195 L 55 195 L 50 155 L 25 160 L 15 55 Z" />
        )}
      </svg>
    </div>
  );
}
