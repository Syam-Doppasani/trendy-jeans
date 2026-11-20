import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';

export function SceneCanvas(): React.ReactElement | null {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    // Lazy load canvas after first paint
    const timer = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  if (!hasWebGL || !mounted) return null;

  return (
    <Canvas
      id="shared-scene-canvas"
      eventSource={document.getElementById('root') as HTMLElement}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100dvh', pointerEvents: 'none' }}
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
      }}
      frameloop="demand"
    >
      <View.Port />
    </Canvas>
  );
}
