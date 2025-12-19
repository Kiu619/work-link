import { Card, Typography } from 'antd'
import type { ReactNode } from 'react'

const { Text } = Typography

interface StatsCardProps {
  title: string
  value: number | string
  icon: ReactNode
  iconBgColor?: string
  iconColor?: string
  valueColor?: string
}

const StatsCard = ({
  title,
  value,
  icon,
  iconBgColor = 'bg-blue-100',
  iconColor = 'text-blue-600',
  valueColor = 'text-gray-800',
}: StatsCardProps) => {
  const formattedValue = typeof value === 'number' ? value.toLocaleString('vi-VN') : value

  return (
    <Card className="border-none! shadow-md! hover:shadow-lg! transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <Text type="secondary" className="text-sm">
            {title}
          </Text>
          <div className={`text-2xl font-bold ${valueColor}`}>{formattedValue}</div>
        </div>
        <div
          className={`w-12 h-12 rounded-full ${iconBgColor} flex items-center justify-center`}
        >
          <span className={`text-xl ${iconColor}`}>{icon}</span>
        </div>
      </div>
    </Card>
  )
}

export default StatsCard

