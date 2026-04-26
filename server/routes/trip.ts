import { Router } from "express";
import { createTrips } from "../services/trip";
import { calculate } from "../../utils/calc";

const router = Router();

router.post("/create", async (req, res) => {
	try {
		const { userId, carName, consumption, fuelPrice, trips } = req.body;
		const results = trips.map((t: any) => {
			const { fuelUsed, cost } = calculate(consumption, t.km, fuelPrice);

			return {
				userId,
				carName,
				consumption,
				fuelPrice,
				city: t.city,
				km: t.km,
				fuelUsed,
				cost
			};
		});

		const resTrips = await createTrips(results);
		res.json(resTrips);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Помилка створення" });
	}
});

export default router;