/*
  Warnings:

  - You are about to alter the column `ch_name` on the `countries` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(64)`.
  - You are about to alter the column `en_name` on the `countries` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(64)`.
  - You are about to alter the column `currency_code` on the `countries` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `VarChar(3)`.
  - You are about to alter the column `code` on the `countries` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `VarChar(3)`.
  - You are about to alter the column `code` on the `currencies` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(3)`.
  - You are about to alter the column `code` on the `mails` table. The data in that column could be lost. The data in that column will be cast from `VarChar(512)` to `VarChar(256)`.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(64)`.
  - You are about to alter the column `name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(64)`.
  - You are about to alter the column `gender` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(8)`.
  - You are about to alter the column `password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(64)`.

*/
-- AlterTable
ALTER TABLE "countries" ALTER COLUMN "ch_name" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "en_name" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "local_name" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "currency_code" SET DATA TYPE VARCHAR(3),
ALTER COLUMN "code" SET DATA TYPE VARCHAR(3);

-- AlterTable
ALTER TABLE "currencies" ALTER COLUMN "code" SET DATA TYPE VARCHAR(3);

-- AlterTable
ALTER TABLE "mails" ALTER COLUMN "type" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "subject" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "code" SET DATA TYPE VARCHAR(256);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "gender" SET DATA TYPE VARCHAR(8),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(64);

-- CreateTable
CREATE TABLE "trips" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "description" TEXT NOT NULL,
    "cover_url" TEXT,
    "creator_id" INTEGER NOT NULL,
    "currency_code" VARCHAR(3) NOT NULL,
    "start_time" TIMESTAMP(0) NOT NULL,
    "end_time" TIMESTAMP(0) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_members" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "nickname" VARCHAR(64) NOT NULL,
    "permissions" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "note" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_members_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_members" ADD CONSTRAINT "trip_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_members" ADD CONSTRAINT "trip_members_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
