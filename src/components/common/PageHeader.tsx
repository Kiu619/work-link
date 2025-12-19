import { Space, Typography } from 'antd'
import type { ReactNode } from 'react'

const { Title, Text } = Typography

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
}

const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <Title level={4} className="mb-1!">
          {title}
        </Title>
        {subtitle && <Text type="secondary">{subtitle}</Text>}
      </div>
      {actions && <Space>{actions}</Space>}
    </div>
  )
}

export default PageHeader

