/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `check_lists` table. All the data in the column will be lost.
  - You are about to drop the column `isPublic` on the `check_lists` table. All the data in the column will be lost.
  - You are about to drop the column `tripMemberId` on the `check_lists` table. All the data in the column will be lost.
  - Added the required column `trip_member_id` to the `check_lists` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "check_lists" DROP CONSTRAINT "check_lists_tripMemberId_fkey";

-- AlterTable
ALTER TABLE "check_lists" DROP COLUMN "isDeleted",
DROP COLUMN "isPublic",
DROP COLUMN "tripMemberId",
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "trip_member_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "check_lists" ADD CONSTRAINT "check_lists_trip_member_id_fkey" FOREIGN KEY ("trip_member_id") REFERENCES "trip_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
