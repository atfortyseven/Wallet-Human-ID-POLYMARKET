CREATE TABLE "User" (
  "walletAddress" TEXT NOT NULL PRIMARY KEY,
  "worldIdNullifierHash" TEXT UNIQUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now()
);

CREATE TABLE "UserMetrics" (
  "id" SERIAL PRIMARY KEY,
  "userAddress" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  CONSTRAINT "UserMetrics_userAddress_fkey" FOREIGN KEY ("userAddress") REFERENCES "User"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE
);
