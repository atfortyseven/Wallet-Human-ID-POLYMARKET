export interface NewsItem {
    id: number;
    headline: string;
    description: string;
    category: "Elections" | "Crypto" | "Finance";
    time: string;
    source: string;
    imageUrl: string;
    footer: string;
}

export const NEWS_DATA: NewsItem[] = [
    // --- ELECTIONS (15 Items) ---
    {
        id: 1,
        headline: "Trump Leads in Pennsylvania: New Rust Belt Polls Shock Democrats",
        description: "Economic anxiety drives a 4-point swing in key counties, putting the Keystone State in play for the GOP.",
        category: "Elections",
        time: "10m ago",
        source: "Polymarket Data",
        imageUrl: "https://images.unsplash.com/photo-1540910419868-474947cebacb?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 2,
        headline: "Biden's Approval Rating Dips Below 38% Amid Inflation Concerns",
        description: "Core voter demographics show signs of fatigue as cost of living remains the #1 issue.",
        category: "Elections",
        time: "25m ago",
        source: "Gallup / Polymarket",
        imageUrl: "https://images.unsplash.com/photo-1580130281131-9a73c7cb659d?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 3,
        headline: "GOP Senate Takeover Odds Rise to 60%",
        description: "Market sentiment shifts heavily towards Republicans regaining control of the Upper Chamber.",
        category: "Elections",
        time: "40m ago",
        source: "Market Analytics",
        imageUrl: "https://images.unsplash.com/photo-1520190282873-afe12c587382?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 4,
        headline: "Nikki Haley Suspends Campaign, Endorses Party Unity",
        description: "The former UN Ambassador clears the path for Trump, consolidating the conservative vote.",
        category: "Elections",
        time: "1h ago",
        source: "Campaign Trail",
        imageKeyword: "nikki haley", // Fallback if url fails
        imageUrl: "https://images.unsplash.com/photo-1575320181282-9afab399332c?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 5,
        headline: "RFK Jr. Ballot Access Secured in Michigan and Arizona",
        description: "Third-party disruptor gains traction in critical swing states, worrying both major campaigns.",
        category: "Elections",
        time: "1h 20m ago",
        source: "FiveThirtyEight",
        imageUrl: "https://images.unsplash.com/photo-1571609825539-7b7921958256?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 6,
        headline: "Supreme Court Unanimously Rules Trump Must Remain on Ballot",
        description: "Justices strike down state-level attempts to disqualify the former President.",
        category: "Elections",
        time: "2h ago",
        source: "SCOTUS Blog",
        imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 7,
        headline: "Voter Turnout Among Gen Z Expected to Surge",
        description: "Early registration data suggests unprecedented youth engagement in the 2024 cycle.",
        category: "Elections",
        time: "2h 15m ago",
        source: "Election Data",
        imageUrl: "https://images.unsplash.com/photo-1590845947706-e71ab8b70717?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 8,
        headline: "Debate Night: Immigration Takes Center Stage",
        description: "Candidates clash over border security policies in a heated primetime exchange.",
        category: "Elections",
        time: "3h ago",
        source: "Live Feed",
        imageUrl: "https://images.unsplash.com/photo-1541872703-74c5963631df?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 9,
        headline: "Polymarket Volume Hits $100M on Election Outcome Bets",
        description: "Prediction markets are outpacing traditional polls in liquidity and speed.",
        category: "Elections",
        time: "3h 45m ago",
        source: "Platform Update",
        imageUrl: "https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 10,
        headline: "Kamala Harris Focuses on Swing State Suburbs",
        description: "VP tours Wisconsin and Michigan to bolster support among moderate voters.",
        category: "Elections",
        time: "4h ago",
        source: "White House Press",
        imageUrl: "https://images.unsplash.com/photo-1605663869935-7128eeb5963a?auto=format&fit=crop&w=800&q=80", // Flag
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 11,
        headline: "Elon Musk's 'X' Becomes Key Political Battleground",
        description: "Social media algorithm changes spark debate over political neutrality.",
        category: "Elections",
        time: "4h 30m ago",
        source: "Tech Policy",
        imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 12,
        headline: "Border Wall Funding Divided Congress Again",
        description: "Budget negotiations stall as immigration policy demands derail appropriations.",
        category: "Elections",
        time: "5h ago",
        source: "Capitol Hill",
        imageUrl: "https://images.unsplash.com/photo-1600673322138-12c4c3792079?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 13,
        headline: "Mail-In Ballot Litigation Intensifies in Georgia",
        description: "Legal teams mobilize to challenge ballot verification procedures.",
        category: "Elections",
        time: "5h 20m ago",
        source: "Legal Update",
        imageUrl: "https://images.unsplash.com/photo-1598136490941-0f3702587979?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 14,
        headline: "Crypto Voters Emerge as Critical Voting Bloc",
        description: "Digital asset owners demand clear regulatory frameworks from candidates.",
        category: "Elections",
        time: "6h ago",
        source: "Crypto Council",
        imageUrl: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 15,
        headline: "Historical Analogy: Is 2024 a Repeat of 1968?",
        description: "Historians draw parallels to a tumultuous election year defined by protest and division.",
        category: "Elections",
        time: "6h 30m ago",
        source: "History Channel",
        imageUrl: "https://images.unsplash.com/photo-1589332240226-9f79b0ccb3b9?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },

    // --- CRYPTO (15 Items) ---
    {
        id: 16,
        headline: "Bitcoin Breaks $72,000 to Set New All-Time High",
        description: "Supply shock from the halving meets insatiable demand from Spot ETFs.",
        category: "Crypto",
        time: "12m ago",
        source: "CoinGecko",
        imageUrl: "https://images.unsplash.com/photo-1518546305927-5a420f3463fb?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 17,
        headline: "BlackRock IBIT ETF Inflows Surpass $15 Billion",
        description: "The world's largest asset manager dominates the crypto investment landscape.",
        category: "Crypto",
        time: "32m ago",
        source: "ETF Stream",
        imageUrl: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 18,
        headline: "Ethereum Dencun Upgrade Live: L2 Fees Drop 90%",
        description: "Scaling solution effectively makes transactions on Arbitrum and Optimism negligible.",
        category: "Crypto",
        time: "45m ago",
        source: "Ethereum Foundation",
        imageUrl: "https://images.unsplash.com/photo-1622790698141-94e30457ef12?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 19,
        headline: "Solana Transaction Volume Flips Ethereum on DEXs",
        description: "High throughput and low fees attract massive memecoin trading activity.",
        category: "Crypto",
        time: "1h 10m ago",
        source: "DefiLlama",
        imageUrl: "https://images.unsplash.com/photo-1642104704074-907c0698b98d?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 20,
        headline: "SEC vs Coinbase: Court Allows Case to Proceed",
        description: "Judicial ruling sets the stage for a defining battle over crypto security laws.",
        category: "Crypto",
        time: "1h 45m ago",
        source: "Legal Brief",
        imageUrl: "https://images.unsplash.com/photo-1555431189-0fabf2667795?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 21,
        headline: "MicroStrategy Acquires Additional 9,000 BTC",
        description: "Michael Saylor continues his aggressive accumulation strategy.",
        category: "Crypto",
        time: "2h ago",
        source: "SEC Filing",
        imageUrl: "https://images.unsplash.com/photo-1519162584292-56dfc9eb5db4?auto=format&fit=crop&w=800&q=80", // Finance generic
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 22,
        headline: "Uniswap Fee Switch Proposal Passes Temperature Check",
        description: "UNI token holders move closer to monetizing the protocol's liquidity.",
        category: "Crypto",
        time: "2h 30m ago",
        source: "Uniswap Gov",
        imageUrl: "https://images.unsplash.com/photo-1621501103258-295dd2cd2bd3?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 23,
        headline: "Vitalik Buterin Outlines 'The Purge' Roadmap",
        description: "Next phase of Ethereum development focuses on simplifying the protocol.",
        category: "Crypto",
        time: "3h ago",
        source: "Vitalik Blog",
        imageUrl: "https://images.unsplash.com/photo-1644361566696-3d442b5b482a?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 24,
        headline: "Tether (USDT) Hits $100 Billion Market Cap",
        description: "Stablecoin dominance grows despite continued regulatory questions.",
        category: "Crypto",
        time: "3h 20m ago",
        source: "Stablecoin Data",
        imageUrl: "https://images.unsplash.com/photo-1620321023374-d1a68fddadb3?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 25,
        headline: "Satoshi Era Bitcoin Wallet Wakes Up After 12 Years",
        description: "A transfer of 500 BTC sparks speculation about early miner activity.",
        category: "Crypto",
        time: "4h ago",
        source: "Whale Alert",
        imageUrl: "https://images.unsplash.com/photo-1609554496796-c345a5335ceb?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 26,
        headline: "Coinbase Launches 'Base' Smart Wallet",
        description: "Passkey integration aims to onboard the next billion users on-chain.",
        category: "Crypto",
        time: "4h 45m ago",
        source: "Tech Review",
        imageUrl: "https://images.unsplash.com/photo-1625806786048-0e39b4313c0c?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 27,
        headline: "DeFi TVL Reaches highest level since 2022",
        description: "Yield farming activity returns as restaking narratives gain traction.",
        category: "Crypto",
        time: "5h ago",
        source: "L2Beat",
        imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 28,
        headline: "Ripple (XRP) to Launch US Dollar Stablecoin",
        description: "Blockchain firm aims to compete directly with Tether and Circle.",
        category: "Crypto",
        time: "5h 30m ago",
        source: "Ripple Press",
        imageUrl: "https://images.unsplash.com/photo-1621416909404-58e574aaa647?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 29,
        headline: "Bitcoin Runes Protocol Clutters Mempool",
        description: "New token standard on Bitcoin mainnet drives fees to record highs.",
        category: "Crypto",
        time: "6h ago",
        source: "Mempool Space",
        imageUrl: "https://images.unsplash.com/photo-1591994843349-f415893b3a6b?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 30,
        headline: "FTX Creditors Expected to Receive Full Repayment",
        description: "Bankruptcy estate recovers enough assets to make customers whole.",
        category: "Crypto",
        time: "6h 45m ago",
        source: "Court Filing",
        imageUrl: "https://images.unsplash.com/photo-1526304640152-d4619684e484?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },

    // --- FINANCE (10 Items) ---
    {
        id: 31,
        headline: "Fed Chair Powell Hints at Rate Cuts Late 2024",
        description: "Inflation data cooling provides room for monetary policy easing.",
        category: "Finance",
        time: "20m ago",
        source: "Federal Reserve",
        imageUrl: "https://images.unsplash.com/photo-1526304640152-d4619684e484?auto=format&fit=crop&w=800&q=80", // reusing chart
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 32,
        headline: "S&P 500 Closes at Record High AI Rally Continues",
        description: "Tech sector strength pushes major indices to new milestones.",
        category: "Finance",
        time: "50m ago",
        source: "WSJ",
        imageUrl: "https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&w=800&q=80", // Stock graphic
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 33,
        headline: "Gold Prices Surge on Geopolitical Instability",
        description: "Safe haven demand pushes precious metal above $2,300/oz.",
        category: "Finance",
        time: "1h 15m ago",
        source: "Bloomberg",
        imageUrl: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 34,
        headline: "Japanese Yen Hits 34-Year Low Against USD",
        description: "Bank of Japan considers intervention to stabilize currency.",
        category: "Finance",
        time: "1h 50m ago",
        source: "Forex",
        imageUrl: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 35,
        headline: "Commercial Real Estate Vacancies Spook Regional Banks",
        description: "Office sector distress poses risks to small lenders' balance sheets.",
        category: "Finance",
        time: "2h 40m ago",
        source: "FT",
        imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 36,
        headline: "Oil Climbs as OPEC+ Extends Supply Cuts",
        description: "Energy prices rise again, threatening global inflation targets.",
        category: "Finance",
        time: "3h 10m ago",
        source: "Oil Price",
        imageUrl: "https://images.unsplash.com/photo-1520190282873-afe12c587382?auto=format&fit=crop&w=800&q=80", // Industry
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 37,
        headline: "Reddit IPO Shares Soar 48% on Debut",
        description: "Social media platform listing reignites interest in new public offerings.",
        category: "Finance",
        time: "4h 15m ago",
        source: "NYSE",
        imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80", // Social
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 38,
        headline: "Apple Faces DOJ Antitrust Lawsuit",
        description: "Government alleges iPhone maker maintains illegal monopoly.",
        category: "Finance",
        time: "5h ago",
        source: "Reuters",
        imageUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 39,
        headline: "Tesla Deliveries Miss Expectations amid Competition",
        description: "EV maker faces slowing demand and rising rivals in China.",
        category: "Finance",
        time: "5h 45m ago",
        source: "CNBC",
        imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    },
    {
        id: 40,
        headline: "Global Debt Hits Record $313 Trillion",
        description: "Rising interest rates put pressure on sovereign borrowers.",
        category: "Finance",
        time: "6h 30m ago",
        source: "World Bank",
        imageUrl: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=800&q=80",
        footer: "✍️ Firmado por Polymarket Wallet"
    }
];
