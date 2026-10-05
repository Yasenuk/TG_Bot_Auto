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

	const amortizationMarkupCost =
		amortizationCost * (data.amortizationMarkupPercent / 100);

	const perCityAmortizationMarkup =
		amortizationMarkupCost / data.citiesCount;

	return {
		fuelUsed,
		fuelCost,
		amortizationCost,
		amortizationMarkupPercent: data.amortizationMarkupPercent,
		amortizationMarkupCost,

		perCityFuel,
		perCityAmortization,
		perCityAmortizationMarkup,
	};
}

/** Фінальна сума: пальне + амортизація + націнка на амортизацію (для поїздки або міста) */
export function getTotalCost(costs: {
	fuelCost: number;
	amortizationCost: number;
	amortizationMarkupCost: number;
}) {
	return costs.fuelCost + costs.amortizationCost + costs.amortizationMarkupCost;
}