-- CreateTable
CREATE TABLE "check_lists" (
    "id" SERIAL NOT NULL,
    "tripId" INTEGER NOT NULL,
    "title" VARCHAR(32) NOT NULL,
    "type" VARCHAR(32) NOT NULL,
    "description" JSONB,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "check_lists_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "check_lists" ADD CONSTRAINT "check_lists_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
