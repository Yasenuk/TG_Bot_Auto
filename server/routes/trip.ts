import { Router } from "express";

import { getCarById } from "../services/car.service";
import { createTrip } from "../services/trip.service";

import { sendTelegramMessage } from "../helpers/bot";

import { calculateTrip } from "../utils/calc";
import { formatTripsMessage } from "../utils/formatTripsMessage";

const router = Router();

router.post("/create", async (req, res) => {
	try {
		const body = req.body;

		const car = await getCarById(body.carId);

		if (!car) {
			return res.status(404).json({
				success: false,
				message: "Car not found"
			});
		}

		const calc = calculateTrip({
			totalKm: body.totalKm,
			consumption: body.consumption,
			fuelPrice: body.fuelPrice,
			amortizationPerKm: car.amortizationPerKm,
			citiesCount: body.cities.length
		});

		const trip = await createTrip({
			...body,
			...calc
		})

		const message = formatTripsMessage(trip);

		await sendTelegramMessage(body.userId, message);

		res.json({
			success: true,
			trip: {
				...trip,
				userId: trip.userId.toString()
			}
		});

	} catch (err) {
		console.log(err);

		res.status(500).json({
			success: false
		});
	}
});

export default router;