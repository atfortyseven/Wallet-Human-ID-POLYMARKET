'use client';

import { useScroll } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';

export function VideoScrubEngine() {
  const scroll = useScroll();
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, gl, size } = useThree();
  const lastTimeRef = useRef(0);
  
  // 1. Setup Video Element with Performance Optimizations
  const [video] = useState(() => {
    if (typeof document === 'undefined') return null;
    
    // Check if mobile for initial settings
    const isMobile = window.innerWidth < 768;

    const vid = document.createElement('video');
    vid.src = '/models/kanagawa-wave.mp4'; 
    vid.crossOrigin = 'Anonymous';
    vid.loop = true; 
    vid.muted = true;
    vid.playsInline = true;
    vid.preload = 'auto'; // Force buffer
    vid.playbackRate = 0; // Manual seek only
    
    // Optimized CSS 
    vid.style.objectFit = 'cover';
    vid.style.transform = 'translate3d(0,0,0)'; 
    vid.style.willChange = 'transform'; 
    
    // Reduce CPU load on filters if on mobile
    if (!isMobile) {
        vid.style.filter = 'contrast(1.15) brightness(1.05) saturate(1.1)';
    }
    
    return vid;
  });

  // Configure WebGL for performance
  useEffect(() => {
    if (gl) {
      // Prioritize performance over perfect color accuracy on mobile
      gl.powerPreference = "high-performance";
      gl.capabilities.precision = 'mediump'; // Drop to mediump for speed
      gl.toneMappingExposure = 1.0;
    }
  }, [gl]);

  // 2. Texture Management with proper disposal
  const videoTexture = useMemo(() => {
    if (!video) return null;
    const tex = new THREE.VideoTexture(video as HTMLVideoElement);
    
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.generateMipmaps = false; 
    
    // Linear filter is fast enough on modern GPUs and looks much better
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    
    return tex;
  }, [video]);

  // Set anisotropic filtering carefully
  useEffect(() => {
    if (videoTexture && gl) {
      const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
      // Cap at 2x for mobile, 4x for desktop to save fill rate
      videoTexture.anisotropy = Math.min(2, maxAnisotropy); 
    }
  }, [videoTexture, gl]);

  // 3. Load video
  useEffect(() => {
    if (video) {
        // Force header loading
       video.currentTime = 0.001; 
    }
  }, [video]);

  // 4. MAX FLUIDITY LOOP (Uncapped)
  useFrame((state, delta) => {
    if (!scroll || !video || !video.duration || !meshRef.current) return;

    // DIRECT MAPPING: No skipping, no throttling.
    // This provides 60fps/120fps scrolling if the GPU can handle it.
    const offset = scroll.offset;
    // Clamp to ensure we never exceed duration (prevents loop glitches during scrub)
    const targetTime = Math.max(0, Math.min(video.duration, offset * video.duration));
    
    // DIRECT UPDATE: No epsilon check. 
    // This ensures even the smallest scroll micro-movement updates the video frame.
    // Essential for "Perfect" sensitivity feeling.
    video.currentTime = targetTime;
    
    // Always mark texture as needing update if we moved
    // VideoTexture internally handles 'readyState' checks
    lastTimeRef.current = targetTime;

    // --- ASPECT RATIO & ZOOM LOGIC ---
    // Modified to ensure "COVER" behavior on portrait mobile
    
    // Zoom logic
    let targetScale = 1;
    const zoomStart = 0.75;
    const zoomPeak = 0.95;
    
    if (offset > zoomStart) {
      const zoomProgress = Math.min((offset - zoomStart) / (zoomPeak - zoomStart), 1);
      if (offset < zoomPeak) {
        targetScale = 1 + Math.pow(zoomProgress, 3) * 8; 
      } else {
        const finalProgress = (offset - zoomPeak) / (1 - zoomPeak);
        targetScale = 9 + Math.pow(finalProgress, 2) * 16; 
      }
    }
    
    const currentScale = meshRef.current.scale.z; // Storing scale in Z for temp storage? No, let's just use lerp var
    // Actually, let's keep it stateless for max speed, or simple lerp
    // For smoothness, we want some damping on the ZOOM, not the video scrub
    // The video scrub must be INSTANT to match scroll. The zoom can lag slightly.
    
    const smoothScale = THREE.MathUtils.lerp(meshRef.current.userData.scale || 1, targetScale, 0.1);
    meshRef.current.userData.scale = smoothScale; // Store for next frame
    
    // COVER LOGIC
    const videoAspect = 16 / 9;
    const screenAspect = size.width / size.height;
    
    let scaleX, scaleY;
    
    // If screen is wider than video (Landscape) -> Fit width, crop height
    if (screenAspect > videoAspect) {
        scaleX = viewport.width * smoothScale;
        scaleY = (viewport.width / videoAspect) * smoothScale;
    } 
    // If screen is taller than video (Portrait Mobile) -> Fit height, crop width
    else {
        scaleY = viewport.height * smoothScale;
        scaleX = (viewport.height * videoAspect) * smoothScale;
    }

    meshRef.current.scale.set(scaleX, scaleY, 1);
  });

  if (!videoTexture) return null;

  return (
    <mesh 
      ref={meshRef} 
      position={[0, 0, -1]}
      frustumCulled={false}
    > 
      {/* 
        Using plane geometry with 1,1. 
        Texture covers it full.
      */}
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial 
        map={videoTexture} 
        toneMapped={false} // Disable tone mapping for raw performance
        side={THREE.FrontSide}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
