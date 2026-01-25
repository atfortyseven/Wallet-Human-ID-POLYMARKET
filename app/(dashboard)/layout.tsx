import OrbBackground from "@/components/world/OrbBackground";
import Masthead from "@/components/crystalline/Masthead";

export default function InternalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen bg-black overflow-x-hidden">
            {/* 1. EL GLOBO (Fondo, Centrado e Interactivo) */}
            <OrbBackground />

            {/* 2. EL CONTENIDO (Encima del globo con z-index) */}
            <div className="relative z-20">
                <Masthead />
                <main className="container mx-auto px-4 py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
