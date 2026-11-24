-- The account's seen-list: a puzzle a signed-in player was shown, and how each of its words went
-- (one byte per word, an index into WORD_STATES). Its words are left out of the player's next
-- puzzles in that language, on any device.
CREATE TABLE "PuzzlePlay" (
    "userId" TEXT NOT NULL,
    "puzzleId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "states" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PuzzlePlay_pkey" PRIMARY KEY ("userId","puzzleId")
);

CREATE INDEX "PuzzlePlay_userId_locale_idx" ON "PuzzlePlay"("userId", "locale");

ALTER TABLE "PuzzlePlay" ADD CONSTRAINT "PuzzlePlay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PuzzlePlay" ADD CONSTRAINT "PuzzlePlay_puzzleId_fkey" FOREIGN KEY ("puzzleId") REFERENCES "Puzzle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
