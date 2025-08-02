/*
  Warnings:

  - You are about to drop the column `name` on the `Income` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Income" DROP COLUMN "name",
ADD COLUMN     "memberId" UUID;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
