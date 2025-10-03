import React, { useState } from 'react'
import { Calculator, TrendingUp, DollarSign, Calendar } from 'lucide-react'

const Simulation: React.FC = () => {
  const [formData, setFormData] = useState({
    crop: 'maize',
    variety: 'hybrid_614',
    plantingDate: '2024-03-15',
    farmSize: 2.0,
    fertilizerDap: 50,
    fertilizerUrea: 25,
    irrigation: 20,
    pesticideApplications: 2
  })

  const [simulationResult, setSimulationResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/v1/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: -1.2921,
          longitude: 36.8219,
          crop: formData.crop,
          variety: formData.variety,
          planting_date: formData.plantingDate,
          farm_size_ha: formData.farmSize,
          inputs: {
            fertilizer_dap_kg_ha: formData.fertilizerDap,
            fertilizer_urea_kg_ha: formData.fertilizerUrea,
            irrigation_mm_week: formData.irrigation,
            pesticide_applications: formData.pesticideApplications
          },
          scenarios: ['current', 'optimal', 'budget']
        })
      })

      const data = await response.json()
      setSimulationResult(data)
    } catch (error) {
      console.error('Simulation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Date') ? value : 
              name.includes('Size') || name.includes('Dap') || name.includes('Urea') || 
              name.includes('irrigation') || name.includes('Applications') ? 
              parseFloat(value) || 0 : value
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Yield Simulation</h1>
        <p className="mt-2 text-gray-600">
          Model crop outcomes based on your farming decisions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulation Form */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Calculator className="h-6 w-6 mr-2 text-primary-600" />
            Simulation Parameters
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Crop Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Crop Type
              </label>
              <select
                name="crop"
                value={formData.crop}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="maize">Maize</option>
                <option value="beans">Beans</option>
                <option value="tomatoes">Tomatoes</option>
                <option value="coffee">Coffee</option>
              </select>
            </div>

            {/* Planting Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Planting Date
              </label>
              <input
                type="date"
                name="plantingDate"
                value={formData.plantingDate}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>

            {/* Farm Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Farm Size (hectares)
              </label>
              <input
                type="number"
                name="farmSize"
                value={formData.farmSize}
                onChange={handleInputChange}
                min="0.1"
                max="1000"
                step="0.1"
                className="input-field"
              />
            </div>

            {/* Fertilizer Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DAP (kg/ha)
                </label>
                <input
                  type="number"
                  name="fertilizerDap"
                  value={formData.fertilizerDap}
                  onChange={handleInputChange}
                  min="0"
                  max="200"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urea (kg/ha)
                </label>
                <input
                  type="number"
                  name="fertilizerUrea"
                  value={formData.fertilizerUrea}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="input-field"
                />
              </div>
            </div>

            {/* Irrigation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Irrigation (mm/week)
              </label>
              <input
                type="number"
                name="irrigation"
                value={formData.irrigation}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="input-field"
              />
            </div>

            {/* Pesticide Applications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pesticide Applications
              </label>
              <input
                type="number"
                name="pesticideApplications"
                value={formData.pesticideApplications}
                onChange={handleInputChange}
                min="0"
                max="10"
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Running Simulation...' : 'Run Simulation'}
            </button>
          </form>
        </div>

        {/* Simulation Results */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-primary-600" />
            Simulation Results
          </h2>

          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : simulationResult ? (
            <div className="space-y-6">
              {/* Current Scenario */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Current Scenario</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Yield:</span>
                    <span className="ml-2 font-medium">{simulationResult.results.current.predicted_yield_kg_ha} kg/ha</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Yield:</span>
                    <span className="ml-2 font-medium">{simulationResult.results.current.total_yield_kg} kg</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Revenue:</span>
                    <span className="ml-2 font-medium">${simulationResult.results.current.revenue_estimate_usd}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Net Profit:</span>
                    <span className="ml-2 font-medium">${simulationResult.results.current.net_profit_usd}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">ROI:</span>
                    <span className="ml-2 font-medium text-green-600">{simulationResult.results.current.roi_percent}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Harvest:</span>
                    <span className="ml-2 font-medium">{simulationResult.results.current.harvest_date_estimate}</span>
                  </div>
                </div>
              </div>

              {/* Optimal Scenario */}
              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <h3 className="font-semibold text-green-900 mb-3">Optimal Scenario</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Yield:</span>
                    <span className="ml-2 font-medium">{simulationResult.results.optimal.predicted_yield_kg_ha} kg/ha</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Improvement:</span>
                    <span className="ml-2 font-medium text-green-600">
                      +{simulationResult.results.optimal.predicted_yield_kg_ha - simulationResult.results.current.predicted_yield_kg_ha} kg/ha
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3">Recommendations</h3>
                <ul className="space-y-2 text-sm">
                  {simulationResult.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-blue-800">{rec.action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Run a simulation to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Simulation
