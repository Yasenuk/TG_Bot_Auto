export interface CreateTripDto {
	userId: number;
	username?: string;

	carId: number;

	consumption: number;
	fuelPrice: number;
	totalKm: number;

	cities: {
		cityId: number;
	}[];
}

export interface CarInput {
	name: string;
	amortizationPerKm: number;
	/** Націнка на розхід пального у %, напр. 10 → 18 л/100км рахується як 19.8 */
	consumptionMarkupPercent: number;
}

export interface CalcInput {
	totalKm: number;
	consumption: number;
	fuelPrice: number;
	amortizationPerKm: number;
	consumptionMarkupPercent: number;
	citiesCount: number;
}

export interface CreateTripPayload {
	userId: number;
	username?: string;

	carId: number;

	consumption: number;
	fuelPrice: number;
	totalKm: number;

	amortizationCost: number;
	consumptionMarkupPercent: number;
	fuelUsed: number;
	fuelCost: number;

	perCityFuel: number;
	perCityAmortization: number;

	cities: {
		cityId: number;
	}[];
}