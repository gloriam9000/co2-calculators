'use client'

import { useEffect, useState } from 'react'

export default function OffsetCalculator() {
  const [userKWh, setUserKWh] = useState<string>('')
  const [solarKWh, setSolarKWh] = useState<string>('')
  const [dirtyCountry, setDirtyCountry] = useState<string>('')
  const [cleanCountry, setCleanCountry] = useState<string>('')
  const [countries, setCountries] = useState<Array<{ name: string; iso_code: string }>>([])
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch('/api/offset-countries')
        const data = await res.json()
        setCountries(data)

        if (data.length > 1) {
          setDirtyCountry(data[0].iso_code)
          setCleanCountry(data[1].iso_code)
        }
      } catch (err) {
        console.error('Failed to fetch countries', err)
      }
    }

    fetchCountries()
  }, [])

  const handleCalculate = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/offset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userKWh: Number(userKWh) || 0,
          solarKWh: Number(solarKWh) || 0,
          dirtyCountryCode: dirtyCountry,
          cleanCountryCode: cleanCountry,
        }),
      })

      const data = await response.json()

      if (response.ok && data.offsetCO2 != null) {
        setResult(data)
      } else {
        console.error('❌ Missing or invalid fields in API response:', data)
        setResult(null)
      }
    } catch (error) {
      console.error('❌ Error during fetch:', error)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-8 flex justify-center min-h-screen">
      <div 
        className="w-full max-w-[480px] mx-auto bg-white rounded-3xl p-6 shadow-2xl"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8)'
        }}
      >
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2 leading-tight">
            CO<sub className="text-lg">₂</sub> Offset Calculator
          </h1>
          <p className="text-sm text-gray-600 font-medium">
            See how much CO₂ you can offset by using clean solar energy instead of dirty electricity — instantly. Just enter your usage, choose your countries, and discover your real impact in kilograms, flights, or trees.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-6 space-y-4">
          {/* Annual Usage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual electricity usage (kWh)
            </label>
            <input
              type="number"
              value={userKWh}
              onChange={(e) => setUserKWh(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="8,000"
            />
          </div>

          {/* Solar Production */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Solar electricity production (kWh)
            </label>
            <input
              type="number"
              value={solarKWh}
              onChange={(e) => setSolarKWh(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="5,000"
            />
          </div>

          {/* Country Selects */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your country
              </label>
              <select
                value={dirtyCountry}
                onChange={(e) => setDirtyCountry(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.25em 1.25em'
                }}
              >
                <option value="">Select your country</option>
                {countries.map((country) => (
                  <option key={country.iso_code} value={country.iso_code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Solar farm country
              </label>
              <select
                value={cleanCountry}
                onChange={(e) => setCleanCountry(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.25em 1.25em'
                }}
              >
                <option value="">Select clean energy country</option>
                {countries.map((country) => (
                  <option key={country.iso_code} value={country.iso_code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          disabled={loading || !userKWh || !solarKWh || !dirtyCountry || !cleanCountry}
          className="w-full font-semibold uppercase py-4 rounded-2xl text-white text-sm tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-6 transform hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: loading || !userKWh || !solarKWh || !dirtyCountry || !cleanCountry 
              ? '#9CA3AF' 
              : 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
            boxShadow: loading || !userKWh || !solarKWh || !dirtyCountry || !cleanCountry 
              ? 'none' 
              : '0 10px 25px -5px rgba(59, 130, 246, 0.4)'
          }}
        >
          {loading ? 'Calculating...' : 'Calculate Offset'}
        </button>

        {/* Results Card */}
        {result && (
          <div 
            className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 text-center animate-fade-in"
            style={{
              boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.1)',
              animation: 'fadeIn 0.5s ease-out'
            }}
          >
            {/* Main Impact Number */}
            <div className="mb-4">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {result.offsetCO2.toFixed(0)} kg
              </div>
              <div className="text-lg text-gray-600">
                CO₂ offset this year
              </div>
            </div>

            {/* Impact Context */}
            <div className="text-sm text-gray-500 mb-4">
              ≈ {(result.offsetCO2 / 1500).toFixed(1)} flights worth of emissions saved
            </div>

            {/* Optional Advanced Breakdown */}
            <details className="text-left">
              <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium text-center mb-3">
                View breakdown
              </summary>
              
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Your country factor:</span>
                  <span className="font-medium">{result.dirtyFactor.toFixed(4)} kg/kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Clean energy factor:</span>
                  <span className="font-medium">{result.cleanFactor.toFixed(4)} kg/kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Usage:</span>
                  <span className="font-medium">{result.userKWh.toLocaleString()} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Solar production:</span>
                  <span className="font-medium">{result.solarKWh.toLocaleString()} kWh</span>
                </div>
              </div>
            </details>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-center text-xs text-gray-400">
            Powered by <span className="font-medium">SolarWise</span> • Data from{' '}
            <a 
              href="https://ourworldindata.org" 
              className="hover:text-gray-500 underline transition-colors" 
              target="_blank"
            >
              Our World in Data
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
