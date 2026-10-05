ALTER TABLE "Car" RENAME COLUMN "amortizationMarkupPercent" TO "consumptionMarkupPercent";

ALTER TABLE "Trip" DROP COLUMN "amortizationMarkupCost",
DROP COLUMN "amortizationMarkupPercent",
ADD COLUMN     "consumptionMarkupPercent" DOUBLE PRECISION NOT NULL DEFAULT 0;

ALTER TABLE "TripCity" DROP COLUMN "amortizationMarkupCost";
