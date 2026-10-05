import { prisma } from "../prisma";
import { CarInput } from "../shared/types";

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

export async function createCar(data: CarInput) {
	return prisma.car.create({ data });
}

export async function updateCar(id: number, data: CarInput) {
	return prisma.car.update({
		where: { id },
		data
	});
}

export async function deleteCar(id: number) {
	return prisma.car.delete({ where: { id } });
}