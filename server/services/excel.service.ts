import ExcelJS from "exceljs";
import { prisma } from "../prisma";

interface GenerateOptions {
  userId?: bigint;
}

export async function generateTripsExcel({ userId }: GenerateOptions = {}) {
  const trips = await prisma.trip.findMany({
    where: userId ? { userId } : undefined,
    include: {
      car: true,
      cities: {
        include: { city: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const workbook = new ExcelJS.Workbook();

  const grouped = new Map<string, typeof trips>();
  for (const trip of trips) {
    const carName = trip.car.name;
    if (!grouped.has(carName)) grouped.set(carName, []);
    grouped.get(carName)!.push(trip);
  }

  if (grouped.size === 0) {
    workbook.addWorksheet("Немає даних");
    return workbook.xlsx.writeBuffer();
  }

  for (const [carName, carTrips] of grouped.entries()) {
    const sheet = workbook.addWorksheet(carName.slice(0, 31));

    sheet.addRow([`Автомобіль: ${carName}`]).font = { bold: true, size: 14 };
    sheet.mergeCells(1, 1, 1, 7);
    sheet.addRow([]);

    const headerRow = sheet.addRow([
      "Місто",
      "Км (маршрут)",
      "Пальне (л)",
      "Сума за пальне",
      "Амортизація",
      "Ціна пального",
      "Дата",
    ]);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9E1F2" },
    };

    sheet.columns = [
      { key: "city", width: 30 },
      { key: "km", width: 14 },
      { key: "fuelUsed", width: 14 },
      { key: "fuelCost", width: 20 },
      { key: "amortization", width: 18 },
      { key: "fuelPrice", width: 16 },
      { key: "date", width: 22 },
    ];

    let totalKm = 0;
    let totalFuelUsed = 0;
    let totalFuelCost = 0;
    let totalAmortization = 0;

    for (const trip of carTrips) {
      const dateStr = new Date(trip.createdAt).toLocaleString("uk-UA");
      const cityCount = trip.cities.length;

      let firstRowNum = 0;

      trip.cities.forEach((tc, index) => {
        const row = sheet.addRow([
          tc.city.name,
          index === 0 ? trip.totalKm : "",
          index === 0 ? Number(trip.fuelUsed).toFixed(2) : "",
          Number(tc.fuelCost).toFixed(2),
          Number(tc.amortizationCost).toFixed(2),
          index === 0 ? trip.fuelPrice : "",
          index === 0 ? dateStr : "",
        ]);

        row.alignment = { vertical: "top", wrapText: true };

        if (index === 0) firstRowNum = row.number;
      });

      if (cityCount > 1) {
        for (const col of [2, 3, 6, 7]) {
          sheet.mergeCells(firstRowNum, col, firstRowNum + cityCount - 1, col);
          const cell = sheet.getCell(firstRowNum, col);
          cell.alignment = { vertical: "middle", horizontal: "center" };
        }
      }

      totalKm += trip.totalKm;
      totalFuelUsed += Number(trip.fuelUsed);
      totalFuelCost += Number(trip.fuelCost);
      totalAmortization += Number(trip.amortizationCost);

      sheet.addRow([]).height = 4;
    }

    sheet.addRow([]);
    const totalRow = sheet.addRow([
      "РАЗОМ:",
      totalKm.toFixed(1),
      totalFuelUsed.toFixed(2),
      totalFuelCost.toFixed(2),
      totalAmortization.toFixed(2),
    ]);
    totalRow.font = { bold: true };
    totalRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFF2CC" },
    };

    sheet.addRow([]);
    const avgConsumption = (totalFuelUsed / totalKm) * 100;
    const avgRow = sheet.addRow([
      "СЕРЕДНІЙ РОЗХІД (л/100км):",
      "",
      avgConsumption.toFixed(2),
    ]);
    avgRow.font = { bold: true };
    avgRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE2EFDA" },
    };
  }

  return workbook.xlsx.writeBuffer();
}