import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { parseUnits, encodeFunctionData } from 'viem';
import { getConditionId, getCollectionId, getPositionId, INDEX_SETS } from '../lib/gnosis-ctf';

// Minimal ABIs (In production, import full Artifacts)
const CTF_ABI = [
    {
        name: 'splitPosition',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'collateralToken', type: 'address' },
            { name: 'parentCollectionId', type: 'bytes32' },
            { name: 'conditionId', type: 'bytes32' },
            { name: 'partition', type: 'uint256[]' },
            { name: 'amount', type: 'uint256' }
        ],
        outputs: []
    },
    {
        name: 'mergePositions',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'collateralToken', type: 'address' },
            { name: 'parentCollectionId', type: 'bytes32' },
            { name: 'conditionId', type: 'bytes32' },
            { name: 'partition', type: 'uint256[]' },
            { name: 'amount', type: 'uint256' }
        ],
        outputs: []
    },
    {
        name: 'redeemPositions',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'collateralToken', type: 'address' },
            { name: 'parentCollectionId', type: 'bytes32' },
            { name: 'conditionId', type: 'bytes32' },
            { name: 'indexSets', type: 'uint256[]' }
        ],
        outputs: []
    },
    {
        name: 'payoutDenominator',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'conditionId', type: 'bytes32' }],
        outputs: [{ name: 'denominator', type: 'uint256' }]
    }
] as const;

// Addresses (ENV variables or constants)
const CTF_ADDRESS = process.env.NEXT_PUBLIC_CTF_ADDRESS as `0x${string}`;
const COLLATERAL_TOKEN = process.env.NEXT_PUBLIC_COLLATERAL_TOKEN_ADDRESS as `0x${string}`; // Deployed MockERC20


export function useCTF() {
    const { address } = useAccount();
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    // 1. Split Position (Mint Tokens)
    // To mint YES/NO tokens, you must split collateral.
    // Partition for Binary: [1, 2] (Index Set 1=Yes, 2=No)
    const splitPosition = (conditionId: `0x${string}`, amount: string) => {
        if (!CTF_ADDRESS) throw new Error("CTF Address not configured");

        const weiAmount = parseUnits(amount, 18); // Assuming 18 decimals
        const parentCollectionId = '0x0000000000000000000000000000000000000000000000000000000000000000'; // Base Split

        writeContract({
            address: CTF_ADDRESS,
            abi: CTF_ABI,
            functionName: 'splitPosition',
            args: [
                COLLATERAL_TOKEN,
                parentCollectionId,
                conditionId,
                [BigInt(INDEX_SETS.YES), BigInt(INDEX_SETS.NO)],
                weiAmount
            ]
        });
    };

    // 2. Merge Positions (Burn Tokens)
    // Combine YES + NO tokens back into Collateral.
    const mergePositions = (conditionId: `0x${string}`, amount: string) => {
        const weiAmount = parseUnits(amount, 18);
        const parentCollectionId = '0x0000000000000000000000000000000000000000000000000000000000000000';

        writeContract({
            address: CTF_ADDRESS,
            abi: CTF_ABI,
            functionName: 'mergePositions',
            args: [
                COLLATERAL_TOKEN,
                parentCollectionId,
                conditionId,
                [BigInt(INDEX_SETS.YES), BigInt(INDEX_SETS.NO)],
                weiAmount
            ]
        });
    };

    // 3. Redeem Positions (Claim Winnings)
    // Burn the WINNING outcome token for Collateral.
    // indexSets should ideally be dynamic based on user holdings, but typically we try redeeming all relevant sets.
    const redeemPositions = (conditionId: `0x${string}`) => {
        const parentCollectionId = '0x0000000000000000000000000000000000000000000000000000000000000000';

        // We attempt to redeem for both YES and NO slots. 
        // Only the winning slot will have value (payout > 0).
        writeContract({
            address: CTF_ADDRESS,
            abi: CTF_ABI,
            functionName: 'redeemPositions',
            args: [
                COLLATERAL_TOKEN,
                parentCollectionId,
                conditionId,
                [BigInt(INDEX_SETS.YES), BigInt(INDEX_SETS.NO)]
            ]
        });
    };

    // Check if market is resolved
    const { data: payoutDenominator } = useReadContract({
        address: CTF_ADDRESS,
        abi: CTF_ABI,
        functionName: 'payoutDenominator',
        // We'd need to pass conditionId dynamically in a real component usage context
        // This is just the shell hook structure.
        args: ['0x0000000000000000000000000000000000000000000000000000000000000000'],
        query: { enabled: false } // Disabled by default here
    });

    return {
        splitPosition,
        mergePositions,
        redeemPositions,
        isPending,
        hash,
        error
    };
}
