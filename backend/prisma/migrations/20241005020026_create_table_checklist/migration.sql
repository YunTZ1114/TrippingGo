/*
  Warnings:

  - You are about to drop the column `tripId` on the `check_lists` table. All the data in the column will be lost.
  - Added the required column `tripMemberId` to the `check_lists` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "check_lists" DROP CONSTRAINT "check_lists_tripId_fkey";

-- AlterTable
ALTER TABLE "check_lists" DROP COLUMN "tripId",
ADD COLUMN     "tripMemberId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "check_lists" ADD CONSTRAINT "check_lists_tripMemberId_fkey" FOREIGN KEY ("tripMemberId") REFERENCES "trip_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
