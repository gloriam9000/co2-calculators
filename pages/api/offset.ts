import type { NextApiRequest, NextApiResponse } from 'next'

// Import using require to handle large JSON files better
const owidData = require('../../data/trimmed-co2-data.json')

type Entry = {
  year: number
  co2_per_unit_energy?: number  // ← To this
}

type Country = {
  iso_code: string
  data: Entry[]
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { userKWh, solarKWh, dirtyCountryCode, cleanCountryCode } = req.body

  if (
    typeof userKWh !== 'number' ||
    typeof solarKWh !== 'number' ||
    !dirtyCountryCode ||
    !cleanCountryCode
  ) {
    return res.status(400).json({ error: 'Missing or invalid input fields' })
  }

  // Get country data objects
  const dirtyCountry: Country | undefined = (Object.values(owidData) as Country[]).find(
    (c: Country) => c.iso_code === dirtyCountryCode
  )

  const cleanCountry: Country | undefined = (Object.values(owidData) as Country[]).find(
    (c: Country) => c.iso_code === cleanCountryCode
  )

  if (!dirtyCountry || !cleanCountry) {
    return res.status(404).json({ error: 'Country not found in dataset' })
  }

  // Find latest available year with emission factor
  const dirtyFactor = [...dirtyCountry.data]
  .reverse()
  .find((entry) => typeof entry.co2_per_unit_energy === 'number')
  ?.co2_per_unit_energy

const cleanFactor = [...cleanCountry.data]
  .reverse()
  .find((entry) => typeof entry.co2_per_unit_energy === 'number')
  ?.co2_per_unit_energy

  if (dirtyFactor == null || cleanFactor == null) {
    return res.status(404).json({ error: 'Emission factors not found' })
  }

  const offsetCO2 = userKWh * dirtyFactor - solarKWh * cleanFactor

  return res.status(200).json({
    userKWh,
    solarKWh,
    dirtyFactor,
    cleanFactor,
    offsetCO2,
  })
}
