import { NextApiRequest, NextApiResponse } from 'next';
import { getLatestCo2Intensity } from '../../lib/parseCo2';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;
  
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Country code required' });
  }
  
  const value = getLatestCo2Intensity(code);
  
  if (!value) {
    return res.status(404).json({ error: 'Country not found or no data available' });
  }
  
  res.status(200).json({ co2_per_unit_energy: value });
}
