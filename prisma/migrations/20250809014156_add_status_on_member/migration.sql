-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "status_memberId" UUID;

-- CreateTable
CREATE TABLE "Status_member" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "Status_member_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Status_member_username_key" ON "Status_member"("username");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_status_memberId_fkey" FOREIGN KEY ("status_memberId") REFERENCES "Status_member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
