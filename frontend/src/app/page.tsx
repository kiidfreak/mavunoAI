import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            🌍 MavunoAI
          </h1>
          <p className="text-2xl text-gray-600 mb-4">
            Modular Farm Intelligence Platform
          </p>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            Transform NASA Earth Observation data into actionable insights for high-value farming operations. 
            Starting with onions (40% loss prevention) and beekeeping (30% yield increase).
          </p>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-4xl mb-4">🧅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Onion Intelligence</h3>
            <p className="text-gray-600 mb-6">
              Prevent 40% crop losses using NASA SMAP soil moisture data for optimal irrigation timing
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div>• SMAP soil moisture (0-5cm depth)</div>
              <div>• MODIS disease risk prediction</div>
              <div>• CHIRPS rainfall forecasting</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-4xl mb-4">🐝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Apiary Intelligence</h3>
            <p className="text-gray-600 mb-6">
              Increase honey production 30% using MODIS NDVI to predict nectar flow and optimize hive placement
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div>• MODIS NDVI for flowering detection</div>
              <div>• CHIRPS rainfall for nectar timing</div>
              <div>• Temperature stress monitoring</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Carbon Impact</h3>
            <p className="text-gray-600 mb-6">
              Track ESG metrics for Carbon Corp entities with satellite-verified impact data
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div>• Landsat land cover analysis</div>
              <div>• Water conservation tracking</div>
              <div>• Biodiversity impact measurement</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/dashboard"
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              📊 View Dashboard
            </Link>
            <Link 
              href="/game"
              className="px-8 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg"
            >
              🎮 Play Game
            </Link>
            <a 
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg"
            >
              📡 API Docs
            </a>
          </div>
        </div>

        {/* NASA Data Sources */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            📡 Powered by NASA Earth Observation Data
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🌍</div>
              <h4 className="font-semibold text-gray-800">SMAP</h4>
              <p className="text-sm text-gray-600">Soil Moisture</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌧️</div>
              <h4 className="font-semibold text-gray-800">CHIRPS</h4>
              <p className="text-sm text-gray-600">Rainfall</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🛰️</div>
              <h4 className="font-semibold text-gray-800">Landsat</h4>
              <p className="text-sm text-gray-600">NDVI</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌡️</div>
              <h4 className="font-semibold text-gray-800">MODIS</h4>
              <p className="text-sm text-gray-600">Temperature</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500">
          <p>NASA Space Apps Challenge 2025 • Built with Next.js & FastAPI</p>
        </div>
      </div>
    </div>
  );
}
