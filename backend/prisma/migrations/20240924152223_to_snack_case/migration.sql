/*
  Warnings:

  - You are about to drop the column `createdAt` on the `mails` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `mails` table. All the data in the column will be lost.
  - You are about to drop the column `isUsed` on the `mails` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `mails` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `mails` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `mails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `mails` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "mails" DROP CONSTRAINT "mails_userId_fkey";

-- AlterTable
ALTER TABLE "mails" DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
DROP COLUMN "isUsed",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_used" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(0) NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "mails" ADD CONSTRAINT "mails_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
