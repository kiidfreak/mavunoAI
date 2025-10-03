import React, { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, Thermometer, Droplets, Wind, MapPin } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState(null)
  const [ndviData, setNdivData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState('Machakos')

  const locations = [
    { name: 'Machakos', lat: -1.2921, lng: 36.8219 },
    { name: 'Nairobi', lat: -1.2921, lng: 36.8219 },
    { name: 'Meru', lat: 0.0500, lng: 37.6500 },
    { name: 'Nakuru', lat: -0.3000, lng: 36.0833 }
  ]

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true)
      try {
        const location = locations.find(loc => loc.name === selectedLocation)
        const response = await fetch('http://localhost:8000/api/v1/weather/forecast', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latitude: location?.lat || -1.2921,
            longitude: location?.lng || 36.8219,
            days: 14
          })
        })
        const data = await response.json()
        setWeatherData(data)

        // Fetch NDVI data
        const ndviResponse = await fetch(`http://localhost:8000/api/v1/satellite/ndvi?latitude=${location?.lat || -1.2921}&longitude=${location?.lng || 36.8219}&days=30`)
        const ndviData = await ndviResponse.json()
        setNdivData(ndviData)
      } catch (error) {
        console.error('Error fetching weather data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()
  }, [selectedLocation])

  const getWeatherIcon = (conditions: string) => {
    const condition = conditions.toLowerCase()
    if (condition.includes('rain')) return <CloudRain className="h-8 w-8 text-blue-500" />
    if (condition.includes('cloud')) return <Cloud className="h-8 w-8 text-gray-500" />
    return <Sun className="h-8 w-8 text-yellow-500" />
  }

  const getWeatherColor = (conditions: string) => {
    const condition = conditions.toLowerCase()
    if (condition.includes('rain')) return 'text-blue-600'
    if (condition.includes('cloud')) return 'text-gray-600'
    return 'text-yellow-600'
  }

  const chartData = weatherData?.forecast?.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    temperature: day.temp_max_c,
    rainfall: day.rainfall_mm,
    humidity: day.humidity_avg
  })) || []

  const ndviChartData = ndviData?.data_points?.map(point => ({
    date: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    ndvi: point.ndvi_value
  })) || []

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
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
          <h1 className="text-3xl font-bold text-gray-900">Weather & Satellite Data</h1>
          <p className="mt-2 text-gray-600">
            Real-time weather forecasts and vegetation health monitoring
          </p>
        </div>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="input-field w-48"
        >
          {locations.map(location => (
            <option key={location.name} value={location.name}>{location.name}</option>
          ))}
        </select>
      </div>

      {/* Current Weather */}
      {weatherData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Conditions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Conditions</h3>
            <div className="text-center">
              <div className="mb-4">
                {getWeatherIcon(weatherData.current.conditions)}
              </div>
              <div className={`text-4xl font-bold mb-2 ${getWeatherColor(weatherData.current.conditions)}`}>
                {weatherData.current.temperature_c}°C
              </div>
              <div className="text-lg text-gray-600 mb-4">{weatherData.current.conditions}</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-center">
                  <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                  <span>{weatherData.current.humidity_percent}%</span>
                </div>
                <div className="flex items-center justify-center">
                  <Wind className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{weatherData.current.wind_speed_kmh} km/h</span>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="card md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Forecast</h3>
            <div className="space-y-2">
              {weatherData.forecast.slice(0, 7).map((day, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 text-sm text-gray-600">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="flex items-center space-x-2">
                      {getWeatherIcon(day.conditions)}
                      <span className="text-sm text-gray-600">{day.conditions}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {day.temp_min_c}° - {day.temp_max_c}°
                    </div>
                    {day.rainfall_mm > 0 && (
                      <div className="text-xs text-blue-600">
                        {day.rainfall_mm}mm rain
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature & Rainfall Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Temperature & Rainfall</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="temp" orientation="left" />
              <YAxis yAxisId="rain" orientation="right" />
              <Tooltip />
              <Line yAxisId="temp" type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={2} />
              <Line yAxisId="rain" type="monotone" dataKey="rainfall" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* NDVI Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vegetation Health (NDVI)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ndviChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Line type="monotone" dataKey="ndvi" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>Average NDVI: {ndviData?.average_ndvi || 0}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                ndviData?.trend === 'improving' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {ndviData?.trend || 'stable'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Alerts */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather Alerts</h3>
        <div className="space-y-3">
          <div className="flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex-shrink-0">
              <Sun className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-yellow-800">High Temperature Alert</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Temperatures reaching 32°C. Monitor crop stress and increase irrigation if needed.
              </p>
            </div>
          </div>
          <div className="flex items-start p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex-shrink-0">
              <CloudRain className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800">Rainfall Forecast</h4>
              <p className="text-sm text-blue-700 mt-1">
                15mm rainfall expected tomorrow. Good conditions for planting.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Cloud className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <h4 className="font-medium text-gray-900">Kenya Met Department</h4>
            <p className="text-sm text-gray-600">Real-time weather data</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <h4 className="font-medium text-gray-900">NASA CHIRPS</h4>
            <p className="text-sm text-gray-600">Rainfall estimates</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Sun className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <h4 className="font-medium text-gray-900">Digital Earth Africa</h4>
            <p className="text-sm text-gray-600">Satellite imagery</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Weather
