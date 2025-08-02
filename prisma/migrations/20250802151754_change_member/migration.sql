/*
  Warnings:

  - You are about to drop the column `roleId` on the `Member` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_roleId_fkey";

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "roleId";
