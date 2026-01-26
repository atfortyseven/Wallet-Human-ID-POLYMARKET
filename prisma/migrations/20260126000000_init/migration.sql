-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING_RELAY', 'SUBMITTED', 'CONFIRMED', 'FAILED');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('PENDING', 'VOTING', 'APPROVED', 'REJECTED', 'CREATED', 'RESOLVED', 'CANCELLED', 'EXECUTED');

-- CreateEnum
CREATE TYPE "VoteChoice" AS ENUM ('FOR', 'AGAINST', 'ABSTAIN');

-- CreateEnum
CREATE TYPE "FeeType" AS ENUM ('TRADING_FEE', 'CREATION_FEE', 'RESOLUTION_FEE');

-- CreateEnum
CREATE TYPE "DistributionStatus" AS ENUM ('PENDING', 'PUBLISHED', 'EXPIRED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ZapStatus" AS ENUM ('PENDING', 'SWAPPING', 'BUYING', 'COMPLETED', 'FAILED', 'PARTIAL_FAIL');

-- CreateTable
CREATE TABLE "User" (
    "walletAddress" TEXT NOT NULL,
    "worldIdNullifierHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("walletAddress")
);

-- CreateTable
CREATE TABLE "MarketProposal" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "outcomes" JSONB NOT NULL,
    "resolutionCriteria" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "creatorAddress" TEXT NOT NULL,
    "creatorNullifier" TEXT NOT NULL,
    "votesFor" INTEGER NOT NULL DEFAULT 0,
    "votesAgainst" INTEGER NOT NULL DEFAULT 0,
    "votingThreshold" INTEGER NOT NULL DEFAULT 100,
    "status" "ProposalStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "votingEndsAt" TIMESTAMP(3) NOT NULL,
    "approvedAt" TIMESTAMP(3),
    "marketCreatedAt" TIMESTAMP(3),
    "proposalId" TEXT,
    "polymarketId" TEXT,
    "conditionId" TEXT,
    "totalFeesAccrued" DECIMAL(18,6) NOT NULL DEFAULT 0,
    "lastRoyaltyUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "txStatus" "TransactionStatus" NOT NULL DEFAULT 'PENDING_RELAY',
    "txHash" TEXT,
    "onChainId" INTEGER,
    "executedAt" TIMESTAMP(3),
    "executionTxHash" TEXT,

    CONSTRAINT "MarketProposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalVote" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "nullifierHash" TEXT NOT NULL,
    "voterAddress" TEXT NOT NULL,
    "vote" "VoteChoice" NOT NULL,
    "votedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "merkleRoot" TEXT NOT NULL,
    "proof" JSONB NOT NULL,
    "verificationLevel" TEXT NOT NULL DEFAULT 'orb',
    "ipfsHash" TEXT,
    "txHash" TEXT,
    "txStatus" "TransactionStatus" NOT NULL DEFAULT 'PENDING_RELAY',
    "errorMessage" TEXT,

    CONSTRAINT "ProposalVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoyaltyAccrual" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "amount" DECIMAL(18,6) NOT NULL,
    "feeType" "FeeType" NOT NULL,
    "txHash" TEXT NOT NULL,
    "blockNumber" BIGINT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "merkleTreeId" TEXT,
    "claimed" BOOLEAN NOT NULL DEFAULT false,
    "claimedAt" TIMESTAMP(3),
    "claimTxHash" TEXT,

    CONSTRAINT "RoyaltyAccrual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerkleDistribution" (
    "id" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "merkleRoot" TEXT NOT NULL,
    "totalAmount" DECIMAL(18,6) NOT NULL,
    "ipfsHash" TEXT NOT NULL,
    "treeData" JSONB NOT NULL,
    "totalClaims" INTEGER NOT NULL DEFAULT 0,
    "totalClaimed" DECIMAL(18,6) NOT NULL DEFAULT 0,
    "status" "DistributionStatus" NOT NULL DEFAULT 'PENDING',
    "publishedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MerkleDistribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardClaim" (
    "id" TEXT NOT NULL,
    "merkleTreeId" TEXT NOT NULL,
    "claimerAddress" TEXT NOT NULL,
    "amount" DECIMAL(18,6) NOT NULL,
    "merkleProof" JSONB NOT NULL,
    "leafIndex" INTEGER NOT NULL,
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "txHash" TEXT NOT NULL,
    "gasUsed" BIGINT NOT NULL,

    CONSTRAINT "RewardClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZapTransaction" (
    "id" TEXT NOT NULL,
    "userAddress" TEXT NOT NULL,
    "wldAmount" DECIMAL(18,6) NOT NULL,
    "wldPriceUSD" DECIMAL(18,6) NOT NULL,
    "usdcReceived" DECIMAL(18,6) NOT NULL,
    "slippage" DECIMAL(5,4) NOT NULL,
    "dexUsed" TEXT NOT NULL,
    "marketId" TEXT NOT NULL,
    "outcomeIndex" INTEGER NOT NULL,
    "sharesReceived" DECIMAL(18,6) NOT NULL,
    "txHash" TEXT NOT NULL,
    "blockNumber" BIGINT NOT NULL,
    "gasUsed" BIGINT NOT NULL,
    "gasPaidBy" TEXT NOT NULL,
    "status" "ZapStatus" NOT NULL,
    "errorMessage" TEXT,
    "initiatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ZapTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMetrics" (
    "id" TEXT NOT NULL,
    "userAddress" TEXT NOT NULL,
    "proposalsCreated" INTEGER NOT NULL DEFAULT 0,
    "votescast" INTEGER NOT NULL DEFAULT 0,
    "zapsExecuted" INTEGER NOT NULL DEFAULT 0,
    "totalWLDZapped" DECIMAL(18,6) NOT NULL DEFAULT 0,
    "totalRoyaltiesEarned" DECIMAL(18,6) NOT NULL DEFAULT 0,
    "totalRoyaltiesClaimed" DECIMAL(18,6) NOT NULL DEFAULT 0,
    "successfulProposals" INTEGER NOT NULL DEFAULT 0,
    "reputationScore" INTEGER NOT NULL DEFAULT 0,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_worldIdNullifierHash_key" ON "User"("worldIdNullifierHash");

-- CreateIndex
CREATE UNIQUE INDEX "MarketProposal_creatorNullifier_key" ON "MarketProposal"("creatorNullifier");

-- CreateIndex
CREATE UNIQUE INDEX "MarketProposal_proposalId_key" ON "MarketProposal"("proposalId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketProposal_polymarketId_key" ON "MarketProposal"("polymarketId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketProposal_txHash_key" ON "MarketProposal"("txHash");

-- CreateIndex
CREATE UNIQUE INDEX "MarketProposal_onChainId_key" ON "MarketProposal"("onChainId");

-- CreateIndex
CREATE INDEX "MarketProposal_status_votingEndsAt_idx" ON "MarketProposal"("status", "votingEndsAt");

-- CreateIndex
CREATE INDEX "MarketProposal_creatorAddress_idx" ON "MarketProposal"("creatorAddress");

-- CreateIndex
CREATE INDEX "MarketProposal_createdAt_idx" ON "MarketProposal"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProposalVote_proposalId_nullifierHash_key" ON "ProposalVote"("proposalId", "nullifierHash");

-- CreateIndex
CREATE INDEX "ProposalVote_proposalId_votedAt_idx" ON "ProposalVote"("proposalId", "votedAt");

-- CreateIndex
CREATE INDEX "ProposalVote_nullifierHash_idx" ON "ProposalVote"("nullifierHash");

-- CreateIndex
CREATE UNIQUE INDEX "RoyaltyAccrual_txHash_key" ON "RoyaltyAccrual"("txHash");

-- CreateIndex
CREATE INDEX "RoyaltyAccrual_proposalId_timestamp_idx" ON "RoyaltyAccrual"("proposalId", "timestamp");

-- CreateIndex
CREATE INDEX "RoyaltyAccrual_merkleTreeId_claimed_idx" ON "RoyaltyAccrual"("merkleTreeId", "claimed");

-- CreateIndex
CREATE UNIQUE INDEX "MerkleDistribution_merkleRoot_key" ON "MerkleDistribution"("merkleRoot");

-- CreateIndex
CREATE INDEX "MerkleDistribution_periodEnd_status_idx" ON "MerkleDistribution"("periodEnd", "status");

-- CreateIndex
CREATE UNIQUE INDEX "RewardClaim_txHash_key" ON "RewardClaim"("txHash");

-- CreateIndex
CREATE UNIQUE INDEX "RewardClaim_merkleTreeId_claimerAddress_key" ON "RewardClaim"("merkleTreeId", "claimerAddress");

-- CreateIndex
CREATE INDEX "RewardClaim_claimerAddress_claimedAt_idx" ON "RewardClaim"("claimerAddress", "claimedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ZapTransaction_txHash_key" ON "ZapTransaction"("txHash");

-- CreateIndex
CREATE INDEX "ZapTransaction_userAddress_initiatedAt_idx" ON "ZapTransaction"("userAddress", "initiatedAt");

-- CreateIndex
CREATE INDEX "ZapTransaction_status_idx" ON "ZapTransaction"("status");

-- CreateIndex
CREATE UNIQUE INDEX "UserMetrics_userAddress_key" ON "UserMetrics"("userAddress");

-- CreateIndex
CREATE INDEX "UserMetrics_reputationScore_idx" ON "UserMetrics"("reputationScore");

-- CreateIndex
CREATE INDEX "UserMetrics_lastActiveAt_idx" ON "UserMetrics"("lastActiveAt");

-- AddForeignKey
ALTER TABLE "MarketProposal" ADD CONSTRAINT "MarketProposal_creatorAddress_fkey" FOREIGN KEY ("creatorAddress") REFERENCES "User"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalVote" ADD CONSTRAINT "ProposalVote_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "MarketProposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalVote" ADD CONSTRAINT "ProposalVote_voterAddress_fkey" FOREIGN KEY ("voterAddress") REFERENCES "User"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoyaltyAccrual" ADD CONSTRAINT "RoyaltyAccrual_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "MarketProposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardClaim" ADD CONSTRAINT "RewardClaim_merkleTreeId_fkey" FOREIGN KEY ("merkleTreeId") REFERENCES "MerkleDistribution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardClaim" ADD CONSTRAINT "RewardClaim_claimerAddress_fkey" FOREIGN KEY ("claimerAddress") REFERENCES "User"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZapTransaction" ADD CONSTRAINT "ZapTransaction_userAddress_fkey" FOREIGN KEY ("userAddress") REFERENCES "User"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMetrics" ADD CONSTRAINT "UserMetrics_userAddress_fkey" FOREIGN KEY ("userAddress") REFERENCES "User"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;
