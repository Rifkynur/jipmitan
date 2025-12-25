/*
  Warnings:

  - A unique constraint covering the columns `[memberId,date]` on the table `Income` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Income_memberId_date_key" ON "Income"("memberId", "date");
