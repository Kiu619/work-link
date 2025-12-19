import type { Commitment } from '@/types/commitment'
import {
  AimOutlined,
  CalendarOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  GlobalOutlined,
  IdcardOutlined,
  UserOutlined,
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
  Tooltip,
  Typography
} from 'antd'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'

const { Title, Text, Paragraph } = Typography

// Fix for default marker icon in Leaflet with Vite
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Fallback image
const FALLBACK_IMAGE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

// Component to fix map size issue in modal and add center button
interface MapControlsProps {
  lat: number
  lng: number
}

const MapControls = ({ lat, lng }: MapControlsProps) => {
  const map = useMap()
  
  useEffect(() => {
    // Delay để đảm bảo modal animation hoàn thành
    const timer1 = setTimeout(() => {
      map.invalidateSize()
    }, 200)
    
    // Thêm delay thứ 2 để chắc chắn
    const timer2 = setTimeout(() => {
      map.invalidateSize()
    }, 500)
    
    // Thêm listener cho resize window
    const handleResize = () => {
      map.invalidateSize()
    }
    window.addEventListener('resize', handleResize)
    
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      window.removeEventListener('resize', handleResize)
    }
  }, [map])
  
  const handleCenterClick = () => {
    map.flyTo([lat, lng], 15, {
      duration: 0.5
    })
  }
  
  return (
    <div className="absolute top-2 right-2 z-10000">
      <Tooltip title="Về vị trí đánh dấu">
        <Button
          type="primary"
          size="small"
          icon={<AimOutlined />}
          onClick={handleCenterClick}
          className="shadow-lg"
        />
      </Tooltip>
    </div>
  )
}

interface CommitmentDetailModalProps {
  open: boolean
  commitment: Commitment | null
  onClose: () => void
}

const CommitmentDetailModal = ({ open, commitment, onClose }: CommitmentDetailModalProps) => {
  if (!commitment) return null

  const hasLocation = commitment.job.workLocationType === 'ONSITE' && 
    commitment.job.workLatitude && 
    commitment.job.workLongitude

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 pb-3 border-b">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <FileTextOutlined className="text-lg text-emerald-600" />
          </div>
          <div className="flex-1">
            <Title level={5} className="mb-0!">
              Chi tiết cam kết
            </Title>
            <Text type="secondary" className="text-sm font-mono">
              #{commitment.id}
            </Text>
          </div>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      centered
      style={{ 
        marginTop: '20px',
        marginBottom: '20px'
       }}
      destroyOnHidden
    >
      <div className="flex flex-col gap-6 pt-4">
        {/* Recruiter & Candidate Info */}
        <Row gutter={[16, 16]}>
          {/* Nhà tuyển dụng */}
          <Col xs={24} md={12}>
            <Card 
              size="small" 
              title={
                <div className="flex items-center gap-2 text-orange-600">
                  <UserOutlined />
                  <span>Nhà tuyển dụng</span>
                </div>
              }
              className="h-full border-orange-200!"
            >
              <div className="flex flex-col items-center gap-3">
                <Image
                  src={commitment.recruiter.frontIdCardImage}
                  alt="Mặt trước CCCD"
                  className="rounded-lg"
                  style={{ maxHeight: 200, objectFit: 'cover' }}
                  fallback={FALLBACK_IMAGE}
                />
                <div className="text-center">
                  <Title level={5} className="mb-1!">{commitment.recruiter.fullName}</Title>
                  <div className="flex items-center justify-center gap-1 text-gray-500">
                    <IdcardOutlined />
                    <Text copyable className="font-mono text-sm">
                      {commitment.recruiter.idCardNumber}
                    </Text>
                  </div>
                </div>
                <div className="w-full">
                  <Text strong className="text-sm block mb-1">Ảnh khuôn mặt:</Text>
                  <Image
                    src={commitment.recruiter.faceImage}
                    alt="Ảnh nhà tuyển dụng"
                    className="rounded-lg"
                    style={{ maxHeight: 150, objectFit: 'cover' }}
                    fallback={FALLBACK_IMAGE}
                  />
                </div>  
              </div>
            </Card>
          </Col>

          {/* Người lao động */}
          <Col xs={24} md={12}>
            <Card 
              size="small" 
              title={
                <div className="flex items-center gap-2 text-blue-600">
                  <UserOutlined />
                  <span>Người lao động</span>
                </div>
              }
              className="h-full border-blue-200!"
            >
              <div className="flex flex-col items-center gap-3">
                <Image
                  src={commitment.candidate.frontIdCardImage}
                  alt="Mặt trước CCCD"
                  className="rounded-lg"
                  style={{ maxHeight: 200, objectFit: 'cover' }}
                  fallback={FALLBACK_IMAGE}
                />
                <div className="text-center">
                  <Title level={5} className="mb-1!">{commitment.candidate.fullName}</Title>
                  <div className="flex items-center justify-center gap-1 text-gray-500">
                    <IdcardOutlined />
                    <Text copyable className="font-mono text-sm">
                      {commitment.candidate.idCardNumber}
                    </Text>
                  </div>
                </div>
                <div className="w-full">
                  <Text strong className="text-sm block mb-1">Ảnh khuôn mặt:</Text>
                  <Image
                    src={commitment.candidate.faceImage}
                    alt="Ảnh người lao động"
                    className="rounded-lg"
                    style={{ maxHeight: 150, objectFit: 'cover' }}
                    fallback={FALLBACK_IMAGE}
                  />
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Job Info */}
        <Descriptions
          bordered
          size="small"
          column={3}
          labelStyle={{ fontWeight: 500, backgroundColor: '#fafafa' }}
          title={
            <div className="flex items-center gap-2">
              <FileTextOutlined className="text-emerald-600" />
              <span>Thông tin công việc</span>
            </div>
          }
        >
          <Descriptions.Item label="Mã công việc" span={3}>
            <Text copyable className="font-mono">{commitment.job.id}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Tên công việc" span={3}>
            <Text strong>{commitment.job.title}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả công việc" span={3}>
            <Paragraph className="mb-0! text-gray-600">
              {commitment.job.description}
            </Paragraph>
          </Descriptions.Item>
          <Descriptions.Item label="Mức lương" span={3}>
            <Text className="text-green-600 font-semibold text-lg">
              <DollarOutlined className="mr-1" />
              {commitment.job.salaryMin.toLocaleString('vi-VN')}đ - {commitment.job.salaryMax.toLocaleString('vi-VN')}đ
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Hình thức làm việc" span={3}>
            <Tag
              icon={commitment.job.workLocationType === 'REMOTE' ? <GlobalOutlined /> : <EnvironmentOutlined />}
              color={commitment.job.workLocationType === 'REMOTE' ? 'cyan' : 'orange'}
            >
              {commitment.job.workLocationType === 'REMOTE' ? 'Làm việc từ xa' : 'Làm việc tại chỗ'}
            </Tag>
          </Descriptions.Item>
          {commitment.job.workLocationType === 'ONSITE' && (
            <>
              <Descriptions.Item label="Địa chỉ làm việc" span={3}>
                <Text><EnvironmentOutlined className="mr-1" />{commitment.job.workAddress || 'Chưa cập nhật'}</Text>
              </Descriptions.Item>
              {hasLocation && (
                <Descriptions.Item label="Tọa độ" span={3}>
                  <Text className="font-mono text-sm">
                    Vĩ độ: {commitment.job.workLatitude} | Kinh độ: {commitment.job.workLongitude}
                  </Text>
                </Descriptions.Item>
              )}
            </>
          )}
        </Descriptions>

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
            <div className="h-[300px] rounded-lg overflow-hidden relative">
              <MapContainer
                center={[commitment.job.workLatitude!, commitment.job.workLongitude!]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
              >
                <MapControls 
                  lat={commitment.job.workLatitude!} 
                  lng={commitment.job.workLongitude!} 
                />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker 
                  position={[commitment.job.workLatitude!, commitment.job.workLongitude!]}
                  icon={icon}
                >
                  <Popup>
                    <div className="text-center">
                      <strong>{commitment.job.title}</strong>
                      <br />
                      <small>{commitment.job.workAddress}</small>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </Card>
        )}

        {/* Commitment Details */}
        <Descriptions
          bordered
          size="small"
          column={2}
          labelStyle={{ fontWeight: 500, backgroundColor: '#fafafa' }}
          title={
            <div className="flex items-center gap-2">
              <CalendarOutlined className="text-purple-600" />
              <span>Thông tin cam kết</span>
            </div>
          }
        >
          {commitment.recruiterNote && (
            <Descriptions.Item label="Ghi chú của nhà tuyển dụng" span={2}>
              <Paragraph className="mb-0! text-gray-600 italic">
                "{commitment.recruiterNote}"
              </Paragraph>
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Thời gian ký (Nhà tuyển dụng)" span={1}>
            <Text>
              <CalendarOutlined className="mr-1 text-orange-500" />
              {commitment.recruiterSignedAt}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian ký (Người lao động)" span={1}>
            <Text>
              <CalendarOutlined className="mr-1 text-blue-500" />
              {commitment.candidateSignedAt}
            </Text>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  )
}

export default CommitmentDetailModal

