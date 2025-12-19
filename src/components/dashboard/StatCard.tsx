import { Card } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import type { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: number
    isUp: boolean
  }
  color: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange'
  subtitle?: string
}

const colorClasses = {
  red: {
    bg: 'bg-red-50',
    icon: 'bg-red-500',
    trend: 'text-red-600',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-500',
    trend: 'text-blue-600',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'bg-green-500',
    trend: 'text-green-600',
  },
  yellow: {
    bg: 'bg-yellow-50',
    icon: 'bg-yellow-500',
    trend: 'text-yellow-600',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'bg-purple-500',
    trend: 'text-purple-600',
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'bg-orange-500',
    trend: 'text-orange-600',
  },
}

const StatCard = ({ title, value, icon, trend, color, subtitle }: StatCardProps) => {
  const colors = colorClasses[color]

  return (
    <Card className="border-none! shadow-md! hover:shadow-lg! transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mb-2">
            {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
          </p>
          {trend && (
            <div className="flex items-center gap-1">
              {trend.isUp ? (
                <ArrowUpOutlined className="text-green-500 text-xs" />
              ) : (
                <ArrowDownOutlined className="text-red-500 text-xs" />
              )}
              <span className={trend.isUp ? 'text-green-500' : 'text-red-500'}>
                {trend.value}%
              </span>
              <span className="text-gray-400 text-xs ml-1">so với tháng trước</span>
            </div>
          )}
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-14 h-14 ${colors.icon} rounded-xl flex items-center justify-center text-white text-2xl shadow-lg`}>
          {icon}
        </div>
      </div>
    </Card>
  )
}

export default StatCard

