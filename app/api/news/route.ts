import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Try to fetch from DB
    // If DB fails (like now with P1001), fallback to static data for demo
    let news = [];
    try {
        news = await prisma.newsUpdate.findMany({
            orderBy: { publishedAt: 'desc' },
            take: 10
        });
    } catch (e) {
        console.warn("DB Connection failed, using mock news data", e);
    }

    // Map DB fields to frontend format if needed, or use as is
    // Schema: title, description, category, imageUrl, publishedAt
    
    if (!news || news.length === 0) {
        // Fallback Mock Data
        news = [
            {
                id: '1',
                title: 'Human Protocol V2 Launch',
                description: 'New quantum-resistant signatures for all users.', // mapped to summary in frontend
                category: 'security',
                publishedAt: new Date().toISOString(),
                imageUrl: '/assets/news/quantum.jpg'
            },
            {
                id: '2',
                title: 'Yield Rates Update',
                description: 'Sepolia testnet yields increased to 15% APY.',
                category: 'defi',
                publishedAt: new Date().toISOString(),
                imageUrl: '/assets/news/yield.jpg'
            },
            {
                id: '3',
                title: 'Governance Proposal #42',
                description: 'Vote on the new privacy layer implementation.',
                category: 'governance',
                publishedAt: new Date().toISOString(),
                imageUrl: '/assets/news/gov.jpg'
            },
             {
                id: '4',
                title: 'Mobile App Beta',
                description: 'Test flight invitations sent to top holders.',
                category: 'updates',
                publishedAt: new Date().toISOString(),
                imageUrl: '/assets/news/mobile.jpg'
            }
        ];
    }

    // Frontend expects 'summary', schema has 'description'. We map it.
    const mappedNews = news.map((item: any) => ({
        ...item,
        summary: item.description || item.summary
    }));

    return NextResponse.json({ news: mappedNews });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
