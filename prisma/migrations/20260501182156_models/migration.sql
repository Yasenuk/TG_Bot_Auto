-- CreateTable
CREATE TABLE "Trip" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "carName" TEXT NOT NULL,
    "amortizationPerKm" DOUBLE PRECISION NOT NULL,
    "fuelPrice" DOUBLE PRECISION NOT NULL,
    "consumption" DOUBLE PRECISION NOT NULL,
    "totalKm" DOUBLE PRECISION NOT NULL,
    "totalAmortization" DOUBLE PRECISION NOT NULL,
    "totalFuelLiters" DOUBLE PRECISION NOT NULL,
    "totalFuelCost" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripCity" (
    "id" SERIAL NOT NULL,
    "tripId" INTEGER NOT NULL,
    "cityId" INTEGER NOT NULL,
    "amortizationShare" DOUBLE PRECISION NOT NULL,
    "fuelCostShare" DOUBLE PRECISION NOT NULL,
    "fuelLitersShare" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TripCity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TripCity" ADD CONSTRAINT "TripCity_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripCity" ADD CONSTRAINT "TripCity_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
