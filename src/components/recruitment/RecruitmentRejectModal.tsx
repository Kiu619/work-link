import { CloseCircleOutlined } from '@ant-design/icons'
import { Button, Input, Modal, Space, Typography } from 'antd'

const { Text } = Typography

interface RecruitmentRejectModalProps {
  open: boolean
  rejectionReason: string
  isUpdating: boolean
  onClose: () => void
  onReasonChange: (value: string) => void
  onConfirm: () => void
}

const RecruitmentRejectModal = ({
  open,
  rejectionReason,
  isUpdating,
  onClose,
  onReasonChange,
  onConfirm,
}: RecruitmentRejectModalProps) => {
  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-red-600">
          <CloseCircleOutlined />
          <span>Từ chối tin tuyển dụng</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={
        <Space>
          <Button onClick={onClose}>Hủy</Button>
          <Button
            danger
            type="primary"
            icon={<CloseCircleOutlined />}
            onClick={onConfirm}
            loading={isUpdating}
            disabled={!rejectionReason.trim()}
          >
            Xác nhận từ chối
          </Button>
        </Space>
      }
      width={500}
      centered
    >
      <div className="py-4">
        <Text strong className="block mb-2">
          Lý do từ chối <span className="text-red-500">*</span>
        </Text>
        <Input.TextArea
          placeholder="Nhập lý do từ chối tin tuyển dụng này..."
          value={rejectionReason}
          onChange={(e) => onReasonChange(e.target.value)}
          rows={4}
          maxLength={500}
          showCount
        />
        <Text type="secondary" className="block mt-2 text-xs">
          Lý do này sẽ được hiển thị cho nhà tuyển dụng biết.
        </Text>
      </div>
    </Modal>
  )
}

export default RecruitmentRejectModal

