import type { RecruitmentStatus } from '@/types/recruitment'
import { SearchOutlined } from '@ant-design/icons'
import { Input, Select } from 'antd'

interface RecruitmentFiltersProps {
  searchText: string
  statusFilter: RecruitmentStatus | ''
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onStatusChange: (value: RecruitmentStatus | '') => void
}

const RecruitmentFilters = ({
  searchText,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: RecruitmentFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <Input
        placeholder="Tìm kiếm theo tiêu đề, nhà tuyển dụng, ngành nghề..."
        prefix={<SearchOutlined className="text-gray-400" />}
        value={searchText}
        onChange={onSearchChange}
        className="md:w-96"
        allowClear
      />
      <Select
        placeholder="Lọc theo trạng thái"
        value={statusFilter}
        onChange={onStatusChange}
        allowClear
        className="md:w-48"
        options={[
          { label: 'Tất cả', value: '' },
          { label: '🕐 Chờ duyệt', value: 'PENDING' },
          { label: '✅ Đã duyệt', value: 'APPROVED' },
          { label: '❌ Từ chối', value: 'REJECTED' },
        ]}
      />
    </div>
  )
}

export default RecruitmentFilters

