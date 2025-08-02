/*
  Warnings:

  - You are about to drop the column `rtId` on the `Income` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Income" DROP CONSTRAINT "Income_rtId_fkey";

-- AlterTable
ALTER TABLE "Income" DROP COLUMN "rtId";
