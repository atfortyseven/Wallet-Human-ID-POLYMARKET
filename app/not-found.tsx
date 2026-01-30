
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 text-center">
            <h1 className="text-6xl font-black text-white/10">404</h1>
            <h2 className="text-2xl font-bold text-white">Lost in the Void</h2>
            <p className="text-gray-400 max-w-sm">
                The requested resource could not be found within this dimension.
            </p>
            <Link 
                href="/"
                className="px-6 py-2 bg-white text-black font-bold rounded hover:scale-105 transition-transform"
            >
                Return Home
            </Link>
        </div>
    );
}
