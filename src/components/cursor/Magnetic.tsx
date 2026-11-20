import React, { useRef, useState, useEffect } from 'react';

export interface MagneticProps {
  children: React.ReactElement;
  strength?: number;
  radius?: number;
}

export function Magnetic({
  children,
  strength = 0.25,
  radius = 80,
}: MagneticProps): React.ReactElement {
  const elRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const check = () => {
      setIsFinePointer(media.matches && !reducedMotion.matches);
    };

    check();
    media.addEventListener('change', check);
    reducedMotion.addEventListener('change', check);

    return () => {
      media.removeEventListener('change', check);
      reducedMotion.removeEventListener('change', check);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isFinePointer || !elRef.current) return;

    const rect = elRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < radius) {
      setOffset({
        x: dx * strength,
        y: dy * strength,
      });
    } else {
      setOffset({ x: 0, y: 0 });
    }
  };

  const handlePointerLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  if (!isFinePointer) {
    return children;
  }

  return (
    <div
      ref={elRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="inline-block"
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: offset.x === 0 && offset.y === 0 ? 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
      }}
    >
      {children}
    </div>
  );
}
