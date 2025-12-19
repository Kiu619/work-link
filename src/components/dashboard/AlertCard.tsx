import { Card, Badge, Button } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import type { ReactNode } from 'react'

interface AlertCardProps {
  title: string
  count: number
  icon: ReactNode
  type: 'warning' | 'danger' | 'info'
  description: string
  onClick?: () => void
}

const typeClasses = {
  warning: {
    bg: 'bg-yellow-50 border-yellow-200',
    icon: 'bg-yellow-100 text-yellow-600',
    badge: 'gold',
    button: 'text-yellow-600 hover:text-yellow-700',
  },
  danger: {
    bg: 'bg-red-50 border-red-200',
    icon: 'bg-red-100 text-red-600',
    badge: 'red',
    button: 'text-red-600 hover:text-red-700',
  },
  info: {
    bg: 'bg-blue-50 border-blue-200',
    icon: 'bg-blue-100 text-blue-600',
    badge: 'blue',
    button: 'text-blue-600 hover:text-blue-700',
  },
}

const AlertCard = ({ title, count, icon, type, description, onClick }: AlertCardProps) => {
  const styles = typeClasses[type]

  return (
    <Card 
      className={`border! ${styles.bg} shadow-md! hover:shadow-lg! transition-shadow duration-300 cursor-pointer`} 
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${styles.icon} rounded-xl flex items-center justify-center text-xl`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-800">{title}</span>
            <Badge 
              count={count} 
              color={styles.badge as 'gold' | 'red' | 'blue'} 
              overflowCount={99}
            />
          </div>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <Button 
          type="text" 
          icon={<RightOutlined />} 
          className={styles.button}
        />
      </div>
    </Card>
  )
}

export default AlertCard

