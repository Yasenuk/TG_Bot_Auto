import { Router } from "express";
import { generateTripsExcel } from "../services/excel.service";

const router = Router();

router.get("/excel", async (req, res) => {
  try {
    const userId = req.query.userId
      ? BigInt(req.query.userId as string)
      : undefined;

    const buffer = await generateTripsExcel({ userId });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="trips.xlsx"'
    );
    res.send(buffer);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Excel generation failed" });
  }
});

export default router;