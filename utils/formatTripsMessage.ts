export function formatTripsMessage(trip: any) {
  return `🚘 Авто: ${trip.carName}

💸 Амортизація: ${trip.amortizationPerKm} грн/км
⛽ Ціна пального: ${trip.fuelPrice} грн
📊 Розхід: ${trip.consumption} л/100км
🛣 Загальний пробіг: ${trip.totalKm} км

━━━━━━━━━━━━━━━

💰 Загальна амортизація: ${trip.totalAmortization.toFixed(1)} грн
⛽ Загальний бензин: ${trip.totalFuelLiters.toFixed(2)} л
🧾 Загальна вартість пального: ${trip.totalFuelCost.toFixed(0)} грн

━━━━━━━━━━━━━━━

${trip.cities
  .map(
    (c: any) => `📍 ${c.city.name}
💸 Амортизація: ${c.amortizationShare.toFixed(1)} грн
⛽ Пальне: ${c.fuelCostShare.toFixed(0)} грн`
  )
  .join("\n\n")}
`;
}