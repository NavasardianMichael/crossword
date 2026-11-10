-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "passwordHash" TEXT,
    "googleId" TEXT,
    "avatarUrl" TEXT,
    "emailVerifiedAt" TIMESTAMP(3),
    "emailVerifyTokenHash" TEXT,
    "emailVerifyExpiresAt" TIMESTAMP(3),
    "tokenVersion" INTEGER NOT NULL DEFAULT 0,
    "passwordResetTokenHash" TEXT,
    "passwordResetExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_emailVerifyTokenHash_key" ON "User"("emailVerifyTokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "User_passwordResetTokenHash_key" ON "User"("passwordResetTokenHash");
