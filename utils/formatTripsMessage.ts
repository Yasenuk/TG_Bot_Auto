export function formatTripsMessage({ carName, consumption, results, total }: any) {
	const header =
		`🚗 ${carName}\n
⛽ Витрата: ${consumption} л/100км\n\n`;

	const body = results
		.map((t: any) => {
			return `📍 ${t.city} — ${t.km} км`;
		})
		.join("\n\n");

	return header + body + `\n\n💵 Всього: ${Math.round(total)} грн`;
}