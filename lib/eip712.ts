export const POLYGON_CHAIN_ID = 137;

// This domain separator must match the one defined in the CTFExchange contract on Polygon
export const domain = {
    name: "CTFExchange",
    version: "1",
    chainId: POLYGON_CHAIN_ID,
    verifyingContract: "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E", // Real CTF Exchange Proxy
} as const;

// The Order struct as defined in Solidity
export const types = {
    Order: [
        { name: "salt", type: "uint256" },
        { name: "maker", type: "address" },
        { name: "signer", type: "address" },
        { name: "taker", type: "address" },
        { name: "tokenId", type: "uint256" },
        { name: "makerAmount", type: "uint256" },
        { name: "takerAmount", type: "uint256" },
        { name: "expiration", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "feeRateBps", type: "uint256" },
        { name: "side", type: "uint8" }, // 0 = Buy, 1 = Sell
        { name: "signatureType", type: "uint8" },
    ],
} as const;

export interface Order {
    salt: bigint;
    maker: `0x${string}`;
    signer: `0x${string}`;
    taker: `0x${string}`;
    tokenId: bigint;
    makerAmount: bigint;
    takerAmount: bigint;
    expiration: bigint;
    nonce: bigint;
    feeRateBps: bigint;
    side: number;
    signatureType: number;
}
