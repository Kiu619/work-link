import { SearchOutlined } from '@ant-design/icons'
import { Input } from 'antd'

interface CommitmentFiltersProps {
  searchText: string
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const CommitmentFilters = ({ searchText, onSearchChange }: CommitmentFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <Input
        placeholder="Tìm kiếm theo mã cam kết, tên nhà tuyển dụng, tên người lao động..."
        prefix={<SearchOutlined className="text-gray-400" />}
        value={searchText}
        onChange={onSearchChange}
        className="md:w-[500px]"
        allowClear
      />
    </div>
  )
}

export default CommitmentFilters

