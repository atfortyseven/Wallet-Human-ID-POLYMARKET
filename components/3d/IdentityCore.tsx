'use client';
import { useRef } from 'react';
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
            {/* CÁSCARA EXTERIOR (CRISTAL) */}
            <mesh ref={mesh}>
                {/* Un octaedro se ve más sci-fi que un cubo simple */}
                <octahedronGeometry args={[1.2, 0]} />
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

            {/* PARTÍCULAS DE ENERGÍA */}
            <Sparkles count={50} scale={3} size={2} speed={0.4} opacity={0.5} color={targetColor} />
        </Float>
    );
}

export default function IdentityCore({ mode = 'LIVE' }: { mode: string }) {
    return (
        <div className="w-full h-full">
            <Canvas camera={{ position: [0, 0, 4], fov: 45 }} gl={{ alpha: true }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <Environment preset="city" />
                <CoreMesh mode={mode} />
            </Canvas>
        </div>
    );
}
