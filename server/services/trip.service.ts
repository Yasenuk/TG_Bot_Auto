import { prisma } from "../prisma";
import { CreateTripPayload } from "../shared/types";

export async function createTrip(data: CreateTripPayload) {
	return prisma.trip.create({
		data: {
			userId: data.userId,
			username: data.username,

			carId: data.carId,

			consumption: data.consumption,
			fuelPrice: data.fuelPrice,
			totalKm: data.totalKm,

			amortizationCost: data.amortizationCost,
			fuelUsed: data.fuelUsed,
			fuelCost: data.fuelCost,

			cities: {
				create: data.cities.map(city => ({
					cityId: city.cityId,

					amortizationCost:
						data.perCityAmortization,

					fuelCost:
						data.perCityFuel,
				}))
			}
		},
		include: {
			car: true,
			cities: {
				include: {
					city: true
				}
			}
		}
	});
}