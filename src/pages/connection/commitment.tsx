// import { getCommitmentsApi } from '@/apis'
import { PageHeader } from '@/components/common'
import {
  CommitmentDetailModal,
  CommitmentFilters,
  CommitmentTable,
} from '@/components/commitment'
import { useDebouncedValue } from '@/hooks/use-debounce'
import type { Commitment, CommitmentListParams } from '@/types/commitment'
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Card } from 'antd'
import type { TablePaginationConfig } from 'antd/es/table'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

// ============================================
// MOCK DATA - Xóa khi có API thật
// ============================================
const MOCK_COMMITMENTS: Commitment[] = [
  {
    id: 'CM001-abc-def-123',
    recruiter: {
      userId: 'REC001',
      fullName: 'Công ty TNHH ABC',
      idCardNumber: '001095123456',
      frontIdCardImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
      faceImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    },
    candidate: {
      userId: 'CAN001',
      fullName: 'Nguyễn Văn An',
      idCardNumber: '001098765432',
      frontIdCardImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
      faceImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
    },
    job: {
      id: 'JOB001',
      title: 'Thợ điện công nghiệp',
      description: 'Lắp đặt, sửa chữa hệ thống điện công nghiệp tại các nhà máy, xưởng sản xuất. Yêu cầu có kinh nghiệm ít nhất 2 năm.',
      salaryMin: 8000000,
      salaryMax: 15000000,
      workLocationType: 'ONSITE',
      workAddress: 'KCN Tân Bình, Quận Tân Phú, TP. Hồ Chí Minh',
      workLatitude: 10.8013,
      workLongitude: 106.6268,
    },
    recruiterNote: 'Ưu tiên ứng viên có thể bắt đầu ngay. Công ty hỗ trợ ăn trưa và xe đưa đón.',
    recruiterSignedAt: '15/12/2025 10:30:00',
    candidateSignedAt: '15/12/2025 14:45:00',
    createdAt: '15/12/2025 09:00:00',
  },
  {
    id: 'CM002-xyz-uvw-456',
    recruiter: {
      userId: 'REC002',
      fullName: 'Nhà hàng Phở Hà Nội',
      idCardNumber: '001087654321',
      frontIdCardImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      faceImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
    candidate: {
      userId: 'CAN002',
      fullName: 'Trần Thị Bình',
      idCardNumber: '048095123789',
      frontIdCardImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      faceImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    },
    job: {
      id: 'JOB002',
      title: 'Phụ bếp',
      description: 'Hỗ trợ đầu bếp trong việc sơ chế nguyên liệu, chuẩn bị món ăn. Làm việc ca sáng từ 6h-14h.',
      salaryMin: 5000000,
      salaryMax: 7000000,
      workLocationType: 'ONSITE',
      workAddress: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
      workLatitude: 10.7744,
      workLongitude: 106.7025,
    },
    recruiterNote: 'Được ăn 2 bữa/ngày. Thưởng tháng 13.',
    recruiterSignedAt: '14/12/2025 08:00:00',
    candidateSignedAt: '14/12/2025 09:30:00',
    createdAt: '14/12/2025 07:00:00',
  },
  {
    id: 'CM003-mno-pqr-789',
    recruiter: {
      userId: 'REC003',
      fullName: 'Công ty Giao hàng Nhanh',
      idCardNumber: '001092345678',
      frontIdCardImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
      faceImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    },
    candidate: {
      userId: 'CAN003',
      fullName: 'Lê Hoàng Cường',
      idCardNumber: '079091234567',
      frontIdCardImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      faceImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    },
    job: {
      id: 'JOB003',
      title: 'Shipper giao hàng',
      description: 'Giao hàng trong nội thành, có xe máy riêng. Thu nhập theo đơn hàng.',
      salaryMin: 300000,
      salaryMax: 500000,
      workLocationType: 'ONSITE',
      workAddress: 'Quận Cầu Giấy, Hà Nội',
      workLatitude: 21.0285,
      workLongitude: 105.7878,
    },
    recruiterNote: 'Hỗ trợ xăng xe. Thưởng theo doanh số.',
    recruiterSignedAt: '13/12/2025 16:00:00',
    candidateSignedAt: '13/12/2025 17:30:00',
    createdAt: '13/12/2025 15:00:00',
  },
  {
    id: 'CM004-ghi-jkl-012',
    recruiter: {
      userId: 'REC004',
      fullName: 'Freelancer Hub',
      idCardNumber: '001089012345',
      frontIdCardImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      faceImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    },
    candidate: {
      userId: 'CAN004',
      fullName: 'Phạm Thị Dung',
      idCardNumber: '092100456789',
      frontIdCardImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      faceImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    },
    job: {
      id: 'JOB004',
      title: 'Nhập liệu dữ liệu',
      description: 'Nhập liệu từ file scan sang Excel. Làm việc online, thời gian linh hoạt.',
      salaryMin: 4000000,
      salaryMax: 6000000,
      workLocationType: 'REMOTE',
    },
    recruiterNote: 'Thanh toán theo tuần. Có thể làm thêm giờ nếu muốn.',
    recruiterSignedAt: '12/12/2025 20:00:00',
    candidateSignedAt: '12/12/2025 21:15:00',
    createdAt: '12/12/2025 19:00:00',
  },
  {
    id: 'CM005-stu-vwx-345',
    recruiter: {
      userId: 'REC005',
      fullName: 'Công ty Xây dựng Hoàng Long',
      idCardNumber: '001085678901',
      frontIdCardImage: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400',
      faceImage: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400',
    },
    candidate: {
      userId: 'CAN005',
      fullName: 'Hoàng Văn Em',
      idCardNumber: '075097890123',
      frontIdCardImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      faceImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    },
    job: {
      id: 'JOB005',
      title: 'Thợ hồ xây dựng',
      description: 'Xây tường, trát tường, đổ bê tông. Làm việc tại công trình ở Đồng Nai.',
      salaryMin: 400000,
      salaryMax: 500000,
      workLocationType: 'ONSITE',
      workAddress: 'KCN Long Thành, Đồng Nai',
      workLatitude: 10.8562,
      workLongitude: 106.9508,
    },
    recruiterNote: 'Bao ăn ở tại công trình. Hợp đồng 3 tháng.',
    recruiterSignedAt: '11/12/2025 07:00:00',
    candidateSignedAt: '11/12/2025 08:00:00',
    createdAt: '11/12/2025 06:30:00',
  },
  {
    id: 'CM006-yza-bcd-678',
    recruiter: {
      userId: 'REC006',
      fullName: 'Công ty Vệ sinh Sạch Sẽ',
      idCardNumber: '001096789012',
      frontIdCardImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      faceImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    },
    candidate: {
      userId: 'CAN006',
      fullName: 'Võ Thị Phương',
      idCardNumber: '048096012345',
      frontIdCardImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      faceImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    },
    job: {
      id: 'JOB006',
      title: 'Nhân viên vệ sinh văn phòng',
      description: 'Vệ sinh văn phòng công ty, làm việc từ 18h-22h hàng ngày.',
      salaryMin: 4500000,
      salaryMax: 5500000,
      workLocationType: 'ONSITE',
      workAddress: 'Tòa nhà Landmark 81, Quận Bình Thạnh, TP. Hồ Chí Minh',
      workLatitude: 10.7942,
      workLongitude: 106.7217,
    },
    recruiterNote: '',
    recruiterSignedAt: '10/12/2025 17:00:00',
    candidateSignedAt: '10/12/2025 18:30:00',
    createdAt: '10/12/2025 16:00:00',
  },
  {
    id: 'CM007-efg-hij-901',
    recruiter: {
      userId: 'REC007',
      fullName: 'Tech Solutions',
      idCardNumber: '001093456789',
      frontIdCardImage: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400',
      faceImage: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400',
    },
    candidate: {
      userId: 'CAN007',
      fullName: 'Đặng Minh Giang',
      idCardNumber: '079094567890',
      frontIdCardImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      faceImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
    job: {
      id: 'JOB007',
      title: 'Hỗ trợ kỹ thuật IT',
      description: 'Hỗ trợ khách hàng qua điện thoại và chat. Có thể làm việc từ xa.',
      salaryMin: 7000000,
      salaryMax: 10000000,
      workLocationType: 'REMOTE',
    },
    recruiterNote: 'Làm việc theo ca, mỗi ca 8 tiếng. Được cấp laptop làm việc.',
    recruiterSignedAt: '09/12/2025 10:00:00',
    candidateSignedAt: '09/12/2025 11:00:00',
    createdAt: '09/12/2025 09:00:00',
  },
  {
    id: 'CM008-klm-nop-234',
    recruiter: {
      userId: 'REC008',
      fullName: 'Siêu thị BigC',
      idCardNumber: '001091234567',
      frontIdCardImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
      faceImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    },
    candidate: {
      userId: 'CAN008',
      fullName: 'Bùi Thị Hạnh',
      idCardNumber: '001099678901',
      frontIdCardImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
      faceImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    },
    job: {
      id: 'JOB008',
      title: 'Nhân viên thu ngân',
      description: 'Thu ngân tại quầy thanh toán. Làm việc theo ca, có đào tạo trước khi làm.',
      salaryMin: 5500000,
      salaryMax: 7000000,
      workLocationType: 'ONSITE',
      workAddress: 'BigC Thăng Long, Cầu Giấy, Hà Nội',
      workLatitude: 21.0367,
      workLongitude: 105.7826,
    },
    recruiterNote: 'Được mua hàng với giá nhân viên. BHXH đầy đủ.',
    recruiterSignedAt: '08/12/2025 14:00:00',
    candidateSignedAt: '08/12/2025 15:30:00',
    createdAt: '08/12/2025 13:00:00',
  },
]

// Mock API function - Simulate server behavior
const mockGetCommitmentsApi = (
  params?: CommitmentListParams
): Promise<{
  code: string
  data: {
    page: number
    maxSize: number
    totalElements: number
    totalPages: number
    data: Commitment[]
  }
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const page = params?.page ?? 1
      const maxSize = params?.maxSize ?? 10
      const search = params?.search?.toLowerCase() ?? ''

      // Filter data
      const filteredData = MOCK_COMMITMENTS.filter((commitment) => {
        const matchSearch =
          !search ||
          commitment.id.toLowerCase().includes(search) ||
          commitment.recruiter.fullName.toLowerCase().includes(search) ||
          commitment.candidate.fullName.toLowerCase().includes(search) ||
          commitment.job.title.toLowerCase().includes(search)

        return matchSearch
      })

      // Pagination
      const totalElements = filteredData.length
      const totalPages = Math.ceil(totalElements / maxSize)
      const startIndex = (page - 1) * maxSize
      const paginatedData = filteredData.slice(startIndex, startIndex + maxSize)

      resolve({
        code: 'WORKLINK-000000',
        data: {
          page,
          maxSize,
          totalElements,
          totalPages,
          data: paginatedData,
        },
      })
    }, 500) // Simulate network delay
  })
}
// ============================================
// END MOCK DATA
// ============================================

const CommitmentPage = () => {
  // Filter states
  const [searchText, setSearchText] = useState('')
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })

  // Modal state
  const [selectedCommitment, setSelectedCommitment] = useState<Commitment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Debounce search text (500ms)
  const debouncedSearch = useDebouncedValue(searchText, 500)

  const {
    data: queryData,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['commitments', pagination.current, pagination.pageSize, debouncedSearch],
    queryFn: async () => {
      // ============================================
      // API THẬT - Uncomment khi có API
      // ============================================
      // const response = await getCommitmentsApi({
      //   page: pagination.current,
      //   maxSize: pagination.pageSize,
      //   search: debouncedSearch,
      // })
      // if (response.code !== 'WORKLINK-000000') {
      //   throw new Error('Failed to fetch commitments')
      // }
      // return response.data
      // ============================================

      // ============================================
      // MOCK DATA - Xóa khi có API thật
      // ============================================
      const response = await mockGetCommitmentsApi({
        page: pagination.current,
        maxSize: pagination.pageSize,
        search: debouncedSearch,
      })
      if (response.code !== 'WORKLINK-000000') {
        throw new Error('Failed to fetch commitments')
      }
      return response.data
      // ============================================
    },
    placeholderData: (previousData) => previousData,
  })

  // Extracted data
  const commitments = queryData?.data ?? []
  const totalElements = queryData?.totalElements ?? 0

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleTableChange = (paginationConfig: TablePaginationConfig) => {
    setPagination({
      current: paginationConfig.current ?? 1,
      pageSize: paginationConfig.pageSize ?? 10,
    })
  }

  const handleRefresh = () => refetch()

  const handleViewDetail = (record: Commitment) => {
    setSelectedCommitment(record)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCommitment(null)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <PageHeader
        title="Danh sách cam kết"
        subtitle="Quản lý các cam kết giữa nhà tuyển dụng và người lao động"
        actions={
          <>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={isFetching}>
              Làm mới
            </Button>
            <Button type="primary" icon={<DownloadOutlined />}>
              Xuất Excel
            </Button>
          </>
        }
      />

      {/* Filters & Table */}
      <Card className="border-none! shadow-md!">
        <CommitmentFilters
          searchText={searchText}
          onSearchChange={handleSearchChange}
        />
        <CommitmentTable
          data={commitments}
          loading={isFetching}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: totalElements,
          }}
          onTableChange={handleTableChange}
          onViewDetail={handleViewDetail}
        />
      </Card>

      {/* Detail Modal */}
      <CommitmentDetailModal
        open={isModalOpen}
        commitment={selectedCommitment}
        onClose={handleCloseModal}
      />
    </div>
  )
}

export default CommitmentPage

