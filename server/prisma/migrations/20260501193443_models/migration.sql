-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "amortizationPerKm" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" SERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "username" TEXT,
    "carId" INTEGER NOT NULL,
    "consumption" DOUBLE PRECISION NOT NULL,
    "fuelPrice" DOUBLE PRECISION NOT NULL,
    "totalKm" DOUBLE PRECISION NOT NULL,
    "amortizationCost" DOUBLE PRECISION NOT NULL,
    "fuelUsed" DOUBLE PRECISION NOT NULL,
    "fuelCost" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripCity" (
    "id" SERIAL NOT NULL,
    "tripId" INTEGER NOT NULL,
    "cityId" INTEGER NOT NULL,
    "amortizationCost" DOUBLE PRECISION NOT NULL,
    "fuelCost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TripCity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripCity" ADD CONSTRAINT "TripCity_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripCity" ADD CONSTRAINT "TripCity_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
