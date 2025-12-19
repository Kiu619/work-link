// ============================================
// API THẬT - Uncomment khi có API
// ============================================
// import { getCandidateJobPostsApi, updateJobPostStatusApi } from '@/apis'
// ============================================

import { PageHeader } from '@/components/common'
import {
  JobSeekerDetailModal,
  JobSeekerFilters,
  JobSeekerRejectModal,
  JobSeekerStats,
  JobSeekerTable,
} from '@/components/job-seeker'
import { useDebouncedValue } from '@/hooks/use-debounce'
import type { CandidateJobPost, JobPostListParams, JobPostStatus, UpdateJobPostStatusRequest } from '@/types/job-post'
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Card, message } from 'antd'
import type { TablePaginationConfig } from 'antd/es/table'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

// ============================================
// MOCK DATA - Xóa khi có API thật
// ============================================
const MOCK_JOB_POSTS: CandidateJobPost[] = [
  {
    id: 'JP001-abc-def-123',
    userId: 'USR001',
    title: 'Tìm việc nhập liệu part-time',
    description: 'Có kinh nghiệm nhập liệu, làm việc giờ hành chính, có thể đi làm ngay. Thành thạo Excel và Word.',
    workLocationType: 'ONSITE',
    workAddress: 'Quận Đống Đa, Hà Nội',
    category: {
      name: 'VĂN PHÒNG',
      description: 'Các nghề văn phòng, hành chính',
      occupation: {
        name: 'Nhập liệu',
        description: 'Nhập dữ liệu vào hệ thống',
      },
    },
    owner: {
      fullName: 'NGUYỄN VĂN AN',
      gender: 'Nam',
      dateOfBirth: '15/03/1995',
    },
    evaluation: {
      detectedRole: 'Người lao động',
      isViolation: false,
      violationType: '',
      severityLevel: 'An toàn',
      confidenceScore: 0.98,
      detectedIssues: [],
      reason: 'Tin tìm việc hợp lệ. Ứng viên nêu rõ mong muốn tìm việc nhập liệu part-time.',
      suggestedAction: 'Chấp nhận',
    },
    workLatitude: 21.018,
    workLongitude: 105.829,
    workRadiusKm: 5,
    salaryMin: 4000000,
    salaryMax: 6000000,
    availableFrom: '20/12/2025 08:00:00',
    availableTo: '31/03/2026 18:00:00',
    expiresAt: '15/01/2026 23:59:59',
    status: 'APPROVED',
    viewCount: 125,
  },
  {
    id: 'JP002-xyz-uvw-456',
    userId: 'USR002',
    title: 'Thợ điện công nghiệp',
    description: 'Kinh nghiệm 5 năm làm thợ điện, có chứng chỉ nghề. Sẵn sàng đi công trình xa.',
    workLocationType: 'ONSITE',
    workAddress: 'KCN Tân Bình, TP. Hồ Chí Minh',
    category: {
      name: 'XÂY DỰNG',
      description: 'Các nghề liên quan đến xây dựng, sửa chữa nhà cửa',
      occupation: {
        name: 'Thợ điện',
        description: 'Lắp đặt, sửa chữa hệ thống điện',
      },
    },
    owner: {
      fullName: 'TRẦN LÊ NAM',
      gender: 'Nam',
      dateOfBirth: '01/06/2003',
    },
    evaluation: undefined,
    workLatitude: 10.8013,
    workLongitude: 106.6268,
    workRadiusKm: 10,
    salaryMin: 8000000,
    salaryMax: 15000000,
    availableFrom: '17/12/2025 08:00:00',
    availableTo: '17/06/2026 17:00:00',
    expiresAt: '16/01/2026 21:30:51',
    status: 'APPROVED',
    viewCount: 89,
  },
  {
    id: 'JP003-mno-pqr-789',
    userId: 'USR003',
    title: 'Phụ bếp nhà hàng',
    description: 'Có mong muốn làm việc tại Cầu Giấy, Hà Nội. Sẵn sàng học hỏi, chịu khó.',
    workLocationType: 'ONSITE',
    workAddress: 'Ngõ 180 Đường Phú Mỹ, Phường Từ Liêm, Thành phố Hà Nội',
    category: {
      name: 'DỊCH VỤ ĂN UỐNG',
      description: 'Các nghề trong lĩnh vực nhà hàng, quán ăn',
      occupation: {
        name: 'Phụ bếp',
        description: 'Hỗ trợ nấu ăn, sơ chế nguyên liệu',
      },
    },
    owner: {
      fullName: 'LÊ THỊ HƯƠNG',
      gender: 'Nữ',
      dateOfBirth: '22/08/1998',
    },
    evaluation: {
      detectedRole: 'Người lao động',
      isViolation: true,
      violationType: 'Thông tin cá nhân nhạy cảm',
      severityLevel: 'Nghiêm trọng',
      confidenceScore: 0.97,
      detectedIssues: [
        'Công khai địa chỉ nhà quá chi tiết (số nhà, ngõ, phường)',
        'Công khai mã bưu điện cụ thể',
      ],
      reason: 'Tin tìm việc VI PHẠM NGHIÊM TRỌNG do để lộ thông tin cá nhân nhạy cảm.',
      suggestedAction: 'Từ chối',
    },
    workLatitude: 21.0285227,
    workLongitude: 105.7714733,
    workRadiusKm: 5,
    salaryMin: 200000,
    salaryMax: 300000,
    availableFrom: '19/12/2025 00:00:00',
    availableTo: '29/12/2025 00:00:00',
    expiresAt: '18/01/2026 00:00:00',
    status: 'PENDING',
    viewCount: 45,
  },
  {
    id: 'JP004-ghi-jkl-012',
    userId: 'USR004',
    title: 'Shipper Giao Hàng',
    description: 'Cần tìm ứng viên làm việc tại khu vực Hà Nội với công việc là shipper.',
    workLocationType: 'ONSITE',
    workAddress: 'Quận Cầu Giấy, Hà Nội',
    category: {
      name: 'VẬN TẢI - GIAO HÀNG',
      description: 'Các nghề vận chuyển, giao hàng',
      occupation: {
        name: 'Shipper',
        description: 'Giao hàng, giao đồ ăn',
      },
    },
    owner: {
      fullName: 'PHẠM VĂN CƯỜNG',
      gender: 'Nam',
      dateOfBirth: '10/12/1992',
    },
    evaluation: {
      detectedRole: 'Người lao động',
      isViolation: true,
      violationType: 'Sai vai trò',
      severityLevel: 'Trung bình',
      confidenceScore: 0.95,
      detectedIssues: [
        'Người lao động đăng tin tuyển dụng',
        'Nội dung mô tả như tin tuyển dụng',
      ],
      reason: 'Tin đăng có nội dung là TUYỂN DỤNG, không phải hồ sơ tìm việc.',
      suggestedAction: 'Từ chối',
    },
    workLatitude: 21.0285413,
    workLongitude: 105.7714731,
    workRadiusKm: 25,
    salaryMin: 300000,
    salaryMax: 500000,
    availableFrom: '18/12/2025 00:00:00',
    availableTo: '20/12/2025 00:00:00',
    expiresAt: '02/01/2026 00:00:00',
    status: 'PENDING',
    viewCount: 67,
  },
  {
    id: 'JP005-stu-vwx-345',
    userId: 'USR005',
    title: 'Thợ Xây Làm Ở Cầu Giấy Hà Nội',
    description: 'Cần tìm việc thợ xây tại khu vực Cầu Giấy, Hà Nội, làm việc trong khoảng 5 ngày.',
    workLocationType: 'ONSITE',
    workAddress: 'Quận Cầu Giấy, Hà Nội',
    category: {
      name: 'XÂY DỰNG',
      description: 'Các nghề liên quan đến xây dựng, sửa chữa nhà cửa',
      occupation: {
        name: 'Thợ hồ',
        description: 'Xây tường, trát tường, đổ bê tông',
      },
    },
    owner: {
      fullName: 'HOÀNG VĂN MINH',
      gender: 'Nam',
      dateOfBirth: '05/04/1990',
    },
    evaluation: {
      detectedRole: 'Người lao động',
      isViolation: false,
      violationType: '',
      severityLevel: 'An toàn',
      confidenceScore: 0.92,
      detectedIssues: [],
      reason: 'Tin tìm việc hợp lệ.',
      suggestedAction: 'Chấp nhận',
    },
    workLatitude: 21.0285655,
    workLongitude: 105.7714634,
    workRadiusKm: 5,
    salaryMin: 300000,
    salaryMax: 400000,
    availableFrom: '18/12/2025 00:00:00',
    availableTo: '23/12/2025 00:00:00',
    expiresAt: '18/01/2026 00:00:00',
    status: 'APPROVED',
    viewCount: 34,
  },
  {
    id: 'JP006-yza-bcd-678',
    userId: 'USR006',
    title: 'Nhân viên vệ sinh văn phòng',
    description: 'Tôi có 3 năm kinh nghiệm làm vệ sinh văn phòng, chăm chỉ, cẩn thận.',
    workLocationType: 'ONSITE',
    workAddress: 'Quận Bình Thạnh, TP. Hồ Chí Minh',
    category: {
      name: 'VỆ SINH - LAO CÔNG',
      description: 'Các nghề vệ sinh, dọn dẹp',
      occupation: {
        name: 'Nhân viên vệ sinh',
        description: 'Vệ sinh văn phòng, nhà cửa',
      },
    },
    owner: {
      fullName: 'VÕ THỊ LAN',
      gender: 'Nữ',
      dateOfBirth: '14/09/1996',
    },
    evaluation: undefined,
    workLatitude: 10.7942,
    workLongitude: 106.7217,
    workRadiusKm: 8,
    salaryMin: 4500000,
    salaryMax: 5500000,
    availableFrom: '01/01/2026 00:00:00',
    availableTo: '30/06/2026 00:00:00',
    expiresAt: '31/01/2026 00:00:00',
    status: 'REJECTED',
    rejectionReason: 'Thông tin không đầy đủ, thiếu mô tả kỹ năng cụ thể.',
    viewCount: 23,
  },
  {
    id: 'JP007-efg-hij-901',
    userId: 'USR007',
    title: 'Hỗ trợ kỹ thuật IT từ xa',
    description: 'Có kinh nghiệm hỗ trợ khách hàng qua điện thoại và chat. Có thể làm việc từ xa.',
    workLocationType: 'REMOTE',
    category: {
      name: 'CÔNG NGHỆ THÔNG TIN',
      description: 'Các nghề IT, công nghệ',
      occupation: {
        name: 'Hỗ trợ kỹ thuật',
        description: 'Hỗ trợ người dùng về kỹ thuật',
      },
    },
    owner: {
      fullName: 'ĐẶNG MINH GIANG',
      gender: 'Nam',
      dateOfBirth: '03/04/1994',
    },
    evaluation: {
      detectedRole: 'Người lao động',
      isViolation: false,
      violationType: '',
      severityLevel: 'An toàn',
      confidenceScore: 0.99,
      detectedIssues: [],
      reason: 'Tin tìm việc hợp lệ, rõ ràng.',
      suggestedAction: 'Chấp nhận',
    },
    salaryMin: 7000000,
    salaryMax: 10000000,
    availableFrom: '01/01/2026 00:00:00',
    availableTo: '31/12/2026 00:00:00',
    expiresAt: '28/02/2026 00:00:00',
    status: 'APPROVED',
    viewCount: 156,
  },
  {
    id: 'JP008-klm-nop-234',
    userId: 'USR008',
    title: 'Nhân viên thu ngân siêu thị',
    description: 'Có kinh nghiệm thu ngân, sử dụng thành thạo máy POS. Làm việc theo ca.',
    workLocationType: 'ONSITE',
    workAddress: 'BigC Thăng Long, Cầu Giấy, Hà Nội',
    category: {
      name: 'BÁN LẺ',
      description: 'Các nghề bán hàng, thu ngân',
      occupation: {
        name: 'Thu ngân',
        description: 'Thu tiền, thanh toán',
      },
    },
    owner: {
      fullName: 'BÙI THỊ HẠNH',
      gender: 'Nữ',
      dateOfBirth: '19/11/1999',
    },
    evaluation: undefined,
    workLatitude: 21.0367,
    workLongitude: 105.7826,
    workRadiusKm: 3,
    salaryMin: 5500000,
    salaryMax: 7000000,
    availableFrom: '01/01/2026 00:00:00',
    availableTo: '30/06/2026 00:00:00',
    expiresAt: '15/02/2026 00:00:00',
    status: 'PENDING',
    viewCount: 78,
  },
]

// Mock API function - Lấy danh sách tin tìm việc
const mockGetCandidateJobPostsApi = (
  params?: JobPostListParams
): Promise<{
  code: string
  data: {
    page: number
    maxSize: number
    totalElements: number
    totalPages: number
    data: CandidateJobPost[]
  }
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const page = params?.page ?? 1
      const maxSize = params?.maxSize ?? 10
      const search = params?.search?.toLowerCase() ?? ''
      const status = params?.status

      // Filter data
      const filteredData = MOCK_JOB_POSTS.filter((post) => {
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

// Mock API function - Cập nhật trạng thái tin tìm việc
const mockUpdateJobPostStatusApi = (
  data: UpdateJobPostStatusRequest
): Promise<{
  code: string
  type: string
  message: string
  data: null
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Cập nhật mock data (trong thực tế sẽ gọi API)
      const postIndex = MOCK_JOB_POSTS.findIndex((p) => p.id === data.id)
      if (postIndex !== -1) {
        MOCK_JOB_POSTS[postIndex].status = data.status
        if (data.rejectionReason) {
          MOCK_JOB_POSTS[postIndex].rejectionReason = data.rejectionReason
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

const JobSeekerList = () => {
  const queryClient = useQueryClient()

  // Filter states
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<JobPostStatus | ''>('')
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })

  // Modal state
  const [selectedPost, setSelectedPost] = useState<CandidateJobPost | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Rejection modal state
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  // Debounce search text (500ms)
  const debouncedSearch = useDebouncedValue(searchText, 500)

  // Query for fetching job posts
  const {
    data: queryData,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['jobPosts', pagination.current, pagination.pageSize, debouncedSearch, statusFilter],
    queryFn: async () => {
      // ============================================
      // API THẬT - Uncomment khi có API
      // ============================================
      // const response = await getCandidateJobPostsApi({
      //   page: pagination.current,
      //   maxSize: pagination.pageSize,
      //   search: debouncedSearch,
      //   status: statusFilter || undefined,
      // })
      // if (response.code !== 'WORKLINK-000000') {
      //   throw new Error('Failed to fetch job posts')
      // }
      // return response.data
      // ============================================

      // ============================================
      // MOCK DATA - Xóa khi có API thật
      // ============================================
      const response = await mockGetCandidateJobPostsApi({
        page: pagination.current,
        maxSize: pagination.pageSize,
        search: debouncedSearch,
        status: statusFilter || undefined,
      })
      if (response.code !== 'WORKLINK-000000') {
        throw new Error('Failed to fetch job posts')
      }
      return response.data
      // ============================================
    },
    placeholderData: (previousData) => previousData,
  })

  // Mutation for updating job post status
  const updateStatusMutation = useMutation({
    // ============================================
    // API THẬT - Uncomment khi có API
    // ============================================
    // mutationFn: updateJobPostStatusApi,
    // ============================================

    // ============================================
    // MOCK DATA - Xóa khi có API thật
    // ============================================
    mutationFn: mockUpdateJobPostStatusApi,
    // ============================================
    onSuccess: (response) => {
      if (response.code === 'WORKLINK-000000') {
        message.success('Cập nhật trạng thái thành công!')
        queryClient.invalidateQueries({ queryKey: ['jobPosts'] })
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
  const jobPosts = queryData?.data ?? []
  const totalElements = queryData?.totalElements ?? 0

  // Statistics
  const stats = {
    total: totalElements,
    pending: jobPosts.filter((p) => p.status === 'PENDING').length,
    approved: jobPosts.filter((p) => p.status === 'APPROVED').length,
    rejected: jobPosts.filter((p) => p.status === 'REJECTED').length,
  }

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleStatusChange = (value: JobPostStatus | '') => {
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

  const handleViewDetail = (record: CandidateJobPost) => {
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
        title="Danh sách tin tìm việc"
        subtitle="Quản lý và xét duyệt tin tìm việc của người lao động"
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
      <JobSeekerStats
        total={stats.total}
        pending={stats.pending}
        approved={stats.approved}
        rejected={stats.rejected}
      />

      {/* Filters & Table */}
      <Card className="border-none! shadow-md!">
        <JobSeekerFilters
          searchText={searchText}
          statusFilter={statusFilter}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
        />
        <JobSeekerTable
          data={jobPosts}
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
      <JobSeekerDetailModal
        open={isModalOpen}
        post={selectedPost}
        isUpdating={updateStatusMutation.isPending}
        onClose={handleCloseModal}
        onApprove={handleApprove}
        onOpenReject={handleOpenRejectModal}
      />

      {/* Rejection Modal */}
      <JobSeekerRejectModal
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

export default JobSeekerList
