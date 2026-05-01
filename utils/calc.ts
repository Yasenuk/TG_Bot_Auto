import { TripInput } from "../shared/types";

export function calculateTrip(data: TripInput) {
  const { amortizationPerKm, fuelPrice, consumption, totalKm, cities } = data;

  const cityCount = Math.max(cities.length, 1);

  const totalAmortization = amortizationPerKm * totalKm;
  const totalFuelLiters = (consumption / 100) * totalKm;
  const totalFuelCost = totalFuelLiters * fuelPrice;

  return {
    totalAmortization,
    totalFuelLiters,
    totalFuelCost,

    perCity: {
      amortization: totalAmortization / cityCount,
      fuelCost: totalFuelCost / cityCount,
      fuelLiters: totalFuelLiters / cityCount,
    },
  };
}