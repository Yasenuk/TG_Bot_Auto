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

  // Групуємо по машинах
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

    // Заголовок аркуша
    sheet.addRow([`Автомобіль: ${carName}`]).font = { bold: true, size: 14 };
    sheet.mergeCells(1, 1, 1, 7);
    sheet.addRow([]); // порожній рядок

    // Заголовки колонок
    const headerRow = sheet.addRow([
      "Місто",
      "Км (маршрут)",
      "Пальне (л)",
      "Вартість пального",
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
      { key: "city",         width: 30 },
      { key: "km",           width: 14 },
      { key: "fuelUsed",     width: 14 },
      { key: "fuelCost",     width: 20 },
      { key: "amortization", width: 18 },
      { key: "fuelPrice",    width: 16 },
      { key: "date",         width: 22 },
    ];

    // Лічильники для підсумків
    let totalKm = 0;
    let totalFuelUsed = 0;
    let totalFuelCost = 0;
    let totalAmortization = 0;

    for (const trip of carTrips) {
      const dateStr = new Date(trip.createdAt).toLocaleString("uk-UA");
      const cityCount = trip.cities.length;

      trip.cities.forEach((tc, index) => {
        const row = sheet.addRow([
          tc.city.name,
          // Км та пальне показуємо тільки в першому рядку поїздки
          index === 0 ? trip.totalKm : "",
          index === 0 ? Number(trip.fuelUsed).toFixed(2) : "",
          Number(tc.fuelCost).toFixed(2),         // вартість по місту
          Number(tc.amortizationCost).toFixed(2), // амортизація по місту
          index === 0 ? trip.fuelPrice : "",
          index === 0 ? dateStr : "",
        ]);
        row.alignment = { vertical: "middle", wrapText: true };

        // Злиття клітинок для км/пальне якщо кілька міст
        if (index === 0 && cityCount > 1) {
          const rowNum = row.number;
          sheet.mergeCells(rowNum, 2, rowNum + cityCount - 1, 2); // Км
          sheet.mergeCells(rowNum, 3, rowNum + cityCount - 1, 3); // Пальне
          sheet.mergeCells(rowNum, 6, rowNum + cityCount - 1, 6); // Ціна
          sheet.mergeCells(rowNum, 7, rowNum + cityCount - 1, 7); // Дата
        }
      });

      totalKm += trip.totalKm;
      totalFuelUsed += Number(trip.fuelUsed);
      totalFuelCost += Number(trip.fuelCost);
      totalAmortization += Number(trip.amortizationCost);

      // Розділювач між поїздками
      sheet.addRow([]).height = 4;
    }

    // Підсумковий рядок
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
  }

  return workbook.xlsx.writeBuffer();
}