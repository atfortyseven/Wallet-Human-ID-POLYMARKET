"use client";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { useHumanFi } from "@/hooks/useHumanFi";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { formatEther } from "viem";

export default function RealDashboard() {
    const { isConnected } = useAccount();
    const { connect } = useConnect();
    const { claimFaucet, executeZap, castVote, votingPower, wldBalance, isPending, txHash } = useHumanFi();

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <h1 className="text-4xl font-black mb-6">Human-Fi Engine</h1>
                <button onClick={() => connect({ connector: injected() })} className="bg-black text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition">
                    Conectar Wallet
                </button>
            </div>
        );
    }

    const balance = wldBalance ? parseFloat(formatEther(wldBalance as bigint)) : 0;
    const power = votingPower ? parseFloat(formatEther(votingPower as bigint)) : 0;

    return (
        <div className="max-w-md mx-auto py-10 px-6 space-y-8 animate-in fade-in">

            {/* TARJETA DE DINERO */}
            <div className="bg-black text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600 rounded-full blur-[60px] opacity-50"></div>
                <h2 className="text-gray-400 text-xs font-bold uppercase mb-1">Tu Poder de Voto</h2>
                <div className="text-5xl font-black">{power} <span className="text-lg text-gray-500">SHARES</span></div>

                <div className="mt-8 relative z-10">
                    {balance < 10 ? (
                        <button onClick={claimFaucet} disabled={isPending} className="w-full bg-yellow-400 text-black font-bold py-4 rounded-xl shadow-lg hover:bg-yellow-300">
                            {isPending ? "Transacción..." : "💸 Reclamar 10 WLD Gratis"}
                        </button>
                    ) : (
                        <button onClick={() => executeZap("10")} disabled={isPending} className="w-full bg-white text-black font-bold py-4 rounded-xl shadow-lg hover:bg-gray-200">
                            {isPending ? "Procesando..." : "⚡ ZAP 10 WLD AHORA"}
                        </button>
                    )}
                    <p className="text-center text-xs text-gray-500 mt-3">Saldo: {balance.toFixed(2)} WLD</p>
                </div>
                {txHash && <a href={`https://sepolia-optimism.etherscan.io/tx/${txHash}`} target="_blank" className="block text-center text-xs text-blue-400 mt-4 underline">Ver en Explorer</a>}
            </div>

            {/* TARJETA DE GOBERNANZA */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xl">
                <div className="flex justify-between mb-4">
                    <h3 className="font-bold text-xl">Propuesta #1</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">ACTIVA</span>
                </div>
                <p className="text-gray-500 text-sm mb-6">¿Activar recompensas automáticas?</p>

                <IDKitWidget
                    app_id={process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`}
                    action={process.env.NEXT_PUBLIC_WLD_ACTION as string}
                    signal="1"
                    onSuccess={castVote}
                    verification_level={VerificationLevel.Orb}
                >
                    {({ open }: { open: () => void }) => (
                        <button onClick={open} disabled={power === 0} className={`w-full py-4 rounded-xl font-bold transition ${power === 0 ? "bg-gray-100 text-gray-400" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                            {power === 0 ? "⛔ Haz ZAP para Votar" : "🗳️ Votar con World ID"}
                        </button>
                    )}
                </IDKitWidget>
            </div>
        </div>
    );
}
