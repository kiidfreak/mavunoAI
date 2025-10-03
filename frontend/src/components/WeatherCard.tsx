import React from 'react'
import { Cloud, Sun, CloudRain, Thermometer, Droplets, Wind } from 'lucide-react'

interface WeatherCardProps {
  data: any
  loading: boolean
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather Forecast</h3>
        <p className="text-gray-500">Unable to load weather data</p>
      </div>
    )
  }

  const { current, forecast, location } = data

  const getWeatherIcon = (conditions: string) => {
    const condition = conditions.toLowerCase()
    if (condition.includes('rain')) return <CloudRain className="h-6 w-6 text-blue-500" />
    if (condition.includes('cloud')) return <Cloud className="h-6 w-6 text-gray-500" />
    return <Sun className="h-6 w-6 text-yellow-500" />
  }

  const getWeatherColor = (conditions: string) => {
    const condition = conditions.toLowerCase()
    if (condition.includes('rain')) return 'text-blue-600'
    if (condition.includes('cloud')) return 'text-gray-600'
    return 'text-yellow-600'
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Weather Forecast</h3>
        <span className="text-sm text-gray-500">{location?.name || 'Machakos'}</span>
      </div>

      {/* Current Weather */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getWeatherIcon(current?.conditions || 'Sunny')}
            <div>
              <div className={`text-2xl font-bold ${getWeatherColor(current?.conditions || 'Sunny')}`}>
                {current?.temperature_c || 26}°C
              </div>
              <div className="text-sm text-gray-600">{current?.conditions || 'Sunny'}</div>
            </div>
          </div>
          <div className="text-right text-sm text-gray-600">
            <div className="flex items-center">
              <Droplets className="h-4 w-4 mr-1" />
              {current?.humidity_percent || 65}%
            </div>
            <div className="flex items-center">
              <Wind className="h-4 w-4 mr-1" />
              {current?.wind_speed_kmh || 12} km/h
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">7-Day Forecast</h4>
        <div className="space-y-2">
          {forecast?.slice(0, 5).map((day: any, index: number) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                {getWeatherIcon(day.conditions)}
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-xs text-gray-500">{day.conditions}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {day.temp_min_c}° - {day.temp_max_c}°
                </div>
                {day.rainfall_mm > 0 && (
                  <div className="text-xs text-blue-600">
                    {day.rainfall_mm}mm
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation */}
      <div className="mt-4 p-3 bg-primary-50 rounded-lg">
        <div className="text-sm text-primary-800">
          <strong>💡 Recommendation:</strong> Good planting conditions expected this week. 
          Soil moisture is optimal for maize planting.
        </div>
      </div>
    </div>
  )
}

export default WeatherCard
