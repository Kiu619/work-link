import type { Commitment } from '@/types/commitment'
import {
  EnvironmentOutlined,
  EyeOutlined,
  GlobalOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Table, Tag, Typography } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'

const { Text } = Typography

// Format salary
const formatSalary = (min: number, max: number) => {
  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(0)}tr`
    }
    return `${(amount / 1000).toFixed(0)}k`
  }
  return `${formatAmount(min)} - ${formatAmount(max)}`
}

interface CommitmentTableProps {
  data: Commitment[]
  loading: boolean
  pagination: {
    current: number
    pageSize: number
    total: number
  }
  onTableChange: (pagination: TablePaginationConfig) => void
  onViewDetail: (record: Commitment) => void
}

const CommitmentTable = ({
  data,
  loading,
  pagination,
  onTableChange,
  onViewDetail,
}: CommitmentTableProps) => {
  const columns: ColumnsType<Commitment> = [
    {
      title: 'Mã cam kết',
      dataIndex: 'id',
      key: 'id',
      width: 140,
      render: (id: string) => (
        <Text className="font-mono text-blue-600" copyable={{ text: id }}>
          {id.substring(0, 8)}...
        </Text>
      ),
    },
    {
      title: 'Nhà tuyển dụng',
      key: 'recruiter',
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Avatar
            size={36}
            src={record.recruiter.faceImage}
            icon={<UserOutlined />}
            className="bg-orange-500!"
          />
          <div>
            <Text strong className="text-gray-800 block">{record.recruiter.fullName}</Text>
            <Text className="text-xs text-gray-500">{record.recruiter.idCardNumber}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Người lao động',
      key: 'candidate',
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Avatar
            size={36}
            src={record.candidate.faceImage}
            icon={<UserOutlined />}
            className="bg-blue-500!"
          />
          <div>
            <Text strong className="text-gray-800 block">{record.candidate.fullName}</Text>
            <Text className="text-xs text-gray-500">{record.candidate.idCardNumber}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Công việc',
      key: 'job',
      width: 200,
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Text strong className="text-gray-800 line-clamp-1" title={record.job.title}>
            {record.job.title}
          </Text>
          <Tag
            icon={record.job.workLocationType === 'REMOTE' ? <GlobalOutlined /> : <EnvironmentOutlined />}
            color={record.job.workLocationType === 'REMOTE' ? 'cyan' : 'orange'}
            className="w-fit"
          >
            {record.job.workLocationType === 'REMOTE' ? 'Từ xa' : 'Tại chỗ'}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Mức lương',
      key: 'salary',
      width: 140,
      render: (_, record) => (
        <Text className="text-green-600 font-medium">
          {formatSalary(record.job.salaryMin, record.job.salaryMax)}
        </Text>
      ),
    },
    {
      title: 'Địa chỉ làm việc',
      key: 'workAddress',
      width: 180,
      ellipsis: true,
      render: (_, record) => (
        record.job.workLocationType === 'ONSITE' ? (
          <Text className="text-gray-600" title={record.job.workAddress}>
            <EnvironmentOutlined className="mr-1" />
            {record.job.workAddress || 'Chưa cập nhật'}
          </Text>
        ) : (
          <Tag icon={<GlobalOutlined />} color="cyan">Làm việc từ xa</Tag>
        )
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="primary"
          ghost
          size="small"
          icon={<EyeOutlined />}
          onClick={() => onViewDetail(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} cam kết`,
        pageSizeOptions: ['10', '20', '50', '100'],
      }}
      onChange={onTableChange}
      scroll={{ x: 1200 }}
      className="overflow-x-auto"
    />
  )
}

export default CommitmentTable

