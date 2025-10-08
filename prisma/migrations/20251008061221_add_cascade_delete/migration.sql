-- DropForeignKey
ALTER TABLE "Income" DROP CONSTRAINT "Income_memberId_fkey";

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
