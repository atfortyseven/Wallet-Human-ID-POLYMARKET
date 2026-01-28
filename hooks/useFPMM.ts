import { useReadContract, useWriteContract, useAccount, usePublicClient } from 'wagmi';
import { parseEther, encodeAbiParameters, keccak256, encodePacked } from 'viem';
// import { getConditionId } from '../lib/gnosis-ctf'; // Needed if we do calculations here

const FPMM_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FPMM_FACTORY_ADDRESS as `0x${string}`;
const CTF_ADDRESS = process.env.NEXT_PUBLIC_CTF_ADDRESS as `0x${string}`;
const COLLATERAL_TOKEN = process.env.NEXT_PUBLIC_COLLATERAL_TOKEN_ADDRESS as `0x${string}`;

const FACTORY_ABI = [
    {
        name: 'createFixedProductMarketMaker',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'conditionalTokens', type: 'address' },
            { name: 'collateralToken', type: 'address' },
            { name: 'conditionIds', type: 'bytes32[]' },
            { name: 'fee', type: 'uint256' }
        ],
        outputs: [{ name: 'fixedProductMarketMaker', type: 'address' }]
    }
] as const;

const FPMM_ABI = [
    {
        name: 'buy',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'investmentAmount', type: 'uint256' },
            { name: 'outcomeIndex', type: 'uint256' },
            { name: 'minOutcomeTokensToBuy', type: 'uint256' }
        ],
        outputs: []
    }
] as const;

export function useFPMM(marketAddress?: `0x${string}`) {
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    // Minimal wrapper to call factory
    const deployMarket = (conditionId: `0x${string}`, fee: string = "0.0") => {
        const feeBI = parseEther(fee);

        writeContract({
            address: FPMM_FACTORY_ADDRESS,
            abi: FACTORY_ABI,
            functionName: 'createFixedProductMarketMaker',
            args: [
                CTF_ADDRESS,
                COLLATERAL_TOKEN,
                [conditionId], // Single condition for simple market
                feeBI
            ]
        });
    };

    const buy = (amount: string, outcomeIndex: number, minTokens: bigint = BigInt(0)) => {
        if (!marketAddress || marketAddress === "0x0000000000000000000000000000000000000000") {
            throw new Error("Invalid Market Address");
        }

        const investmentAmount = parseEther(amount);

        writeContract({
            address: marketAddress,
            abi: FPMM_ABI,
            functionName: 'buy',
            args: [
                investmentAmount,
                BigInt(outcomeIndex),
                minTokens
            ]
        });
    };

    return {
        deployMarket,
        buy,
        isPending,
        hash,
        error
    };
}
