import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL!
});

const prisma = new PrismaClient({ adapter });

export async function createTrips(results = []) {
	await prisma.trip.createMany({ data: results });
}

export async function getTripsByUserId(userId: number) {
	return await prisma.trip.findMany({
		where: {
			userId
		}
	});
}