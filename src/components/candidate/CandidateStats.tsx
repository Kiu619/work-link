import { StatsCard } from '@/components/common'
import { ManOutlined, TeamOutlined, WomanOutlined } from '@ant-design/icons'
import { Col, Row } from 'antd'

interface CandidateStatsProps {
  total: number
  male: number
  female: number
}

const CandidateStats = ({ total, male, female }: CandidateStatsProps) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={8}>
        <StatsCard
          title="Tổng người lao động"
          value={total}
          icon={<TeamOutlined />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          valueColor="text-gray-800"
        />
      </Col>
      <Col xs={24} sm={8}>
        <StatsCard
          title="Nam"
          value={male}
          icon={<ManOutlined />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          valueColor="text-blue-600"
        />
      </Col>
      <Col xs={24} sm={8}>
        <StatsCard
          title="Nữ"
          value={female}
          icon={<WomanOutlined />}
          iconBgColor="bg-pink-100"
          iconColor="text-pink-600"
          valueColor="text-pink-600"
        />
      </Col>
    </Row>
  )
}

export default CandidateStats

