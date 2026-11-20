import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RotateCcw, MoveHorizontal } from 'lucide-react';

export interface HandControlled3DViewerProps {
  framesDir: string;
  totalFrames?: number;
  name: string;
  aspect?: string;
  dark?: boolean;
}

export function HandControlled3DViewer({
  framesDir,
  totalFrames = 24,
  name,
  aspect = 'aspect-square',
  dark = false,
}: HandControlled3DViewerProps): React.ReactElement {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPreloaded, setIsPreloaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef(0);
  const dragStartFrameRef = useRef(0);

  // Preload all 24 frames for instant 60fps hand scrubbing
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.src = `${framesDir}/${i}.webp`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount >= totalFrames) {
          setIsPreloaded(true);
        }
      };
      images.push(img);
    }

    return () => {
      images.forEach((img) => {
        img.onload = null;
      });
    };
  }, [framesDir, totalFrames]);

  // Pointer event handlers for hand swipe/drag
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture fails
    }
    dragStartXRef.current = e.clientX;
    dragStartFrameRef.current = currentFrame;
    setIsDragging(true);
    setHasInteracted(true);
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartXRef.current;
      // ~14px of hand movement advances 1 frame
      const frameDelta = Math.round(deltaX / 14);
      let nextFrame = (dragStartFrameRef.current - frameDelta) % totalFrames;
      if (nextFrame < 0) nextFrame += totalFrames;
      setCurrentFrame(nextFrame);
    },
    [isDragging, totalFrames]
  );

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
    setIsDragging(false);
  };

  const handleResetAngle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentFrame(0);
  };

  const currentAngle = Math.round((currentFrame / totalFrames) * 360);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative ${aspect} w-full rounded-card overflow-hidden select-none transition-all ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      } ${dark ? 'bg-[#080D1A]' : 'bg-[#0B1220]/5'}`}
      style={{ touchAction: 'none' }}
      aria-label={`${name} 3D interactive viewer. Drag horizontally with hand to rotate.`}
    >
      {/* Preload skeleton */}
      {!isPreloaded && (
        <div className="absolute inset-0 bg-black/10 animate-pulse pointer-events-none z-0" />
      )}

      {/* 3D Frame Image */}
      <img
        src={`${framesDir}/${currentFrame}.webp`}
        alt={`${name} at ${currentAngle}°`}
        draggable={false}
        className="w-full h-full object-cover object-center pointer-events-none"
      />

      {/* Hand Interaction Prompt (fades out after first drag) */}
      {!hasInteracted && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10 animate-bounce">
          <div className="bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-semibold border border-white/20 flex items-center gap-2 shadow-lg">
            <span className="text-sm">👆</span>
            <span>Drag horizontally to rotate 360°</span>
          </div>
        </div>
      )}

      {/* Top right badges: Angle indicator & Reset */}
      <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-2">
        <div
          className={`px-3 py-1 rounded-full text-[11px] font-semibold border shadow-xs flex items-center gap-1.5 ${
            dark
              ? 'bg-black/70 text-gold border-gold/30'
              : 'bg-surface/90 text-ink border-line'
          }`}
        >
          <MoveHorizontal className="w-3.5 h-3.5 text-gold" />
          <span>{currentAngle}°</span>
        </div>

        {currentFrame !== 0 && (
          <button
            type="button"
            onClick={handleResetAngle}
            title="Reset to front view"
            className="w-7 h-7 rounded-full bg-surface/90 text-ink border border-line shadow-xs flex items-center justify-center hover:bg-ink hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Bottom status badge */}
      <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between pointer-events-none">
        <div
          className={`px-3 py-1 rounded-full text-[11px] font-semibold shadow-xs flex items-center gap-1.5 ${
            dark ? 'bg-white/10 text-white/90 border border-white/15 backdrop-blur-md' : 'bg-surface/90 text-ink shadow-soft'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-gold" />
          <span>Hand-Controlled 3D Turntable</span>
        </div>

        {/* 360 Scrubber Track Indicator */}
        <div className="w-24 h-1.5 rounded-full bg-white/20 overflow-hidden backdrop-blur-xs">
          <div
            className="h-full bg-gold transition-all duration-75"
            style={{ width: `${((currentFrame + 1) / totalFrames) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
