-- CreateEnum
CREATE TYPE "ExerciseMetric" AS ENUM ('REPS', 'WEIGHT_REPS', 'TIME', 'DISTANCE');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "IconType" AS ENUM ('EMOJI', 'PHOTO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "name" TEXT,
    "image" TEXT,
    "iconType" "IconType" NOT NULL DEFAULT 'EMOJI',
    "iconEmoji" TEXT NOT NULL DEFAULT '🍫',
    "heightCm" DOUBLE PRECISION,
    "sex" "Sex",
    "birthDate" TIMESTAMP(3),
    "goalWeightKg" DOUBLE PRECISION,
    "declaration" TEXT,
    "heatmapColor" TEXT NOT NULL DEFAULT 'brown',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "WeightEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "weightKg" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeightEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "metric" "ExerciseMetric" NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT true,
    "ownerId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ExerciseType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutVideo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkoutVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "exerciseTypeId" TEXT NOT NULL,
    "reps" INTEGER,
    "weightKg" DOUBLE PRECISION,
    "durationSec" INTEGER,
    "distanceM" DOUBLE PRECISION,
    "note" TEXT,
    "videoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkoutLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealPhoto" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "thumbPath" TEXT NOT NULL,
    "caption" TEXT,
    "eatenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sharedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BodyPhoto" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "thumbPath" TEXT NOT NULL,
    "note" TEXT,
    "takenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BodyPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "WeightEntry_userId_date_idx" ON "WeightEntry"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "WeightEntry_userId_date_key" ON "WeightEntry"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseType_name_ownerId_key" ON "ExerciseType"("name", "ownerId");

-- CreateIndex
CREATE INDEX "WorkoutVideo_userId_idx" ON "WorkoutVideo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutVideo_userId_url_key" ON "WorkoutVideo"("userId", "url");

-- CreateIndex
CREATE INDEX "WorkoutLog_userId_date_idx" ON "WorkoutLog"("userId", "date");

-- CreateIndex
CREATE INDEX "WorkoutLog_videoId_idx" ON "WorkoutLog"("videoId");

-- CreateIndex
CREATE INDEX "MealPhoto_userId_eatenAt_idx" ON "MealPhoto"("userId", "eatenAt");

-- CreateIndex
CREATE INDEX "MealPhoto_sharedAt_idx" ON "MealPhoto"("sharedAt");

-- CreateIndex
CREATE INDEX "BodyPhoto_userId_takenAt_idx" ON "BodyPhoto"("userId", "takenAt");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeightEntry" ADD CONSTRAINT "WeightEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutVideo" ADD CONSTRAINT "WorkoutVideo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutLog" ADD CONSTRAINT "WorkoutLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutLog" ADD CONSTRAINT "WorkoutLog_exerciseTypeId_fkey" FOREIGN KEY ("exerciseTypeId") REFERENCES "ExerciseType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutLog" ADD CONSTRAINT "WorkoutLog_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "WorkoutVideo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPhoto" ADD CONSTRAINT "MealPhoto_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BodyPhoto" ADD CONSTRAINT "BodyPhoto_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
