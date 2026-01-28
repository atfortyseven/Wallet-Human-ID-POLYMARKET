import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic'; // Ensure real-time data

export async function GET() {
    try {
        const markets = await prisma.market.findMany({
            select: {
                slug: true,  // This corresponds to the Market Address
                riskLevel: true
            }
        });

        return NextResponse.json(markets);
    } catch (error) {
        console.error("Error fetching market metadata:", error);
        return NextResponse.json({ error: "Failed to fetch markets" }, { status: 500 });
    }
}
