// ============================================
// API THẬT - Uncomment khi có API
// ============================================
// import { getRecruiterJobPostsApi, updateRecruitmentStatusApi } from '@/apis'
// ============================================

import { PageHeader } from '@/components/common'
import {
  RecruitmentDetailModal,
  RecruitmentFilters,
  RecruitmentRejectModal,
  RecruitmentStats,
  RecruitmentTable,
} from '@/components/recruitment'
import { useDebouncedValue } from '@/hooks/use-debounce'
import type { RecruiterJobPost, RecruitmentListParams, RecruitmentStatus, UpdateRecruitmentStatusRequest } from '@/types/recruitment'
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Card, message } from 'antd'
import type { TablePaginationConfig } from 'antd/es/table'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

// ============================================
// MOCK DATA - Xóa khi có API thật
// ============================================
const MOCK_RECRUITMENT_POSTS: RecruiterJobPost[] = [
  {
    id: 'RP001-abc-def-123',
    userId: 'REC001',
    title: 'Tuyển thợ điện công nghiệp',
    description: 'Cần tuyển thợ điện có kinh nghiệm làm việc tại nhà máy, xưởng sản xuất. Ưu tiên có chứng chỉ nghề.',
    quantityNeeded: 5,
    category: {
      name: 'XÂY DỰNG',
      description: 'Các nghề liên quan đến xây dựng, sửa chữa nhà cửa',
      occupation: {
        name: 'Thợ điện',
        description: 'Lắp đặt, sửa chữa hệ thống điện',
      },
    },
    evaluation: {
      detectedRole: 'Nhà tuyển dụng',
      isViolation: false,
      violationType: '',
      severityLevel: 'An toàn',
      confidenceScore: 0.98,
      detectedIssues: [],
      reason: 'Tin tuyển dụng hợp lệ, rõ ràng về yêu cầu công việc.',
      suggestedAction: 'Chấp nhận',
    },
    workLocationType: 'ONSITE',
    owner: {
      userId: 'REC001',
      fullName: 'CÔNG TY TNHH ĐIỆN LỰC MIỀN NAM',
      gender: 'Nam',
      dateOfBirth: '15/03/1980',
    },
    workAddress: 'KCN Tân Bình, Quận Tân Phú, TP. Hồ Chí Minh',
    workLatitude: 10.8013,
    workLongitude: 106.6268,
    salaryMin: 8000000,
    salaryMax: 15000000,
    applyBeforeDate: '31/12/2025 23:59:59',
    jobStartDate: '05/01/2026 08:00:00',
    jobEndDate: '05/07/2026 17:00:00',
    expiresAt: '31/12/2025 23:59:59',
    status: 'APPROVED',
    viewCount: 234,
    applicationCount: 12,
  },
  {
    id: 'RP002-xyz-uvw-456',
    userId: 'REC002',
    title: 'Tuyển nhân viên phục vụ nhà hàng',
    description: 'Nhà hàng 5 sao tuyển nhân viên phục vụ, yêu cầu ngoại hình ưa nhìn, giao tiếp tốt.',
    quantityNeeded: 10,
    category: {
      name: 'DỊCH VỤ ĂN UỐNG',
      description: 'Các nghề trong lĩnh vực nhà hàng, quán ăn',
      occupation: {
        name: 'Phục vụ',
        description: 'Phục vụ khách hàng tại nhà hàng',
      },
    },
    evaluation: undefined,
    workLocationType: 'ONSITE',
    owner: {
      userId: 'REC002',
      fullName: 'NHÀ HÀNG HOÀNG GIA',
      gender: 'Nam',
      dateOfBirth: '22/08/1975',
    },
    workAddress: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    workLatitude: 10.7744,
    workLongitude: 106.7025,
    salaryMin: 5000000,
    salaryMax: 8000000,
    applyBeforeDate: '25/12/2025 23:59:59',
    jobStartDate: '01/01/2026 08:00:00',
    jobEndDate: '30/06/2026 22:00:00',
    expiresAt: '25/12/2025 23:59:59',
    status: 'APPROVED',
    viewCount: 567,
    applicationCount: 45,
  },
  {
    id: 'RP003-mno-pqr-789',
    userId: 'REC003',
    title: 'Tuyển shipper giao hàng',
    description: 'Cần tuyển gấp shipper, có xe máy, biết đường trong thành phố. Lương theo đơn + thưởng.',
    quantityNeeded: 20,
    category: {
      name: 'VẬN TẢI - GIAO HÀNG',
      description: 'Các nghề vận chuyển, giao hàng',
      occupation: {
        name: 'Shipper',
        description: 'Giao hàng, giao đồ ăn',
      },
    },
    evaluation: {
      detectedRole: 'Nhà tuyển dụng',
      isViolation: true,
      violationType: 'Thông tin lương không rõ ràng',
      severityLevel: 'Nhẹ',
      confidenceScore: 0.85,
      detectedIssues: [
        'Không ghi rõ mức lương cụ thể',
        'Thiếu thông tin về phúc lợi',
      ],
      reason: 'Tin tuyển dụng thiếu thông tin về mức lương cụ thể.',
      suggestedAction: 'Yêu cầu bổ sung',
    },
    workLocationType: 'ONSITE',
    owner: {
      userId: 'REC003',
      fullName: 'CÔNG TY GIAO HÀNG NHANH',
      gender: 'Nam',
      dateOfBirth: '10/05/1985',
    },
    workAddress: 'Toàn thành phố Hà Nội',
    workLatitude: 21.0285,
    workLongitude: 105.8542,
    salaryMin: 300000,
    salaryMax: 500000,
    applyBeforeDate: '20/12/2025 23:59:59',
    jobStartDate: '22/12/2025 08:00:00',
    jobEndDate: '22/03/2026 20:00:00',
    expiresAt: '20/12/2025 23:59:59',
    status: 'PENDING',
    viewCount: 890,
    applicationCount: 78,
  },
  {
    id: 'RP004-ghi-jkl-012',
    userId: 'REC004',
    title: 'Tuyển thợ hồ xây dựng',
    description: 'Công trình lớn cần tuyển thợ hồ có kinh nghiệm. Bao ăn ở, lương cao.',
    quantityNeeded: 15,
    category: {
      name: 'XÂY DỰNG',
      description: 'Các nghề liên quan đến xây dựng, sửa chữa nhà cửa',
      occupation: {
        name: 'Thợ hồ',
        description: 'Xây tường, trát tường, đổ bê tông',
      },
    },
    evaluation: {
      detectedRole: 'Nhà tuyển dụng',
      isViolation: false,
      violationType: '',
      severityLevel: 'An toàn',
      confidenceScore: 0.95,
      detectedIssues: [],
      reason: 'Tin tuyển dụng hợp lệ.',
      suggestedAction: 'Chấp nhận',
    },
    workLocationType: 'ONSITE',
    owner: {
      userId: 'REC004',
      fullName: 'CÔNG TY XÂY DỰNG HOÀNG LONG',
      gender: 'Nam',
      dateOfBirth: '05/12/1978',
    },
    workAddress: 'KCN Long Thành, Đồng Nai',
    workLatitude: 10.8562,
    workLongitude: 106.9508,
    salaryMin: 400000,
    salaryMax: 500000,
    applyBeforeDate: '28/12/2025 23:59:59',
    jobStartDate: '02/01/2026 07:00:00',
    jobEndDate: '02/04/2026 17:00:00',
    expiresAt: '28/12/2025 23:59:59',
    status: 'APPROVED',
    viewCount: 345,
    applicationCount: 23,
  },
  {
    id: 'RP005-stu-vwx-345',
    userId: 'REC005',
    title: 'Tuyển nhân viên vệ sinh',
    description: 'Tòa nhà văn phòng cần tuyển nhân viên vệ sinh. Làm việc buổi tối từ 18h-22h.',
    quantityNeeded: 3,
    category: {
      name: 'VỆ SINH - LAO CÔNG',
      description: 'Các nghề vệ sinh, dọn dẹp',
      occupation: {
        name: 'Nhân viên vệ sinh',
        description: 'Vệ sinh văn phòng, nhà cửa',
      },
    },
    evaluation: undefined,
    workLocationType: 'ONSITE',
    owner: {
      userId: 'REC005',
      fullName: 'CÔNG TY QUẢN LÝ TÒA NHÀ LANDMARK',
      gender: 'Nữ',
      dateOfBirth: '14/09/1982',
    },
    workAddress: 'Tòa nhà Landmark 81, Quận Bình Thạnh, TP. Hồ Chí Minh',
    workLatitude: 10.7942,
    workLongitude: 106.7217,
    salaryMin: 4500000,
    salaryMax: 5500000,
    applyBeforeDate: '30/12/2025 23:59:59',
    jobStartDate: '05/01/2026 18:00:00',
    jobEndDate: '05/07/2026 22:00:00',
    expiresAt: '30/12/2025 23:59:59',
    status: 'PENDING',
    viewCount: 123,
    applicationCount: 8,
  },
  {
    id: 'RP006-yza-bcd-678',
    userId: 'REC006',
    title: 'Tuyển lập trình viên freelance',
    description: 'Cần tuyển lập trình viên làm việc từ xa, có kinh nghiệm React/Node.js.',
    quantityNeeded: 2,
    category: {
      name: 'CÔNG NGHỆ THÔNG TIN',
      description: 'Các nghề IT, công nghệ',
      occupation: {
        name: 'Lập trình viên',
        description: 'Phát triển phần mềm, website',
      },
    },
    evaluation: {
      detectedRole: 'Nhà tuyển dụng',
      isViolation: false,
      violationType: '',
      severityLevel: 'An toàn',
      confidenceScore: 0.99,
      detectedIssues: [],
      reason: 'Tin tuyển dụng hợp lệ, rõ ràng.',
      suggestedAction: 'Chấp nhận',
    },
    workLocationType: 'REMOTE',
    owner: {
      userId: 'REC006',
      fullName: 'TECH SOLUTIONS VIETNAM',
      gender: 'Nam',
      dateOfBirth: '03/04/1990',
    },
    salaryMin: 15000000,
    salaryMax: 25000000,
    applyBeforeDate: '15/01/2026 23:59:59',
    jobStartDate: '01/02/2026 00:00:00',
    jobEndDate: '01/08/2026 00:00:00',
    expiresAt: '15/01/2026 23:59:59',
    status: 'APPROVED',
    viewCount: 456,
    applicationCount: 34,
  },
  {
    id: 'RP007-efg-hij-901',
    userId: 'REC007',
    title: 'Tuyển bảo vệ ca đêm',
    description: 'Cần tuyển bảo vệ làm ca đêm, yêu cầu sức khỏe tốt, trung thực.',
    quantityNeeded: 4,
    category: {
      name: 'BẢO VỆ - AN NINH',
      description: 'Các nghề bảo vệ, an ninh',
      occupation: {
        name: 'Bảo vệ',
        description: 'Bảo vệ tài sản, an ninh',
      },
    },
    evaluation: {
      detectedRole: 'Nhà tuyển dụng',
      isViolation: true,
      violationType: 'Phân biệt đối xử',
      severityLevel: 'Trung bình',
      confidenceScore: 0.88,
      detectedIssues: [
        'Yêu cầu giới tính trong tin tuyển dụng',
        'Có dấu hiệu phân biệt tuổi tác',
      ],
      reason: 'Tin tuyển dụng có yêu cầu phân biệt giới tính và tuổi tác.',
      suggestedAction: 'Từ chối',
    },
    workLocationType: 'ONSITE',
    owner: {
      userId: 'REC007',
      fullName: 'CÔNG TY BẢO VỆ AN TOÀN',
      gender: 'Nam',
      dateOfBirth: '19/11/1970',
    },
    workAddress: 'Quận 7, TP. Hồ Chí Minh',
    workLatitude: 10.7326,
    workLongitude: 106.7196,
    salaryMin: 6000000,
    salaryMax: 7500000,
    applyBeforeDate: '22/12/2025 23:59:59',
    jobStartDate: '01/01/2026 22:00:00',
    jobEndDate: '01/07/2026 06:00:00',
    expiresAt: '22/12/2025 23:59:59',
    status: 'PENDING',
    viewCount: 189,
    applicationCount: 15,
  },
  {
    id: 'RP008-klm-nop-234',
    userId: 'REC008',
    title: 'Tuyển phụ bếp nhà hàng',
    description: 'Nhà hàng Nhật cần tuyển phụ bếp, ưu tiên có kinh nghiệm.',
    quantityNeeded: 2,
    category: {
      name: 'DỊCH VỤ ĂN UỐNG',
      description: 'Các nghề trong lĩnh vực nhà hàng, quán ăn',
      occupation: {
        name: 'Phụ bếp',
        description: 'Hỗ trợ nấu ăn, sơ chế nguyên liệu',
      },
    },
    evaluation: undefined,
    workLocationType: 'ONSITE',
    owner: {
      userId: 'REC008',
      fullName: 'NHÀ HÀNG SAKURA',
      gender: 'Nữ',
      dateOfBirth: '25/02/1988',
    },
    workAddress: '45 Lê Thánh Tôn, Quận 1, TP. Hồ Chí Minh',
    workLatitude: 10.7756,
    workLongitude: 106.7019,
    salaryMin: 5500000,
    salaryMax: 7000000,
    applyBeforeDate: '31/12/2025 23:59:59',
    jobStartDate: '05/01/2026 08:00:00',
    jobEndDate: '05/07/2026 22:00:00',
    expiresAt: '31/12/2025 23:59:59',
    status: 'REJECTED',
    rejectionReason: 'Tin tuyển dụng trùng lặp với tin đã đăng trước đó.',
    viewCount: 78,
    applicationCount: 5,
  },
]

// Mock API function - Lấy danh sách tin tuyển dụng
const mockGetRecruiterJobPostsApi = (
  params?: RecruitmentListParams
): Promise<{
  code: string
  data: {
    page: number
    maxSize: number
    totalElements: number
    totalPages: number
    data: RecruiterJobPost[]
  }
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const page = params?.page ?? 1
      const maxSize = params?.maxSize ?? 10
      const search = params?.search?.toLowerCase() ?? ''
      const status = params?.status

      // Filter data
      const filteredData = MOCK_RECRUITMENT_POSTS.filter((post) => {
        const matchSearch =
          !search ||
          post.title.toLowerCase().includes(search) ||
          post.owner.fullName.toLowerCase().includes(search) ||
          post.description.toLowerCase().includes(search)

        const matchStatus = !status || post.status === status

        return matchSearch && matchStatus
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
    }, 500)
  })
}

// Mock API function - Cập nhật trạng thái tin tuyển dụng
const mockUpdateRecruitmentStatusApi = (
  data: UpdateRecruitmentStatusRequest
): Promise<{
  code: string
  type: string
  message: string
  data: null
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Cập nhật mock data
      const postIndex = MOCK_RECRUITMENT_POSTS.findIndex((p) => p.id === data.id)
      if (postIndex !== -1) {
        MOCK_RECRUITMENT_POSTS[postIndex].status = data.status
        if (data.rejectionReason) {
          MOCK_RECRUITMENT_POSTS[postIndex].rejectionReason = data.rejectionReason
        }
      }

      resolve({
        code: 'WORKLINK-000000',
        type: 'OK',
        message: 'Cập nhật trạng thái thành công',
        data: null,
      })
    }, 500)
  })
}
// ============================================
// END MOCK DATA
// ============================================

const RecruitmentList = () => {
  const queryClient = useQueryClient()

  // Filter states
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<RecruitmentStatus | ''>('')
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })

  // Modal state
  const [selectedPost, setSelectedPost] = useState<RecruiterJobPost | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Rejection modal state
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  // Debounce search text (500ms)
  const debouncedSearch = useDebouncedValue(searchText, 500)

  // Query for fetching recruitment posts
  const {
    data: queryData,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['recruitmentPosts', pagination.current, pagination.pageSize, debouncedSearch, statusFilter],
    queryFn: async () => {
      // ============================================
      // API THẬT - Uncomment khi có API
      // ============================================
      // const response = await getRecruiterJobPostsApi({
      //   page: pagination.current,
      //   maxSize: pagination.pageSize,
      //   search: debouncedSearch,
      //   status: statusFilter || undefined,
      // })
      // if (response.code !== 'WORKLINK-000000') {
      //   throw new Error('Failed to fetch recruitment posts')
      // }
      // return response.data
      // ============================================

      // ============================================
      // MOCK DATA - Xóa khi có API thật
      // ============================================
      const response = await mockGetRecruiterJobPostsApi({
        page: pagination.current,
        maxSize: pagination.pageSize,
        search: debouncedSearch,
        status: statusFilter || undefined,
      })
      if (response.code !== 'WORKLINK-000000') {
        throw new Error('Failed to fetch recruitment posts')
      }
      return response.data
      // ============================================
    },
    placeholderData: (previousData) => previousData,
  })

  // Mutation for updating recruitment status
  const updateStatusMutation = useMutation({
    // ============================================
    // API THẬT - Uncomment khi có API
    // ============================================
    // mutationFn: updateRecruitmentStatusApi,
    // ============================================

    // ============================================
    // MOCK DATA - Xóa khi có API thật
    // ============================================
    mutationFn: mockUpdateRecruitmentStatusApi,
    // ============================================
    onSuccess: (response) => {
      if (response.code === 'WORKLINK-000000') {
        message.success('Cập nhật trạng thái thành công!')
        queryClient.invalidateQueries({ queryKey: ['recruitmentPosts'] })
        setIsModalOpen(false)
        setIsRejectModalOpen(false)
        setRejectionReason('')
        setSelectedPost(null)
      } else {
        message.error(response.message || 'Có lỗi xảy ra!')
      }
    },
    onError: (error: Error) => {
      message.error(error.message || 'Có lỗi xảy ra khi cập nhật trạng thái!')
    },
  })

  // Extracted data
  const recruitmentPosts = queryData?.data ?? []
  const totalElements = queryData?.totalElements ?? 0

  // Statistics
  const stats = {
    total: totalElements,
    pending: recruitmentPosts.filter((p) => p.status === 'PENDING').length,
    approved: recruitmentPosts.filter((p) => p.status === 'APPROVED').length,
    rejected: recruitmentPosts.filter((p) => p.status === 'REJECTED').length,
  }

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleStatusChange = (value: RecruitmentStatus | '') => {
    setStatusFilter(value)
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleTableChange = (paginationConfig: TablePaginationConfig) => {
    setPagination({
      current: paginationConfig.current ?? 1,
      pageSize: paginationConfig.pageSize ?? 10,
    })
  }

  const handleRefresh = () => refetch()

  const handleViewDetail = (record: RecruiterJobPost) => {
    setSelectedPost(record)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPost(null)
  }

  const handleApprove = () => {
    if (!selectedPost) return
    updateStatusMutation.mutate({
      id: selectedPost.id,
      status: 'APPROVED',
    })
  }

  const handleOpenRejectModal = () => setIsRejectModalOpen(true)

  const handleCloseRejectModal = () => {
    setIsRejectModalOpen(false)
    setRejectionReason('')
  }

  const handleReject = () => {
    if (!selectedPost) return
    if (!rejectionReason.trim()) {
      message.warning('Vui lòng nhập lý do từ chối!')
      return
    }
    updateStatusMutation.mutate({
      id: selectedPost.id,
      status: 'REJECTED',
      rejectionReason: rejectionReason.trim(),
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <PageHeader
        title="Danh sách tin tuyển dụng"
        subtitle="Quản lý và xét duyệt tin tuyển dụng của nhà tuyển dụng"
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

      {/* Statistics Cards */}
      <RecruitmentStats
        total={stats.total}
        pending={stats.pending}
        approved={stats.approved}
        rejected={stats.rejected}
      />

      {/* Filters & Table */}
      <Card className="border-none! shadow-md!">
        <RecruitmentFilters
          searchText={searchText}
          statusFilter={statusFilter}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
        />
        <RecruitmentTable
          data={recruitmentPosts}
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
      <RecruitmentDetailModal
        open={isModalOpen}
        post={selectedPost}
        isUpdating={updateStatusMutation.isPending}
        onClose={handleCloseModal}
        onApprove={handleApprove}
        onOpenReject={handleOpenRejectModal}
      />

      {/* Rejection Modal */}
      <RecruitmentRejectModal
        open={isRejectModalOpen}
        rejectionReason={rejectionReason}
        isUpdating={updateStatusMutation.isPending}
        onClose={handleCloseRejectModal}
        onReasonChange={setRejectionReason}
        onConfirm={handleReject}
      />
    </div>
  )
}

export default RecruitmentList

