'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CO2AvoidanceWidget() {
  const [solarKWh, setSolarKWh] = useState('')
  const [results, setResults] = useState<{
    avoidedCO2: number
    unit: string
    emissionFactor: number
    year: number
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const calculateAvoidance = async () => {
    if (!solarKWh) {
      setError('Please enter a number')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/avoidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kWh: parseFloat(solarKWh),
          countryCode: 'BRA',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Calculation failed')
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate CO₂ avoidance')
    } finally {
      setLoading(false)
    }
  }

  const treesEquivalent = results ? Math.round(results.avoidedCO2 / 22) : 0

  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center p-8">
      <div className="w-full max-w-lg mx-auto bg-yellow-300 border-8 border-black rounded-[20px] shadow-2xl p-10">

        <h1 className="text-2xl font-semibold text-center text-gray-900 mb-6">
          CO<sub>2</sub> Avoidance Calculator
        </h1>

        <p className="text-center text-gray-500 text-sm mb-10 leading-relaxed">
          This tool shows how much CO₂ you help avoid each year through the solar panels you own in our Brazilian solar farm.
          <br />
          Unlike carbon offsetting (which compensates elsewhere), CO₂ avoidance means your panels directly stop emissions by producing clean electricity in place of fossil fuels.
        </p>

        <div className="mb-8">
          <label htmlFor="kWh" className="block text-sm font-medium text-gray-600 mb-3">
            Your annual solar panel production (kWh)
          </label>
          <input
            type="number"
            id="kWh"
            value={solarKWh}
            onChange={(e) => setSolarKWh(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-base"
            placeholder="e.g. 8000"
          />
          <p className="text-xs text-gray-400 mt-4 text-center">
            Using Brazil's 🇧🇷 emission factor: 0.13 kg CO₂/kWh (2023)
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-6 text-center">{error}</p>
        )}

        <button
          onClick={calculateAvoidance}
          disabled={loading || !solarKWh}
          className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          {loading ? 'Calculating...' : 'Calculate CO₂ Avoided'}
        </button>

        {results && (
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Estimated Impact</h2>

            <p className="text-gray-700 text-base mb-1">
              <strong>CO₂ Avoided:</strong>{' '}
              <span className="text-green-600 font-bold">{results.avoidedCO2.toFixed(2)} kg</span>{' '}
              ≈ {(results.avoidedCO2 / 1000).toFixed(2)} tons
            </p>
            <p className="text-sm text-gray-500">
              🌱 Equals planting <strong>{treesEquivalent}</strong> tree{treesEquivalent !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Based on {results.year} Brazil grid mix ({results.emissionFactor.toFixed(2)} kg CO₂/kWh)
            </p>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">
          Powered by{' '}
          <Link href="https://solarwise.vet" className="text-blue-500 underline" target="_blank">SolarWise</Link>{' · '}
          Data from{' '}
          <Link href="https://ourworldindata.org" className="text-blue-500 underline" target="_blank">Our World in Data</Link>
        </p>
      </div>
    </div>
  )
}
