'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CarbonCalculator() {
  const [formData, setFormData] = useState({
    // Energy & Home
    electricity: '',
    naturalGas: '',
    heatingOil: '',
    propane: '',
    coal: '',
    
    // Transportation
    carMiles: '',
    carType: 'average',
    publicTransport: '',
    flights: '',
    flightType: 'domestic',
    
    // Food & Diet
    meat: '',
    dairy: '',
    vegetables: '',
    processed: '',
    
    // Lifestyle
    waste: '',
    recycling: '',
    shopping: '',
    paper: ''
  })

  const [results, setResults] = useState({
    total: 0,
    breakdown: {} as Record<string, number>
  })

  // Emission factors (kg CO2 per unit)
  const emissionFactors = {
    // Energy (kg CO2 per kWh/unit)
    electricity: 0.5, // per kWh
    naturalGas: 5.3, // per therm
    heatingOil: 10.15, // per gallon
    propane: 5.68, // per gallon
    coal: 2.07, // per kg
    
    // Transportation (kg CO2 per mile/km)
    carTypes: {
      compact: 0.31, // kg CO2 per mile
      average: 0.4,
      suv: 0.5,
      truck: 0.6,
      hybrid: 0.2,
      electric: 0.15
    },
    publicTransport: 0.089, // per mile
    flightTypes: {
      domestic: 0.255, // per mile
      international: 0.195
    },
    
    // Food (kg CO2 per serving/lb)
    meat: 6.61, // per serving
    dairy: 3.2, // per serving
    vegetables: 0.43, // per serving
    processed: 2.5, // per serving
    
    // Lifestyle (kg CO2 per unit)
    waste: 1.44, // per lb of waste
    recycling: -0.89, // negative because it saves CO2
    shopping: 5.5, // per $100 spent
    paper: 1.32 // per ream
  }

  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...formData, [field]: value }
    setFormData(updatedData)
    calculateFootprint(updatedData)
  }

  const calculateFootprint = (data: typeof formData) => {
    let total = 0
    const breakdown: Record<string, number> = {}

    // Energy calculations
    const electricity = (parseFloat(data.electricity) || 0) * emissionFactors.electricity
    const naturalGas = (parseFloat(data.naturalGas) || 0) * emissionFactors.naturalGas
    const heatingOil = (parseFloat(data.heatingOil) || 0) * emissionFactors.heatingOil
    const propane = (parseFloat(data.propane) || 0) * emissionFactors.propane
    const coal = (parseFloat(data.coal) || 0) * emissionFactors.coal
    
    const energyTotal = electricity + naturalGas + heatingOil + propane + coal
    breakdown['Energy'] = energyTotal
    total += energyTotal

    // Transportation calculations
    const carMiles = parseFloat(data.carMiles) || 0
    const carEmissions = carMiles * emissionFactors.carTypes[data.carType as keyof typeof emissionFactors.carTypes]
    const publicTransportEmissions = (parseFloat(data.publicTransport) || 0) * emissionFactors.publicTransport
    const flightEmissions = (parseFloat(data.flights) || 0) * emissionFactors.flightTypes[data.flightType as keyof typeof emissionFactors.flightTypes]
    
    const transportTotal = carEmissions + publicTransportEmissions + flightEmissions
    breakdown['Transportation'] = transportTotal
    total += transportTotal

    // Food calculations
    const meatEmissions = (parseFloat(data.meat) || 0) * emissionFactors.meat
    const dairyEmissions = (parseFloat(data.dairy) || 0) * emissionFactors.dairy
    const vegetableEmissions = (parseFloat(data.vegetables) || 0) * emissionFactors.vegetables
    const processedEmissions = (parseFloat(data.processed) || 0) * emissionFactors.processed
    
    const foodTotal = meatEmissions + dairyEmissions + vegetableEmissions + processedEmissions
    breakdown['Food'] = foodTotal
    total += foodTotal

    // Lifestyle calculations
    const wasteEmissions = (parseFloat(data.waste) || 0) * emissionFactors.waste
    const recyclingEmissions = (parseFloat(data.recycling) || 0) * emissionFactors.recycling
    const shoppingEmissions = (parseFloat(data.shopping) || 0) * emissionFactors.shopping / 100
    const paperEmissions = (parseFloat(data.paper) || 0) * emissionFactors.paper
    
    const lifestyleTotal = wasteEmissions + recyclingEmissions + shoppingEmissions + paperEmissions
    breakdown['Lifestyle'] = lifestyleTotal
    total += lifestyleTotal

    setResults({ total, breakdown })
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(Math.round(num))
  }

  return (
    <div className="max-w-6xl mx-auto p-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-800">Carbon Footprint Calculator</h1>
      <p className="text-center text-gray-600 mb-12">Calculate your annual carbon emissions across all major categories</p>
      
      {/* Navigation */}
      <div className="flex justify-center space-x-4 mb-12">
        <Link href="/" className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
          Home
        </Link>
        <Link href="/avoidance" className="px-4 py-2 bg-green-200 rounded-lg hover:bg-green-300 transition-colors">
          Avoidance Calculator
        </Link>
        <Link href="/offset" className="px-4 py-2 bg-blue-200 rounded-lg hover:bg-blue-300 transition-colors">
          Offset Calculator
        </Link>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12">
        {/* Energy & Home Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-orange-400 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-orange-700">🏠 Energy & Home</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Electricity (kWh/month)</label>
              <input
                type="number"
                value={formData.electricity}
                onChange={(e) => handleInputChange('electricity', e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-300"
                placeholder="Monthly electricity usage"
              />
              <p className="text-xs text-gray-500">Average US home: 900 kWh/month</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Natural Gas (therms/month)</label>
              <input
                type="number"
                value={formData.naturalGas}
                onChange={(e) => handleInputChange('naturalGas', e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-300"
                placeholder="Monthly natural gas usage"
              />
              <p className="text-xs text-gray-500">Average US home: 80 therms/month</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Heating Oil (gallons/year)</label>
              <input
                type="number"
                value={formData.heatingOil}
                onChange={(e) => handleInputChange('heatingOil', e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-300"
                placeholder="Annual heating oil"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Propane (gallons/year)</label>
              <input
                type="number"
                value={formData.propane}
                onChange={(e) => handleInputChange('propane', e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-300"
                placeholder="Annual propane usage"
              />
            </div>
          </div>
        </div>

        {/* Transportation Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-blue-400 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-blue-700">🚗 Transportation</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Car Miles (per year)</label>
              <input
                type="number"
                value={formData.carMiles}
                onChange={(e) => handleInputChange('carMiles', e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
                placeholder="Annual driving miles"
              />
              <p className="text-xs text-gray-500">Average US driver: 12,000 miles/year</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Car Type</label>
              <select
                value={formData.carType}
                onChange={(e) => handleInputChange('carType', e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
              >
                <option value="compact">Compact Car</option>
                <option value="average">Average Car</option>
                <option value="suv">SUV</option>
                <option value="truck">Truck</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Public Transport (miles/year)</label>
              <input
                type="number"
                value={formData.publicTransport}
                onChange={(e) => handleInputChange('publicTransport', e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
                placeholder="Bus, train, subway miles"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Flight Miles (per year)</label>
              <input
                type="number"
                value={formData.flights}
                onChange={(e) => handleInputChange('flights', e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
                placeholder="Annual flight miles"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Flight Type</label>
              <select
                value={formData.flightType}
                onChange={(e) => handleInputChange('flightType', e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
              >
                <option value="domestic">Domestic Flights</option>
                <option value="international">International Flights</option>
              </select>
            </div>
          </div>
        </div>

        {/* Food & Diet Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-green-400 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-green-700">🍽️ Food & Diet</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Meat (servings/week)</label>
              <input
                type="number"
                value={formData.meat}
                onChange={(e) => handleInputChange('meat', e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-300"
                placeholder="Weekly meat servings"
              />
              <p className="text-xs text-gray-500">Beef, pork, lamb - high carbon impact</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Dairy (servings/week)</label>
              <input
                type="number"
                value={formData.dairy}
                onChange={(e) => handleInputChange('dairy', e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-300"
                placeholder="Weekly dairy servings"
              />
              <p className="text-xs text-gray-500">Milk, cheese, yogurt</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Vegetables/Fruits (servings/day)</label>
              <input
                type="number"
                value={formData.vegetables}
                onChange={(e) => handleInputChange('vegetables', e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-300"
                placeholder="Daily vegetable/fruit servings"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Processed Foods ($/month)</label>
              <input
                type="number"
                value={formData.processed}
                onChange={(e) => handleInputChange('processed', e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-300"
                placeholder="Monthly spending on processed foods"
              />
            </div>
          </div>
        </div>

        {/* Lifestyle Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-purple-400 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-purple-700">🛍️ Lifestyle</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Waste (lbs/week)</label>
              <input
                type="number"
                value={formData.waste}
                onChange={(e) => handleInputChange('waste', e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-300"
                placeholder="Weekly household waste"
              />
              <p className="text-xs text-gray-500">Average US household: 30 lbs/week</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Recycling (lbs/week)</label>
              <input
                type="number"
                value={formData.recycling}
                onChange={(e) => handleInputChange('recycling', e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-300"
                placeholder="Weekly recycling"
              />
              <p className="text-xs text-gray-500">Reduces your carbon footprint!</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Shopping ($/month)</label>
              <input
                type="number"
                value={formData.shopping}
                onChange={(e) => handleInputChange('shopping', e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-300"
                placeholder="Monthly retail spending"
              />
              <p className="text-xs text-gray-500">Clothes, electronics, household items</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Paper Usage (reams/year)</label>
              <input
                type="number"
                value={formData.paper}
                onChange={(e) => handleInputChange('paper', e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-300"
                placeholder="Annual paper consumption"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {results.total > 0 && (
        <div className="mt-16 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 p-8 rounded-lg">
          <h3 className="text-2xl font-bold mb-4 text-red-800">Your Annual Carbon Footprint</h3>
          <div className="text-center mb-6">
            <p className="text-5xl font-bold text-red-600 mb-2">{formatNumber(results.total)} kg CO₂</p>
            <p className="text-xl text-gray-700">
              That's {(results.total / 1000).toFixed(1)} tonnes of CO₂ per year
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Global average: 4.8 tonnes • US average: 16 tonnes
            </p>
          </div>
          
          {/* Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(results.breakdown).map(([category, value]) => (
              <div key={category} className="bg-white p-4 rounded-lg text-center">
                <h4 className="font-semibold text-gray-700">{category}</h4>
                <p className="text-lg font-bold text-blue-600">{formatNumber(value)} kg</p>
                <p className="text-sm text-gray-500">
                  {((value / results.total) * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="text-center space-x-4">
            <Link
              href="/offset"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              💰 Offset Your Footprint
            </Link>
            <Link
              href="/avoidance"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              🌱 Reduction Tips
            </Link>
          </div>
          
          {/* Recommendations */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 Quick Tips to Reduce Your Footprint:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Switch to renewable energy or energy-efficient appliances</li>
              <li>• Use public transport, bike, or walk when possible</li>
              <li>• Reduce meat consumption and food waste</li>
              <li>• Buy less, reuse more, and choose sustainable products</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
