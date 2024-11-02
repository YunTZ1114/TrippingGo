/*
  Warnings:

  - You are about to drop the column `trip_id` on the `place_durations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "place_durations" DROP CONSTRAINT "place_durations_trip_id_fkey";

-- AlterTable
ALTER TABLE "place_durations" DROP COLUMN "trip_id";
