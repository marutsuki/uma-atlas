/*
  Warnings:

  - Added the required column `stars` to the `BlueSpark` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stars` to the `PinkSpark` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlueSpark" ADD COLUMN     "stars" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PinkSpark" ADD COLUMN     "stars" INTEGER NOT NULL;
