"use client";
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from "@react-three/drei";

export default function OrbBackground() {
    return (
        <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
            {/* CAPA DE DIFUMINADO CSS (El "Blur" que pediste) */}
            <div className="absolute inset-0 backdrop-blur-[120px] bg-black/60 z-10 pointer-events-none" />

            {/* CANVAS DEL GLOBO (Centrado y Reactivo) */}
            <div className="w-full h-full absolute inset-0 z-0 pointer-events-auto">
                <Canvas camera={{ position: [0, 0, 2.5] }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f2ff" />

                    <Suspense fallback={null}>
                        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                            <Sphere args={[1, 100, 100]} scale={1}>
                                {/* Material Estilo "Orb" con distorsión sutil */}
                                <MeshDistortMaterial
                                    color="#050505"
                                    emissive="#001a1a"
                                    roughness={0.1}
                                    metalness={1}
                                    distort={0.3}
                                    speed={2}
                                />
                                {/* Malla de Red Global (Wireframe) */}
                                <meshStandardMaterial
                                    wireframe
                                    color="#00f2ff"
                                    transparent
                                    opacity={0.15}
                                />
                            </Sphere>
                        </Float>
                    </Suspense>

                    {/* PERMITE GIRARLO AL HACER CLICK/DRAG */}
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        rotateSpeed={0.6}
                    />
                </Canvas>
            </div>
        </div>
    );
}
