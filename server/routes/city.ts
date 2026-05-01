import { Router } from "express";
import { getCities } from "../services/city.service";

const router = Router();

router.get("/cities", async (_, res) => {
  try {
    const cities = await getCities();
    res.json(cities);
  } catch (e) {
    res.status(500).json({
      success: false,
      error: "error loading cities",
    });
  }
});

export default router;