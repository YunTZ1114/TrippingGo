/*
  Warnings:

  - You are about to drop the column `created_at` on the `mails` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `mails` table. All the data in the column will be lost.
  - You are about to drop the column `is_used` on the `mails` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `mails` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `mails` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `google_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `is_verified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[googleId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `mails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `mails` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "mails" DROP CONSTRAINT "mails_user_id_fkey";

-- DropIndex
DROP INDEX "users_google_id_key";

-- AlterTable
ALTER TABLE "mails" DROP COLUMN "created_at",
DROP COLUMN "expires_at",
DROP COLUMN "is_used",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiresAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isUsed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(0) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at",
DROP COLUMN "google_id",
DROP COLUMN "is_verified",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- AddForeignKey
ALTER TABLE "mails" ADD CONSTRAINT "mails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
