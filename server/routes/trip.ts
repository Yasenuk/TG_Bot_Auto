import { Router } from "express";

import { calculateTrip } from "../../utils/calc";
import { createTrip } from "../services/trip.service";
import { formatTripsMessage } from "../../utils/formatTripsMessage";
import { bot } from "../../shared/telegram";

const router = Router();

router.post("/create", async (req, res) => {
	try {
		const tripData = req.body;

		if (!tripData?.cities?.length) {
			return res.status(400).json({
				success: false,
				error: "cities required",
			});
		}

		const calc = calculateTrip(tripData);

		const trip = await createTrip({
			...tripData,
			...calc,
		});

		const message = formatTripsMessage({
			...trip,
			...calc
		});

		try {
			await bot.telegram.sendMessage(tripData.userId, message);
		} catch (e) {
			console.error("Telegram error", e);
		}

		res.json({
			success: true,
			trip,
		});
	} catch (e) {
		console.error(e);

		res.status(500).json({
			success: false,
			error: "Server error",
		});
	}
});

export default router;