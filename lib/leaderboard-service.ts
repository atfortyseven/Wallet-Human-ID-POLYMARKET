const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/tokenunion/polymarket-matic';
const GAMMA_API_URL = 'https://gammap-api.polymarket.com/profiles'; // Endpoint oficial de perfiles

export interface Trader {
    rank: number;
    address: string;
    name: string;
    image: string;
    volume: number;
    profit: number;
    profileUrl: string;
}

// ✨ REALISM CHECK 1: Normalizador Inteligente de Decimales
// Detecta si el número viene en "Wei/Atomic units" o en Dólares planos
function smartNormalize(valueStr: string): number {
    const val = parseFloat(valueStr || "0");

    // Si el número es absurdamente grande (> 1 Billón), seguro viene con 6 decimales extra
    // Ejemplo: 1000000000000 (unidades) = $1,000,000 (dólares)
    if (val > 1_000_000_000) {
        return val / 1_000_000;
    }
    return val;
}

export async function fetchTopTraders(): Promise<Trader[]> {
    // Query optimizada para obtener usuarios con actividad real
    const query = `
    {
      users(first: 20, orderBy: totalVolume, orderDirection: desc, where: { totalVolume_gt: "10000" }) {
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
            next: { revalidate: 60 } // Cachear 1 minuto para no saturar
        });

        const { data } = await graphRes.json();
        if (!data || !data.users) return [];

        // Paralelizamos las peticiones de identidad para que cargue rápido
        const traders = await Promise.all(data.users.map(async (user: any, index: number) => {
            let displayName = `${user.id.substring(0, 6)}...`;
            let displayImage = `https://api.dicebear.com/7.x/identicon/svg?seed=${user.id}`;

            try {
                // ✨ REALISM CHECK 2: Identidad Real (Gamma API)
                const profileRes = await fetch(`${GAMMA_API_URL}?address=${user.id}`);
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    if (profileData.display_name) displayName = profileData.display_name;
                    if (profileData.profile_image) displayImage = profileData.profile_image;
                }
            } catch (e) {
                // Fallback silencioso
            }

            return {
                rank: index + 1,
                address: user.id,
                name: displayName,
                image: displayImage,
                volume: smartNormalize(user.totalVolume),
                profit: smartNormalize(user.totalProfit),
                profileUrl: `https://polymarket.com/profile/${user.id}` // Link de verificación
            };
        }));

        // Ordenamos por Profit o Volumen según prefieras (aquí por Volumen original)
        return traders.sort((a, b) => b.volume - a.volume);

    } catch (error) {
        console.error("Error en Leaderboard:", error);
        return [];
    }
}
