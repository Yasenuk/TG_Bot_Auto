import { prisma } from "../prisma";

export async function createTrip(data: any) {
  return prisma.trip.create({
    data: {
      userId: data.userId,
      carName: data.carName,

      amortizationPerKm: data.amortizationPerKm,
      fuelPrice: data.fuelPrice,
      consumption: data.consumption,
      totalKm: data.totalKm,

      totalAmortization: data.totalAmortization,
      totalFuelLiters: data.totalFuelLiters,
      totalFuelCost: data.totalFuelCost,

      cities: {
        create: data.cities.map((c: any) => ({
          cityId: c.cityId,

          amortizationShare: data.perCity.amortization,
          fuelCostShare: data.perCity.fuelCost,
          fuelLitersShare: data.perCity.fuelLiters,
        })),
      },
    },

    include: {
      cities: {
        include: {
          city: true,
        },
      },
    },
  });
}

export async function getTrips() {
  return prisma.trip.findMany({
    include: {
      cities: {
        include: {
          city: true,
        },
      },
    },
  });
}