import type { Complaint } from '@/types/dispute'
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  GlobalOutlined,
  IdcardOutlined,
  ManOutlined,
  PictureOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  WomanOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Descriptions,
  Image,
  Modal,
  Row,
  Space,
  Steps,
  Tag,
  Typography,
} from 'antd'
import Map from '@/components/Map'

const { Title, Text, Paragraph } = Typography

// Fallback image
const FALLBACK_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns%3D%22http://www.w3.org/2000/svg%22 width%3D%22120%22 height%3D%22120%22%3E%3Crect width%3D%22120%22 height%3D%22120%22 fill%3D%22%23f5f5f5%22/%3E%3Ctext x%3D%2260%22 y%3D%2266%22 font-size%3D%2212%22 text-anchor%3D%22middle%22 fill%3D%22%23d9d9d9%22%3ENo Image%3C/text%3E%3C/svg%3E'

interface DisputeDetailModalProps {
  open: boolean
  complaint: Complaint | null
  onClose: () => void
  onVerdict: (complaint: Complaint) => void
}

const DisputeDetailModal = ({ open, complaint, onClose, onVerdict }: DisputeDetailModalProps) => {
  if (!complaint) return null

  const { commitment } = complaint
  const hasLocation =
    commitment.workLocationType === 'ONSITE' &&
    commitment.workLatitude &&
    commitment.workLongitude

  const getCommitmentStatusStep = () => {
    switch (commitment.status) {
      case 'PENDING':
        return 0
      case 'APPROVED':
        return 1
      case 'REJECTED':
        return 2
      default:
        return 0
    }
  }

  const getVerdictTag = () => {
    if (complaint.adminVerdict === null) {
      return (
        <Tag icon={<ClockCircleOutlined />} color="warning">
          Chưa phán quyết
        </Tag>
      )
    }
    if (complaint.adminVerdict === 'UPHOLD_CANDIDATE') {
      return (
        <Tag icon={<CheckCircleOutlined />} color="blue">
          Ứng viên thắng - Tiền về ứng viên
        </Tag>
      )
    }
    return (
      <Tag icon={<CheckCircleOutlined />} color="orange">
        NTD thắng - Tiền hoàn về NTD
      </Tag>
    )
  }

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 pb-3 border-b">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <ExclamationCircleOutlined className="text-lg text-red-600" />
          </div>
          <div className="flex-1">
            <Title level={5} className="mb-0!">
              Chi tiết khiếu nại
            </Title>
            <Text type="secondary" className="text-sm font-mono">
              #{complaint.id}
            </Text>
          </div>
          {getVerdictTag()}
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={
        complaint.adminVerdict === null ? (
          <div className="flex justify-end gap-2">
            <Button type="primary" icon={<SafetyCertificateOutlined />} onClick={() => onVerdict(complaint)}>
              Đưa ra phán quyết
            </Button>
            <Button onClick={onClose}>Đóng</Button>
          </div>
        ) : null
      }
      width={1200}
      centered
      style={{
        marginTop: '20px',
        marginBottom: '20px'
      }}
      destroyOnHidden
    >
      <div className="flex flex-col gap-6 pt-4">
        {/* Complaint Info */}
        <Card
          size="small"
          title={
            <div className="flex items-center gap-2 text-red-600">
              <FileTextOutlined />
              <span>Nội dung khiếu nại</span>
              <Tag color={complaint.viewUser === 'CANDIDATE' ? 'cyan' : 'purple'}>
                {complaint.viewUser === 'CANDIDATE' ? 'Từ ứng viên' : 'Từ nhà tuyển dụng'}
              </Tag>
            </div>
          }
          className="border-red-200!"
        >
          <Paragraph className="mb-4 text-gray-700 whitespace-pre-wrap">
            {complaint.rejectReasonDetail}
          </Paragraph>

          {complaint.rejectEvidenceImages.length > 0 && (
            <div>
              <div className="flex items-center gap-2">
                <PictureOutlined className="text-emerald-600" />
                <span>Thông tin cam kết</span>
              </div>
              <Image.PreviewGroup>
                <Space wrap>
                  {complaint.rejectEvidenceImages.map((img, idx) => (
                    <Image
                      key={idx}
                      src={img}
                      alt={`Evidence ${idx + 1}`}
                      width={120}
                      height={90}
                      className="rounded-lg object-cover"
                      fallback={FALLBACK_IMAGE}
                    />
                  ))}
                </Space>
              </Image.PreviewGroup>
            </div>
          )}
        </Card>

        {/* Candidate & Recruiter Info */}
        <Row gutter={[16, 16]}>
          {/* Ứng viên */}
          <Col xs={24} md={12}>
            <Card
              size="small"
              title={
                <div className="flex items-center gap-2 text-blue-600">
                  <UserOutlined />
                  <span>Thông tin ứng viên</span>
                  {complaint.viewUser === 'CANDIDATE' && (
                    <Tag color="cyan" className="ml-auto">
                      Người khiếu nại
                    </Tag>
                  )}
                </div>
              }
              className="h-full border-blue-200!"
            >
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Họ và tên">
                  <Text strong>{commitment.candidate.fullName}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Giới tính">
                  <Tag
                    icon={commitment.candidate.gender === 'Nam' ? <ManOutlined /> : <WomanOutlined />}
                    color={commitment.candidate.gender === 'Nam' ? 'blue' : 'pink'}
                  >
                    {commitment.candidate.gender}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">
                  <CalendarOutlined className="mr-1" />
                  {commitment.candidate.dateOfBirth}
                </Descriptions.Item>
              </Descriptions>
              {commitment.candidateVerifyImageUrl && (
                <div className="mt-3">
                  <Text type="secondary" className="text-xs block mb-2">
                    Ảnh xác thực:
                  </Text>
                  <Image
                    src={commitment.candidateVerifyImageUrl}
                    alt="Candidate Verify"
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                    fallback={FALLBACK_IMAGE}
                  />
                </div>
              )}
            </Card>
          </Col>

          {/* Nhà tuyển dụng */}
          <Col xs={24} md={12}>
            <Card
              size="small"
              title={
                <div className="flex items-center gap-2 text-orange-600">
                  <IdcardOutlined />
                  <span>Thông tin nhà tuyển dụng</span>
                  {complaint.viewUser === 'RECRUITER' && (
                    <Tag color="purple" className="ml-auto">
                      Người khiếu nại
                    </Tag>
                  )}
                </div>
              }
              className="h-full border-orange-200!"
            >
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Họ và tên">
                  <Text strong>{commitment.recruiter.fullName}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Giới tính">
                  <Tag
                    icon={commitment.recruiter.gender === 'Nam' ? <ManOutlined /> : <WomanOutlined />}
                    color={commitment.recruiter.gender === 'Nam' ? 'blue' : 'pink'}
                  >
                    {commitment.recruiter.gender}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">
                  <CalendarOutlined className="mr-1" />
                  {commitment.recruiter.dateOfBirth}
                </Descriptions.Item>
              </Descriptions>
              {commitment.recruiterVerifyImageUrl && (
                <div className="mt-3">
                  <Text type="secondary" className="text-xs block mb-2">
                    Ảnh xác thực:
                  </Text>
                  <Image
                    src={commitment.recruiterVerifyImageUrl}
                    alt="Recruiter Verify"
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                    fallback={FALLBACK_IMAGE}
                  />
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* Commitment Info */}
        <Descriptions
          bordered
          size="small"
          column={{ xs: 1, sm: 2, md: 3 }}
          labelStyle={{ fontWeight: 500, backgroundColor: '#fafafa' }}
          title={
            <div className="flex items-center gap-2 text-emerald-600">
              <FileTextOutlined/>
              <span>Thông tin cam kết</span>
            </div>
          }
        >
          <Descriptions.Item label="Mã cam kết" span={3}>
            <Text copyable className="font-mono">
              {complaint.commitmentId}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Công việc" span={3}>
            <Text strong>{commitment.recruiterJobPost.title}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Mức lương thỏa thuận" span={1}>
            <Text className="text-green-600 font-semibold">
              <DollarOutlined className="mr-1" />
              {commitment.agreedSalary.toLocaleString('vi-VN')}đ
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Hình thức" span={1}>
            <Tag
              icon={commitment.workLocationType === 'REMOTE' ? <GlobalOutlined /> : <EnvironmentOutlined />}
              color={commitment.workLocationType === 'REMOTE' ? 'cyan' : 'orange'}
            >
              {commitment.workLocationType === 'REMOTE' ? 'Làm việc từ xa' : 'Làm việc tại chỗ'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái cam kết" span={1}>
            <Tag
              color={
                commitment.status === 'APPROVED'
                  ? 'success'
                  : commitment.status === 'REJECTED'
                    ? 'error'
                    : 'warning'
              }
            >
              {commitment.status === 'APPROVED'
                ? 'Đã xác nhận'
                : commitment.status === 'REJECTED'
                  ? 'Đã từ chối'
                  : 'Chờ xác nhận'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian bắt đầu" span={1}>
            <CalendarOutlined className="mr-1" />
            {commitment.startTime}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian kết thúc" span={1}>
            <CalendarOutlined className="mr-1" />
            {commitment.endTime}
          </Descriptions.Item>
          {commitment.workLocationType === 'ONSITE' && (
            <Descriptions.Item label="Địa chỉ làm việc" span={3}>
              <EnvironmentOutlined className="mr-1" />
              {commitment.workAddress}
            </Descriptions.Item>
          )}
        </Descriptions>

        {/* Checkin/Checkout Timeline */}
        {(commitment.checkin || commitment.checkout) && (
          <Card
            size="small"
            title={
              <div className="flex items-center gap-2">
                <ClockCircleOutlined className="text-purple-600" />
                <span>Lịch sử checkin/checkout</span>
              </div>
            }
          >
            <Steps
              current={getCommitmentStatusStep()}
              items={[
                {
                  title: 'Checkin',
                  description: commitment.checkin ? (
                    <div className="text-xs">
                      <div>{commitment.checkin.actionTime}</div>
                      {commitment.checkin.candidateVerifyImageUrl && (
                        <Image
                          src={commitment.checkin.candidateVerifyImageUrl}
                          alt="Checkin"
                          width={60}
                          height={60}
                          className="rounded mt-1"
                          fallback={FALLBACK_IMAGE}
                        />
                      )}
                    </div>
                  ) : (
                    'Chưa checkin'
                  ),
                  status: commitment.checkin ? 'finish' : 'wait',
                },
                {
                  title: 'Checkout',
                  description: commitment.checkout ? (
                    <div className="text-xs">
                      <div>{commitment.checkout.actionTime}</div>
                      {commitment.checkout.candidateVerifyImageUrl && (
                        <Image
                          src={commitment.checkout.candidateVerifyImageUrl}
                          alt="Checkout"
                          width={60}
                          height={60}
                          className="rounded mt-1"
                          fallback={FALLBACK_IMAGE}
                        />
                      )}
                    </div>
                  ) : (
                    'Chưa checkout'
                  ),
                  status: commitment.checkout ? 'finish' : 'wait',
                },
              ]}
            />
          </Card>
        )}

        {/* Map for ONSITE */}
        {hasLocation && (
          <Card
            size="small"
            title={
              <div className="flex items-center gap-2">
                <EnvironmentOutlined className="text-red-500" />
                <span>Vị trí làm việc trên bản đồ</span>
              </div>
            }
          >
            <Map
              center={[commitment.workLatitude!, commitment.workLongitude!]}
              zoom={15}
              height={250}
              showCenterButton={true}
              markers={[
                {
                  position: [commitment.workLatitude!, commitment.workLongitude!],
                  popupContent: (
                    <div className="text-center">
                      <strong>{commitment.recruiterJobPost.title}</strong>
                      <br />
                      <small>{commitment.workAddress}</small>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        )}

        {/* Timestamp */}
        <div className="text-right text-gray-400 text-xs">
          Khiếu nại lúc: {complaint.createAt}
        </div>
      </div>
    </Modal>
  )
}

export default DisputeDetailModal

