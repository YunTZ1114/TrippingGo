/*
  Warnings:

  - You are about to drop the column `content` on the `mails` table. All the data in the column will be lost.
  - Added the required column `html` to the `mails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mails" DROP COLUMN "content",
ADD COLUMN     "html" TEXT NOT NULL;
