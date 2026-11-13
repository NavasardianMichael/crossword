-- Free credits replace the free puzzle (docs/BILLING.md): every holder gets FREE_MONTHLY_CREDITS
-- (11) a month. FreePuzzle becomes FreeSpend, one row per puzzle that took free credits; a free
-- puzzle already claimed this month spent all 11.
ALTER TABLE "FreePuzzle" RENAME TO "FreeSpend";
ALTER TABLE "FreeSpend" RENAME CONSTRAINT "FreePuzzle_pkey" TO "FreeSpend_pkey";
ALTER TABLE "FreeSpend" ADD COLUMN "amount" INTEGER NOT NULL DEFAULT 11;
ALTER TABLE "FreeSpend" ALTER COLUMN "amount" DROP DEFAULT;
ALTER TABLE "FreeSpend" ADD CONSTRAINT "FreeSpend_amount_positive" CHECK ("amount" > 0);

-- A holder now spends in several puzzles a month: no longer one row per (month, holder).
DROP INDEX "FreePuzzle_month_holder_key";
CREATE INDEX "FreeSpend_month_holder_idx" ON "FreeSpend"("month", "holder");
ALTER INDEX "FreePuzzle_month_ipKey_idx" RENAME TO "FreeSpend_month_ipKey_idx";

-- The hourly cap on free credits counts the spends of the last hour.
CREATE INDEX "FreeSpend_createdAt_idx" ON "FreeSpend"("createdAt");
