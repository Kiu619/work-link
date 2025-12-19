import { StatsCard } from '@/components/common'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import { Col, Row } from 'antd'

interface RecruitmentStatsProps {
  total: number
  pending: number
  approved: number
  rejected: number
}

const RecruitmentStats = ({ total, pending, approved, rejected }: RecruitmentStatsProps) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={6}>
        <StatsCard
          title="Tổng tin"
          value={total}
          icon={<FileTextOutlined />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          valueColor="text-gray-800"
        />
      </Col>
      <Col xs={24} sm={6}>
        <StatsCard
          title="Chờ duyệt"
          value={pending}
          icon={<ClockCircleOutlined />}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
          valueColor="text-yellow-600"
        />
      </Col>
      <Col xs={24} sm={6}>
        <StatsCard
          title="Đã duyệt"
          value={approved}
          icon={<CheckCircleOutlined />}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          valueColor="text-green-600"
        />
      </Col>
      <Col xs={24} sm={6}>
        <StatsCard
          title="Từ chối"
          value={rejected}
          icon={<CloseCircleOutlined />}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
          valueColor="text-red-600"
        />
      </Col>
    </Row>
  )
}

export default RecruitmentStats

