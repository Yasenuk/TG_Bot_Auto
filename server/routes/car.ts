import { Router } from "express";

import { getCars } from "../services/car.service";

const router = Router();

router.get("/cars", async (_, res) => {
	try {
		const cars = await getCars();

		res.json(cars);
	} catch (e) {
		console.error(e);

		res.status(500).json({
			success: false,
			error: "Server error",
		});
	}
});

export default router;