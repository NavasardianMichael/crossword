-- Words written by Claude agents in development: retired by player reports like AI words.
ALTER TYPE "EntryOrigin" ADD VALUE 'claude';

-- The daily crossword's reserve: words custom puzzles never draw, until a daily places them.
ALTER TABLE "Entry" ADD COLUMN     "dailyReserve" BOOLEAN NOT NULL DEFAULT false;

-- Gemini only on need: a bucket records the gap a player's next puzzle would hit, instead of
-- "urgent" and the longest seen-list.
ALTER TABLE "PoolDemand" DROP COLUMN "maxExclude",
DROP COLUMN "urgent",
ADD COLUMN     "lengthBand" TEXT,
ADD COLUMN     "paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pausedUntil" TIMESTAMP(3),
ADD COLUMN     "shortfall" INTEGER NOT NULL DEFAULT 0;

-- One daily crossword per language per UTC day.
CREATE TABLE "DailyPuzzle" (
    "locale" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "puzzleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyPuzzle_pkey" PRIMARY KEY ("locale","date")
);

CREATE UNIQUE INDEX "DailyPuzzle_puzzleId_key" ON "DailyPuzzle"("puzzleId");

CREATE INDEX "Entry_locale_dailyReserve_idx" ON "Entry"("locale", "dailyReserve");

CREATE INDEX "PoolDemand_shortfall_idx" ON "PoolDemand"("shortfall");

ALTER TABLE "DailyPuzzle" ADD CONSTRAINT "DailyPuzzle_puzzleId_fkey" FOREIGN KEY ("puzzleId") REFERENCES "Puzzle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
