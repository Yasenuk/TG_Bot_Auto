export type TripInput = {
  amortizationPerKm: number;
  fuelPrice: number;
  consumption: number;
  totalKm: number;
  cities: { cityId: number }[];
};