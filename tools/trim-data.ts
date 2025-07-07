import fs from 'fs'
import path from 'path'

// Load the full dataset (adjust the path if needed)
import rawData from '../data/trimmed-co2-data.json'

const trimmedData: Record<string, any> = {}

Object.entries(rawData).forEach(([countryCode, countryData]: [string, any]) => {
  const filteredEntries = countryData.data.filter(
    (entry: any) =>
      entry.year >= 2015 &&
      entry.year <= 2023 &&
      typeof entry.co2_per_unit_energy === 'number'
  )

  if (filteredEntries.length > 0) {
    trimmedData[countryCode] = {
      iso_code: countryData.iso_code,
      country: countryData.country,
      data: filteredEntries,
    }
  }
})

// Save the result as a smaller JSON file
const outputPath = path.join(__dirname, '../data/trimmed-co2.json')
fs.writeFileSync(outputPath, JSON.stringify(trimmedData, null, 2))

console.log(`✅ Trimmed data saved to: ${outputPath}`)
