/*
  Warnings:

  - You are about to drop the column `rt` on the `Income` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rtId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "userId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Income" DROP COLUMN "rt",
ADD COLUMN     "rtId" UUID,
ADD COLUMN     "userId" UUID;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rtId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Rt" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Rt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "roleId" UUID NOT NULL,
    "rtId" UUID NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rt_name_key" ON "Rt"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Member_name_key" ON "Member"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rtId_fkey" FOREIGN KEY ("rtId") REFERENCES "Rt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_rtId_fkey" FOREIGN KEY ("rtId") REFERENCES "Rt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_rtId_fkey" FOREIGN KEY ("rtId") REFERENCES "Rt"("id") ON DELETE SET NULL ON UPDATE CASCADE;
