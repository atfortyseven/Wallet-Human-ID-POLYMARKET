import React, { forwardRef, useMemo } from 'react';
import { Uniform } from 'three';
import { Effect } from 'postprocessing';

// Custom Barrel Distortion Shader
const fragmentShader = `
  uniform float uDistortion;
  uniform float uPrincipalPointX;
  uniform float uPrincipalPointY;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 centered = uv - vec2(uPrincipalPointX, uPrincipalPointY);
    float r2 = dot(centered, centered);
    
    // Barrel Distortion Formula: p' = p * (1 + k * r^2)
    // If k > 0: Barrel. If k < 0: Pincushion.
    vec2 distorted = centered * (1.0 + uDistortion * r2) + vec2(uPrincipalPointX, uPrincipalPointY);
    
    // Boundary check (Black void outside distortion)
    if (distorted.x < 0.0 || distorted.x > 1.0 || distorted.y < 0.0 || distorted.y > 1.0) {
        outputColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        outputColor = texture2D(inputBuffer, distorted);
    }
  }
`;

// Define the Effect
class BarrelDistortionEffect extends Effect {
  constructor({ distortion = 0, principalPointX = 0.5, principalPointY = 0.5 } = {}) {
    super('BarrelDistortionEffect', fragmentShader, {
      uniforms: new Map([
        ['uDistortion', new Uniform(distortion)],
        ['uPrincipalPointX', new Uniform(principalPointX)],
        ['uPrincipalPointY', new Uniform(principalPointY)],
      ]),
    });
  }

  update(_renderer: any, _inputBuffer: any, _deltaTime: number) {
     // Optional: animate here if needed, but we control via Props
  }
}

// React Wrapper
// We must use 'any' for the effect type because TS struggles with custom effects
export const BarrelDistortion = forwardRef(({ distortion = 0 }: { distortion?: number }, ref) => {
  const effect = useMemo(() => new BarrelDistortionEffect({ distortion }), [distortion]);
  
  // Update uniform when prop changes
  useMemo(() => {
    effect.uniforms.get('uDistortion')!.value = distortion;
  }, [distortion, effect]);

  return <primitive ref={ref} object={effect} dispose={null} />;
});

BarrelDistortion.displayName = 'BarrelDistortion';
