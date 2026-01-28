'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function refreshIntelStream() {
    try {
        // Fetch real crypto/finance news from CryptoCompare
        const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN');
        const data = await response.json();
        const articles = data.Data.slice(0, 15);

        for (const article of articles) {
            const exists = await prisma.intelItem.findFirst({
                where: { url: article.url }
            });

            if (!exists) {
                // Auto-categorization logic
                let cat = 'FINANCE';
                const txt = (article.title + article.tags).toLowerCase();

                if (txt.includes('government') || txt.includes('sec') || txt.includes('law') || txt.includes('regulation')) {
                    cat = 'GEOPOLITICS';
                } else if (txt.includes('ai') || txt.includes('tech') || txt.includes('nvidia') || txt.includes('upgrade')) {
                    cat = 'TECH';
                } else if (txt.includes('hack') || txt.includes('scam') || txt.includes('exploit') || txt.includes('security')) {
                    cat = 'SECURITY';
                }

                await prisma.intelItem.create({
                    data: {
                        title: article.title,
                        source: article.source_info.name,
                        url: article.url,
                        category: cat,
                        publishedAt: new Date(article.published_on * 1000), // Maps to publishedAt
                        priority: txt.includes('bitcoin') || txt.includes('etf') || txt.includes('blackrock') ? 'HIGH' : 'NORMAL'
                    }
                });
            }
        }

        // Return the latest 20 items
        return await prisma.intelItem.findMany({
            orderBy: { publishedAt: 'desc' },
            take: 20
        });

    } catch (e) {
        console.error("Feed Error:", e);
        return [];
    }
}
