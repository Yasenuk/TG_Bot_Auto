export function formatTripsMessage(trip: any) {
	return `
🚘 Авто: ${trip.car.name}

💸 Амортизація: ${trip.car.amortizationPerKm} грн/км
⛽ Ціна пального: ${trip.fuelPrice} грн
📊 Розхід: ${trip.consumption} л/100км
🛣 Загальний пробіг: ${trip.totalKm} км

━━━━━━━━━━━━━━━

💰 Загальна амортизація: ${trip.amortizationCost.toFixed(1)} грн
⛽ Загальний бензин: ${trip.fuelUsed.toFixed(2)} л
🧾 Загальна вартість пального: ${trip.fuelCost.toFixed(0)} грн

━━━━━━━━━━━━━━━

${trip.cities.map((c: any) => `
📍 ${c.city.name}
💸 Амортизація: ${c.amortizationCost.toFixed(1)} грн
⛽ Пальне: ${c.fuelCost.toFixed(0)} грн
`).join("\n")}
`;
}