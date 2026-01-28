import { GraphQLClient, gql } from 'graphql-request';

const SNAPSHOT_HUB_URL = 'https://hub.snapshot.org/graphql';
const client = new GraphQLClient(SNAPSHOT_HUB_URL);

// Interface for Proposal
export interface Proposal {
    id: string;
    title: string;
    body: string;
    choices: string[];
    start: number;
    end: number;
    state: string;
    author: string;
    space: {
        id: string;
        name: string;
    };
    scores: number[];
    scores_total: number;
}

export const GET_PROPOSALS_QUERY = gql`
  query Proposals($space: String!) {
    proposals(
      first: 20,
      skip: 0,
      where: {
        space_in: [$space],
        state: "active"
      },
      orderBy: "created",
      orderDirection: desc
    ) {
      id
      title
      body
      choices
      start
      end
      state
      author
      space {
        id
        name
      }
      scores
      scores_total
    }
  }
`;

export const getProposals = async (space: string = 'humanid.eth'): Promise<Proposal[]> => {
    try {
        const data: any = await client.request(GET_PROPOSALS_QUERY, { space });
        return data.proposals;
    } catch (error) {
        console.error("Error fetching proposals:", error);
        return [];
    }
};
