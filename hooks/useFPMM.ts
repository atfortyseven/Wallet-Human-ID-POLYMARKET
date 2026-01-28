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
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: 'creator', type: 'address' },
            { indexed: false, name: 'fixedProductMarketMaker', type: 'address' },
            { indexed: false, name: 'conditionalTokens', type: 'address' },
            { indexed: false, name: 'collateralToken', type: 'address' },
            { indexed: false, name: 'conditionIds', type: 'bytes32[]' },
            { indexed: false, name: 'fee', type: 'uint256' }
        ],
        name: 'FixedProductMarketMakerCreation',
        type: 'event'
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
    },
    {
        name: 'addFunding',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'addedFunds', type: 'uint256' },
            { name: 'distributionHint', type: 'uint256[]' }
        ],
        outputs: []
    }
] as const;

const ERC20_ABI = [
    {
        name: 'approve',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' }
        ],
        outputs: [{ name: '', type: 'bool' }]
    }
] as const;

export function useFPMM(defaultMarketAddress?: `0x${string}`) {
    const { writeContractAsync, data: hash, isPending, error } = useWriteContract();

    // Minimal wrapper to call factory
    const deployMarket = async (conditionId: `0x${string}`, fee: string = "0.0") => {
        const feeBI = parseEther(fee);

        return await writeContractAsync({
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

    const buy = async (amount: string, outcomeIndex: number, minTokens: bigint = BigInt(0), marketAddress?: `0x${string}`) => {
        const targetAddress = marketAddress || defaultMarketAddress;
        if (!targetAddress || targetAddress === "0x0000000000000000000000000000000000000000") {
            throw new Error("Invalid Market Address");
        }

        const investmentAmount = parseEther(amount);

        return await writeContractAsync({
            address: targetAddress,
            abi: FPMM_ABI,
            functionName: 'buy',
            args: [
                investmentAmount,
                BigInt(outcomeIndex),
                minTokens
            ]
        });
    };

    const addFunding = async (amount: string, distributionHint: bigint[] = [], marketAddress?: `0x${string}`) => {
        const targetAddress = marketAddress || defaultMarketAddress;
        if (!targetAddress || targetAddress === "0x0000000000000000000000000000000000000000") {
            throw new Error("Invalid Market Address");
        }

        const investmentAmount = parseEther(amount);

        return await writeContractAsync({
            address: targetAddress,
            abi: FPMM_ABI,
            functionName: 'addFunding',
            args: [
                investmentAmount,
                distributionHint
            ]
        });
    };

    const approve = async (spender: `0x${string}`, amount: string) => {
        const amountBI = parseEther(amount);
        return await writeContractAsync({
            address: COLLATERAL_TOKEN,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [spender, amountBI]
        });
    };

    return {
        deployMarket,
        buy,
        addFunding,
        approve,
        isPending,
        hash,
        error
    };
}
