import type { RecruiterJobPost, RecruitmentStatus } from '@/types/recruitment'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  GlobalOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Progress, Table, Tag, Tooltip, Typography } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'

const { Text } = Typography

// Format salary
const formatSalary = (amount: number) => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(0)}tr`
  }
  return `${(amount / 1000).toFixed(0)}k`
}

// Status config
const statusConfig: Record<RecruitmentStatus, { color: string; icon: React.ReactNode; label: string }> = {
  PENDING: { color: 'warning', icon: <ClockCircleOutlined />, label: 'Chờ duyệt' },
  APPROVED: { color: 'success', icon: <CheckCircleOutlined />, label: 'Đã duyệt' },
  REJECTED: { color: 'error', icon: <CloseCircleOutlined />, label: 'Từ chối' },
}

interface RecruitmentTableProps {
  data: RecruiterJobPost[]
  loading: boolean
  pagination: {
    current: number
    pageSize: number
    total: number
  }
  onTableChange: (pagination: TablePaginationConfig) => void
  onViewDetail: (record: RecruiterJobPost) => void
}

const RecruitmentTable = ({
  data,
  loading,
  pagination,
  onTableChange,
  onViewDetail,
}: RecruitmentTableProps) => {
  const columns: ColumnsType<RecruiterJobPost> = [
    {
      title: 'Tin tuyển dụng',
      key: 'recruitment',
      width: 300,
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Text strong className="text-gray-800 line-clamp-1" title={record.title}>
            {record.title}
          </Text>
          <div className="flex items-center gap-2">
            <Tag color="blue">{record.category.occupation.name}</Tag>
            <Tag color="purple">{record.category.name}</Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Nhà tuyển dụng',
      key: 'owner',
      width: 180,
      render: (_, record) => (
        <div className="flex gap-2">
          <div className="shrink-0 flex items-center">
            <Avatar
              size={32}
              icon={<UserOutlined />}
              className={record.owner.gender === 'Nam' ? 'bg-blue-500!' : 'bg-pink-500!'}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div
              className="font-medium text-gray-800 text-sm truncate"
              title={record.owner.fullName}
            >
              {record.owner.fullName}
            </div>
            <div className="text-xs text-gray-500">{record.owner.dateOfBirth}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Hình thức',
      key: 'workType',
      width: 130,
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Tag
            icon={record.workLocationType === 'REMOTE' ? <GlobalOutlined /> : <EnvironmentOutlined />}
            color={record.workLocationType === 'REMOTE' ? 'cyan' : 'orange'}
          >
            {record.workLocationType === 'REMOTE' ? 'Từ xa' : 'Tại chỗ'}
          </Tag>
          {record.workAddress && (
            <Text className="text-xs text-gray-500 line-clamp-1" title={record.workAddress}>
              {record.workAddress}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      width: 100,
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <TeamOutlined className="text-blue-500" />
            <Text strong>{record.quantityNeeded}</Text>
          </div>
          <Text className="text-xs text-gray-500">
            {record.applicationCount} ứng tuyển
          </Text>
        </div>
      ),
    },
    {
      title: 'Mức lương',
      key: 'salary',
      width: 140,
      render: (_, record) => (
        <Text className="text-green-600 font-medium">
          {formatSalary(record.salaryMin)} - {formatSalary(record.salaryMax)}
        </Text>
      ),
    },
    {
      title: 'AI đánh giá',
      key: 'evaluation',
      width: 120,
      render: (_, record) => {
        if (!record.evaluation) return <Text type="secondary">-</Text>
        const score = Math.round(record.evaluation.confidenceScore * 100)
        return (
          <Tooltip title={record.evaluation.reason}>
            <div className="flex flex-col gap-1">
              <Progress
                percent={score}
                size="small"
                status={record.evaluation.isViolation ? 'exception' : 'success'}
                showInfo={false}
              />
              <Text className={`text-xs ${record.evaluation.isViolation ? 'text-red-500' : 'text-green-500'}`}>
                {record.evaluation.isViolation ? 'Vi phạm' : 'Hợp lệ'} ({score}%)
              </Text>
            </div>
          </Tooltip>
        )
      },
    },
    {
      title: 'Lượt xem',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 90,
      render: (count: number) => (
        <div className="flex items-center gap-1">
          <EyeOutlined className="text-gray-400" />
          <Text className="text-gray-600">{count}</Text>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: RecruitmentStatus) => {
        const config = statusConfig[status]
        return (
          <Tag icon={config.icon} color={config.color}>
            {config.label}
          </Tag>
        )
      },
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
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} tin tuyển dụng`,
        pageSizeOptions: ['10', '20', '50', '100'],
      }}
      onChange={onTableChange}
      scroll={{ x: 1400 }}
      className="overflow-x-auto"
    />
  )
}

export default RecruitmentTable

