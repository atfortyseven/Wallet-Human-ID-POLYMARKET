// prisma/seed.ts
import { PrismaClient, IdentityTier, MarketStatus, ProposalStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Iniciando Operación Génesis...')

    // 1. Crear el Arquitecto (TU USUARIO)
    // IMPORTANTE: Cambia 'admin_wallet_01' por tu wallet real si quieres ver esto logueado
    const admin = await prisma.user.upsert({
        where: { walletAddress: '0x1234567890abcdef1234567890abcdef12345678' },
        update: {},
        create: {
            walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
            email: 'admin@humanidfi.com',
            tier: IdentityTier.SOVEREIGN, // Nivel máximo
            reputation: 9000,
        },
    })
    console.log('👤 Usuario Soberano creado.')

    // 2. Inyectar Capital en la Tesorería (Para que los gráficos suban)
    await prisma.treasurySnapshot.create({
        data: {
            totalValueLocked: 54000000.50, // $54 Millones
            circulatingSupply: 12000000,
            protocolRevenue: 350000.75,    // $350k ganados
        },
    })
    console.log('💰 Tesorería fondeada.')

    // 3. Crear un Mercado Activo (Bitcoin)
    const market = await prisma.market.upsert({
        where: { slug: 'bitcoin-100k-2026' },
        update: {},
        create: {
            slug: 'bitcoin-100k-2026',
            question: 'Will Bitcoin hit $100k before Q3 2026?',
            category: 'Crypto',
            status: MarketStatus.ACTIVE,
            endDate: new Date('2026-06-30'),
            volume: 1500000,    // 1.5M Volumen
            liquidity: 500000,  // 500k Liquidez
        },
    })
    console.log('📈 Mercado de Bitcoin abierto.')

    // 4. Crear una Propuesta de Gobernanza
    await prisma.marketProposal.create({
        data: {
            question: 'Should we increase staking rewards?',
            description: 'Proposal to increase APY from 5% to 8% for Sovereign members.',
            outcomes: ["Yes", "No"],
            resolutionCriteria: 'Majority vote',
            category: 'Governance',
            creatorAddress: admin.walletAddress,
            creatorNullifier: 'nullifier-hash-secret-123',
            status: ProposalStatus.VOTING,
            votingEndsAt: new Date('2026-02-28'),
            votesFor: 150,
            votesAgainst: 20,
        }
    })
    console.log('🗳️ Propuesta de Gobernanza activa.')

    // 5. Crear una Noticia de Inteligencia (Intel)
    await prisma.intelItem.create({
        data: {
            source: 'Bloomberg AI',
            title: 'Regulatory Approval for Human-Fi likely in Q2',
            category: 'Regulation',
            url: 'https://bloomberg.com/crypto/human-fi',
            publishedAt: new Date(),
            sentimentScore: 0.85, // Muy positivo
            aiSummary: 'Fuentes internas confirman que la SEC ve con buenos ojos el modelo de identidad.',
        }
    })
    console.log('🧠 Inteligencia Artificial insertada.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
