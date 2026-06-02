import { prisma } from "../prisma";

export async function getCities() {
	return prisma.city.findMany({
		orderBy: {
			name: "asc"
		}
	});
}

export async function createCity(name: string) {
	return prisma.city.create({ data: { name } });
}

export async function updateCity(id: number, name: string) {
	return prisma.city.update({ where: { id }, data: { name } });
}

export async function deleteCity(id: number) {
	return prisma.city.delete({ where: { id } });
}