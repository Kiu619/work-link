import type { AdminVerdict } from '@/types/dispute'
import { FilterOutlined, SearchOutlined } from '@ant-design/icons'
import { Col, Input, Row, Select, Space, Typography } from 'antd'

const { Text } = Typography

interface DisputeFiltersProps {
  searchText: string
  statusFilter: AdminVerdict | ''
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onStatusChange: (value: AdminVerdict | '') => void
}

const DisputeFilters = ({
  searchText,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: DisputeFiltersProps) => {
  return (
    <div className="mb-6">
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={8}>
          <Space direction="vertical" size={4} className="w-full">
            <Text type="secondary" className="text-xs">
              <SearchOutlined className="mr-1" />
              Tìm kiếm
            </Text>
            <Input
              placeholder="Tìm theo mã khiếu nại, tên..."
              value={searchText}
              onChange={onSearchChange}
              allowClear
              size="middle"
            />
          </Space>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Space direction="vertical" size={4} className="w-full">
            <Text type="secondary" className="text-xs">
              <FilterOutlined className="mr-1" />
              Trạng thái phán quyết
            </Text>
            <Select
              value={statusFilter}
              onChange={onStatusChange}
              className="w-full"
              size="middle"
              options={[
                { value: '', label: 'Tất cả' },
                { value: null, label: 'Chưa phán quyết' },
                { value: 'UPHOLD_CANDIDATE', label: 'Ứng viên thắng' },
                { value: 'UPHOLD_RECRUITER', label: 'Nhà tuyển dụng thắng' },
              ]}
            />
          </Space>
        </Col>
      </Row>
    </div>
  )
}

export default DisputeFilters

