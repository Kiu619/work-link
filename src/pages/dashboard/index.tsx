import { AlertCard, StatCard } from '@/components/dashboard'
import { Column, Pie } from '@ant-design/charts'
import {
  BankOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FileProtectOutlined,
  LinkOutlined,
  ReloadOutlined,
  TeamOutlined,
  WarningOutlined
} from '@ant-design/icons'
import { Button, Card, Col, Progress, Row, Space, Table, Tag, Typography } from 'antd'

const { Title, Text } = Typography

// Mock data - Thay bằng API thực tế sau
const statsData = {
  laborRegistrations: 125847,
  employerRegistrations: 8524,
  successfulConnections: 45632,
  signedCommitments: 38945,
  suspiciousPosts: 23,
  pendingDisputes: 12,
  disputeRate: 2.4,
}

// Data cho biểu đồ cột - Top nghề thiếu người
const jobShortageData = [
  { job: 'Công nhân may', shortage: 15420 },
  { job: 'Thợ điện', shortage: 12350 },
  { job: 'Thợ hàn', shortage: 9870 },
  { job: 'Lái xe tải', shortage: 8540 },
  { job: 'Bảo vệ', shortage: 7230 },
  { job: 'Kỹ thuật viên', shortage: 6890 },
  { job: 'Nhân viên bán hàng', shortage: 5670 },
  { job: 'Phục vụ nhà hàng', shortage: 4520 },
]

// Data cho biểu đồ tròn - Phân bổ theo khu vực
const regionData = [
  { region: 'Miền Bắc', value: 45230 },
  { region: 'Miền Trung', value: 28450 },
  { region: 'Miền Nam', value: 52167 },
]

// Data cho bảng tranh chấp gần đây
const recentDisputes = [
  {
    key: '1',
    id: 'TC-2024-001',
    employer: 'Công ty TNHH ABC',
    worker: 'Nguyễn Văn A',
    issue: 'Không trả lương đúng hạn',
    date: '15/12/2024',
    status: 'pending',
    priority: 'high',
  },
  {
    key: '2',
    id: 'TC-2024-002',
    employer: 'Công ty CP XYZ',
    worker: 'Trần Thị B',
    issue: 'Vi phạm hợp đồng lao động',
    date: '14/12/2024',
    status: 'processing',
    priority: 'medium',
  },
  {
    key: '3',
    id: 'TC-2024-003',
    employer: 'DN Tư nhân DEF',
    worker: 'Lê Văn C',
    issue: 'Điều kiện làm việc không đảm bảo',
    date: '13/12/2024',
    status: 'pending',
    priority: 'high',
  },
  {
    key: '4',
    id: 'TC-2024-004',
    employer: 'Công ty TNHH GHI',
    worker: 'Phạm Thị D',
    issue: 'Không đóng BHXH',
    date: '12/12/2024',
    status: 'resolved',
    priority: 'low',
  },
]

const disputeColumns = [
  {
    title: 'Mã',
    dataIndex: 'id',
    key: 'id',
    render: (text: string) => <span className="font-medium text-blue-600">{text}</span>,
  },
  {
    title: 'Nhà tuyển dụng',
    dataIndex: 'employer',
    key: 'employer',
  },
  {
    title: 'Người lao động',
    dataIndex: 'worker',
    key: 'worker',
  },
  {
    title: 'Vấn đề',
    dataIndex: 'issue',
    key: 'issue',
    ellipsis: true,
  },
  {
    title: 'Ngày',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const config: Record<string, { color: string; text: string }> = {
        pending: { color: 'orange', text: 'Chờ xử lý' },
        processing: { color: 'blue', text: 'Đang xử lý' },
        resolved: { color: 'green', text: 'Đã giải quyết' },
      }
      return <Tag color={config[status].color}>{config[status].text}</Tag>
    },
  },
  {
    title: 'Độ ưu tiên',
    dataIndex: 'priority',
    key: 'priority',
    render: (priority: string) => {
      const config: Record<string, { color: string; text: string }> = {
        high: { color: 'red', text: 'Cao' },
        medium: { color: 'orange', text: 'Trung bình' },
        low: { color: 'green', text: 'Thấp' },
      }
      return <Tag color={config[priority].color}>{config[priority].text}</Tag>
    },
  },
  {
    title: '',
    key: 'action',
    render: () => (
      <Button type="text" icon={<EyeOutlined />} size="small">
        Xem
      </Button>
    ),
  },
]

// Config cho biểu đồ cột
const columnConfig = {
  data: jobShortageData,
  xField: 'job',
  yField: 'shortage',
  color: '#dc2626',
  autoFit: true,
  label: {
    text: (d: { shortage: number }) => d.shortage.toLocaleString('vi-VN'),
    textBaseline: 'bottom' as const,
  },
  style: {
    radiusTopLeft: 4,
    radiusTopRight: 4,
  },
}

// Config cho biểu đồ tròn
const pieConfig = {
  data: regionData,
  angleField: 'value',
  colorField: 'region',
  radius: 0.8,
  innerRadius: 0.6,
  autoFit: true,
  color: ['#dc2626', '#eab308', '#16a34a'],
  label: {
    text: (d: { region: string; value: number }) => `${d.region}\n${d.value.toLocaleString('vi-VN')}`,
    style: {
      fontWeight: 'bold',
    },
  },
  legend: {
    color: {
      title: false,
      position: 'bottom' as const,
      rowPadding: 5,
    },
  },
  annotations: [
    {
      type: 'text' as const,
      style: {
        text: 'Tổng\n125,847',
        x: '50%',
        y: '50%',
        textAlign: 'center' as const,
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
  ],
}

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Title level={4} className="mb-1!">Tổng quan hệ thống</Title>
          <Text type="secondary">Cập nhật lúc: {new Date().toLocaleString('vi-VN')}</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />}>Làm mới</Button>
          <Button type="primary" icon={<DownloadOutlined />}>
            Xuất báo cáo
          </Button>
        </Space>
      </div>

      {/* Alert Cards - Cần xử lý ngay */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <AlertCard
            title="Tin nghi ngờ cần duyệt"
            count={statsData.suspiciousPosts}
            icon={<WarningOutlined />}
            type="warning"
            description="Có tin đăng nghi ngờ lừa đảo cần kiểm duyệt"
          />
        </Col>
        <Col xs={24} md={12}>
          <AlertCard
            title="Tranh chấp cần xử lý"
            count={statsData.pendingDisputes}
            icon={<ExclamationCircleOutlined />}
            type="danger"
            description="Có tranh chấp mới cần được giải quyết gấp"
          />
        </Col>
      </Row>

      {/* Stat Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Lao động đăng ký"
            value={statsData.laborRegistrations}
            icon={<TeamOutlined />}
            color="blue"
            trend={{ value: 12.5, isUp: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Nhà tuyển dụng"
            value={statsData.employerRegistrations}
            icon={<BankOutlined />}
            color="purple"
            trend={{ value: 8.3, isUp: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Kết nối thành công"
            value={statsData.successfulConnections}
            icon={<LinkOutlined />}
            color="green"
            trend={{ value: 15.2, isUp: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Cam kết điện tử"
            value={statsData.signedCommitments}
            icon={<FileProtectOutlined />}
            color="orange"
            trend={{ value: 5.7, isUp: true }}
          />
        </Col>
      </Row>

      {/* Tỷ lệ tranh chấp */}
      <Card className="border-none! shadow-md! hover:shadow-lg! transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Title level={5} className="mb-0!">Tỷ lệ tranh chấp</Title>
            <Text type="secondary">Tỷ lệ tranh chấp trên tổng số kết nối</Text>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600">{statsData.disputeRate}%</div>
            <Text type="secondary" className="text-xs">Mục tiêu: &lt; 5%</Text>
          </div>
        </div>
        <Progress
          percent={statsData.disputeRate}
          strokeColor="#16a34a"
          railColor ="#e5e7eb"
          showInfo={false}
          size={['100%', 12]}
        />
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>0%</span>
          <span>Tốt</span>
          <span>5%</span>
          <span>Cảnh báo</span>
          <span>10%</span>
        </div>
      </Card>

      {/* Charts Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            className="border-none! shadow-md! hover:shadow-lg! transition-shadow duration-300"
            title={
              <div className="flex items-center gap-2">
                <EnvironmentOutlined className="text-red-500" />
                <span>Top 8 nghề thiếu người lao động</span>
              </div>
            }
          >
            <div className='h-90'>
              <Column {...columnConfig} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            className="border-none! shadow-md! hover:shadow-lg! transition-shadow duration-300"
            title={
              <div className="flex items-center gap-2">
                <EnvironmentOutlined className="text-blue-500" />
                <span>Phân bổ theo khu vực</span>
              </div>
            }
          >
            <div className='h-90'>
              <Pie {...pieConfig} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Disputes Table */}
      <Card
        className="border-none! shadow-md! hover:shadow-lg! transition-shadow duration-300"
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ExclamationCircleOutlined className="text-orange-500" />
              <span>Tranh chấp gần đây</span>
            </div>
            <Button type="link">Xem tất cả →</Button>
          </div>
        }
      >
        <Table
          columns={disputeColumns}
          dataSource={recentDisputes}
          pagination={false}
          size="small"
          className="overflow-x-auto"
        />
      </Card>
    </div>
  )
}

export default Dashboard
