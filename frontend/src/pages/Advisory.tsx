import React, { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle, Info, TrendingUp, Users, MapPin } from 'lucide-react'

const Advisory: React.FC = () => {
  const [advisoryData, setAdvisoryData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedFarmer, setSelectedFarmer] = useState('farmer_001')

  const farmers = [
    { id: 'farmer_001', name: 'John Mwangi', location: 'Machakos', crops: ['maize', 'beans'] },
    { id: 'farmer_002', name: 'Grace Njeri', location: 'Kiambu', crops: ['tomatoes', 'coffee'] },
    { id: 'farmer_003', name: 'Peter Kimani', location: 'Meru', crops: ['maize'] }
  ]

  useEffect(() => {
    const fetchAdvisoryData = async () => {
      setLoading(true)
      try {
        const response = await fetch('http://localhost:8000/api/v1/advisory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            farmer_id: selectedFarmer,
            latitude: -1.2921,
            longitude: 36.8219,
            crop: 'maize',
            farm_size_ha: 2.0
          })
        })
        const data = await response.json()
        setAdvisoryData(data)
      } catch (error) {
        console.error('Error fetching advisory data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdvisoryData()
  }, [selectedFarmer])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'text-red-600 bg-red-100'
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-100'
      case 'LOW':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return <AlertTriangle className="h-4 w-4" />
      case 'MEDIUM':
        return <Info className="h-4 w-4" />
      case 'LOW':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Agricultural Advisory</h1>
          <p className="mt-2 text-gray-600">
            AI-powered farming recommendations and alerts
          </p>
        </div>
        <select
          value={selectedFarmer}
          onChange={(e) => setSelectedFarmer(e.target.value)}
          className="input-field w-64"
        >
          {farmers.map(farmer => (
            <option key={farmer.id} value={farmer.id}>{farmer.name} - {farmer.location}</option>
          ))}
        </select>
      </div>

      {/* Farm Health Score */}
      {advisoryData && (
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Farm Health Score</h3>
              <p className="text-sm text-gray-600">Overall farm performance indicator</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-gray-900">{advisoryData.farm_health_score}</div>
              <div className="text-sm text-gray-500">out of 100</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${advisoryData.farm_health_score}%` }}
              ></div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {advisoryData.farm_health_score >= 80 ? 'Excellent' : 
               advisoryData.farm_health_score >= 60 ? 'Good' : 
               advisoryData.farm_health_score >= 40 ? 'Fair' : 'Needs Attention'}
            </div>
          </div>
        </div>
      )}

      {/* Alerts and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h3>
          <div className="space-y-4">
            {advisoryData?.alerts?.length > 0 ? (
              advisoryData.alerts.map((alert, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg ${getPriorityColor(alert.priority)}`}>
                      {getPriorityIcon(alert.priority)}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{alert.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                          {alert.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                      {alert.action_required && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-red-600 bg-red-100">
                            Action Required
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>No active alerts</p>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
          <div className="space-y-4">
            {advisoryData?.recommendations?.length > 0 ? (
              advisoryData.recommendations.map((rec, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="font-medium text-gray-900 capitalize">{rec.category}</h4>
                      <p className="text-sm text-gray-600 mt-1">{rec.message}</p>
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">
                          Confidence: {Math.round(rec.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Info className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                <p>No recommendations available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Market Intelligence */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Intelligence</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">+8%</div>
            <div className="text-sm text-gray-600">Maize Price Trend</div>
            <div className="text-xs text-gray-500 mt-1">Last 7 days</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">45 KES</div>
            <div className="text-sm text-gray-600">Current Price/kg</div>
            <div className="text-xs text-gray-500 mt-1">Nairobi Market</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 mb-2">Good</div>
            <div className="text-sm text-gray-600">Selling Opportunity</div>
            <div className="text-xs text-gray-500 mt-1">Prices trending up</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="btn-primary text-center">
            <Users className="h-5 w-5 mx-auto mb-2" />
            <div className="text-sm">Contact Extension Officer</div>
          </button>
          <button className="btn-secondary text-center">
            <MapPin className="h-5 w-5 mx-auto mb-2" />
            <div className="text-sm">View Farm Location</div>
          </button>
          <button className="btn-secondary text-center">
            <TrendingUp className="h-5 w-5 mx-auto mb-2" />
            <div className="text-sm">Run Yield Simulation</div>
          </button>
          <button className="btn-secondary text-center">
            <AlertTriangle className="h-5 w-5 mx-auto mb-2" />
            <div className="text-sm">Report Issue</div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Advisory
