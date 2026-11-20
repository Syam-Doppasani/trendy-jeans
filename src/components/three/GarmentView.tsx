import React, { useRef, useState, useEffect } from 'react';
import { View, PerspectiveCamera, Environment, OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RotateCcw } from 'lucide-react';
import { Garment } from './Garment';
import { GarmentFallback } from './GarmentFallback';
import { GarmentType } from '../../data/products';

export interface GarmentViewProps {
  type: GarmentType;
  colorHex: string;
  fit?: string;
  productId?: string;
  name: string;
  mode?: 'card' | 'viewer';
  className?: string;
  aspect?: string;
}

// Inner scene for card mode: static with desktop hover tilt
function CardScene({
  type,
  colorHex,
  fit,
  productId,
  isHovered,
}: {
  type: GarmentType;
  colorHex: string;
  fit?: string;
  productId?: string;
  isHovered: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = isHovered ? 0.314 : -0.314; // -18 deg to +18 deg

  useFrame(({ invalidate }) => {
    if (groupRef.current) {
      const current = groupRef.current.rotation.y;
      const diff = targetRotation - current;
      if (Math.abs(diff) > 0.002) {
        groupRef.current.rotation.y += diff * 0.08;
        invalidate();
      } else {
        groupRef.current.rotation.y = targetRotation;
      }
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 3.8]} fov={45} />
      <Environment preset="studio" />
      <directionalLight position={[2, 3, 4]} intensity={1.1} />
      <ambientLight intensity={0.4} />

      <group ref={groupRef} rotation={[0, -0.314, 0]}>
        <Garment type={type} colorHex={colorHex} fit={fit} productId={productId} />
      </group>
    </>
  );
}

// Inner scene for interactive viewer mode (product page and lookbook)
function InteractiveScene({
  type,
  colorHex,
  fit,
  productId,
  controlsRef,
  isReducedMotion,
}: {
  type: GarmentType;
  colorHex: string;
  fit?: string;
  productId?: string;
  controlsRef: React.RefObject<OrbitControlsImpl>;
  isReducedMotion: boolean;
}) {
  const [autoRotate, setAutoRotate] = useState(!isReducedMotion);
  const idleTimer = useRef<number | null>(null);

  const handleStart = () => {
    setAutoRotate(false);
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
  };

  const handleEnd = () => {
    if (isReducedMotion) return;
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => {
      setAutoRotate(true);
    }, 3000);
  };

  useFrame(({ invalidate }) => {
    if (autoRotate && !isReducedMotion) {
      invalidate();
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 3.8]} fov={45} />
      <Environment preset="studio" />
      <directionalLight position={[2, 3, 4]} intensity={1.1} />
      <ambientLight intensity={0.4} />

      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.8}
        enableDamping
        dampingFactor={0.08}
        autoRotate={autoRotate && !isReducedMotion}
        autoRotateSpeed={0.8}
        onStart={handleStart}
        onEnd={handleEnd}
        makeDefault
      />

      <Garment type={type} colorHex={colorHex} fit={fit} productId={productId} />
    </>
  );
}

export function GarmentView({
  type,
  colorHex,
  fit,
  productId,
  name,
  mode = 'card',
  className = '',
  aspect = 'aspect-[3/4]',
}: GarmentViewProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasError(true);
    } catch {
      setHasError(true);
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  // Keyboard navigation for interactive viewer: Arrow Left/Right rotate 15 deg, 'R' resets
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (mode !== 'viewer' || !controlsRef.current) return;
    const step = (15 * Math.PI) / 180;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      controlsRef.current.setAzimuthalAngle(controlsRef.current.getAzimuthalAngle() - step);
      controlsRef.current.update();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      controlsRef.current.setAzimuthalAngle(controlsRef.current.getAzimuthalAngle() + step);
      controlsRef.current.update();
    } else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      controlsRef.current.reset();
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  if (hasError) {
    return (
      <div className={`relative ${aspect} ${className}`}>
        <GarmentFallback type={type} colorHex={colorHex} name={name} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={`3D view of ${name}`}
      tabIndex={mode === 'viewer' ? 0 : undefined}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor={mode === 'card' ? 'view' : 'drag'}
      className={`relative w-full ${aspect} select-none viewer-container outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-card overflow-hidden bg-bg/40 ${className}`}
    >
      <View
        track={containerRef as React.MutableRefObject<HTMLElement>}
        className="w-full h-full"
      >
        {mode === 'card' ? (
          <CardScene
            type={type}
            colorHex={colorHex}
            fit={fit}
            productId={productId}
            isHovered={isHovered}
          />
        ) : (
          <InteractiveScene
            type={type}
            colorHex={colorHex}
            fit={fit}
            productId={productId}
            controlsRef={controlsRef}
            isReducedMotion={isReducedMotion}
          />
        )}
      </View>

      {/* Reset view icon button on interactive viewer */}
      {mode === 'viewer' && (
        <button
          type="button"
          onClick={handleReset}
          aria-label="Reset 3D view"
          title="Reset view (R)"
          className="absolute bottom-3 right-3 z-20 w-9 h-9 inline-flex items-center justify-center rounded-full bg-surface/80 backdrop-blur-md border border-line text-ink hover:bg-surface shadow-soft transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
