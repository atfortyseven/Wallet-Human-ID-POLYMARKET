import WorldIDButton from "@/components/WorldIDButton"; // Asegúrate de que la ruta sea correcta

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Elementos decorativos de fondo (Orbes de luz) */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="z-10 w-full max-w-md">
                {/* Aquí cargamos tu componente con Glassmorphism */}
                <WorldIDButton />
            </div>

            <footer className="absolute bottom-5 text-gray-500 text-xs text-center w-full">
                Powered by Railway & World ID
            </footer>
        </main>
    );
}
