'use client';

import { useScroll } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';

export function VideoScrubEngine() {
  const scroll = useScroll();
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, gl } = useThree();
  const lastTimeRef = useRef(0);
  const frameSkipRef = useRef(0);
  const lastUpdateTime = useRef(0);
  
  // 1. Setup Video Element with Performance Optimizations
  const [video] = useState(() => {
    if (typeof document === 'undefined') return null;
    
    const vid = document.createElement('video');
    vid.src = '/models/kanagawa-wave.mp4'; 
    vid.crossOrigin = 'Anonymous';
    vid.loop = true; 
    vid.muted = true;
    vid.playsInline = true;
    vid.preload = 'auto';
    vid.playbackRate = 0;
    vid.preservesPitch = false;
    
    // Optimized CSS for performance
    vid.style.filter = 'contrast(1.15) brightness(1.05) saturate(1.1)';
    vid.style.objectFit = 'cover';
    vid.style.transform = 'translate3d(0,0,0)'; // Force GPU layer
    vid.style.backfaceVisibility = 'hidden';
    vid.style.imageRendering = 'high-quality';
    vid.style.willChange = 'transform'; // Hint to browser for optimization
    
    return vid;
  });

  // Configure WebGL for balanced quality/performance
  useEffect(() => {
    if (gl) {
      gl.outputColorSpace = THREE.SRGBColorSpace;
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.0;
      // Enable hardware acceleration hints
      gl.capabilities.precision = 'highp';
    }
  }, [gl]);

  // 2. Optimized Video Texture - Adaptive Quality
  const videoTexture = useMemo(() => {
    if (!video) return null;
    const tex = new THREE.VideoTexture(video as HTMLVideoElement);
    
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter; // Changed from mipmap to reduce processing
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false; // Disabled for performance
    tex.format = THREE.RGBAFormat;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    
    return tex;
  }, [video]);

  // Set anisotropy based on GPU but limit for performance
  useEffect(() => {
    if (videoTexture && gl) {
      const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
      videoTexture.anisotropy = Math.min(4, maxAnisotropy); // Limited to 4 for performance
    }
  }, [videoTexture, gl]);

  // 3. Load video metadata
  useEffect(() => {
    if (video) {
      video.load();
      
      // Preload first frame
      video.addEventListener('loadedmetadata', () => {
        video.currentTime = 0.001;
      }, { once: true });
    }
  }, [video]);

  // 4. ULTRA-OPTIMIZED CORE LOOP
  useFrame((state, delta) => {
    if (!scroll || !video || !video.duration || !meshRef.current) return;

    // AGGRESSIVE frame skipping: Only update every 2 out of 3 frames for smoother performance
    const now = state.clock.elapsedTime;
    frameSkipRef.current++;
    const shouldUpdate = frameSkipRef.current % 2 === 0; // Skip 1 out of 2 frames
    
    if (!shouldUpdate) return;

    const offset = scroll.offset;
    
    // --- A. ULTRA-OPTIMIZED SCRUBBING: Reduce texture updates ---
    const targetTime = offset * video.duration;
    const timeDiff = Math.abs(video.currentTime - targetTime);
    
    // Only seek if difference is VERY significant (reduces GPU load massively)
    if (timeDiff > 0.033) { // ~2 frames at 60fps - less frequent updates
      video.currentTime = targetTime;
      
      // Throttle texture updates to max 30fps
      if (videoTexture && now - lastUpdateTime.current > 0.033) {
        videoTexture.needsUpdate = true;
        lastUpdateTime.current = now;
      }
    }
    
    lastTimeRef.current = targetTime;
    
    // --- B. HIGHLY OPTIMIZED ZOOM: Reduced max zoom for performance ---
    let targetScale = 1;
    const zoomStart = 0.75;
    const zoomPeak = 0.95;
    
    // Early bailout if not in zoom range
    if (offset < zoomStart) {
      meshRef.current.scale.set(viewport.width, viewport.height, 1);
      return;
    }
    
    if (offset > zoomStart) {
      const zoomProgress = Math.min((offset - zoomStart) / (zoomPeak - zoomStart), 1);
      
      // Ultra-smooth zoom curve with MUCH lower max zoom
      if (offset < zoomPeak) {
        // Gentle cubic easing
        targetScale = 1 + Math.pow(zoomProgress, 2.5) * 8; // Max 9x at peak
      } else {
        // Final zoom phase - smooth quartic easing
        const finalProgress = (offset - zoomPeak) / (1 - zoomPeak);
        targetScale = 9 + Math.pow(finalProgress, 2) * 16; // Max 25x total (reduced from 80x)
      }
    }
    
    // Faster, more responsive lerp
    const currentScale = meshRef.current.scale.x / viewport.width;
    const smoothScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.2); // Increased responsiveness
    
    // --- C. Optimized Aspect Ratio Calculation ---
    const videoAspect = 16 / 9;
    const viewportAspect = viewport.width / viewport.height;
    
    let scaleX = viewport.width * smoothScale;
    let scaleY = viewport.height * smoothScale;
    
    // Fast aspect ratio fix
    if (viewportAspect > videoAspect) {
      scaleY = scaleX / videoAspect;
    } else {
      scaleX = scaleY * videoAspect;
    }
    
    // Direct scale application (no intermediate calculations)
    meshRef.current.scale.set(scaleX, scaleY, 1);
  });

  if (!videoTexture) return null;

  return (
    <mesh 
      ref={meshRef} 
      position={[0, 0, -1]}
      frustumCulled={false} // Prevent culling during zoom
    > 
      <planeGeometry args={[1, 1]} /> {/* Minimal geometry for max performance */}
      <meshBasicMaterial 
        map={videoTexture} 
        toneMapped={true}
        side={THREE.FrontSide} // Only render front (performance)
        transparent={false}
        depthWrite={false} // Optimization: no depth writing needed
        depthTest={false}  // Optimization: always render on top
        precision="mediump" // Balanced precision
      />
    </mesh>
  );
}
