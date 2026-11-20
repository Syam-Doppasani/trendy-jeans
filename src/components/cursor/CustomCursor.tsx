import React, { useEffect, useState, useRef } from 'react';

type CursorMode = 'default' | 'hover' | 'view' | 'drag';

export function CustomCursor(): React.ReactElement | null {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<CursorMode>('default');
  const [labelText, setLabelText] = useState<string>('');

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const ringElRef = useRef<HTMLDivElement>(null);
  const dotElRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only desktop with hover and fine pointer, not reduced motion
    const hoverFine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const checkEnabled = () => {
      setEnabled(hoverFine.matches && !reducedMotion.matches);
    };

    checkEnabled();
    hoverFine.addEventListener('change', checkEnabled);
    reducedMotion.addEventListener('change', checkEnabled);

    return () => {
      hoverFine.removeEventListener('change', checkEnabled);
      reducedMotion.removeEventListener('change', checkEnabled);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let animFrame: number;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      // Instant dot
      if (dotElRef.current) {
        dotElRef.current.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
      }

      // Check hovered target
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const viewTarget = target.closest('[data-cursor="view"]');
      const dragTarget = target.closest('[data-cursor="drag"]');
      const interactiveTarget = target.closest('button, a, input, select, textarea, [role="button"]');

      if (viewTarget) {
        setMode('view');
        setLabelText('VIEW');
      } else if (dragTarget) {
        setMode('drag');
        setLabelText('DRAG');
      } else if (interactiveTarget) {
        setMode('hover');
        setLabelText('');
      } else {
        setMode('default');
        setLabelText('');
      }
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    const updateRing = () => {
      // Lerp 0.15
      const lerp = 0.15;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerp;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerp;

      if (ringElRef.current) {
        ringElRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animFrame = requestAnimationFrame(updateRing);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    animFrame = requestAnimationFrame(updateRing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animFrame);
    };
  }, [enabled, visible]);

  if (!enabled || !visible) return null;

  // Render ring size and style based on mode
  let ringStyle = 'w-9 h-9 border border-white mix-blend-difference rounded-full';
  if (mode === 'hover') {
    ringStyle = 'w-[54px] h-[54px] border border-white mix-blend-difference rounded-full';
  } else if (mode === 'view' || mode === 'drag') {
    ringStyle =
      'w-[72px] h-[72px] bg-ink/90 text-surface text-[11px] font-semibold tracking-wider flex items-center justify-center uppercase rounded-full shadow-soft';
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* 8px instant ink dot (hidden in view/drag mode for clarity) */}
      {(mode === 'default' || mode === 'hover') && (
        <div
          ref={dotElRef}
          className="fixed top-0 left-0 w-2 h-2 rounded-full bg-ink mix-blend-difference pointer-events-none"
        />
      )}

      {/* 36px ring (or 54px hover, 72px view/drag) */}
      <div
        ref={ringElRef}
        className={`fixed top-0 left-0 pointer-events-none transition-[width,height,background-color] duration-200 ease-out flex items-center justify-center ${ringStyle}`}
      >
        {labelText && <span className="select-none">{labelText}</span>}
      </div>
    </div>
  );
}
