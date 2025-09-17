/*
  Warnings:

  - You are about to drop the column `username` on the `Status_member` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Status_member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Status_member` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Status_member_username_key";

-- AlterTable
ALTER TABLE "Status_member" DROP COLUMN "username",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Status_member_name_key" ON "Status_member"("name");
