import type { Candidate } from '@/types/candidate'
import {
  EyeOutlined,
  IdcardOutlined,
  ManOutlined,
  UserOutlined,
  WomanOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Table, Tag, Typography } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'

const { Text } = Typography

interface CandidateTableProps {
  data: Candidate[]
  loading: boolean
  pagination: {
    current: number
    pageSize: number
    total: number
  }
  onTableChange: (pagination: TablePaginationConfig) => void
  onViewDetail: (record: Candidate) => void
}

const CandidateTable = ({
  data,
  loading,
  pagination,
  onTableChange,
  onViewDetail,
}: CandidateTableProps) => {
  const columns: ColumnsType<Candidate> = [
    {
      title: 'Mã căn cước',
      dataIndex: 'idCardNumber',
      key: 'idCardNumber',
      width: 140,
      render: (idCard: string) => (
        <div className="flex items-center gap-2">
          <IdcardOutlined className="text-blue-500" />
          <Text className="font-mono text-gray-700">{idCard}</Text>
        </div>
      ),
    },
    {
      title: 'Họ và tên',
      key: 'fullName',
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={36}
            icon={<UserOutlined />}
            className={record.gender === 'Nam' ? 'bg-blue-500!' : 'bg-pink-500!'}
          />
          <Text strong className="text-gray-800">
            {record.fullName}
          </Text>
        </div>
      ),
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
      render: (gender: string) => (
        <Tag
          icon={gender === 'Nam' ? <ManOutlined /> : <WomanOutlined />}
          color={gender === 'Nam' ? 'blue' : 'pink'}
        >
          {gender}
        </Tag>
      ),
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      width: 120,
      render: (date: string) => <Text className="text-gray-600">{date}</Text>,
    },
    {
      title: 'Quê quán',
      dataIndex: 'placeOfOrigin',
      key: 'placeOfOrigin',
      width: 200,
      ellipsis: true,
      render: (place: string) => (
        <Text className="text-gray-600" title={place}>
          {place}
        </Text>
      ),
    },
    {
      title: 'Địa chỉ thường trú',
      dataIndex: 'placeOfResidence',
      key: 'placeOfResidence',
      width: 200,
      ellipsis: true,
      render: (place: string) => (
        <Text className="text-gray-600" title={place}>
          {place}
        </Text>
      ),
    },
    {
      title: 'Quốc tịch',
      dataIndex: 'nationality',
      key: 'nationality',
      width: 100,
      render: (nationality: string) => (
        <Text className="text-gray-600" title={nationality}>
          {nationality}
        </Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="primary"
          ghost
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
      rowKey="userId"
      loading={loading}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người lao động`,
        pageSizeOptions: ['10', '20', '50', '100'],
      }}
      onChange={onTableChange}
      scroll={{ x: 1200 }}
      className="overflow-x-auto"
    />
  )
}

export default CandidateTable

