import type { RecruiterJobPost, RecruitmentStatus } from '@/types/recruitment'
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  FileTextOutlined,
  GlobalOutlined,
  ManOutlined,
  RobotOutlined,
  TagOutlined,
  TeamOutlined,
  UserOutlined,
  WarningOutlined,
  WomanOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Modal,
  Progress,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd'

const { Title, Text, Paragraph } = Typography

// Status config
const statusConfig: Record<RecruitmentStatus, { color: string; icon: React.ReactNode; label: string }> = {
  PENDING: { color: 'warning', icon: <ClockCircleOutlined />, label: 'Chờ duyệt' },
  APPROVED: { color: 'success', icon: <CheckCircleOutlined />, label: 'Đã duyệt' },
  REJECTED: { color: 'error', icon: <CloseCircleOutlined />, label: 'Từ chối' },
}

interface RecruitmentDetailModalProps {
  open: boolean
  post: RecruiterJobPost | null
  isUpdating: boolean
  onClose: () => void
  onApprove: () => void
  onOpenReject: () => void
}

const RecruitmentDetailModal = ({
  open,
  post,
  isUpdating,
  onClose,
  onApprove,
  onOpenReject,
}: RecruitmentDetailModalProps) => {
  if (!post) return null

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 pb-3 border-b">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <FileTextOutlined className="text-lg text-orange-600" />
          </div>
          <div className="flex-1">
            <Title level={5} className="mb-0! line-clamp-1">
              {post.title}
            </Title>
            <div className="flex items-center gap-2 mt-1">
              <Tag color={statusConfig[post.status].color}>
                {statusConfig[post.status].label}
              </Tag>
              <Text type="secondary" className="text-sm">
                ID: {post.id}
              </Text>
            </div>
          </div>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={
        <div className="flex flex-row-reverse justify-between">
          {post.status === 'PENDING' && (
            <Space>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={onApprove}
                loading={isUpdating}
              >
                Duyệt
              </Button>
            <Button
              danger
              icon={<CloseCircleOutlined />}
              onClick={onOpenReject}
              loading={isUpdating}
            >
              Từ chối
            </Button>
            
            </Space>
          )}
        </div>
      }
      width={900}
      centered
    >
      <div className="flex flex-col gap-6 pt-4">
        {/* Owner Info */}
        <Card size="small" title={<><UserOutlined className="mr-2" />Thông tin nhà tuyển dụng</>}>
          <div className="flex items-center gap-4">
            <Avatar
              size={64}
              icon={<UserOutlined />}
              className={post.owner.gender === 'Nam' ? 'bg-blue-500!' : 'bg-pink-500!'}
            />
            <div className="flex-1">
              <Title level={5} className="mb-1!">{post.owner.fullName}</Title>
              <Space split={<span className="text-gray-300">|</span>}>
                <Tag
                  icon={post.owner.gender === 'Nam' ? <ManOutlined /> : <WomanOutlined />}
                  color={post.owner.gender === 'Nam' ? 'blue' : 'pink'}
                >
                  {post.owner.gender}
                </Tag>
                <Text type="secondary">{post.owner.dateOfBirth}</Text>
                <Text type="secondary">ID: {post.owner.userId}</Text>
              </Space>
            </div>
          </div>
        </Card>

        {/* Job Details */}
        <Descriptions
          bordered
          size="small"
          column={3}
          labelStyle={{ fontWeight: 500, backgroundColor: '#fafafa' }}
          title={<><TagOutlined className="mr-2" />Chi tiết tin tuyển dụng</>}
        >
          <Descriptions.Item label="Ngành nghề" span={3}>
            <Space>
              <Tag color="blue">{post.category.occupation.name}</Tag>
              <Tag color="purple">{post.category.name}</Tag>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả công việc" span={3}>
            <Paragraph className="mb-0! text-gray-600">
              {post.description}
            </Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="Số lượng cần tuyển" span={1}>
            <Tag icon={<TeamOutlined />} color="blue">
              {post.quantityNeeded} người
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Số lượng ứng tuyển" span={2}>
            <Text>{post.applicationCount} người</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Hình thức làm việc" span={3}>
            <Tag
              icon={post.workLocationType === 'REMOTE' ? <GlobalOutlined /> : <EnvironmentOutlined />}
              color={post.workLocationType === 'REMOTE' ? 'cyan' : 'orange'}
            >
              {post.workLocationType === 'REMOTE' ? 'Làm việc từ xa' : 'Làm việc tại chỗ'}
            </Tag>
          </Descriptions.Item>
          {post.workAddress && (
            <Descriptions.Item label="Địa điểm làm việc" span={3}>
              <Text><EnvironmentOutlined className="mr-1" />{post.workAddress}</Text>
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Mức lương" span={3}>
            <Text className="text-green-600 font-semibold text-lg">
              <DollarOutlined className="mr-1" />
              {post.salaryMin.toLocaleString('vi-VN')}đ - {post.salaryMax.toLocaleString('vi-VN')}đ
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Hạn nộp đơn" span={1}>
            <Text type="warning"><CalendarOutlined className="mr-1" />{post.applyBeforeDate.split(' ')[0]}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian làm việc" span={2}>
            <Space>
              <CalendarOutlined />
              <Text>{post.jobStartDate.split(' ')[0]}</Text>
              <Text type="secondary">đến</Text>
              <Text>{post.jobEndDate.split(' ')[0]}</Text>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Hết hạn đăng tin" span={1}>
            <Text type="warning">{post.expiresAt.split(' ')[0]}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Lượt xem" span={2}>
            <Text><EyeOutlined className="mr-1" />{post.viewCount} lượt</Text>
          </Descriptions.Item>
        </Descriptions>

        {/* AI Evaluation */}
        {post.evaluation && (
          <Card
            size="small"
            title={<><RobotOutlined className="mr-2" />Đánh giá từ AI</>}
            className={post.evaluation.isViolation ? 'border-red-200!' : 'border-green-200!'}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="flex items-center gap-2 mb-2">
                  <Text strong>Độ tin cậy:</Text>
                  <Progress
                    percent={Math.round(post.evaluation.confidenceScore * 100)}
                    size="small"
                    status={post.evaluation.isViolation ? 'exception' : 'success'}
                    style={{ width: 120 }}
                  />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Text strong>Vai trò phát hiện:</Text>
                  <Tag>{post.evaluation.detectedRole}</Tag>
                </div>
                <div className="flex items-center gap-2">
                  <Text strong>Trạng thái:</Text>
                  <Tag color={post.evaluation.isViolation ? 'error' : 'success'}>
                    {post.evaluation.isViolation ? 'Có vi phạm' : 'Không vi phạm'}
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-2">
                  <Text strong>Hành động đề xuất:</Text>
                  <Tag color="blue" className="ml-2">{post.evaluation.suggestedAction}</Tag>
                </div>
                <div>
                  <Text strong>Lý do:</Text>
                  <Paragraph type="secondary" className="mb-0! mt-1">
                    {post.evaluation.reason}
                  </Paragraph>
                </div>
              </Col>
              {post.evaluation.detectedIssues.length > 0 && (
                <Col span={24}>
                  <Text strong>Vấn đề phát hiện:</Text>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {post.evaluation.detectedIssues.map((issue, i) => (
                      <Tag key={i} color="warning" icon={<WarningOutlined />}>{issue}</Tag>
                    ))}
                  </div>
                </Col>
              )}
            </Row>
          </Card>
        )}

        {/* Rejection Info */}
        {post.status === 'REJECTED' && (
          <Card size="small" className="border-red-200! bg-red-50!">
            <div className="flex items-start gap-3">
              <CloseCircleOutlined className="text-red-500 text-lg mt-1" />
              <div>
                <Text strong className="text-red-600">Lý do từ chối:</Text>
                <Paragraph className="mb-0! mt-1">{post.rejectionReason}</Paragraph>
                {post.fraudReason && (
                  <>
                    <Text strong className="text-red-600 mt-2 block">AI phát hiện:</Text>
                    <Paragraph className="mb-0! mt-1">{post.fraudReason}</Paragraph>
                  </>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </Modal>
  )
}

export default RecruitmentDetailModal

