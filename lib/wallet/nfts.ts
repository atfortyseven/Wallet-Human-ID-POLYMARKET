import { Alchemy, Network, NftFilters } from 'alchemy-sdk';

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET, // Default, can be dynamic
};

const alchemy = new Alchemy(config);

export interface NFT {
  id: string;
  contract: string;
  tokenId: string;
  title: string;
  description: string;
  image: string;
  collectionName: string;
  floorPrice?: number;
}

export async function getNFTs(address: string, chainId: number = 1): Promise<NFT[]> {
  // Map chainId to Alchemy Network
  let network = Network.ETH_MAINNET;
  if (chainId === 137) network = Network.MATIC_MAINNET;
  if (chainId === 8453) network = Network.BASE_MAINNET;
  
  const settings = { ...config, network };
  const client = new Alchemy(settings);

  try {
    const nfts = await client.nft.getNftsForOwner(address, {
      excludeFilters: [NftFilters.SPAM],
      pageSize: 50
    });

    return nfts.ownedNfts.map((nft) => ({
      id: `${nft.contract.address}-${nft.tokenId}`,
      contract: nft.contract.address,
      tokenId: nft.tokenId,
      title: nft.name || `#${nft.tokenId}`,
      description: nft.description || '',
      image: nft.image?.thumbnailUrl || nft.image?.cachedUrl || '',
      collectionName: nft.contract.name || 'Unknown Collection',
      floorPrice: nft.contract.openSeaMetadata?.floorPrice
    }));
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return [];
  }
}

export async function getNFTMetadata(contractAddress: string, tokenId: string) {
  try {
    const response = await alchemy.nft.getNftMetadata(contractAddress, tokenId);
    return response;
  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
    return null;
  }
}

export const getNFTsForOwner = getNFTs;

export async function getNFTCollections(address: string, chainId: number = 1) {
  const nfts = await getNFTs(address, chainId);
  
  // Aggregate unique collections
  const collectionsMap = new Map();
  
  nfts.forEach(nft => {
    if (!collectionsMap.has(nft.contract)) {
      collectionsMap.set(nft.contract, {
        contract: nft.contract,
        name: nft.collectionName || 'Unknown Collection',
        image: nft.image,
        count: 0
      });
    }
    collectionsMap.get(nft.contract).count++;
  });

  return Array.from(collectionsMap.values());
}
