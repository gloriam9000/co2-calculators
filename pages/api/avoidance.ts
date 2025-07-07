import { NextApiRequest, NextApiResponse } from 'next';
import { calculateAvoidedCO2 } from '../../lib/co2Calculator';
import { getElectricityEmissionFactor } from '../../lib/parseCo2';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { kWh, countryCode } = req.body;
    
    if (typeof kWh !== 'number') {
      return res.status(400).json({ error: 'Invalid input: kWh must be a number' });
    }

    // For SolarWise avoidance calculator, use Brazil's clean energy mix (0.13 kg CO₂/kWh)
    const brazilEmissionFactor = 0.13;
    
    // If countryCode is provided, try to get actual factor, otherwise use Brazil
    let emissionFactor = brazilEmissionFactor;
    
    if (countryCode && typeof countryCode === 'string' && countryCode !== 'BRA') {
      const actualFactor = getElectricityEmissionFactor(countryCode);
      if (actualFactor !== null) {
        emissionFactor = actualFactor;
      }
    }

    const avoidedCO2 = calculateAvoidedCO2(kWh, emissionFactor);

    return res.status(200).json({ 
      avoidedCO2, 
      unit: 'kg CO2',
      emissionFactor,
      year: 2023,
      countryCode: countryCode || 'BRA'
    });
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
