/*
  Warnings:

  - The `description` column on the `trip_members` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "trip_members" DROP COLUMN "description",
ADD COLUMN     "description" JSONB;
