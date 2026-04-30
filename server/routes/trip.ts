import { Router } from "express";

import { createTrips, getTripsByUserId } from "../services/trip.service";

import { calculate } from "../../utils/calc";
import { formatTripsMessage } from "../../utils/formatTripsMessage";

import { bot } from "../../shared/telegram";

const router = Router();

router.post("/create", async (req, res) => {
	try {
		const { userId, carName, consumption, fuelPrice, trips } = req.body;

		// if (!Array.isArray(trips) || trips.length === 0) {
		// 	return res.status(400).json({
		// 		success: false,
		// 		error: "Trips required"
		// 	});
		// }

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

		await createTrips(results);

		const total = results.reduce((sum: number, r: any) => sum + r.cost, 0);

		const message = formatTripsMessage({ carName, consumption, results, total });

		try {
			await bot.telegram.sendMessage(Number(userId), message);
		} catch (e) {
			console.error("Telegram send error", e);
		}

		res.json({
			success: true,
			results
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			error: "Помилка створення поїздок"
		});
	}
});

router.get("/trips/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		const trips = await getTripsByUserId(Number(userId));
		res.json(trips);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Помилка отримання поїздок" });
	}
});

export default router;