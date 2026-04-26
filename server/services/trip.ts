import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/client';

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({ adapter });

export async function createTrips(results = []) {
	await prisma.trip.createMany({ data: results });
}

export function getTrip() {

}