const fs = require('fs');
const path = require('path');

// Load full OWID dataset
const inputPath = path.join(__dirname, 'data/owid-co2-data.json');
const outputPath = path.join(__dirname, 'data/trimmed-co2-data.json');

// Years you want to keep (e.g. 2020–2023)
const KEEP_YEARS = [2020, 2021, 2022, 2023];

const fullData = require(inputPath);
const trimmedData = {};

console.log(`Processing ${Object.keys(fullData).length} countries...`);

for (const [isoCode, country] of Object.entries(fullData)) {
  if (!country.data || !Array.isArray(country.data)) continue;

  const filtered = country.data.filter((entry) =>
    KEEP_YEARS.includes(entry.year)
  );

  if (filtered.length > 0) {
    trimmedData[isoCode] = {
      iso_code: country.iso_code,
      country: country.country || isoCode,
      data: filtered.map(({ year, co2_per_unit_energy, co2_per_capita, electricity_emissions_factor }) => ({
        year,
        co2_per_unit_energy,
        co2_per_capita,
        electricity_emissions_factor
      })).filter(e => 
        e.co2_per_unit_energy !== undefined || 
        e.co2_per_capita !== undefined || 
        e.electricity_emissions_factor !== undefined
      )
    };
  }
}

fs.writeFileSync(outputPath, JSON.stringify(trimmedData, null, 2));
console.log(`✅ Trimmed dataset saved to ${outputPath}`);
