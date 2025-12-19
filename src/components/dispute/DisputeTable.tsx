import type { AdminVerdict, Complaint } from '@/types/dispute'
import {
  CalendarOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Button, Table, Tag, Tooltip, Typography } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'

const { Text } = Typography

interface DisputeTableProps {
  data: Complaint[]
  loading: boolean
  pagination: {
    current: number
    pageSize: number
    total: number
  }
  onTableChange: (pagination: TablePaginationConfig) => void
  onViewDetail: (record: Complaint) => void
}

const getVerdictTag = (verdict: AdminVerdict) => {
  if (verdict === null) {
    return <Tag color="warning">Chưa phán quyết</Tag>
  }
  if (verdict === 'UPHOLD_CANDIDATE') {
    return <Tag color="blue">Ứng viên thắng</Tag>
  }
  return <Tag color="orange">NTD thắng</Tag>
}

const getViewUserTag = (viewUser: 'CANDIDATE' | 'RECRUITER') => {
  if (viewUser === 'CANDIDATE') {
    return <Tag color="cyan">Ứng viên khiếu nại</Tag>
  }
  return <Tag color="purple">NTD khiếu nại</Tag>
}

const DisputeTable = ({
  data,
  loading,
  pagination,
  onTableChange,
  onViewDetail,
}: DisputeTableProps) => {
  const columns: ColumnsType<Complaint> = [
    {
      title: 'Mã khiếu nại',
      dataIndex: 'id',
      key: 'id',
      width: 140,
      render: (id: string) => (
        <Tooltip title={id}>
          <Text copyable={{ text: id }} className="font-mono text-xs">
            {id.slice(0, 8)}...
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Người khiếu nại',
      key: 'complainant',
      width: 180,
      render: (_, record) => {
        const isCandidate = record.viewUser === 'CANDIDATE'
        const user = isCandidate
          ? record.commitment.candidate
          : record.commitment.recruiter
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <UserOutlined className={isCandidate ? 'text-blue-500' : 'text-orange-500'} />
              <Text strong className="text-sm">
                {user.fullName}
              </Text>
            </div>
            {getViewUserTag(record.viewUser)}
          </div>
        )
      },
    },
    {
      title: 'Công việc',
      key: 'job',
      width: 200,
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Text strong className="text-sm line-clamp-1">
            {record.commitment.recruiterJobPost.title}
          </Text>
          <Text type="secondary" className="text-xs flex items-center gap-1">
            <EnvironmentOutlined />
            {record.commitment.workLocationType === 'REMOTE'
              ? 'Làm việc từ xa'
              : record.commitment.workAddress?.slice(0, 30) + '...'}
          </Text>
        </div>
      ),
    },
    {
      title: 'Mức lương',
      key: 'salary',
      width: 120,
      render: (_, record) => (
        <Text className="text-green-600 font-medium text-sm flex items-center gap-1">
          <DollarOutlined />
          {record.commitment.agreedSalary.toLocaleString('vi-VN')}đ
        </Text>
      ),
    },
    {
      title: 'Ngày khiếu nại',
      dataIndex: 'createAt',
      key: 'createAt',
      width: 140,
      render: (date: string) => (
        <Text type="secondary" className="text-xs flex items-center gap-1">
          <CalendarOutlined />
          {date}
        </Text>
      ),
    },
    {
      title: 'Phán quyết',
      dataIndex: 'adminVerdict',
      key: 'adminVerdict',
      width: 150,
      render: (verdict: AdminVerdict) => getVerdictTag(verdict),
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
        ...pagination,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} khiếu nại`,
        pageSizeOptions: ['10', '20', '50', '100'],
      }}
      onChange={onTableChange}
      scroll={{ x: 1100 }}
      size="middle"
    />
  )
}

export default DisputeTable

