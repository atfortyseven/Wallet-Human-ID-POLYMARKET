export interface GraphNode {
    id: string;
    name?: string;
    val: number; // Volume/Importance (Scale)
    group: 'USER' | 'DEFI' | 'WALLET' | 'UNKNOWN' | 'PHISHING';
    color?: string;
    date?: string; // ISO String
}

export interface GraphLink {
    source: string;
    target: string;
    value: number; // Tx Count (Thickness)
}

export interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

export const generateMockGraphData = (userAddress: string = '0xUser'): GraphData => {
    const nodes: GraphNode[] = [
        { id: userAddress, name: 'ME', val: 50, group: 'USER', color: '#ffffff' },
        { id: 'Uniswap V3', name: 'Uniswap V3', val: 30, group: 'DEFI', color: '#3b82f6' }, // Blue
        { id: 'Aave V3', name: 'Aave V3', val: 25, group: 'DEFI', color: '#8b5cf6' }, // Violet
        { id: 'Lido', name: 'Lido Staking', val: 20, group: 'DEFI', color: '#0ea5e9' }, // Sky
        { id: '0xFriend1', name: 'Vitalik.eth', val: 10, group: 'WALLET', color: '#10b981' }, // Emerald
        { id: '0xFriend2', name: 'Satoshi.eth', val: 10, group: 'WALLET', color: '#10b981' },
        { id: '0xRandom', name: 'Unknown', val: 5, group: 'UNKNOWN', color: '#71717a' }, // Gray
        { id: '0xScam', name: 'Phishing Site', val: 8, group: 'PHISHING', color: '#ef4444' }, // Red
    ];

    const links: GraphLink[] = [
        { source: userAddress, target: 'Uniswap V3', value: 15 },
        { source: userAddress, target: 'Aave V3', value: 8 },
        { source: userAddress, target: 'Lido', value: 5 },
        { source: userAddress, target: '0xFriend1', value: 3 },
        { source: userAddress, target: '0xFriend2', value: 2 },
        { source: userAddress, target: '0xRandom', value: 1 },
        { source: userAddress, target: '0xScam', value: 1 },
        // Inter-protocol interactions
        { source: 'Uniswap V3', target: 'Aave V3', value: 2 },
    ];

    return { nodes, links };
};
