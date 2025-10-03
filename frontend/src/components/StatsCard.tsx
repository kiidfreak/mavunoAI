import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  unit?: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red'
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  unit,
  change,
  changeType = 'neutral',
  icon: Icon,
  color
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500'
  }

  const changeColorClasses = {
    positive: 'text-green-600 bg-green-100',
    negative: 'text-red-600 bg-red-100',
    neutral: 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline mt-2">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {unit && (
              <p className="ml-1 text-sm text-gray-500">{unit}</p>
            )}
          </div>
          {change && (
            <div className="mt-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${changeColorClasses[changeType]}`}>
                {changeType === 'positive' && '↗'}
                {changeType === 'negative' && '↘'}
                {changeType === 'neutral' && '→'}
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${colorClasses[color].replace('bg-', 'text-')}`} />
        </div>
      </div>
    </div>
  )
}

export default StatsCard
