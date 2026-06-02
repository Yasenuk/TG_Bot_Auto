import { prisma } from "../prisma";

export async function getCars() {
	return prisma.car.findMany({
		orderBy: {
			id: "desc"
		}
	});
}

export async function getCarById(id: number) {
	return prisma.car.findUnique({
		where: {
			id
		}
	});
}

export async function createCar(
	name: string,
	amortizationPerKm: number
) {
	return prisma.car.create({
		data: {
			name,
			amortizationPerKm
		}
	});
}

export async function updateCar(
	id: number,
	name: string,
	amortizationPerKm: number
) {
	return prisma.car.update({
		where: { id },
		data: { name, amortizationPerKm }
	});
}

export async function deleteCar(id: number) {
	return prisma.car.delete({ where: { id } });
}