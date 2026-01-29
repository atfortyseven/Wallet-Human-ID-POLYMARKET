import { createWalletClient, custom, parseAbi } from 'viem';
import { mainnet, optimism, base, arbitrum } from 'viem/chains';

// Helper to determine chain based on window.ethereum (naive implementation) or default to mainnet
// In a real app we'd pass the chainId or client.
export const revokeTokenAllowance = async (tokenAddress: string, spenderAddress: string) => {
    if (!window.ethereum) throw new Error("No crypto wallet found");

    const walletClient = createWalletClient({
        chain: mainnet, // Defaulting to mainnet types, but 'custom' transport usually relies on the wallet's active chain
        transport: custom(window.ethereum!)
    });

    const [account] = await walletClient.requestAddresses();

    // Real Blockchain Write Interaction 
    const hash = await walletClient.writeContract({
        address: tokenAddress as `0x${string}`,
        abi: parseAbi(['function approve(address spender, uint256 amount) returns (bool)']),
        functionName: 'approve',
        args: [spenderAddress as `0x${string}`, 0n], // 0n = Zero Allowance 
        account
    });

    return hash;
};
