import { prisma } from "../prisma";
import { CreateTripPayload } from "../shared/types";

export async function getTripsByMonth(month: string) {
	// month format: "YYYY-MM"
	const [year, mon] = month.split("-").map(Number);
	const from = new Date(year, mon - 1, 1);
	const to = new Date(year, mon, 1);

	return prisma.trip.findMany({
		where: {
			createdAt: { gte: from, lt: to }
		},
		include: {
			car: true,
			cities: { include: { city: true } }
		},
		orderBy: { createdAt: "desc" }
	});
}

export async function deleteTripsByIds(ids: number[]) {
	await prisma.tripCity.deleteMany({ where: { tripId: { in: ids } } });
	return prisma.trip.deleteMany({ where: { id: { in: ids } } });
}

export async function deleteTripsByMonth(month: string) {
	const [year, mon] = month.split("-").map(Number);
	const from = new Date(year, mon - 1, 1);
	const to = new Date(year, mon, 1);

	const trips = await prisma.trip.findMany({
		where: { createdAt: { gte: from, lt: to } },
		select: { id: true }
	});
	const ids = trips.map(t => t.id);

	await prisma.tripCity.deleteMany({ where: { tripId: { in: ids } } });
	return prisma.trip.deleteMany({ where: { id: { in: ids } } });
}

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