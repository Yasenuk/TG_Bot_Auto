import { prisma } from "../prisma";

export async function getCities() {
	return prisma.city.findMany({
		orderBy: {
			name: "asc"
		}
	});
}

export async function createCity(
	name: string
) {
	return prisma.city.create({
		data: {
			name
		}
	});
}