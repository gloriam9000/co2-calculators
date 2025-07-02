export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Carbon Footprint Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Welcome to our carbon footprint calculator. Track your environmental impact and find ways to reduce your carbon footprint.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Calculator Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">🌍</div>
            <h2 className="text-2xl font-bold mb-4">Calculate Your Footprint</h2>
            <p className="text-gray-600 mb-6">
              Calculate your annual carbon emissions from transportation, energy use, and lifestyle choices.
            </p>
            <a
              href="/calculator"
              className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 inline-block"
            >
              Start Calculating
            </a>
          </div>

          {/* Offset Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">🌳</div>
            <h2 className="text-2xl font-bold mb-4">Offset Your Carbon</h2>
            <p className="text-gray-600 mb-6">
              Calculate the cost to offset your carbon footprint through various environmental projects.
            </p>
            <a
              href="/offset"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 inline-block"
            >
              Calculate Offsets
            </a>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-3">Why Calculate Your Carbon Footprint?</h3>
            <p className="text-gray-600">
              Understanding your carbon footprint is the first step toward reducing your environmental impact. 
              Our tools help you identify areas for improvement and provide options to offset unavoidable emissions.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
