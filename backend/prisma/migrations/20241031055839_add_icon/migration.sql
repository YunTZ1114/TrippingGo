/*
  Warnings:

  - You are about to alter the column `name` on the `trips` table. The data in that column could be lost. The data in that column will be cast from `VarChar(256)` to `VarChar(200)`.

*/
-- AlterTable
ALTER TABLE "trips" ALTER COLUMN "name" SET DATA TYPE VARCHAR(200);
