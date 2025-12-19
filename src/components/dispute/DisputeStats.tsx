import type { Complaint } from '@/types/dispute'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import { Card, Col, Row, Statistic, Typography } from 'antd'

const { Text } = Typography

interface DisputeStatsProps {
  complaints: Complaint[]
}

const DisputeStats = ({ complaints }: DisputeStatsProps) => {
  const totalCount = complaints.length
  const pendingCount = complaints.filter((c) => c.adminVerdict === null).length
  const candidateWinCount = complaints.filter((c) => c.adminVerdict === 'UPHOLD_CANDIDATE').length
  const recruiterWinCount = complaints.filter((c) => c.adminVerdict === 'UPHOLD_RECRUITER').length

  const stats = [
    {
      title: 'Tổng khiếu nại',
      value: totalCount,
      icon: <FileTextOutlined className="text-2xl" />,
      color: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Chờ phán quyết',
      value: pendingCount,
      icon: <ClockCircleOutlined className="text-2xl" />,
      color: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
    },
    {
      title: 'Ứng viên thắng',
      value: candidateWinCount,
      icon: <CheckCircleOutlined className="text-2xl" />,
      color: 'bg-cyan-50',
      textColor: 'text-cyan-600',
      borderColor: 'border-cyan-200',
    },
    {
      title: 'NTD thắng',
      value: recruiterWinCount,
      icon: <ExclamationCircleOutlined className="text-2xl" />,
      color: 'bg-orange-50',
      textColor: 'text-orange-600',
      borderColor: 'border-orange-200',
    },
  ]

  return (
    <Row gutter={[16, 16]} className="mb-6">
      {stats.map((stat, index) => (
        <Col xs={12} sm={12} md={6} key={index}>
          <Card
            className={`border ${stat.borderColor} ${stat.color} transition-all hover:shadow-md`}
            styles={{ body: { padding: '16px' } }}
          >
            <div className="flex items-center justify-between">
              <div>
                <Text type="secondary" className="text-xs block mb-1">
                  {stat.title}
                </Text>
                <Statistic
                  value={stat.value}
                  valueStyle={{ fontSize: 24, fontWeight: 600 }}
                  className={stat.textColor}
                />
              </div>
              <div className={`${stat.textColor} opacity-70`}>{stat.icon}</div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default DisputeStats

