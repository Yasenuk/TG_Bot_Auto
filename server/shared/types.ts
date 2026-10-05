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
	/** Націнка на амортизацію у %, напр. 10 = +10% */
	amortizationMarkupPercent: number;
}

export interface CalcInput {
	totalKm: number;
	consumption: number;
	fuelPrice: number;
	amortizationPerKm: number;
	amortizationMarkupPercent: number;
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
	amortizationMarkupPercent: number;
	amortizationMarkupCost: number;
	fuelUsed: number;
	fuelCost: number;

	perCityFuel: number;
	perCityAmortization: number;
	perCityAmortizationMarkup: number;

	cities: {
		cityId: number;
	}[];
}