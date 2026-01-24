import GlassLogin from "@/components/GlassLogin";
import Background from "@/components/crystalline/Background";

export default function Home() {
    return (
        <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black">

            {/* 1. EL BACKGROUND (CSS Optimized) */}
            <Background />

            {/* 2. EL CONTENIDO (Z-Index bajo para no tapar el modal de World ID) */}
            <div className="relative z-10 px-4">
                <GlassLogin />
            </div>

        </main>
    );
}
