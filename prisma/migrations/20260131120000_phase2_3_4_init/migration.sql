-- CreateEnum
CREATE TYPE "WalletTransactionType" AS ENUM ('SEND', 'RECEIVE', 'SWAP', 'CONTRACT', 'NFT_TRANSFER', 'STAKE', 'UNSTAKE');

-- CreateEnum
CREATE TYPE "WalletTransactionStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED');

-- CreateEnum
CREATE TYPE "WalletType" AS ENUM ('PRIMARY', 'DERIVED', 'IMPORTED', 'WATCH_ONLY', 'HARDWARE');

-- AlterTable
ALTER TABLE "AuthUser" ADD COLUMN IF NOT EXISTS "walletAddress" TEXT;
ALTER TABLE "AuthUser" ADD COLUMN IF NOT EXISTS "encryptedMnemonic" TEXT;
ALTER TABLE "AuthUser" ADD COLUMN IF NOT EXISTS "encryptedPrivateKey" TEXT;
ALTER TABLE "AuthUser" ADD COLUMN IF NOT EXISTS "walletSalt" TEXT;

-- CreateTable
CREATE TABLE IF NOT EXISTS "Transaction" (
    "id" TEXT NOT NULL,
    "authUserId" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "type" "WalletTransactionType" NOT NULL,
    "status" "WalletTransactionStatus" NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "value" DECIMAL(32,18) NOT NULL,
    "tokenAddress" TEXT,
    "tokenSymbol" TEXT,
    "gasUsed" BIGINT,
    "gasPrice" DECIMAL(32,18),
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "AddressBookEntry" (
    "id" TEXT NOT NULL,
    "authUserId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "ensName" TEXT,
    "label" TEXT,
    "note" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "chainId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AddressBookEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Authenticator" (
    "id" TEXT NOT NULL,
    "credentialID" TEXT NOT NULL,
    "credentialPublicKey" TEXT NOT NULL,
    "counter" BIGINT NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "WalletAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "WalletType" NOT NULL DEFAULT 'DERIVED',
    "derivationPath" TEXT,
    "index" INTEGER,
    "encryptedKey" TEXT,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "AuthUser_walletAddress_key" ON "AuthUser"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Transaction_hash_key" ON "Transaction"("hash");
CREATE INDEX IF NOT EXISTS "Transaction_authUserId_timestamp_idx" ON "Transaction"("authUserId", "timestamp");
CREATE INDEX IF NOT EXISTS "Transaction_hash_idx" ON "Transaction"("hash");
CREATE INDEX IF NOT EXISTS "Transaction_chainId_idx" ON "Transaction"("chainId");
CREATE INDEX IF NOT EXISTS "Transaction_type_idx" ON "Transaction"("type");
CREATE INDEX IF NOT EXISTS "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AddressBookEntry_authUserId_isFavorite_idx" ON "AddressBookEntry"("authUserId", "isFavorite");
CREATE INDEX IF NOT EXISTS "AddressBookEntry_authUserId_label_idx" ON "AddressBookEntry"("authUserId", "label");
CREATE UNIQUE INDEX IF NOT EXISTS "AddressBookEntry_authUserId_address_key" ON "AddressBookEntry"("authUserId", "address");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Authenticator_credentialID_key" ON "Authenticator"("credentialID");
CREATE INDEX IF NOT EXISTS "Authenticator_userId_idx" ON "Authenticator"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "WalletAccount_userId_idx" ON "WalletAccount"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "WalletAccount_userId_address_key" ON "WalletAccount"("userId", "address");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Transaction_authUserId_fkey') THEN
        ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_authUserId_fkey" FOREIGN KEY ("authUserId") REFERENCES "AuthUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Authenticator_userId_fkey') THEN
        ALTER TABLE "Authenticator" ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'WalletAccount_userId_fkey') THEN
        ALTER TABLE "WalletAccount" ADD CONSTRAINT "WalletAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
