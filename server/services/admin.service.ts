import { prisma } from "../prisma";

export async function getAdmins() {
	return prisma.admin.findMany({ orderBy: { id: "asc" } });
}

export async function isAdmin(userId: bigint) {
	const admin = await prisma.admin.findUnique({ where: { userId } });
	return !!admin;
}

export async function addAdmin(userId: bigint, username?: string) {
	return prisma.admin.upsert({
		where: { userId },
		update: { username },
		create: { userId, username }
	});
}

export async function removeAdmin(userId: bigint) {
	return prisma.admin.delete({ where: { userId } });
}
