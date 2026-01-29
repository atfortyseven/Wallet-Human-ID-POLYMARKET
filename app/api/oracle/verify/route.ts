import { NextRequest, NextResponse } from 'next/server';

interface NewsSource {
    id: string;
    name: string;
    tier: 1 | 2 | 3;
    logo: string;
    headline: string;
    url: string;
    timestamp: Date;
    status: 'confirms' | 'mentions' | 'denies';
    confidence: number;
}

interface FactCheckResult {
    pollId: string;
    claim: string;
    sources: NewsSource[];
    truthScore: number;
    status: 'verified' | 'unconfirmed' | 'disputed';
    provenanceStamp: string;
    analyzedAt: Date;
}

// Mock intelligent fact-checking function
// TODO: Replace with real API integration (Perplexity/Serper)
function mockFactCheck(claim: string): FactCheckResult {
    // Simulate semantic analysis based on claim keywords
    const claimLower = claim.toLowerCase();
    
    // Determine mock scenario based on keywords
    let scenario: 'verified' | 'unconfirmed' | 'disputed' = 'unconfirmed';
    
    if (claimLower.includes('bitcoin') || claimLower.includes('btc')) {
        scenario = 'verified';
    } else if (claimLower.includes('fake') || claimLower.includes('rumor')) {
        scenario = 'disputed';
    }
    
    // Generate realistic mock sources
    const sources: NewsSource[] = [];
    
    if (scenario === 'verified') {
        sources.push(
            {
                id: '1',
                name: 'Reuters',
                tier: 1,
                logo: '/logos/reuters.svg',
                headline: `Institutional confirmation: ${claim.substring(0, 50)}...`,
                url: 'https://reuters.com/crypto/latest',
                timestamp: new Date(Date.now() - 120000), // 2 mins ago
                status: 'confirms',
                confidence: 95
            },
            {
                id: '2',
                name: 'Bloomberg',
                tier: 1,
                logo: '/logos/bloomberg.svg',
                headline: `Market analysis supports claim regarding ${claim.split(' ').slice(0, 3).join(' ')}`,
                url: 'https://bloomberg.com/news/articles',
                timestamp: new Date(Date.now() - 300000), // 5 mins ago
                status: 'confirms',
                confidence: 90
            },
            {
                id: '3',
                name: 'CoinDesk',
                tier: 2,
                logo: '/logos/coindesk.svg',
                headline: 'Breaking: Industry sources corroborate recent developments',
                url: 'https://coindesk.com/markets',
                timestamp: new Date(Date.now() - 60000), // 1 min ago
                status: 'confirms',
                confidence: 85
            }
        );
    } else if (scenario === 'disputed') {
        sources.push(
            {
                id: '1',
                name: 'Reuters',
                tier: 1,
                logo: '/logos/reuters.svg',
                headline: `Fact check: Claim about ${claim.split(' ').slice(0, 3).join(' ')} disputed by officials`,
                url: 'https://reuters.com/fact-check',
                timestamp: new Date(Date.now() - 180000),
                status: 'denies',
                confidence: 92
            },
            {
                id: '2',
                name: 'Associated Press',
                tier: 1,
                logo: '/logos/ap.svg',
                headline: 'Verification team finds no evidence supporting viral claim',
                url: 'https://apnews.com/hub/fact-checking',
                timestamp: new Date(Date.now() - 240000),
                status: 'denies',
                confidence: 88
            }
        );
    } else {
        // Unconfirmed - mixed sources
        sources.push(
            {
                id: '1',
                name: 'CoinDesk',
                tier: 2,
                logo: '/logos/coindesk.svg',
                headline: `Developing: ${claim.substring(0, 40)}... sources say`,
                url: 'https://coindesk.com/business',
                timestamp: new Date(Date.now() - 300000),
                status: 'mentions',
                confidence: 70
            },
            {
                id: '2',
                name: 'The Block',
                tier: 2,
                logo: '/logos/theblock.svg',
                headline: 'Unconfirmed reports circulating regarding recent announcement',
                url: 'https://theblock.co/post',
                timestamp: new Date(Date.now() - 180000),
                status: 'mentions',
                confidence: 65
            }
        );
    }
    
    // Calculate weighted truth score
    const totalWeight = sources.reduce((sum, source) => {
        // Tier weighting: Tier 1 = 50pts, Tier 2 = 20pts, Tier 3 = 2pts
        const tierWeight = source.tier === 1 ? 50 : source.tier === 2 ? 20 : 2;
        
        // Status multiplier: confirms = 1, mentions = 0.5, denies = -1
        const statusMultiplier = 
            source.status === 'confirms' ? 1 : 
            source.status === 'denies' ? -1 : 
            0.5;
        
        return sum + (tierWeight * statusMultiplier * (source.confidence / 100));
    }, 0);
    
    // Normalize to 0-100 scale
    const truthScore = Math.max(0, Math.min(100, 50 + totalWeight));
    
    // Determine final status
    const finalStatus = 
        truthScore >= 70 ? 'verified' : 
        truthScore >= 30 ? 'unconfirmed' : 
        'disputed';
    
    return {
        pollId: 'temp',
        claim,
        sources,
        truthScore: Math.round(truthScore),
        status: finalStatus,
        provenanceStamp: `PROTOCOL V3.1 // BLOCK #${Math.floor(Math.random() * 100000)}`,
        analyzedAt: new Date(),
    };
}

export async function POST(req: NextRequest) {
    try {
        const { claim } = await req.json();

        if (!claim || typeof claim !== 'string') {
            return NextResponse.json({ error: 'Valid claim required' }, { status: 400 });
        }

        // Perform fact-checking analysis
        const result = mockFactCheck(claim);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Oracle verification error:', error);
        return NextResponse.json(
            { error: 'Verification failed' }, 
            { status: 500 }
        );
    }
}
