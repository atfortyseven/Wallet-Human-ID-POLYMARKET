const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/tokenunion/polymarket-matic';
const GAMMA_API_URL = 'https://gammap-api.polymarket.com/profiles';

export interface Trader {
    rank: number;
    address: string;
    name: string;
    image: string;
    volume: number;
    profit: number;
    profileUrl: string;
}

const MOCK_TRADERS: Trader[] = [
    { rank: 1, address: "0x8971...3122", name: "WhaleTrader.eth", image: "https://api.dicebear.com/7.x/identicon/svg?seed=whale", volume: 15420000, profit: 320000, profileUrl: "#" },
    { rank: 2, address: "0x1234...5678", name: "CryptoKing", image: "https://api.dicebear.com/7.x/identicon/svg?seed=king", volume: 12100000, profit: 150000, profileUrl: "#" },
    { rank: 3, address: "0xabcd...ef01", name: "PolyDegen", image: "https://api.dicebear.com/7.x/identicon/svg?seed=poly", volume: 9800000, profit: -5000, profileUrl: "#" },
    { rank: 4, address: "0x4321...8765", name: "PredictionPro", image: "https://api.dicebear.com/7.x/identicon/svg?seed=pred", volume: 5400000, profit: 89000, profileUrl: "#" },
    { rank: 5, address: "0x9876...1234", name: "FutureSeer", image: "https://api.dicebear.com/7.x/identicon/svg?seed=future", volume: 3200000, profit: 45000, profileUrl: "#" },
];

function smartNormalize(valueStr: string): number {
    const val = parseFloat(valueStr || "0");
    if (val > 1_000_000_000) return val / 1_000_000;
    return val;
}

// Ahora aceptamos 'page' como argumento
export async function fetchTopTraders(page: number = 1): Promise<Trader[]> {
    const ITEMS_PER_PAGE = 20;
    const skip = (page - 1) * ITEMS_PER_PAGE;

    // Query dinámica con variables de paginación
    const query = `
    {
      users(first: ${ITEMS_PER_PAGE}, skip: ${skip}, orderBy: totalVolume, orderDirection: desc, where: { totalVolume_gt: "100" }) {
        id
        totalVolume
        totalProfit
      }
    }
  `;

    try {
        const graphRes = await fetch(SUBGRAPH_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
            next: { revalidate: 60 }
        });

        if (!graphRes.ok) throw new Error(`Graph API returned ${graphRes.status}`);

        const { data } = await graphRes.json();

        // FAIL-SAFE: Return Mock Data if empty (only for page 1 to avoid infinite mock loops)
        if ((!data || !data.users || data.users.length === 0)) {
            if (page === 1) {
                console.warn("[Leaderboard] Graph data empty, serving Fallback Mock Data.");
                return MOCK_TRADERS;
            }
            return [];
        }

        const traders = await Promise.all(data.users.map(async (user: any, index: number) => {
            let displayName = `${user.id.substring(0, 6)}...`;
            let displayImage = `https://api.dicebear.com/7.x/identicon/svg?seed=${user.id}`;

            try {
                const profileRes = await fetch(`${GAMMA_API_URL}?address=${user.id}`);
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    if (profileData.display_name) displayName = profileData.display_name;
                    if (profileData.profile_image) displayImage = profileData.profile_image;
                }
            } catch (e) { }

            return {
                // CÁLCULO DE RANK REAL: (Página anterior * 20) + posición actual + 1
                rank: skip + index + 1,
                address: user.id,
                name: displayName,
                image: displayImage,
                volume: smartNormalize(user.totalVolume),
                profit: smartNormalize(user.totalProfit),
                profileUrl: `https://polymarket.com/profile/${user.id}`
            };
        }));

        return traders.sort((a, b) => b.volume - a.volume);

    } catch (error) {
        console.error("Error Leaderboard Paginado:", error);
        // Fallback for Page 1
        if (page === 1) return MOCK_TRADERS;
        return [];
    }
}
