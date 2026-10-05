import { CalcInput } from "../shared/types";

/** Розхід з націнкою: 18 л/100км + 10% → 19.8 л/100км */
export function getConsumptionWithMarkup(consumption: number, markupPercent: number) {
	return consumption * (1 + markupPercent / 100);
}

export function calculateTrip(data: CalcInput) {
	const consumptionWithMarkup =
		getConsumptionWithMarkup(data.consumption, data.consumptionMarkupPercent);

	const fuelUsed = (data.totalKm / 100) * consumptionWithMarkup;

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
		consumptionMarkupPercent: data.consumptionMarkupPercent,

		perCityFuel,
		perCityAmortization,
	};
}

/** Фінальна сума: пальне (вже з націнкою на розхід) + амортизація — для поїздки або міста */
export function getTotalCost(costs: { fuelCost: number; amortizationCost: number }) {
	return costs.fuelCost + costs.amortizationCost;
}
