import type { Complaint } from '@/types/dispute'
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Alert, Card, Modal, Radio, Space, Typography } from 'antd'
import { useState } from 'react'

const { Title, Text, Paragraph } = Typography

interface DisputeVerdictModalProps {
  open: boolean
  complaint: Complaint | null
  loading: boolean
  onClose: () => void
  onSubmit: (id: string, verdict: 'UPHOLD_CANDIDATE' | 'UPHOLD_RECRUITER') => void
}

const DisputeVerdictModal = ({
  open,
  complaint,
  loading,
  onClose,
  onSubmit,
}: DisputeVerdictModalProps) => {
  const [verdict, setVerdict] = useState<'UPHOLD_CANDIDATE' | 'UPHOLD_RECRUITER' | null>(null)

  const handleSubmit = () => {
    if (complaint && verdict) {
      onSubmit(complaint.id, verdict)
      setVerdict(null)
    }
  }

  const handleClose = () => {
    setVerdict(null)
    onClose()
  }

  if (!complaint) return null

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <SafetyCertificateOutlined className="text-lg text-amber-600" />
          </div>
          <div>
            <Title level={5} className="mb-0!">
              Đưa ra phán quyết
            </Title>
            <Text type="secondary" className="text-sm">
              Mã khiếu nại: #{complaint.id.slice(0, 8)}...
            </Text>
          </div>
        </div>
      }
      open={open}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText="Xác nhận phán quyết"
      cancelText="Hủy"
      okButtonProps={{ disabled: !verdict, loading }}
      width={600}
      centered
    >
      <div className="flex flex-col gap-4 py-4">
        {/* Warning Alert */}
        <Alert
          message="Lưu ý quan trọng"
          description="Phán quyết này sẽ ảnh hưởng đến việc hoàn tiền cho các bên. Vui lòng xem xét kỹ trước khi đưa ra quyết định."
          type="warning"
          showIcon
          icon={<ExclamationCircleOutlined />}
        />

        {/* Summary */}
        <Card size="small" className="bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Text type="secondary" className="text-xs">
                Người khiếu nại
              </Text>
              <div className="flex items-center gap-2 mt-1">
                <UserOutlined
                  className={
                    complaint.viewUser === 'CANDIDATE' ? 'text-blue-500' : 'text-orange-500'
                  }
                />
                <Text strong>
                  {complaint.viewUser === 'CANDIDATE'
                    ? complaint.commitment.candidate.fullName
                    : complaint.commitment.recruiter.fullName}
                </Text>
              </div>
            </div>
            <div>
              <Text type="secondary" className="text-xs">
                Mức lương tranh chấp
              </Text>
              <div className="mt-1">
                <Text strong className="text-green-600">
                  {complaint.commitment.agreedSalary.toLocaleString('vi-VN')}đ
                </Text>
              </div>
            </div>
          </div>
        </Card>

        {/* Verdict Options */}
        <div>
          <Text strong className="block mb-3">
            Chọn phán quyết:
          </Text>
          <Radio.Group
            value={verdict}
            onChange={(e) => setVerdict(e.target.value)}
            className="w-full"
          >
            <Space direction="vertical" className="w-full">
              <Card
                size="small"
                className={`cursor-pointer transition-all ${
                  verdict === 'UPHOLD_CANDIDATE'
                    ? 'border-blue-500 bg-blue-50'
                    : 'hover:border-blue-300'
                }`}
                onClick={() => setVerdict('UPHOLD_CANDIDATE')}
              >
                <Radio value="UPHOLD_CANDIDATE" className="w-full">
                  <div className="flex items-center gap-3">
                    <CheckCircleOutlined className="text-blue-500 text-xl" />
                    <div>
                      <Text strong className="text-blue-600">
                        Ứng viên thắng
                      </Text>
                      <Paragraph className="mb-0 text-xs text-gray-500">
                        Tiền sẽ được chuyển về cho ứng viên:{' '}
                        <strong>{complaint.commitment.candidate.fullName}</strong>
                      </Paragraph>
                    </div>
                  </div>
                </Radio>
              </Card>

              <Card
                size="small"
                className={`cursor-pointer transition-all ${
                  verdict === 'UPHOLD_RECRUITER'
                    ? 'border-orange-500 bg-orange-50'
                    : 'hover:border-orange-300'
                }`}
                onClick={() => setVerdict('UPHOLD_RECRUITER')}
              >
                <Radio value="UPHOLD_RECRUITER" className="w-full">
                  <div className="flex items-center gap-3">
                    <CheckCircleOutlined className="text-orange-500 text-xl" />
                    <div>
                      <Text strong className="text-orange-600">
                        Nhà tuyển dụng thắng
                      </Text>
                      <Paragraph className="mb-0 text-xs text-gray-500">
                        Tiền sẽ được hoàn về cho nhà tuyển dụng:{' '}
                        <strong>{complaint.commitment.recruiter.fullName}</strong>
                      </Paragraph>
                    </div>
                  </div>
                </Radio>
              </Card>
            </Space>
          </Radio.Group>
        </div>
      </div>
    </Modal>
  )
}

export default DisputeVerdictModal

