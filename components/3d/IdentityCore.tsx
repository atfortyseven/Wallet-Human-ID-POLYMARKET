'use client';
import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Colores según el modo del Feed
const MODE_COLORS = {
    LIVE: '#00f2ea',   // Cyan (Normal)
    WHALES: '#8b5cf6', // Violeta (Misterio)
    GAS: '#ef4444',    // Rojo (Alerta/Calor)
    GOV: '#f59e0b',    // Dorado (Poder)
    YIELD: '#10b981'   // Verde (Dinero)
};

// WebGL Detection Function
function isWebGLAvailable(): boolean {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('webgl2') || canvas.getContext('experimental-webgl');
        return !!gl;
    } catch (e) {
        return false;
    }
}

interface CoreProps {
    mode: string;
}

function CoreMesh({ mode }: CoreProps) {
    const mesh = useRef<THREE.Mesh>(null);
    const innerMesh = useRef<THREE.Mesh>(null);

    // Color objetivo (para transiciones suaves)
    const targetColor = new THREE.Color(MODE_COLORS[mode as keyof typeof MODE_COLORS] || '#00f2ea');

    useFrame((state, delta) => {
        if (!mesh.current || !innerMesh.current) return;

        // 1. SEGUIMIENTO DEL MOUSE (Suave como la seda)
        // Usamos 'lerp' para que el movimiento tenga inercia y peso
        const { x, y } = state.mouse;

        mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, y * 0.5, 0.05);
        mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, x * 0.5, 0.05);

        // 2. ANIMACIÓN "RESPIRACIÓN" (El núcleo interior pulsa)
        const t = state.clock.getElapsedTime();
        innerMesh.current.scale.setScalar(0.5 + Math.sin(t * 2) * 0.05);

        // 3. TRANSICIÓN DE COLOR
        // El material interior cambia de color suavemente según la pestaña
        (innerMesh.current.material as THREE.MeshStandardMaterial).color.lerp(targetColor, 0.05);
        (innerMesh.current.material as THREE.MeshStandardMaterial).emissive.lerp(targetColor, 0.05);
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            {/* CÁSCARA EXTERIOR (CRISTAL) - SCALED DOWN 30% */}
            <mesh ref={mesh} scale={[1.75, 1.75, 1.75]}>
                {/* Un octaedro se ve más sci-fi que un cubo simple */}
                <octahedronGeometry args={[1.5, 0]} />
                <MeshTransmissionMaterial
                    backside
                    samples={4}       // Calidad del cristal
                    thickness={0.5}   // Grosor
                    roughness={0.1}   // Pulido
                    chromaticAberration={0.4} // Ese efecto arcoiris en los bordes
                    anisotropy={0.3}
                    color="#ffffff"
                    resolution={512}
                />

                {/* ALMA INTERNA (TUS DATOS) */}
                <mesh ref={innerMesh} scale={[0.5, 0.5, 0.5]}>
                    <sphereGeometry args={[0.8, 32, 32]} />
                    <meshStandardMaterial
                        color="#00f2ea"
                        emissive="#00f2ea"
                        emissiveIntensity={3}
                        wireframe
                        toneMapped={false}
                    />
                </mesh>
            </mesh>

            {/* PARTÍCULAS DE ENERGÍA (ADAPTATIVAS) */}
            <Sparkles count={80} scale={5.6} size={4} speed={0.4} opacity={0.6} color={targetColor} />

            {/* CHISPAS VERDES EXTRA (SOLICITUD USER) */}
            <Sparkles
                count={150}
                scale={7}
                size={3}
                speed={0.8}
                opacity={0.8}
                color="#10b981" // Emerald Green fijo
                noise={0.5}
            />
        </Float>
    );
}

// CSS-Only Fallback Component
function FallbackBackground() {
    return (
        <div className="w-full h-full relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-emerald-900/20 animate-pulse"
                style={{ animationDuration: '4s' }} />

            {/* Glowing orbs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
                style={{ animationDuration: '3s' }} />
            <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
                style={{ animationDuration: '5s', animationDelay: '1s' }} />
            <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"
                style={{ animationDuration: '4s', animationDelay: '2s' }} />
        </div>
    );
}

interface IdentityCoreProps {
    mode?: string;
}

export default function IdentityCore({ mode = 'LIVE' }: IdentityCoreProps) {
    const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);

    useEffect(() => {
        // Check WebGL support on mount
        setWebGLSupported(isWebGLAvailable());
    }, []);

    // Loading state
    if (webGLSupported === null) {
        return <FallbackBackground />;
    }

    // WebGL not supported - use CSS fallback
    if (!webGLSupported) {
        console.warn('WebGL not supported, using CSS fallback');
        return <FallbackBackground />;
    }

    // WebGL supported - render Three.js scene
    return (
        <div className="w-full h-full pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 8], fov: 45 }}
                gl={{ alpha: true }}
                onCreated={(state) => {
                    // Additional safety check
                    if (!state.gl) {
                        console.error('WebGL context creation failed');
                    }
                }}
            >
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <Environment preset="city" />
                <CoreMesh mode={mode} />
            </Canvas>
        </div>
    );
}
