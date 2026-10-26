-- CreateEnum
CREATE TYPE "PuzzleFormat" AS ENUM ('classic', 'scanword');

-- CreateEnum
CREATE TYPE "EntryOrigin" AS ENUM ('ai', 'seed');

-- CreateEnum
CREATE TYPE "EntryKind" AS ENUM ('common', 'proper');

-- CreateEnum
CREATE TYPE "ClueStyle" AS ENUM ('full', 'short');

-- CreateTable
CREATE TABLE "Entry" (
    "id" SERIAL NOT NULL,
    "locale" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "display" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "firstCell" TEXT NOT NULL,
    "topics" TEXT[],
    "difficulty" INTEGER NOT NULL,
    "kind" "EntryKind" NOT NULL DEFAULT 'common',
    "origin" "EntryOrigin" NOT NULL DEFAULT 'ai',
    "model" TEXT,
    "servedCount" INTEGER NOT NULL DEFAULT 0,
    "revealCount" INTEGER NOT NULL DEFAULT 0,
    "reportCount" INTEGER NOT NULL DEFAULT 0,
    "retiredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clue" (
    "id" TEXT NOT NULL,
    "entryId" INTEGER NOT NULL,
    "style" "ClueStyle" NOT NULL,
    "text" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "servedCount" INTEGER NOT NULL DEFAULT 0,
    "reportCount" INTEGER NOT NULL DEFAULT 0,
    "retiredAt" TIMESTAMP(3),
    "model" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Clue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Puzzle" (
    "id" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "format" "PuzzleFormat" NOT NULL,
    "topic" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "seed" INTEGER NOT NULL,
    "layoutVersion" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "entryIds" INTEGER[],
    "clueIds" TEXT[],
    "playCount" INTEGER NOT NULL DEFAULT 0,
    "solveCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Puzzle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntryReport" (
    "id" TEXT NOT NULL,
    "entryId" INTEGER NOT NULL,
    "clueId" TEXT,
    "puzzleId" TEXT,
    "reporterKey" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EntryReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoolDemand" (
    "locale" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "requests" INTEGER NOT NULL DEFAULT 0,
    "maxExclude" INTEGER NOT NULL DEFAULT 0,
    "urgent" BOOLEAN NOT NULL DEFAULT false,
    "lastRequestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PoolDemand_pkey" PRIMARY KEY ("locale","topic","difficulty")
);

-- CreateTable
CREATE TABLE "GenerationLog" (
    "id" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "subtopic" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "letters" TEXT[],
    "model" TEXT NOT NULL,
    "promptVariant" TEXT NOT NULL,
    "calls" INTEGER NOT NULL DEFAULT 1,
    "returned" INTEGER NOT NULL,
    "valid" INTEGER NOT NULL,
    "verified" INTEGER NOT NULL,
    "inserted" INTEGER NOT NULL,
    "mergedClues" INTEGER NOT NULL,
    "ms" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GenerationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Entry_locale_difficulty_length_idx" ON "Entry"("locale", "difficulty", "length");

-- CreateIndex
CREATE INDEX "Entry_locale_firstCell_idx" ON "Entry"("locale", "firstCell");

-- CreateIndex
CREATE INDEX "Entry_topics_idx" ON "Entry" USING GIN ("topics");

-- CreateIndex
CREATE UNIQUE INDEX "Entry_locale_answer_key" ON "Entry"("locale", "answer");

-- CreateIndex
CREATE INDEX "Clue_entryId_style_idx" ON "Clue"("entryId", "style");

-- CreateIndex
CREATE UNIQUE INDEX "Clue_entryId_hash_key" ON "Clue"("entryId", "hash");

-- CreateIndex
CREATE INDEX "Puzzle_locale_createdAt_idx" ON "Puzzle"("locale", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "EntryReport_entryId_reporterKey_key" ON "EntryReport"("entryId", "reporterKey");

-- CreateIndex
CREATE INDEX "GenerationLog_locale_topic_createdAt_idx" ON "GenerationLog"("locale", "topic", "createdAt");

-- CreateIndex
CREATE INDEX "GenerationLog_createdAt_idx" ON "GenerationLog"("createdAt");

-- AddForeignKey
ALTER TABLE "Clue" ADD CONSTRAINT "Clue_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryReport" ADD CONSTRAINT "EntryReport_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
