'use client';

import React, { useRef } from 'react';
import { useGLTF, useScroll, Environment } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
// Importamos el material personalizado
import './shaders/SapphireShaderMaterial';

export function KanagawaEngine() {
  // Config: Load GLB with Draco decoder (Critical for 4MB file)
  const { nodes } = useGLTF('/models/kanagawa-wave.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
  const scroll = useScroll();
  const materialRef = useRef<any>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!materialRef.current || !scroll) return;

    // 1. Actualizar tiempo para animaciones sutiles
    materialRef.current.uTime += delta;

    // 2. Conectar el offset del scroll al uniform del shader
    // Usamos lerp para suavizar el movimiento de la rueda del ratón
    materialRef.current.uScrollProgress = THREE.MathUtils.lerp(
        materialRef.current.uScrollProgress,
        scroll.offset, // Valor entre 0 y 1 dependiendo de dónde estés en la página
        0.08 // Factor de suavizado (menor = más lento/pesado)
    );

  // 3. Rotación sutil de seguimiento del ratón (Efecto MetaMask)
    if (meshRef.current) {
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
            meshRef.current.rotation.y,
            state.mouse.x * 0.3, // Rotación sutil en Y
            0.05
        );
         meshRef.current.rotation.x = THREE.MathUtils.lerp(
            meshRef.current.rotation.x,
            state.mouse.y * 0.1, // Rotación muy sutil en X
            0.05
        );
    }
  });

  // Dynamic Mesh Finding (Safe for any GLB structure)
  const waveMesh = nodes.Ola || Object.values(nodes).find((node: any) => node.isMesh);

  return (
    <group dispose={null}>
      {/* Fallback check in case 'Ola' is not the exact name in the new compressed GLB */}
      {waveMesh && (
        <mesh ref={meshRef} geometry={(waveMesh as THREE.Mesh).geometry} scale={0.15} position={[0, -2, 0]} rotation={[0, -1.57, 0]}>
            {/* Usamos el material personalizado que extendimos */}
            <sapphireShaderMaterial
            ref={materialRef}
            transparent={true}
            side={THREE.DoubleSide}
            // @ts-ignore - TS doesn't know about the extended material props yet
            uColor={new THREE.Color('#3b0764')} // Deep Purple base
            />
        </mesh>
      )}
      
      {/* Entorno de estudio para reflejos de lujo */}
      <Environment preset="studio" blur={0.8} />
    </group>
  );
}
