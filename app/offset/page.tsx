'use client';

import React, { useState } from 'react';

export default function OffsetCalculator() {
  const [footprint, setFootprint] = useState(0);
  const [offsetMethod, setOffsetMethod] = useState('trees');
  const [results, setResults] = useState<{
    tons: number;
    cost: number;
    quantity: number | string;
    method: any;
  } | null>(null);

  const offsetOptions = {
    trees: {
      name: 'Tree Planting',
      costPerTon: 25, // USD per ton CO2
      description: 'Plant trees that will absorb CO2 over their lifetime',
      unit: 'trees',
      conversion: 22, // kg CO2 per tree per year
      icon: '🌳'
    },
    renewable: {
      name: 'Renewable Energy',
      costPerTon: 15,
      description: 'Support renewable energy projects',
      unit: 'kWh',
      conversion: 0.5, // kg CO2 per kWh
      icon: '⚡'
    },
    conservation: {
      name: 'Forest Conservation',
      costPerTon: 12,
      description: 'Protect existing forests from deforestation',
      unit: 'hectares',
      conversion: 200, // tons CO2 per hectare per year
      icon: '🏞️'
    },
    methane: {
      name: 'Methane Capture',
      costPerTon: 20,
      description: 'Capture methane from landfills and farms',
      unit: 'projects',
      conversion: 1000, // kg CO2 equivalent per project
      icon: '🔧'
    }
  };

  const calculateOffset = () => {
    const tons = footprint / 1000;
    const option = offsetOptions[offsetMethod];
    const cost = tons * option.costPerTon;
    
    let quantity;
    if (offsetMethod === 'trees') {
      quantity = Math.ceil((footprint / option.conversion));
    } else if (offsetMethod === 'renewable') {
      quantity = Math.ceil(footprint / option.conversion);
    } else if (offsetMethod === 'conservation') {
      quantity = (footprint / 1000 / option.conversion).toFixed(3);
    } else {
      quantity = Math.ceil(footprint / option.conversion);
    }

    setResults({
      tons,
      cost,
      quantity,
      method: option
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Carbon Offset Calculator</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Enter Your Carbon Footprint</h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Annual Carbon Footprint (kg CO₂)
            </label>
            <input
              type="number"
              value={footprint}
              onChange={(e) => setFootprint(Number(e.target.value))}
              className="w-full p-3 border rounded-md text-lg"
              placeholder="Enter your carbon footprint"
            />
          </div>
          <div>
            <a
              href="/calculator"
              className="bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700"
            >
              Calculate Footprint
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Choose Offset Method</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(offsetOptions).map(([key, option]) => (
            <div
              key={key}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                offsetMethod === key
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setOffsetMethod(key)}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <h3 className="font-semibold">{option.name}</h3>
                  <p className="text-sm text-gray-600">${option.costPerTon}/ton CO₂</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{option.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mb-8">
        <button
          onClick={calculateOffset}
          disabled={!footprint}
          className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
        >
          Calculate Offset Cost
        </button>
      </div>

      {results && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-center mb-4">Offset Results</h3>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-600">Carbon Footprint</h4>
              <p className="text-2xl font-bold text-blue-600">
                {results.tons.toFixed(2)} tons CO₂
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-gray-600">Offset Cost</h4>
              <p className="text-2xl font-bold text-green-600">
                ${results.cost.toFixed(2)}
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-gray-600">
                {results.method.name}
              </h4>
              <p className="text-2xl font-bold text-orange-600">
                {results.quantity} {results.method.unit}
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">What This Means:</h4>
            <p className="text-gray-700">
              To offset your annual carbon footprint of {results.tons.toFixed(2)} tons CO₂, 
              you would need to invest ${results.cost.toFixed(2)} in {results.method.name.toLowerCase()}. 
              This would be equivalent to {results.quantity} {results.method.unit}.
            </p>
          </div>

          <div className="mt-6 text-center">
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700">
              Purchase Carbon Offsets
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
