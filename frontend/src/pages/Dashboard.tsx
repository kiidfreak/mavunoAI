import React, { useState, useEffect } from 'react'
import { Map, MapPin, Cloud, TrendingUp, Users, Leaf } from 'lucide-react'
import WeatherCard from '../components/WeatherCard'
import MapComponent from '../components/MapComponent'
import StatsCard from '../components/StatsCard'
import RecentActivity from '../components/RecentActivity'

const Dashboard: React.FC = () => {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch demo weather data
    const fetchWeatherData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/weather/forecast', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latitude: -1.2921,
            longitude: 36.8219,
            days: 7
          })
        })
        const data = await response.json()
        setWeatherData(data)
      } catch (error) {
        console.error('Error fetching weather data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()
  }, [])

  const stats = [
    {
      title: 'Active Farmers',
      value: '1,250',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Carbon Sequestered',
      value: '4,200',
      unit: 'tonnes CO₂',
      change: '+18%',
      changeType: 'positive',
      icon: Leaf,
      color: 'green'
    },
    {
      title: 'Yield Increase',
      value: '18%',
      change: '+5%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'yellow'
    },
    {
      title: 'Weather Stations',
      value: '47',
      change: '+3',
      changeType: 'positive',
      icon: Cloud,
      color: 'purple'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Agricultural intelligence powered by NASA and Digital Earth Africa
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Card */}
        <div className="lg:col-span-1">
          <WeatherCard data={weatherData} loading={loading} />
        </div>

        {/* Map */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Map className="h-5 w-5 mr-2 text-primary-600" />
                Farm Locations & NDVI
              </h3>
              <span className="text-sm text-gray-500">Real-time</span>
            </div>
            <MapComponent />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        
        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full btn-primary text-left">
              <MapPin className="h-4 w-4 mr-2 inline" />
              Run Yield Simulation
            </button>
            <button className="w-full btn-secondary text-left">
              <Cloud className="h-4 w-4 mr-2 inline" />
              Check Weather Forecast
            </button>
            <button className="w-full btn-secondary text-left">
              <TrendingUp className="h-4 w-4 mr-2 inline" />
              View Market Prices
            </button>
            <button className="w-full btn-secondary text-left">
              <Leaf className="h-4 w-4 mr-2 inline" />
              Carbon Impact Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
