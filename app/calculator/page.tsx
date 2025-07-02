'use client';

import React, { useState } from 'react';

export default function Calculator() {
  const [transport, setTransport] = useState({
    car: 0,
    plane: 0,
    train: 0,
    bus: 0
  });
  
  const [energy, setEnergy] = useState({
    electricity: 0,
    gas: 0,
    heating: 0
  });
  
  const [totalFootprint, setTotalFootprint] = useState(0);

  // CO2 emission factors (kg CO2 per unit)
  const emissionFactors = {
    car: 0.21, // per km
    plane: 0.255, // per km
    train: 0.041, // per km
    bus: 0.089, // per km
    electricity: 0.5, // per kWh
    gas: 2.3, // per m³
    heating: 2.5 // per liter
  };

  const calculateFootprint = () => {
    const transportTotal = 
      transport.car * emissionFactors.car +
      transport.plane * emissionFactors.plane +
      transport.train * emissionFactors.train +
      transport.bus * emissionFactors.bus;
    
    const energyTotal = 
      energy.electricity * emissionFactors.electricity +
      energy.gas * emissionFactors.gas +
      energy.heating * emissionFactors.heating;
    
    const total = transportTotal + energyTotal;
    setTotalFootprint(total);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Carbon Footprint Calculator</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Transportation Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Transportation (per year)</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Car (km)</label>
              <input
                type="number"
                value={transport.car}
                onChange={(e) => setTransport({...transport, car: Number(e.target.value)})}
                className="w-full p-2 border rounded-md"
                placeholder="Annual km by car"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Flights (km)</label>
              <input
                type="number"
                value={transport.plane}
                onChange={(e) => setTransport({...transport, plane: Number(e.target.value)})}
                className="w-full p-2 border rounded-md"
                placeholder="Annual flight km"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Train (km)</label>
              <input
                type="number"
                value={transport.train}
                onChange={(e) => setTransport({...transport, train: Number(e.target.value)})}
                className="w-full p-2 border rounded-md"
                placeholder="Annual km by train"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Bus (km)</label>
              <input
                type="number"
                value={transport.bus}
                onChange={(e) => setTransport({...transport, bus: Number(e.target.value)})}
                className="w-full p-2 border rounded-md"
                placeholder="Annual km by bus"
              />
            </div>
          </div>
        </div>

        {/* Energy Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Energy Consumption (per year)</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Electricity (kWh)</label>
              <input
                type="number"
                value={energy.electricity}
                onChange={(e) => setEnergy({...energy, electricity: Number(e.target.value)})}
                className="w-full p-2 border rounded-md"
                placeholder="Annual electricity usage"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Natural Gas (m³)</label>
              <input
                type="number"
                value={energy.gas}
                onChange={(e) => setEnergy({...energy, gas: Number(e.target.value)})}
                className="w-full p-2 border rounded-md"
                placeholder="Annual gas usage"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Heating Oil (liters)</label>
              <input
                type="number"
                value={energy.heating}
                onChange={(e) => setEnergy({...energy, heating: Number(e.target.value)})}
                className="w-full p-2 border rounded-md"
                placeholder="Annual heating oil"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Calculate Button */}
      <div className="text-center mt-8">
        <button
          onClick={calculateFootprint}
          className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700"
        >
          Calculate My Carbon Footprint
        </button>
      </div>

      {/* Results */}
      {totalFootprint > 0 && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-2">Your Annual Carbon Footprint</h3>
          <p className="text-4xl font-bold text-red-600">{totalFootprint.toFixed(2)} kg CO₂</p>
          <p className="text-lg text-gray-600 mt-2">
            That's equivalent to {(totalFootprint / 1000).toFixed(2)} tonnes of CO₂ per year
          </p>
          
          <div className="mt-4">
            <a
              href="/offset"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Offset Your Carbon Footprint
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
