import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseEther, erc20Abi, maxUint256 } from "viem";

// ABIs Mínimos
const MOCK_WLD_ABI = [
    { name: "faucet", type: "function", stateMutability: "nonpayable", inputs: [], outputs: [] },
    { name: "balanceOf", type: "function", stateMutability: "view", inputs: [{ name: "", type: "address" }], outputs: [{ name: "", type: "uint256" }] }
] as const;

const HUMANFI_ABI = [
    { name: "zap", type: "function", stateMutability: "nonpayable", inputs: [{ name: "amount", type: "uint256" }], outputs: [] },
    {
        name: "voteWithWorldID", type: "function", stateMutability: "nonpayable", inputs: [
            { name: "root", type: "uint256" },
            { name: "nullifierHash", type: "uint256" },
            { name: "proof", type: "uint256[8]" }
        ], outputs: []
    },
    { name: "votingPower", type: "function", stateMutability: "view", inputs: [{ name: "", type: "address" }], outputs: [{ name: "", type: "uint256" }] }
] as const;

const HUMANFI_ADDRESS = process.env.NEXT_PUBLIC_HUMANFI_CONTRACT as `0x${string}`;
const WLD_TOKEN = process.env.NEXT_PUBLIC_WLD_TOKEN as `0x${string}`;

export function useHumanFi() {
    const { address } = useAccount();
    const { writeContract, data: hash, isPending } = useWriteContract();

    // Lecturas de estado
    const { data: wldBalance } = useReadContract({
        address: WLD_TOKEN, abi: MOCK_WLD_ABI, functionName: "balanceOf", args: [address!], query: { enabled: !!address }
    });
    const { data: allowance } = useReadContract({
        address: WLD_TOKEN, abi: erc20Abi, functionName: "allowance", args: [address!, HUMANFI_ADDRESS], query: { enabled: !!address }
    });
    const { data: votingPower } = useReadContract({
        address: HUMANFI_ADDRESS, abi: HUMANFI_ABI, functionName: "votingPower", args: [address!], query: { enabled: !!address }
    });

    // 1. Obtener Fondos (Faucet)
    const claimFaucet = () => {
        writeContract({ address: WLD_TOKEN, abi: MOCK_WLD_ABI, functionName: "faucet", args: [] });
    };

    // 2. Ejecutar Zap (Approve automático)
    const executeZap = (amount: string) => {
        const wei = parseEther(amount);
        // Convert BigInt to number for comparison if needed, but direct comparison works with BigInt in modern JS.
        // However, allowance is BigInt | undefined.

        // Simple logic: if allowance is insufficient, approve. Otherwise, zap.
        if (!allowance || allowance < wei) {
            writeContract({ address: WLD_TOKEN, abi: erc20Abi, functionName: "approve", args: [HUMANFI_ADDRESS, maxUint256] });
        } else {
            writeContract({ address: HUMANFI_ADDRESS, abi: HUMANFI_ABI, functionName: "zap", args: [wei] });
        }
    };

    // 3. Votar
    const castVote = (proofData: any) => {
        const root = BigInt(proofData.merkle_root);
        const nullifier = BigInt(proofData.nullifier_hash);
        const proof = proofData.proof.map((p: string) => BigInt(p));

        writeContract({
            address: HUMANFI_ADDRESS, abi: HUMANFI_ABI, functionName: "voteWithWorldID",
            args: [root, nullifier, proof],
        });
    };

    return { claimFaucet, executeZap, castVote, votingPower, wldBalance, isPending, txHash: hash };
}
