// lib/getLatestFactors.ts
import owidData from '../data/trimmed-co2-data.json'

export function getLatestFactors(): Record<string, number> {
  const factors: Record<string, number> = {}

  for (const country of Object.values(owidData)) {
    if (!country || !(country as any).iso_code || !Array.isArray((country as any).data)) continue

    const latest = [...(country as any).data]
      .reverse()
      .find((entry: any) => entry.co2_per_unit_energy != null)

    if (latest) {
      factors[(country as any).iso_code] = latest.co2_per_unit_energy
    }
  }

  return factors
}
