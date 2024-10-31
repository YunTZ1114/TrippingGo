/*
  Warnings:

  - You are about to drop the column `place_icon` on the `places` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "places" DROP COLUMN "place_icon",
ADD COLUMN     "icon" VARCHAR(50) DEFAULT 'flag';
