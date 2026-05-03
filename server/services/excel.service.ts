import ExcelJS from "exceljs";
import { prisma } from "../prisma";

export async function generateTripsExcel() {
	const trips = await prisma.trip.findMany({
		include: {
			car: true,
			cities: {
				include: {
					city: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	const workbook = new ExcelJS.Workbook();
	const sheet = workbook.addWorksheet("Trips by Car");

	sheet.columns = [
		{ header: "Авто", key: "car", width: 28 },
		{ header: "Міста", key: "city", width: 45 },

		{ header: "Км", key: "km", width: 12 },
		{ header: "Пальне (л)", key: "fuelUsed", width: 15 },
		{ header: "Вартість пального", key: "fuelCost", width: 20 },
		{ header: "Амортизація", key: "amortization", width: 18 },

		{ header: "Дата", key: "date", width: 24 },
	];

	sheet.getRow(1).font = {
		bold: true,
	};

	const grouped = new Map<string, typeof trips>();

	for (const trip of trips) {
		const carName = trip.car.name;

		if (!grouped.has(carName)) {
			grouped.set(carName, []);
		}

		grouped.get(carName)!.push(trip);
	}

	for (const [carName, carTrips] of grouped.entries()) {
		const titleRow = sheet.addRow({
			car: `=== ${carName} ===`,
		});

		titleRow.font = {
			bold: true,
			size: 13,
		};

		for (const trip of carTrips) {
			for (const tripCity of trip.cities) {
				sheet.addRow({
					car: "",

					city: tripCity.city.name,

					km: trip.totalKm,

					fuelUsed: Number(trip.fuelUsed).toFixed(2),

					fuelCost: Number(trip.fuelCost).toFixed(2),

					amortization: Number(
						trip.amortizationCost
					).toFixed(2),

					date: new Date(
						trip.createdAt
					).toLocaleString("uk-UA"),
				});
			}
		}

		sheet.addRow({});
	}

	sheet.eachRow((row) => {
		row.alignment = {
			vertical: "middle",
			wrapText: true,
		};
	});

	return workbook.xlsx.writeBuffer();
}