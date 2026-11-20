import React, { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { GarmentType } from '../../data/products';
import { getGarmentTextures } from '../../lib/garmentTextures';

export interface GarmentProps {
  type: GarmentType;
  colorHex: string;
  fit?: string;
  productId?: string;
  modelUrl?: string | null;
}

export function Garment({
  type,
  colorHex,
  fit,
  productId,
}: GarmentProps): React.ReactElement {
  const frontMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const backMatRef = useRef<THREE.MeshStandardMaterial>(null);

  // Generate procedural textures
  const textures = useMemo(() => {
    return getGarmentTextures(type, colorHex, fit, productId);
  }, [type, colorHex, fit, productId]);

  // Plane geometry: 2.4 x 2.4 with 96x96 segments
  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(2.4, 2.4, 96, 96);
  }, []);

  // Lerp material color over 300ms on color change
  const targetColor = useMemo(() => new THREE.Color(colorHex), [colorHex]);
  const isColorTransitioning = useRef(false);
  const transitionStart = useRef(0);

  useEffect(() => {
    if (frontMatRef.current && backMatRef.current) {
      frontMatRef.current.map = textures.colorTexture;
      backMatRef.current.map = textures.colorTexture;
      frontMatRef.current.needsUpdate = true;
      backMatRef.current.needsUpdate = true;
      isColorTransitioning.current = true;
      transitionStart.current = performance.now();
    }
  }, [textures]);

  useFrame(({ invalidate }) => {
    if (isColorTransitioning.current && frontMatRef.current && backMatRef.current) {
      const elapsed = performance.now() - transitionStart.current;
      const progress = Math.min(1, elapsed / 300);

      frontMatRef.current.color.lerp(targetColor, 0.15);
      backMatRef.current.color.lerp(targetColor, 0.15);

      invalidate();

      if (progress >= 1) {
        frontMatRef.current.color.copy(targetColor);
        backMatRef.current.color.copy(targetColor);
        isColorTransitioning.current = false;
      }
    }
  });

  // Cleanup geometries on unmount
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  return (
    <group position={[0, 0.05, 0]}>
      {/* Front mesh */}
      <mesh geometry={geometry} position={[0, 0, 0.015]}>
        <meshStandardMaterial
          ref={frontMatRef}
          map={textures.colorTexture}
          alphaMap={textures.silhouetteTexture}
          alphaTest={0.5}
          side={THREE.DoubleSide}
          displacementMap={textures.heightTexture}
          displacementScale={0.32}
          roughness={0.88}
          metalness={0}
        />
      </mesh>

      {/* Back mesh (rotated PI on Y) */}
      <mesh geometry={geometry} position={[0, 0, -0.015]} rotation={[0, Math.PI, 0]}>
        <meshStandardMaterial
          ref={backMatRef}
          map={textures.colorTexture}
          alphaMap={textures.silhouetteTexture}
          alphaTest={0.5}
          side={THREE.DoubleSide}
          displacementMap={textures.heightTexture}
          displacementScale={-0.32}
          roughness={0.88}
          metalness={0}
        />
      </mesh>

      {/* Ground contact shadow */}
      <ContactShadows
        opacity={0.35}
        blur={2.5}
        scale={6}
        position={[0, -1.35, 0]}
      />
    </group>
  );
}
