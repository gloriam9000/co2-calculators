// Calculate CO2 avoided by solar panels (kg CO2)
export function calculateAvoidedCO2(kWh: number, emissionFactor: number): number {
  return kWh * emissionFactor;
}

// Calculate CO2 offset by switching from dirty to clean energy mix (kg CO2)
export function calculateOffsetCO2(userKWh: number, dirtyMix: number, cleanMix: number): number {
  return userKWh * (dirtyMix - cleanMix);
}

// Calculate annual CO2 savings from solar installation
export function calculateAnnualSolarSavings(
  annualProduction: number, // kWh per year
  gridEmissionFactor: number // kg CO2 per kWh
): number {
  return annualProduction * gridEmissionFactor;
}

// Calculate CO2 reduction from energy efficiency improvements
export function calculateEfficiencySavings(
  energySavedKWh: number,
  gridEmissionFactor: number
): number {
  return energySavedKWh * gridEmissionFactor;
}
