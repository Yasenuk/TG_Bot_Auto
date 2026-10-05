-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "amortizationMarkupPercent" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "amortizationMarkupCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "amortizationMarkupPercent" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "TripCity" ADD COLUMN     "amortizationMarkupCost" DOUBLE PRECISION NOT NULL DEFAULT 0;
