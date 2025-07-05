/*
  Warnings:

  - You are about to drop the column `pinkSparkLegacyId` on the `Legacy` table. All the data in the column will be lost.
  - Added the required column `stars` to the `BlueSpark` table without a default value. This is not possible if the table is not empty.
  - Added the required column `active` to the `Legacy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stars` to the `PinkSpark` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlueSpark" ADD COLUMN     "stars" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Legacy" DROP COLUMN "pinkSparkLegacyId",
ADD COLUMN     "active" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "PinkSpark" ADD COLUMN     "stars" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "friendCode" TEXT;
