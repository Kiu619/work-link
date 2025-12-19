import type { Candidate } from '@/types/candidate'
import {
  CloseOutlined,
  IdcardOutlined,
  ManOutlined,
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
  Tag,
  Typography,
} from 'antd'

const { Title, Text } = Typography

// Fallback image for ID card
const ID_CARD_FALLBACK =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgesANmMeMgAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB1WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAADyklEQVR4Ae3UMQEAAAjDsEE+5TGi2A9QcEWAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECZgVeJZoAALYqFqYAAAAASUVORK5CYII='

interface CandidateDetailModalProps {
  open: boolean
  candidate: Candidate | null
  onClose: () => void
}

const CandidateDetailModal = ({ open, candidate, onClose }: CandidateDetailModalProps) => {
  if (!candidate) return null

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 pb-2 border-b">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              candidate.gender === 'Nam' ? 'bg-blue-100' : 'bg-pink-100'
            }`}
          >
            <UserOutlined
              className={`text-lg ${
                candidate.gender === 'Nam' ? 'text-blue-600' : 'text-pink-600'
              }`}
            />
          </div>
          <div>
            <Title level={5} className="mb-0!">
              {candidate.fullName}
            </Title>
            <Text type="secondary" className="text-sm">
              Mã căn cước: {candidate.idCardNumber}
            </Text>
          </div>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={
        <Button onClick={onClose} icon={<CloseOutlined />}>
          Đóng
        </Button>
      }
      width={800}
      centered
    >
      <div className="flex flex-col gap-6 pt-4">
        {/* ID Card Images */}
        <div>
          <Title level={5} className="mb-3!">
            <IdcardOutlined className="mr-2" />
            Hình ảnh căn cước công dân
          </Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Card
                size="small"
                title="Mặt trước"
                className="text-center"
                styles={{ body: { padding: 12 } }}
              >
                <Image
                  src={candidate.frontIdCardImage}
                  alt="Mặt trước CCCD"
                  className="rounded-lg"
                  style={{ maxHeight: 200, objectFit: 'cover' }}
                  fallback={ID_CARD_FALLBACK}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card
                size="small"
                title="Mặt sau"
                className="text-center"
                styles={{ body: { padding: 12 } }}
              >
                <Image
                  src={candidate.backIdCardImage}
                  alt="Mặt sau CCCD"
                  className="rounded-lg"
                  style={{ maxHeight: 200, objectFit: 'cover' }}
                  fallback={ID_CARD_FALLBACK}
                />
              </Card>
            </Col>
          </Row>
        </div>

        {/* Personal Information */}
        <div>
          <Title level={5} className="mb-3!">
            <UserOutlined className="mr-2" />
            Thông tin cá nhân
          </Title>
          <Descriptions
            bordered
            size="small"
            labelStyle={{ fontWeight: 500, backgroundColor: '#fafafa' }}
          >
            <Descriptions.Item label="Mã căn cước" span={3}>
              <Text copyable className="font-mono">
                {candidate.idCardNumber}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Họ và tên" span={3}>
              <Text strong>{candidate.fullName}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Giới tính" span={3}>
              <Tag
                icon={candidate.gender === 'Nam' ? <ManOutlined /> : <WomanOutlined />}
                color={candidate.gender === 'Nam' ? 'blue' : 'pink'}
              >
                {candidate.gender}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày sinh" span={3}>
              {candidate.dateOfBirth}
            </Descriptions.Item>
            <Descriptions.Item label="Quốc tịch" span={3}>
              <Tag color="green">{candidate.nationality}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Quê quán" span={3}>
              {candidate.placeOfOrigin}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ thường trú" span={3}>
              {candidate.placeOfResidence}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Modal>
  )
}

export default CandidateDetailModal

