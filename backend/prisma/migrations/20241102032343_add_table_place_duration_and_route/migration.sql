-- CreateTable
CREATE TABLE "place_durations" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "place_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "col" INTEGER[],
    "row" INTEGER NOT NULL,
    "group_number" INTEGER,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "place_durations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routes" (
    "id" SERIAL NOT NULL,
    "starting_point_id" INTEGER NOT NULL,
    "destination_id" INTEGER NOT NULL,
    "travelMode" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "distance" INTEGER NOT NULL,
    "path" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "routes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "place_durations" ADD CONSTRAINT "place_durations_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_durations" ADD CONSTRAINT "place_durations_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "routes_starting_point_id_fkey" FOREIGN KEY ("starting_point_id") REFERENCES "place_durations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routes" ADD CONSTRAINT "routes_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "place_durations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
