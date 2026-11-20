import React, { useRef, useState, useEffect } from 'react';
import { View, PerspectiveCamera, Environment, OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScroll } from 'framer-motion';
import { Garment } from './Garment';

function HeroModel({
  scrollRotationRef,
  pointerRef,
  isReducedMotion,
}: {
  scrollRotationRef: React.MutableRefObject<number>;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  isReducedMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const idleRotation = useRef(0);

  useFrame(({ invalidate }, delta) => {
    if (!groupRef.current) return;

    if (!isReducedMotion) {
      // Idle Y rotation 0.25 rad/s
      idleRotation.current += delta * 0.25;

      // X tilt follows pointer +/- 0.12 rad with lerp factor 0.08
      const targetTiltX = -pointerRef.current.y * 0.12;
      groupRef.current.rotation.x += (targetTiltX - groupRef.current.rotation.x) * 0.08;

      // Scroll-linked rotation offset from 0 to PI
      const totalY = idleRotation.current + scrollRotationRef.current;
      groupRef.current.rotation.y = totalY;

      // Gentle float: y = sin(t * 0.9) * 0.05
      const time = performance.now() * 0.001;
      groupRef.current.position.y = Math.sin(time * 0.9) * 0.05;

      invalidate();
    }
  });

  return (
    <group ref={groupRef}>
      {/* Indigo Slim Fit Jeans featured in Hero */}
      <Garment type="jeans" colorHex="#2B3F66" fit="Slim" productId="TJ-J01" />
    </group>
  );
}

export function HeroScene(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const scrollRotationRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Framer-motion scroll linked rotation: 0 to PI
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      // Rotate through PI as user scrolls through the top hero
      scrollRotationRef.current = Math.min(1, latest * 2) * Math.PI;
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isReducedMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      pointerRef.current = { x, y };
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="relative w-full h-full min-h-[380px] md:min-h-[520px] viewer-container select-none"
      data-cursor="drag"
    >
      <View
        track={containerRef as React.MutableRefObject<HTMLElement>}
        className="w-full h-full"
      >
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
        />

        <HeroModel
          scrollRotationRef={scrollRotationRef}
          pointerRef={pointerRef}
          isReducedMotion={isReducedMotion}
        />
      </View>

      {/* Touch drag hint */}
      <div className="md:hidden absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none text-[11px] text-white/50 tracking-wider uppercase font-medium bg-black/20 px-3 py-1 rounded-full backdrop-blur-xs">
        Drag to rotate
      </div>
    </div>
  );
}
