import type { NextApiRequest, NextApiResponse } from 'next'
import { countryList } from '../../data/countryList'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Return the country list with iso_code and name
  const countries = countryList.map(country => ({
    iso_code: country.code,
    name: country.name
  }))

  res.status(200).json(countries)
}
