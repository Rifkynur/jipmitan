/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Income` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "Income" DROP COLUMN "deletedAt";
