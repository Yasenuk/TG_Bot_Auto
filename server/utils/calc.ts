import { CalcInput } from "../shared/types";

export function calculateTrip(data: CalcInput) {
	const fuelUsed = (data.totalKm / 100) * data.consumption;

	const fuelCost = fuelUsed * data.fuelPrice;

	const amortizationCost =
		data.totalKm * data.amortizationPerKm;

	const perCityFuel =
		fuelCost / data.citiesCount;

	const perCityAmortization =
		amortizationCost / data.citiesCount;

	return {
		fuelUsed,
		fuelCost,
		amortizationCost,

		perCityFuel,
		perCityAmortization,
	};
}