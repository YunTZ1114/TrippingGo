/*
  Warnings:

  - You are about to drop the column `title` on the `mails` table. All the data in the column will be lost.
  - Added the required column `subject` to the `mails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mails" DROP COLUMN "title",
ADD COLUMN     "subject" VARCHAR(255) NOT NULL;
