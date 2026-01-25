import { GraphQLClient, gql } from 'graphql-request';

const GAMMA_API_URL = 'https://gamma-api.polymarket.com/query';

const client = new GraphQLClient(GAMMA_API_URL);

// Query for Top Markets (Simplified)
const TOP_MARKETS_QUERY = gql`
  query TopMarkets($limit: Int!) {
    markets(
      limit: $limit, 
      order: volumeNum, 
      orderDirection: desc,
      where: { closed: false, active: true }
    ) {
      id
      question
      slug
      image
      volume
      outcomePrices
      outcomes
      clobTokenIds
    }
  }
`;

export interface Market {
    id: string;
    question: string;
    slug: string;
    image: string;
    volume: string;
    outcomePrices: string[]; // ["0.65", "0.35"]
    outcomes: string[]; // ["Yes", "No"]
    clobTokenIds: string[];
}

export const getTopMarkets = async (limit: number = 6): Promise<Market[]> => {
    try {
        const data: any = await client.request(TOP_MARKETS_QUERY, { limit });
        return data.markets;
    } catch (error) {
        console.error("Polymarket API Error:", error);
        return [];
    }
};
