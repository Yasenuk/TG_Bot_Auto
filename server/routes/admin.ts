import { Router, Request, Response, NextFunction } from "express";

import { getAdmins, isAdmin, addAdmin, removeAdmin } from "../services/admin.service";
import { getCars, createCar, updateCar, deleteCar } from "../services/car.service";
import { getCities, createCity, updateCity, deleteCity } from "../services/city.service";
import { getTripsByMonth, deleteTripsByIds, deleteTripsByMonth } from "../services/trip.service";

const router = Router();

// Middleware: check admin
async function requireAdmin(req: Request, res: Response, next: NextFunction) {
	const userId = req.headers["x-user-id"];
	if (!userId) return res.status(401).json({ error: "Unauthorized" });

	const ok = await isAdmin(BigInt(userId as string));
	if (!ok) return res.status(403).json({ error: "Forbidden" });

	next();
}

// Check if current user is admin
router.get("/admin/check", async (req, res) => {
	const userId = req.headers["x-user-id"];
	if (!userId) return res.json({ isAdmin: false });

	const ok = await isAdmin(BigInt(userId as string));
	res.json({ isAdmin: ok });
});

// ── Trips ───────────────────────────────────────────────

router.get("/admin/trips", requireAdmin, async (req, res) => {
	try {
		const month = req.query.month as string;
		if (!month || !/^\d{4}-\d{2}$/.test(month)) {
			return res.status(400).json({ error: "month param required (YYYY-MM)" });
		}
		const trips = await getTripsByMonth(month);
		res.json(trips.map(t => ({ ...t, userId: t.userId.toString() })));
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "Server error" });
	}
});

router.delete("/admin/trips/month", requireAdmin, async (req, res) => {
	try {
		const { month } = req.body as { month: string };
		if (!month) return res.status(400).json({ error: "month required" });
		const result = await deleteTripsByMonth(month);
		res.json({ deleted: result.count });
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "Server error" });
	}
});

router.delete("/admin/trips", requireAdmin, async (req, res) => {
	try {
		const { ids } = req.body as { ids: number[] };
		if (!ids?.length) return res.status(400).json({ error: "ids required" });
		const result = await deleteTripsByIds(ids);
		res.json({ deleted: result.count });
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "Server error" });
	}
});

// ── Cars ─────────────────────────────────────────────────

router.get("/admin/cars", requireAdmin, async (_, res) => {
	try {
		res.json(await getCars());
	} catch (e) {
		res.status(500).json({ error: "Server error" });
	}
});

router.post("/admin/cars", requireAdmin, async (req, res) => {
	try {
		const { name, amortizationPerKm } = req.body;
		if (!name || amortizationPerKm == null) return res.status(400).json({ error: "name and amortizationPerKm required" });
		const car = await createCar(name, Number(amortizationPerKm));
		res.json(car);
	} catch (e) {
		res.status(500).json({ error: "Server error" });
	}
});

router.put("/admin/cars/:id", requireAdmin, async (req, res) => {
	try {
		const { name, amortizationPerKm } = req.body;
		const car = await updateCar(Number(req.params.id), name, Number(amortizationPerKm));
		res.json(car);
	} catch (e) {
		res.status(500).json({ error: "Server error" });
	}
});

router.delete("/admin/cars/:id", requireAdmin, async (req, res) => {
	try {
		await deleteCar(Number(req.params.id));
		res.json({ success: true });
	} catch (e) {
		res.status(500).json({ error: "Server error" });
	}
});

// ── Cities ───────────────────────────────────────────────

router.get("/admin/cities", requireAdmin, async (_, res) => {
	try {
		res.json(await getCities());
	} catch (e) {
		res.status(500).json({ error: "Server error" });
	}
});

router.post("/admin/cities", requireAdmin, async (req, res) => {
	try {
		const { name } = req.body;
		if (!name) return res.status(400).json({ error: "name required" });
		res.json(await createCity(name));
	} catch (e) {
		res.status(500).json({ error: "Server error" });
	}
});

router.put("/admin/cities/:id", requireAdmin, async (req, res) => {
	try {
		const { name } = req.body;
		res.json(await updateCity(Number(req.params.id), name));
	} catch (e) {
		res.status(500).json({ error: "Server error" });
	}
});

router.delete("/admin/cities/:id", requireAdmin, async (req, res) => {
	try {
		await deleteCity(Number(req.params.id));
		res.json({ success: true });
	} catch (e) {
		res.status(500).json({ error: "Server error" });
	}
});

// ── Admins ───────────────────────────────────────────────

router.get("/admin/admins", requireAdmin, async (_, res) => {
	try {
		const admins = await getAdmins();
		res.json(admins.map((a: { id: number; userId: bigint; username: string | null }) => ({ ...a, userId: a.userId.toString() })));
	} catch (e) {
		res.status(500).json({ error: "Server error" });
	}
});

router.post("/admin/admins", requireAdmin, async (req, res) => {
	try {
		const { userId, username } = req.body;
		if (!userId) return res.status(400).json({ error: "userId required" });
		const admin = await addAdmin(BigInt(userId), username);
		res.json({ ...admin, userId: admin.userId.toString() });
	} catch (e) {
		res.status(500).json({ error: "Server error" });
	}
});

router.delete("/admin/admins/:userId", requireAdmin, async (req, res) => {
	try {
		await removeAdmin(BigInt(req.params.userId as string));
		res.json({ success: true });
	} catch (e) {
		res.status(500).json({ error: "Server error" });
	}
});

export default router;
