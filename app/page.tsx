import GlassLogin from "@/components/GlassLogin";

export default function Home() {
    return (
        <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black">

            {/* 1. EL BACKGROUND (GIF) */}
            <div className="absolute inset-0 z-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/background.gif"
                    alt="Background Animation"
                    className="h-full w-full object-cover"
                />
            </div>

            {/* 2. EL CONTENIDO (Z-Index bajo para no tapar el modal de World ID) */}
            <div className="relative z-10 px-4">
                <GlassLogin />
            </div>

        </main>
    );
}
