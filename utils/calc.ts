export function calculate(consumption: number, km: number, fuelPrice: number) {
  const fuelUsed = (consumption / 100) * km;
  const cost = fuelUsed * fuelPrice;

  return { fuelUsed, cost };
}