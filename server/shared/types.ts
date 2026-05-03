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

export interface CalcInput {
	totalKm: number;
	consumption: number;
	fuelPrice: number;
	amortizationPerKm: number;
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
	fuelUsed: number;
	fuelCost: number;

	perCityFuel: number;
	perCityAmortization: number;

	cities: {
		cityId: number;
	}[];
}