export type Category =
    | "Trending" | "Breaking" | "New" | "Politics" | "Sports" | "Crypto"
    | "Finance" | "Geopolitics" | "Earnings" | "Tech" | "Culture" | "World"
    | "Economy" | "Climate & Science" | "Elections" | "Mentions";

export interface NewsItem {
    id: string;
    headline: string;
    description: string;
    category: Category;
    time: string;
    source: string;
    imageUrl: string;
}

// --- CONFIG ---

const CATEGORIES: Category[] = [
    "Trending", "Breaking", "New", "Politics", "Sports", "Crypto",
    "Finance", "Geopolitics", "Earnings", "Tech", "Culture", "World",
    "Economy", "Climate & Science", "Elections", "Mentions"
];

const ITEMS_PER_CATEGORY = 50;

// Procedural Generators
const GENERATORS: Record<string, { subjects: string[], verbs: string[], complements: string[], keywords: string[] }> = {
    Trending: {
        subjects: ["Taylor Swift", "SpaceX Starship", "Viral TikTok Trend", "New iPhone", "ChatGPT-5", "Super Bowl"],
        verbs: ["breaks internet records", "surges in popularity", "faces backlash", "dominates headlines", "launches globally"],
        complements: ["after surprise announcement", "amidst fan frenzy", "following leaked video", "despite controversy", "in historic moment"],
        keywords: ["concert", "rocket", "phone", "technology", "crowd"]
    },
    Breaking: {
        subjects: ["Federal Reserve", "White House", "NASA", "European Union", "WHO", "Supreme Court"],
        verbs: ["declares emergency", "issues red alert", "announces lockdown", "passes historic bill", "confirms report"],
        complements: ["effective immediately", "shocking markets", "citing security concerns", "in unanimous decision", "after overnight summit"],
        keywords: ["siren", "police", "press", "government", "emergency"]
    },
    New: {
        subjects: ["Revolutionary App", "Hidden Feature", "Beta Protocol", "Crypto Wallet", "Design System", "Startup"],
        verbs: ["launches today", "goes live", "secures funding", "disrupts industry", "opens waitlist"],
        complements: ["promising 10x growth", "backed by Y Combinator", "with AI integration", "solving major pain point", "for early adopters"],
        keywords: ["startup", "launch", "rocket", "code", "app"]
    },
    Politics: {
        subjects: ["Senate Leader", "Congress", "The President", "GOP Nominee", "Democratic Party", "Supreme Court Justice"],
        verbs: ["blocks legislation", "vetoes bill", "calls for investigation", "rallies supporters", "leaks memo"],
        complements: ["ahead of midterms", "sparking debate", "change in policy", "regarding tax reform", "on border security"],
        keywords: ["capitol", "flag", "vote", "politics", "white house"]
    },
    Sports: {
        subjects: ["LeBron James", "Manchester City", "Max Verstappen", "Kansas City Chiefs", "UFC Champion", "Olympic Team"],
        verbs: ["wins championship", "breaks world record", "signs massive contract", "suffers injury", "demands trade"],
        complements: ["in stunning uptime", "shocking the world", "worth $500 million", "ending season early", "before playoffs"],
        keywords: ["stadium", "athlete", "soccer", "basketball", "race car"]
    },
    Crypto: {
        subjects: ["Bitcoin", "Ethereum ETF", "Solana", "Binance", "BlackRock", "Satoshi Nakamoto"],
        verbs: ["smashes $100k", "suffers flash crash", "implements hard fork", "receives SEC approval", "moves 10,000 BTC"],
        complements: ["triggering bull run", "wiping out shorts", "improving scalability", "opening institutional gates", "from dormant wallet"],
        keywords: ["bitcoin", "crypto", "blockchain", "chart", "ethereum"]
    },
    Finance: {
        subjects: ["S&P 500", "Goldman Sachs", "Inflation Rate", "Oil Prices", "Housing Market", "Federal Reserve"],
        verbs: ["hits all-time high", "plummets drastically", "exceeds expectations", "signals recession", "stabilizes"],
        complements: ["driven by tech sector", "worrying investors", "despite rate hikes", "crushing home buyers", "after volatile week"],
        keywords: ["stock", "money", "wall street", "finance", "graph"]
    },
    Geopolitics: {
        subjects: ["NATO Alliance", "China", "Russia", "UN Security Council", "Middle East Treaty", "G7 Leaders"],
        verbs: ["mobilizes troops", "imposes sanctions", "signs peace deal", "issues ultimatum", "holds crisis summit"],
        complements: ["escalating tensions", "targeting economy", "ending decades of conflict", "warning of consequences", "in Geneva"],
        keywords: ["map", "globe", "flag", "army", "diplomacy"]
    },
    Earnings: {
        subjects: ["Apple", "Tesla", "Nvidia", "Amazon", "Microsoft", "Netflix"],
        verbs: ["crushes earnings", "misses revenue", "announces stock split", "guides lower", "buys back shares"],
        complements: ["sending stock soaring", "dropping 15%", "attracting retail investors", "blaming supply chain", "boosting dividend"],
        keywords: ["chart", "meeting", "money", "office", "presentation"]
    },
    Tech: {
        subjects: ["OpenAI", "Quantum Computer", "Google Gemini", "Humanoid Robot", "Neuralink", "VR Headset"],
        verbs: ["achieves AGI", "solves math problem", "passes Turing test", "learns to walk", "implants chip"],
        complements: ["scaring experts", "faster than supercomputer", "fooling humans", "without assistance", "in first human trial"],
        keywords: ["robot", "computer", "vr", "technology", "cyber"]
    },
    Culture: {
        subjects: ["Hollywood Strike", "Viral Meme", "Music Festival", "Modern Art", "Fashion Week", "Streaming Giant"],
        verbs: ["ends after months", "takes over internet", "sells out instantly", "confuses critics", "sets new trend"],
        complements: ["costing billions", "generating millions of views", "attracting huge crowds", "selling for $50M", "showcasing bitter rivalry"],
        keywords: ["cinema", "concert", "fashion", "art", "music"]
    },
    World: {
        subjects: ["Global Population", "Amazon Rainforest", "Antarctica", "Ocean Cleanup", "Space Station", "Pandemic Treaty"],
        verbs: ["hits 8 billion", "faces tipping point", "loses ice shelf", "removes plastic", "welcomes astronauts"],
        complements: ["presenting new challenges", "requiring urgent action", "raising sea levels", "milestone achieved", "for 6 month mission"],
        keywords: ["earth", "nature", "city", "world", "people"]
    },
    Economy: {
        subjects: ["Unemployment Rate", "GDP Growth", "Consumer Spending", "Manufacturing Output", "National Debt", "Minimum Wage"],
        verbs: ["drops to record low", "exceeds forecast", "slows down", "rebounds strongly", "crosses $34 trillion"],
        complements: ["signaling strong economy", "defying recession fears", "worrying retailers", "indicating recovery", "sparking debate"],
        keywords: ["factory", "worker", "money", "shopping", "economy"]
    },
    'Climate & Science': {
        subjects: ["James Webb Telescope", "New Vaccine", "Solar Power", "Mars Colony", "Ocean Temperature", "Endangered Species"],
        verbs: ["captures galaxy", "enters trials", "surpasses coal", "plans announced", "breaks heat record"],
        complements: ["revealing early universe", "targeting cancer", "in energy mix", "by Elon Musk", "threatening coral reefs"],
        keywords: ["space", "science", "nature", "solar", "telescope"]
    },
    Elections: {
        subjects: ["Donald Trump", "Joe Biden", "Swing State Poll", "Electoral Map", "Voter Turnout", "Debate Stage"],
        verbs: ["surges in lead", "struggles in key state", "shows dead heat", "predicts landslide", "prepares for face-off"],
        complements: ["among independent voters", "worrying campaign staff", "in Pennsylvania", "according to FiveThirtyEight", "next Tuesday"],
        keywords: ["vote", "ballot", "usa", "election", "candidate"]
    },
    Mentions: {
        subjects: ["Polymarket", "Vitalik Buterin", "Prediction Odds", "Whale Trade", "Market Volume", "Crypto Twitter"],
        verbs: ["predicts outcome", "praises platform", "shifts dramatically", "bets $5 Million", "hits record high"],
        complements: ["correctly again", "calling it future of truth", "after breaking news", "on Trump victory", "during election night"],
        keywords: ["twitter", "polymarket", "chart", "phone", "network"]
    }
};

const getGenerator = (cat: Category) => {
    if (cat === "Climate & Science") return GENERATORS["Climate & Science"];
    return GENERATORS[cat] || GENERATORS["Trending"];
};

const generateNews = (): NewsItem[] => {
    let allNews: NewsItem[] = [];
    let idCounter = 1;

    CATEGORIES.forEach(category => {
        const gen = getGenerator(category);
        for (let i = 0; i < ITEMS_PER_CATEGORY; i++) {
            const subject = gen.subjects[Math.floor(Math.random() * gen.subjects.length)];
            const verb = gen.verbs[Math.floor(Math.random() * gen.verbs.length)];
            const complement = gen.complements[Math.floor(Math.random() * gen.complements.length)];
            const keyword = gen.keywords[Math.floor(Math.random() * gen.keywords.length)];

            // Unsplash Source URL with keyword for relevance
            // Using random query param to potentially bust cache or provide variety if supported
            const displayId = idCounter;

            allNews.push({
                id: displayId.toString(),
                headline: `${subject} ${verb} ${complement}`,
                description: `Detailed analysis: ${subject} has made headlines as it ${verb}. This development ${complement} is being closely watched by experts in ${category}.`,
                category: category,
                time: `${Math.floor(Math.random() * 23) + 1}h ago`,
                source: "Polymarket News",
                imageUrl: `https://loremflickr.com/800/600/${encodeURIComponent(keyword)}?lock=${displayId}`
            });
            idCounter++;
        }
    });

    return allNews;
};

export const NEWS_DATA = generateNews();
