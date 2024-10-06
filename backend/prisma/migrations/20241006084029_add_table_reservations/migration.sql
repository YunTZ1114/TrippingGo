-- CreateTable
CREATE TABLE "reservations" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "reservation_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),
    "trip_member_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "notes" TEXT,
    "description" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_trip_member_id_fkey" FOREIGN KEY ("trip_member_id") REFERENCES "trip_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
