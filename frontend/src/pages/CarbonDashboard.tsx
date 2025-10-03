import React, { useState, useEffect } from 'react'
import { Leaf, TrendingUp, Users, MapPin, BarChart3 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const CarbonDashboard: React.FC = () => {
  const [selectedEntity, setSelectedEntity] = useState('entity_001')
  const [carbonData, setCarbonData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCarbonData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/carbon/entity/entity_001', {
          method: 'GET'
        })
        const data = await response.json()
        setCarbonData(data)
      } catch (error) {
        console.error('Error fetching carbon data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCarbonData()
  }, [selectedEntity])

  const entities = [
    { id: 'entity_001', name: 'GreenFinance Kenya Ltd' },
    { id: 'entity_002', name: 'Sustainable Agriculture Fund' },
    { id: 'entity_003', name: 'Climate Action Partners' }
  ]

  const mockTrendData = [
    { month: 'Jan', carbon: 3200, farms: 1200, yield: 15 },
    { month: 'Feb', carbon: 3400, farms: 1220, yield: 16 },
    { month: 'Mar', carbon: 3600, farms: 1240, yield: 17 },
    { month: 'Apr', carbon: 3800, farms: 1250, yield: 18 },
    { month: 'May', carbon: 4000, farms: 1250, yield: 18 },
    { month: 'Jun', carbon: 4200, farms: 1250, yield: 18 }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Carbon Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Sustainability metrics and impact tracking for Carbon Corp entities
          </p>
        </div>
        <select
          value={selectedEntity}
          onChange={(e) => setSelectedEntity(e.target.value)}
          className="input-field w-64"
        >
          {entities.map(entity => (
            <option key={entity.id} value={entity.id}>{entity.name}</option>
          ))}
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Carbon Sequestered</p>
              <p className="text-2xl font-semibold text-gray-900">4,200</p>
              <p className="text-sm text-gray-500">tonnes CO₂</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-100">
              ↗ +18%
            </span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Farms Monitored</p>
              <p className="text-2xl font-semibold text-gray-900">1,250</p>
              <p className="text-sm text-gray-500">active farms</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-100">
              ↗ +12%
            </span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Yield Increase</p>
              <p className="text-2xl font-semibold text-gray-900">18%</p>
              <p className="text-sm text-gray-500">average improvement</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-100">
              ↗ +5%
            </span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hectares Monitored</p>
              <p className="text-2xl font-semibold text-gray-900">3,400</p>
              <p className="text-sm text-gray-500">total area</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-100">
              ↗ +8%
            </span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carbon Sequestration Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Carbon Sequestration Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="carbon" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Farm Performance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Farm Performance Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="farms" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Environmental Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">125,000</div>
            <div className="text-sm text-gray-600">Water Saved (m³)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">18%</div>
            <div className="text-sm text-gray-600">Soil Health Improvement</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">45</div>
            <div className="text-sm text-gray-600">Forest Area Restored (ha)</div>
          </div>
        </div>
      </div>

      {/* Social Impact */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Social Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">890</div>
            <div className="text-sm text-gray-600">Farmers Above Poverty Line</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">22%</div>
            <div className="text-sm text-gray-600">Average Income Increase</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">42%</div>
            <div className="text-sm text-gray-600">Women Farmers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">28%</div>
            <div className="text-sm text-gray-600">Youth Farmers</div>
          </div>
        </div>
      </div>

      {/* Data Quality */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Quality & Verification</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-2xl font-bold text-gray-900 mb-1">95%</div>
            <div className="text-sm text-gray-600">Satellite Coverage</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 mb-1">85</div>
            <div className="text-sm text-gray-600">Ground Truth Samples</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 mb-1">92%</div>
            <div className="text-sm text-gray-600">Confidence Score</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarbonDashboard
