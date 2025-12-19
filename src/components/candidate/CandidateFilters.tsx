import { SearchOutlined } from '@ant-design/icons'
import { Input, Select } from 'antd'

interface CandidateFiltersProps {
  searchText: string
  genderFilter: string | undefined
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onGenderChange: (value: string | undefined) => void
}

const CandidateFilters = ({
  searchText,
  genderFilter,
  onSearchChange,
  onGenderChange,
}: CandidateFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <Input
        placeholder="Tìm kiếm theo tên, mã căn cước, địa chỉ..."
        prefix={<SearchOutlined className="text-gray-400" />}
        value={searchText}
        onChange={onSearchChange}
        className="md:w-80"
        allowClear
      />
      <Select
        placeholder="Lọc theo giới tính"
        value={genderFilter}
        onChange={onGenderChange}
        allowClear
        className="md:w-40"
        options={[
          { label: 'Nam', value: 'Nam' },
          { label: 'Nữ', value: 'Nữ' },
        ]}
      />
    </div>
  )
}

export default CandidateFilters

