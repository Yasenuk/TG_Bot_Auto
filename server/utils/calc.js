"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTrip = calculateTrip;
function calculateTrip(data) {
    const fuelUsed = (data.totalKm / 100) * data.consumption;
    const fuelCost = fuelUsed * data.fuelPrice;
    const amortizationCost = data.totalKm * data.amortizationPerKm;
    const perCityFuel = fuelCost / data.citiesCount;
    const perCityAmortization = amortizationCost / data.citiesCount;
    return {
        fuelUsed,
        fuelCost,
        amortizationCost,
        perCityFuel,
        perCityAmortization,
    };
}
