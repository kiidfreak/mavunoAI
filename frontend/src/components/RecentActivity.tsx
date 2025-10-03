import React from 'react'
import { Activity, User, MapPin, TrendingUp } from 'lucide-react'

const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'farmer_onboarded',
      title: 'New Farmer Onboarded',
      description: 'John Mwangi from Machakos County joined the platform',
      timestamp: '2 hours ago',
      icon: User,
      color: 'green'
    },
    {
      id: 2,
      type: 'weather_alert',
      title: 'Weather Alert Sent',
      description: 'Heavy rain warning sent to 15 farmers in Meru County',
      timestamp: '4 hours ago',
      icon: Activity,
      color: 'blue'
    },
    {
      id: 3,
      type: 'yield_simulation',
      title: 'Yield Simulation Completed',
      description: 'Grace Njeri completed maize yield simulation for 10ha farm',
      timestamp: '6 hours ago',
      icon: TrendingUp,
      color: 'yellow'
    },
    {
      id: 4,
      type: 'carbon_verified',
      title: 'Carbon Credits Verified',
      description: '420 tonnes CO₂ sequestered verified for GreenFinance Kenya',
      timestamp: '1 day ago',
      icon: MapPin,
      color: 'purple'
    },
    {
      id: 5,
      type: 'market_update',
      title: 'Market Prices Updated',
      description: 'Maize prices increased 8% in Nairobi market',
      timestamp: '2 days ago',
      icon: TrendingUp,
      color: 'green'
    }
  ]

  const getActivityIcon = (type: string) => {
    const activity = activities.find(a => a.type === type)
    return activity?.icon || Activity
  }

  const getActivityColor = (type: string) => {
    const activity = activities.find(a => a.type === type)
    return activity?.color || 'gray'
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-primary-600 hover:text-primary-700">
          View all
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          const colorClasses = {
            green: 'text-green-600 bg-green-100',
            blue: 'text-blue-600 bg-blue-100',
            yellow: 'text-yellow-600 bg-yellow-100',
            purple: 'text-purple-600 bg-purple-100',
            red: 'text-red-600 bg-red-100',
            gray: 'text-gray-600 bg-gray-100'
          }
          
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${colorClasses[activity.color as keyof typeof colorClasses]}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecentActivity
