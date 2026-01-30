'use client';

import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useState } from 'react';

/**
 * Quantum Leap Effect (DOM Version)
 * 
 * Sapphire radial flash that activates at 85%+ scroll.
 * This component lives INSIDE the Scroll html context to access useScroll.
 */
export function QuantumLeapEffectInternal() {
  const scroll = useScroll();
  const [opacity, setOpacity] = useState(0);

  useFrame(() => {
    if (!scroll) return;
    
    const offset = scroll.offset;
    
    // Activate flash at 85%+ scroll
    if (offset >= 0.85) {
      // Map 85%-100% to opacity 0-1
      const flashProgress = (offset - 0.85) / 0.15;
      setOpacity(Math.min(flashProgress * 2, 1)); // Fast ramp-up
    } else {
      setOpacity(0);
    }
  });

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] transition-opacity duration-150"
      style={{
        opacity,
        background: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.8) 0%, rgba(6, 182, 212, 0.4) 40%, transparent 70%)',
        mixBlendMode: 'plus-lighter',
      }}
    />
  );
}
