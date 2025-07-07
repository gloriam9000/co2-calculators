import co2Data from '../data/trimmed-co2-data.json'

// ✅ 1. Convert per-capita emissions to estimated kg CO2 per kWh (optional)
export function getLatestCo2Intensity(countryCode: string): number | null {
  const entry = Object.values(co2Data).find(
    (country: any) => country.iso_code === countryCode
  )

  if (!entry || !Array.isArray((entry as any).data)) return null

  const data2023 = (entry as any).data.find((yearData: any) => yearData.year === 2023)

  if (data2023 && typeof (data2023 as any).co2_per_capita === 'number') {
    return ((data2023 as any).co2_per_capita * 1000) / 3000 // tons -> kg, divide by avg. kWh
  }

  return null
}

// ✅ 2. Get electricity grid emission factor (kg CO2 per kWh)
export function getElectricityEmissionFactor(countryCode: string): number | null {
  const entry = Object.values(co2Data).find(
    (country: any) => country.iso_code === countryCode
  )

  if (!entry || !Array.isArray((entry as any).data)) return null

  const data2023 = (entry as any).data.find((yearData: any) => yearData.year === 2023)

  if (data2023 && typeof (data2023 as any).electricity_emissions_factor === 'number') {
    return (data2023 as any).electricity_emissions_factor
  }

  return null
}

// ✅ 3. Get countries with valid electricity_emissions_factor (for offset calculator)
export function getAvailableCountries(): Array<{ name: string; iso_code: string }> {
  const countries: Array<{ name: string; iso_code: string }> = []

  Object.entries(co2Data).forEach(([name, data]: [string, any]) => {
    if ((data as any).iso_code && Array.isArray((data as any).data)) {
      const hasValidData = (data as any).data.some(
        (yearData: any) =>
          yearData.year === 2023 &&
          typeof yearData.electricity_emissions_factor === 'number'
      )

      if (hasValidData) {
        countries.push({
          name,
          iso_code: data.iso_code,
        })
      }
    }
  })

  return countries.sort((a, b) => a.name.localeCompare(b.name))
}
