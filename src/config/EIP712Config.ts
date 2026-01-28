// EIP-712 DOMAIN SEPARATOR
export const DOMAIN = {
    name: 'Humanid.fi',
    version: '1',
    chainId: 8453, // Base Mainnet
    verifyingContract: '0x0000000000000000000000000000000000000000', // To be updated with actual contract
} as const;

// TYPE DEFINITIONS
export const TYPES = {
    // 1. Market Creation
    CreateMarket: [
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'collateralAmount', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
    ],
    // 2. Governance Vote
    Vote: [
        { name: 'proposalId', type: 'bytes32' },
        { name: 'support', type: 'uint8' }, // 0=Against, 1=For, 2=Abstain
        { name: 'voter', type: 'address' },
        { name: 'reason', type: 'string' },
    ],
    // 3. Terms of Service (Clickwrap)
    AccessTerms: [
        { name: 'signer', type: 'address' },
        { name: 'statement', type: 'string' },
        { name: 'timestamp', type: 'uint256' },
    ],
} as const;

// HELPER FOR WAGMI HOOKS
export const getTypedDataConfig = (message: any, primaryType: keyof typeof TYPES) => {
    return {
        domain: DOMAIN,
        types: TYPES,
        primaryType,
        message,
    };
};
