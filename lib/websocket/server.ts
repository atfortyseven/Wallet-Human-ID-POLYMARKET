import { Server as HTTPServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { prisma } from '@/lib/prisma';
import { verifyPremiumAccess } from '@/lib/security/premium-security';

let io: SocketServer | null = null;

export function initializeWebSocket(server: HTTPServer) {
  if (io) return io;

  io = new SocketServer(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', async (socket) => {
    console.log('[WebSocket] Client connected:', socket.id);

    // Authenticate user
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      socket.disconnect();
      return;
    }

    // Join user-specific room
    socket.join(`user:${userId}`);

    // Check premium status
    const access = await verifyPremiumAccess(userId);
    const isPremium = access.valid;

    if (isPremium) {
      socket.join('premium');
    }

    // Subscribe to whale wallets
    socket.on('subscribe-wallets', async (walletAddresses: string[]) => {
      if (!isPremium && walletAddresses.length > 3) {
        socket.emit('error', { message: 'Free tier limited to 3 wallets' });
        return;
      }

      walletAddresses.forEach(address => {
        socket.join(`wallet:${address.toLowerCase()}`);
      });

      console.log(`[WebSocket] User ${userId} subscribed to ${walletAddresses.length} wallets`);
    });

    // Unsubscribe from wallets
    socket.on('unsubscribe-wallets', (walletAddresses: string[]) => {
      walletAddresses.forEach(address => {
        socket.leave(`wallet:${address.toLowerCase()}`);
      });
    });

    socket.on('disconnect', () => {
      console.log('[WebSocket] Client disconnected:', socket.id);
    });
  });

  // Start whale activity monitoring
  startWhaleActivityMonitor();
  startLeaderboardUpdates();
  startAchievementChecker();

  return io;
}

// ============================================
// REAL-TIME WHALE ACTIVITY MONITORING
// ============================================

async function startWhaleActivityMonitor() {
  console.log('[WebSocket] Starting whale activity monitor...');

  // In production, this would connect to blockchain nodes via Alchemy/Infura
  // For now, simulate with periodic checks
  setInterval(async () => {
    try {
      // Fetch recent whale activities from database
      const activities = await prisma.whaleActivity.findMany({
        where: {
          timestamp: {
            gte: new Date(Date.now() - 60000), // Last minute
          },
        },
        orderBy: { timestamp: 'desc' },
        take: 50,
      });

      // Broadcast to relevant subscribers
      for (const activity of activities) {
        const room = `wallet:${activity.walletAddress.toLowerCase()}`;
        io?.to(room).emit('whale-activity', {
          id: activity.id,
          type: activity.type,
          token: activity.token,
          amount: activity.amount.toString(),
          usdValue: activity.usdValue.toString(),
          fromAddress: activity.fromAddress,
          toAddress: activity.toAddress,
          timestamp: activity.timestamp,
          transactionHash: activity.transactionHash,
        });

        // Also broadcast to premium users feed
        io?.to('premium').emit('whale-feed', {
          walletAddress: activity.walletAddress,
          ...activity,
        });

        // ============================================
        // [NEW] AUTOMATED TELEGRAM ROUTING
        // ============================================
        const subscribers = await prisma.userSettings.findMany({
          where: {
            telegramEnabled: true,
            telegramChatId: { not: null },
          }
        });

        const { formatWhaleAlertTelegram, sendTelegramMessage } = await import('../telegramBot');
        
        const messageText = formatWhaleAlertTelegram({
          address: activity.walletAddress,
          type: activity.type,
          amount: Number(activity.usdValue),
          token: activity.token,
          txHash: activity.transactionHash,
        });

        for (const sub of subscribers) {
          if (sub.telegramChatId) {
            await sendTelegramMessage({
              chatId: sub.telegramChatId,
              text: messageText,
              threadId: sub.telegramTopicId || undefined,
            });
          }
        }
      }
    } catch (error) {
      console.error('[WebSocket] Activity monitor error:', error);
    }
  }, 10000); // Check every 10 seconds
}

// ============================================
// LEADERBOARD UPDATES
// ============================================

async function startLeaderboardUpdates() {
  console.log('[WebSocket] Starting leaderboard updates...');

  setInterval(async () => {
    try {
      // Update leaderboards
      const topProfits = await prisma.userStats.findMany({
        take: 100,
        orderBy: { totalProfitUSD: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      const topWinRates = await prisma.userStats.findMany({
        where: {
          totalCopyTrades: { gte: 10 }, // Minimum 10 trades
        },
        take: 100,
        orderBy: { copyTradeWinRate: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      const topStreaks = await prisma.userStats.findMany({
        take: 100,
        orderBy: { currentStreak: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Broadcast leaderboards
      io?.to('premium').emit('leaderboard-update', {
        profits: topProfits.slice(0, 10),
        winRates: topWinRates.slice(0, 10),
        streaks: topStreaks.slice(0, 10),
        updatedAt: new Date(),
      });

      // Cache in database
      await updateLeaderboardCache(topProfits, topWinRates, topStreaks);
    } catch (error) {
      console.error('[WebSocket] Leaderboard error:', error);
    }
  }, 300000); // Update every 5 minutes
}

async function updateLeaderboardCache(
  profits: any[],
  winRates: any[],
  streaks: any[]
) {
  // Clear old cache
  await prisma.leaderboard.deleteMany({
    where: {
      updatedAt: {
        lt: new Date(Date.now() - 3600000), // Older than 1 hour
      },
    },
  });

  // Insert new cache
  const entries = [
    ...profits.map((stat, index) => ({
      userId: stat.userId,
      username: stat.user.name || 'Anonymous',
      metric: 'PROFIT',
      value: stat.totalProfitUSD,
      rank: index + 1,
    })),
    ...winRates.map((stat, index) => ({
      userId: stat.userId,
      username: stat.user.name || 'Anonymous',
      metric: 'WIN_RATE',
      value: stat.copyTradeWinRate,
      rank: index + 1,
    })),
    ...streaks.map((stat, index) => ({
      userId: stat.userId,
      username: stat.user.name || 'Anonymous',
      metric: 'STREAK',
      value: stat.currentStreak,
      rank: index + 1,
    })),
  ];

  for (const entry of entries) {
    await prisma.leaderboard.upsert({
      where: {
        id: `${entry.userId}-${entry.metric}`,
      },
      create: {
        id: `${entry.userId}-${entry.metric}`,
        ...entry,
      },
      update: entry,
    });
  }
}

// ============================================
// ACHIEVEMENT CHECKER
// ============================================

async function startAchievementChecker() {
  console.log('[WebSocket] Starting achievement checker...');

  setInterval(async () => {
    try {
      const users = await prisma.userStats.findMany({
        where: {
          updatedAt: {
            gte: new Date(Date.now() - 3600000), // Active in last hour
          },
        },
      });

      for (const stats of users) {
        const newAchievements = await checkAchievements(stats);
        
        if (newAchievements.length > 0) {
          // Save achievements
          await prisma.achievement.createMany({
            data: newAchievements.map(ach => ({
              userId: stats.userId,
              type: ach.type,
              tier: ach.tier,
              metadata: ach.metadata,
            })),
            skipDuplicates: true,
          });

          // Notify user in real-time
          io?.to(`user:${stats.userId}`).emit('achievement-unlocked', newAchievements);

          // Create notification
          for (const achievement of newAchievements) {
            await prisma.notification.create({
              data: {
                userId: stats.userId,
                type: 'ACHIEVEMENT',
                title: `🏆 Achievement Unlocked!`,
                message: getAchievementMessage(achievement),
                priority: 'HIGH',
              },
            });
          }
        }
      }
    } catch (error) {
      console.error('[WebSocket] Achievement checker error:', error);
    }
  }, 60000); // Check every minute
}

async function checkAchievements(stats: any) {
  const achievements = [];

  // First Trade
  if (stats.totalCopyTrades === 1) {
    achievements.push({
      type: 'FIRST_TRADE',
      tier: 'BRONZE',
      metadata: {},
    });
  }

  // Win Streak
  if (stats.currentStreak >= 7 && stats.currentStreak < 30) {
    achievements.push({
      type: 'WEEK_STREAK',
      tier: 'SILVER',
      metadata: { streak: stats.currentStreak },
    });
  } else if (stats.currentStreak >= 30 && stats.currentStreak < 100) {
    achievements.push({
      type: 'MONTH_STREAK',
      tier: 'GOLD',
      metadata: { streak: stats.currentStreak },
    });
  } else if (stats.currentStreak >= 100) {
    achievements.push({
      type: 'LEGEND_STREAK',
      tier: 'DIAMOND',
      metadata: { streak: stats.currentStreak },
    });
  }

  // Profit Milestones
  const profit = parseFloat(stats.totalProfitUSD.toString());
  if (profit >= 1000 && profit < 10000) {
    achievements.push({
      type: 'PROFIT_1K',
      tier: 'BRONZE',
      metadata: { profit },
    });
  } else if (profit >= 10000 && profit < 100000) {
    achievements.push({
      type: 'PROFIT_10K',
      tier: 'SILVER',
      metadata: { profit },
    });
  } else if (profit >= 100000) {
    achievements.push({
      type: 'PROFIT_100K',
      tier: 'GOLD',
      metadata: { profit },
    });
  }

  // Win Rate
  if (stats.totalCopyTrades >= 10) {
    const winRate = parseFloat(stats.copyTradeWinRate.toString());
    if (winRate >= 90) {
      achievements.push({
        type: 'PERFECT_TRADER',
        tier: 'DIAMOND',
        metadata: { winRate },
      });
    } else if (winRate >= 75) {
      achievements.push({
        type: 'PRO_TRADER',
        tier: 'GOLD',
        metadata: { winRate },
      });
    }
  }

  return achievements;
}

function getAchievementMessage(achievement: any): string {
  const messages: Record<string, string> = {
    FIRST_TRADE: "You've executed your first copy trade!",
    WEEK_STREAK: `${achievement.metadata.streak} day streak! You're on fire!`,
    MONTH_STREAK: `${achievement.metadata.streak} day streak! Legendary dedication!`,
    LEGEND_STREAK: `${achievement.metadata.streak} day streak! You're a trading legend!`,
    PROFIT_1K: 'First $1,000 in profits! Keep it up!',
    PROFIT_10K: '$10,000 in profits! You\'re crushing it!',
    PROFIT_100K: '$100,000 in profits! Pro trader status!',
    PERFECT_TRADER: `${achievement.metadata.winRate}% win rate! Absolutely incredible!`,
    PRO_TRADER: `${achievement.metadata.winRate}% win rate! Professional level!`,
  };

  return messages[achievement.type] || 'New achievement unlocked!';
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function getIO(): SocketServer | null {
  return io;
}

export function broadcastToUser(userId: string, event: string, data: any) {
  io?.to(`user:${userId}`).emit(event, data);
}

export function broadcastToPremium(event: string, data: any) {
  io?.to('premium').emit(event, data);
}

export function broadcastToWallet(walletAddress: string, event: string, data: any) {
  io?.to(`wallet:${walletAddress.toLowerCase()}`).emit(event, data);
}
