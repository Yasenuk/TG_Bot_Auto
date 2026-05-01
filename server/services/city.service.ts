import { prisma } from "../prisma";

export async function getCities() {
	return await prisma.city.findMany();
}