// lib/getLatestFactors.ts
import owidData from '../data/owid-co2-data.json'

export function getLatestFactors(): Record<string, number> {
  const factors: Record<string, number> = {}

  for (const country of Object.values(owidData)) {
    if (!country || !country.iso_code || !Array.isArray(country.data)) continue

    const latest = [...country.data]
      .reverse()
      .find(entry => entry.co2_intensity_kg_per_kwh != null)

    if (latest) {
      factors[country.iso_code] = latest.co2_intensity_kg_per_kwh
    }
  }

  return factors
}
