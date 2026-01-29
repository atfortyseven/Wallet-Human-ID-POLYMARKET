"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Access granted");
                router.push("/"); // Redirect to main app
                router.refresh();
            } else {
                toast.error(data.message || "Access denied");
            }
        } catch (error) {
            toast.error("Connection error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
            {/* Void Background */}
            <div className="absolute inset-0 bg-gradient-radial from-neutral-900/50 to-black" />

            {/* Animated Stars */}
            <div className="absolute inset-0">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-30 animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 20}s`,
                            animationDuration: `${20 + Math.random() * 10}s`,
                        }}
                    />
                ))}
            </div>

            {/* Login Box */}
            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-3xl p-12 shadow-2xl">
                    {/* Logo */}
                    <div className="text-center mb-10">
                        <h1 className="text-2xl font-extralight tracking-[0.5em] uppercase text-white">
                            PolyMarket
                        </h1>
                        <p className="text-xs text-neutral-500 mt-2 tracking-widest">
                            ADMIN PORTAL
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                                className="w-full bg-black/50 border border-white/10 text-white placeholder-neutral-500 p-3 rounded-lg focus:outline-none focus:border-white/40 transition-colors"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                className="w-full bg-black/50 border border-white/10 text-white placeholder-neutral-500 p-3 rounded-lg focus:outline-none focus:border-white/40 transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-black py-3 rounded-lg font-bold hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 transition-all"
                        >
                            {isLoading ? "ACCESSING..." : "ENTER"}
                        </button>
                    </form>

                    {/* Info */}
                    <p className="text-center text-xs text-neutral-600 mt-6">
                        Secure access via MongoDB Atlas
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    from {
                        transform: translateY(100vh);
                    }
                    to {
                        transform: translateY(-10vh);
                    }
                }
                .animate-float {
                    animation: float linear infinite;
                }
            `}</style>
        </div>
    );
}
