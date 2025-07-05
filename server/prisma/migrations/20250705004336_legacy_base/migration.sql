-- CreateEnum
CREATE TYPE "BlueSparkType" AS ENUM ('SPEED', 'STAMINA', 'POWER', 'GUTS', 'WIT');

-- CreateEnum
CREATE TYPE "PinkSparkType" AS ENUM ('TURF', 'DIRT', 'SPRINT', 'MILE', 'MIDDLE_DISTANCE', 'LONG_DISTANCE', 'FRONT_RUNNER', 'PACE_CHASER', 'LATE_SURGER', 'END_CLOSER');

-- CreateTable
CREATE TABLE "Legacy" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pinkSparkLegacyId" TEXT NOT NULL,

    CONSTRAINT "Legacy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlueSpark" (
    "type" "BlueSparkType" NOT NULL,
    "legacyId" TEXT NOT NULL,

    CONSTRAINT "BlueSpark_pkey" PRIMARY KEY ("legacyId")
);

-- CreateTable
CREATE TABLE "PinkSpark" (
    "type" "PinkSparkType" NOT NULL,
    "legacyId" TEXT NOT NULL,

    CONSTRAINT "PinkSpark_pkey" PRIMARY KEY ("legacyId")
);

-- AddForeignKey
ALTER TABLE "Legacy" ADD CONSTRAINT "Legacy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlueSpark" ADD CONSTRAINT "BlueSpark_legacyId_fkey" FOREIGN KEY ("legacyId") REFERENCES "Legacy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinkSpark" ADD CONSTRAINT "PinkSpark_legacyId_fkey" FOREIGN KEY ("legacyId") REFERENCES "Legacy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
