// import { getComplaintsApi, updateComplaintVerdictApi } from '@/apis'
import { PageHeader } from '@/components/common'
import {
  DisputeDetailModal,
  DisputeFilters,
  DisputeStats,
  DisputeTable,
  DisputeVerdictModal,
} from '@/components/dispute'
import { useDebouncedValue } from '@/hooks/use-debounce'
import type { AdminVerdict, Complaint, ComplaintListParams } from '@/types/dispute'
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Card, message } from 'antd'
import type { TablePaginationConfig } from 'antd/es/table'
import { useState } from 'react'

// ============================================
// MOCK DATA - Xóa khi có API thật
// ============================================
const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'CP001-abc-def-123',
    commitmentId: 'CM001-abc-def-123',
    rejectReasonDetail:
      'Nhà tuyển dụng không thanh toán lương đúng hạn như đã cam kết. Tôi đã hoàn thành công việc đúng thời gian nhưng vẫn chưa nhận được tiền sau 7 ngày.',
    rejectEvidenceImages: [
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400',
    ],
    adminVerdict: null,
    viewUser: 'CANDIDATE',
    createAt: '18/12/2025 14:30:00',
    commitment: {
      jobApplicationId: 'JA001',
      candidate: {
        fullName: 'Nguyễn Văn An',
        gender: 'Nam',
        dateOfBirth: '15/03/1995',
      },
      recruiter: {
        fullName: 'Công ty TNHH ABC',
        gender: 'Nam',
        dateOfBirth: '01/01/1980',
      },
      recruiterJobPost: {
        id: 'RJP001',
        userId: 'REC001',
        title: 'Thợ điện công nghiệp',
        description: 'Lắp đặt, sửa chữa hệ thống điện công nghiệp',
        quantityNeeded: 5,
        category: {
          name: 'XÂY DỰNG',
          description: 'Các nghề liên quan đến xây dựng',
          occupation: { name: 'Thợ điện', description: 'Lắp đặt, sửa chữa hệ thống điện' },
        },
        workLocationType: 'ONSITE',
        workAddress: 'KCN Tân Bình, Quận Tân Phú, TP.HCM',
        workLatitude: 10.8013,
        workLongitude: 106.6268,
        salaryMin: 8000000,
        salaryMax: 15000000,
        applyBeforeDate: '10/12/2025 23:59:59',
        jobStartDate: '12/12/2025 08:00:00',
        jobEndDate: '12/12/2025 17:00:00',
        expiresAt: '31/12/2025 23:59:59',
        viewCount: 150,
        applicationCount: 12,
      },
      candidateJobPost: {
        id: 'CJP001',
        userId: 'CAN001',
        title: 'Tìm việc thợ điện',
        description: 'Có 5 năm kinh nghiệm làm thợ điện công nghiệp',
        workLocationType: 'ONSITE',
        workAddress: 'Quận Tân Phú, TP.HCM',
        category: {
          name: 'XÂY DỰNG',
          description: 'Các nghề liên quan đến xây dựng',
          occupation: { name: 'Thợ điện', description: 'Lắp đặt, sửa chữa hệ thống điện' },
        },
        workLatitude: 10.8013,
        workLongitude: 106.6268,
        workRadiusKm: 10,
        salaryMin: 8000000,
        salaryMax: 12000000,
        availableFrom: '01/12/2025 08:00:00',
        availableTo: '31/12/2025 17:00:00',
        expiresAt: '31/12/2025 23:59:59',
        status: 'APPROVED',
        viewCount: 50,
      },
      checkin: {
        id: 'ACT001',
        activityType: 'CHECKIN',
        longitude: 106.6268,
        latitude: 10.8013,
        candidateVerifyImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        images: [],
        actionTime: '12/12/2025 08:05:00',
      },
      checkout: {
        id: 'ACT002',
        activityType: 'CHECKOUT',
        longitude: 106.6268,
        latitude: 10.8013,
        candidateVerifyImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        images: [],
        actionTime: '12/12/2025 17:10:00',
      },
      workLocationType: 'ONSITE',
      workAddress: 'KCN Tân Bình, Quận Tân Phú, TP.HCM',
      workLatitude: 10.8013,
      workLongitude: 106.6268,
      agreedSalary: 500000,
      startTime: '12/12/2025 08:00:00',
      endTime: '12/12/2025 17:00:00',
      status: 'APPROVED',
      recruiterVerifyImageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200',
      candidateVerifyImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    },
  },
  {
    id: 'CP002-xyz-uvw-456',
    commitmentId: 'CM002-xyz-uvw-456',
    rejectReasonDetail:
      'Ứng viên không hoàn thành công việc theo yêu cầu. Chất lượng công việc kém, không đúng thỏa thuận ban đầu.',
    rejectEvidenceImages: [
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400',
    ],
    adminVerdict: null,
    viewUser: 'RECRUITER',
    createAt: '17/12/2025 09:15:00',
    commitment: {
      jobApplicationId: 'JA002',
      candidate: {
        fullName: 'Trần Thị Bình',
        gender: 'Nữ',
        dateOfBirth: '20/08/1998',
      },
      recruiter: {
        fullName: 'Nhà hàng Phở Hà Nội',
        gender: 'Nam',
        dateOfBirth: '15/06/1975',
      },
      recruiterJobPost: {
        id: 'RJP002',
        userId: 'REC002',
        title: 'Phụ bếp nhà hàng',
        description: 'Hỗ trợ đầu bếp, sơ chế nguyên liệu',
        quantityNeeded: 3,
        category: {
          name: 'DỊCH VỤ ĂN UỐNG',
          description: 'Các nghề trong lĩnh vực nhà hàng, quán ăn',
          occupation: { name: 'Phụ bếp', description: 'Hỗ trợ nấu ăn, sơ chế nguyên liệu' },
        },
        workLocationType: 'ONSITE',
        workAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM',
        workLatitude: 10.7744,
        workLongitude: 106.7025,
        salaryMin: 5000000,
        salaryMax: 7000000,
        applyBeforeDate: '15/12/2025 23:59:59',
        jobStartDate: '16/12/2025 06:00:00',
        jobEndDate: '16/12/2025 14:00:00',
        expiresAt: '31/12/2025 23:59:59',
        viewCount: 80,
        applicationCount: 8,
      },
      candidateJobPost: {
        id: 'CJP002',
        userId: 'CAN002',
        title: 'Tìm việc phụ bếp',
        description: 'Có kinh nghiệm 2 năm làm phụ bếp',
        workLocationType: 'ONSITE',
        workAddress: 'Quận 1, TP.HCM',
        category: {
          name: 'DỊCH VỤ ĂN UỐNG',
          description: 'Các nghề trong lĩnh vực nhà hàng, quán ăn',
          occupation: { name: 'Phụ bếp', description: 'Hỗ trợ nấu ăn, sơ chế nguyên liệu' },
        },
        workLatitude: 10.7744,
        workLongitude: 106.7025,
        workRadiusKm: 5,
        salaryMin: 5000000,
        salaryMax: 6000000,
        availableFrom: '01/12/2025 06:00:00',
        availableTo: '31/12/2025 14:00:00',
        expiresAt: '31/12/2025 23:59:59',
        status: 'APPROVED',
        viewCount: 30,
      },
      checkin: {
        id: 'ACT003',
        activityType: 'CHECKIN',
        longitude: 106.7025,
        latitude: 10.7744,
        candidateVerifyImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        images: [],
        actionTime: '16/12/2025 06:10:00',
      },
      workLocationType: 'ONSITE',
      workAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      workLatitude: 10.7744,
      workLongitude: 106.7025,
      agreedSalary: 250000,
      startTime: '16/12/2025 06:00:00',
      endTime: '16/12/2025 14:00:00',
      status: 'APPROVED',
      recruiterVerifyImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      candidateVerifyImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    },
  },
  {
    id: 'CP003-mno-pqr-789',
    commitmentId: 'CM003-mno-pqr-789',
    rejectReasonDetail:
      'Nhà tuyển dụng yêu cầu làm thêm giờ nhưng không trả thêm lương như đã thỏa thuận.',
    rejectEvidenceImages: [],
    adminVerdict: 'UPHOLD_CANDIDATE',
    viewUser: 'CANDIDATE',
    createAt: '15/12/2025 16:45:00',
    commitment: {
      jobApplicationId: 'JA003',
      candidate: {
        fullName: 'Lê Hoàng Cường',
        gender: 'Nam',
        dateOfBirth: '10/11/1992',
      },
      recruiter: {
        fullName: 'Công ty Giao hàng Nhanh',
        gender: 'Nam',
        dateOfBirth: '20/04/1985',
      },
      recruiterJobPost: {
        id: 'RJP003',
        userId: 'REC003',
        title: 'Shipper giao hàng',
        description: 'Giao hàng trong nội thành',
        quantityNeeded: 10,
        category: {
          name: 'VẬN TẢI - GIAO HÀNG',
          description: 'Các nghề vận chuyển, giao hàng',
          occupation: { name: 'Shipper', description: 'Giao hàng, giao đồ ăn' },
        },
        workLocationType: 'ONSITE',
        workAddress: 'Quận Cầu Giấy, Hà Nội',
        workLatitude: 21.0285,
        workLongitude: 105.7878,
        salaryMin: 300000,
        salaryMax: 500000,
        applyBeforeDate: '12/12/2025 23:59:59',
        jobStartDate: '13/12/2025 08:00:00',
        jobEndDate: '13/12/2025 20:00:00',
        expiresAt: '31/12/2025 23:59:59',
        viewCount: 200,
        applicationCount: 25,
      },
      candidateJobPost: {
        id: 'CJP003',
        userId: 'CAN003',
        title: 'Tìm việc shipper',
        description: 'Có xe máy riêng, quen đường Hà Nội',
        workLocationType: 'ONSITE',
        workAddress: 'Cầu Giấy, Hà Nội',
        category: {
          name: 'VẬN TẢI - GIAO HÀNG',
          description: 'Các nghề vận chuyển, giao hàng',
          occupation: { name: 'Shipper', description: 'Giao hàng, giao đồ ăn' },
        },
        workLatitude: 21.0285,
        workLongitude: 105.7878,
        workRadiusKm: 15,
        salaryMin: 300000,
        salaryMax: 400000,
        availableFrom: '01/12/2025 08:00:00',
        availableTo: '31/12/2025 20:00:00',
        expiresAt: '31/12/2025 23:59:59',
        status: 'APPROVED',
        viewCount: 40,
      },
      workLocationType: 'ONSITE',
      workAddress: 'Quận Cầu Giấy, Hà Nội',
      workLatitude: 21.0285,
      workLongitude: 105.7878,
      agreedSalary: 400000,
      startTime: '13/12/2025 08:00:00',
      endTime: '13/12/2025 20:00:00',
      status: 'APPROVED',
      recruiterVerifyImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      candidateVerifyImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    },
  },
  {
    id: 'CP004-ghi-jkl-012',
    commitmentId: 'CM004-ghi-jkl-012',
    rejectReasonDetail:
      'Ứng viên không đến làm việc đúng giờ, gây ảnh hưởng đến công việc của công ty.',
    rejectEvidenceImages: [
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400',
    ],
    adminVerdict: 'UPHOLD_RECRUITER',
    viewUser: 'RECRUITER',
    createAt: '14/12/2025 11:20:00',
    commitment: {
      jobApplicationId: 'JA004',
      candidate: {
        fullName: 'Phạm Thị Dung',
        gender: 'Nữ',
        dateOfBirth: '05/02/2000',
      },
      recruiter: {
        fullName: 'Freelancer Hub',
        gender: 'Nam',
        dateOfBirth: '12/09/1988',
      },
      recruiterJobPost: {
        id: 'RJP004',
        userId: 'REC004',
        title: 'Nhập liệu dữ liệu',
        description: 'Nhập liệu từ file scan sang Excel',
        quantityNeeded: 2,
        category: {
          name: 'VĂN PHÒNG',
          description: 'Các nghề văn phòng',
          occupation: { name: 'Nhập liệu', description: 'Nhập dữ liệu vào hệ thống' },
        },
        workLocationType: 'REMOTE',
        salaryMin: 4000000,
        salaryMax: 6000000,
        applyBeforeDate: '10/12/2025 23:59:59',
        jobStartDate: '11/12/2025 08:00:00',
        jobEndDate: '11/12/2025 17:00:00',
        expiresAt: '31/12/2025 23:59:59',
        viewCount: 100,
        applicationCount: 15,
      },
      candidateJobPost: {
        id: 'CJP004',
        userId: 'CAN004',
        title: 'Tìm việc nhập liệu online',
        description: 'Thành thạo Excel, làm việc cẩn thận',
        workLocationType: 'REMOTE',
        category: {
          name: 'VĂN PHÒNG',
          description: 'Các nghề văn phòng',
          occupation: { name: 'Nhập liệu', description: 'Nhập dữ liệu vào hệ thống' },
        },
        salaryMin: 4000000,
        salaryMax: 5000000,
        availableFrom: '01/12/2025 08:00:00',
        availableTo: '31/12/2025 17:00:00',
        expiresAt: '31/12/2025 23:59:59',
        status: 'APPROVED',
        viewCount: 25,
      },
      workLocationType: 'REMOTE',
      agreedSalary: 200000,
      startTime: '11/12/2025 08:00:00',
      endTime: '11/12/2025 17:00:00',
      status: 'APPROVED',
      recruiterVerifyImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      candidateVerifyImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    },
  },
  {
    id: 'CP005-stu-vwx-345',
    commitmentId: 'CM005-stu-vwx-345',
    rejectReasonDetail:
      'Công ty không cung cấp đầy đủ dụng cụ làm việc như đã cam kết. Tôi phải tự mua vật liệu.',
    rejectEvidenceImages: [
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400',
    ],
    adminVerdict: null,
    viewUser: 'CANDIDATE',
    createAt: '19/12/2025 08:00:00',
    commitment: {
      jobApplicationId: 'JA005',
      candidate: {
        fullName: 'Hoàng Văn Em',
        gender: 'Nam',
        dateOfBirth: '25/07/1990',
      },
      recruiter: {
        fullName: 'Công ty Xây dựng Hoàng Long',
        gender: 'Nam',
        dateOfBirth: '08/03/1970',
      },
      recruiterJobPost: {
        id: 'RJP005',
        userId: 'REC005',
        title: 'Thợ hồ xây dựng',
        description: 'Xây tường, trát tường, đổ bê tông',
        quantityNeeded: 8,
        category: {
          name: 'XÂY DỰNG',
          description: 'Các nghề liên quan đến xây dựng',
          occupation: { name: 'Thợ hồ', description: 'Xây tường, trát tường, đổ bê tông' },
        },
        workLocationType: 'ONSITE',
        workAddress: 'KCN Long Thành, Đồng Nai',
        workLatitude: 10.8562,
        workLongitude: 106.9508,
        salaryMin: 400000,
        salaryMax: 500000,
        applyBeforeDate: '17/12/2025 23:59:59',
        jobStartDate: '18/12/2025 07:00:00',
        jobEndDate: '18/12/2025 17:00:00',
        expiresAt: '31/12/2025 23:59:59',
        viewCount: 120,
        applicationCount: 18,
      },
      candidateJobPost: {
        id: 'CJP005',
        userId: 'CAN005',
        title: 'Tìm việc thợ hồ',
        description: 'Có 10 năm kinh nghiệm làm thợ hồ',
        workLocationType: 'ONSITE',
        workAddress: 'Đồng Nai',
        category: {
          name: 'XÂY DỰNG',
          description: 'Các nghề liên quan đến xây dựng',
          occupation: { name: 'Thợ hồ', description: 'Xây tường, trát tường, đổ bê tông' },
        },
        workLatitude: 10.8562,
        workLongitude: 106.9508,
        workRadiusKm: 20,
        salaryMin: 400000,
        salaryMax: 450000,
        availableFrom: '01/12/2025 07:00:00',
        availableTo: '31/12/2025 17:00:00',
        expiresAt: '31/12/2025 23:59:59',
        status: 'APPROVED',
        viewCount: 35,
      },
      checkin: {
        id: 'ACT005',
        activityType: 'CHECKIN',
        longitude: 106.9508,
        latitude: 10.8562,
        candidateVerifyImageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
        images: [],
        actionTime: '18/12/2025 07:05:00',
      },
      checkout: {
        id: 'ACT006',
        activityType: 'CHECKOUT',
        longitude: 106.9508,
        latitude: 10.8562,
        candidateVerifyImageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
        images: [],
        actionTime: '18/12/2025 17:15:00',
      },
      workLocationType: 'ONSITE',
      workAddress: 'KCN Long Thành, Đồng Nai',
      workLatitude: 10.8562,
      workLongitude: 106.9508,
      agreedSalary: 450000,
      startTime: '18/12/2025 07:00:00',
      endTime: '18/12/2025 17:00:00',
      status: 'APPROVED',
      recruiterVerifyImageUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200',
      candidateVerifyImageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
    },
  },
]

// Mock API function - Simulate server behavior
const mockGetComplaintsApi = (
  params?: ComplaintListParams
): Promise<{
  code: string
  data: {
    page: number
    maxSize: number
    totalElements: number
    totalPages: number
    data: Complaint[]
  }
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const page = params?.page ?? 1
      const maxSize = params?.maxSize ?? 10
      const status = params?.status

      // Filter data
      let filteredData = [...MOCK_COMPLAINTS]
      
      if (status !== undefined && status !== '') {
        filteredData = filteredData.filter((c) => c.adminVerdict === status)
      }

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

// Mock Update Verdict API
const mockUpdateComplaintVerdictApi = (
  data: { id: string; adminVerdict: 'UPHOLD_CANDIDATE' | 'UPHOLD_RECRUITER' }
): Promise<{ code: string; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const complaint = MOCK_COMPLAINTS.find((c) => c.id === data.id)
      if (complaint) {
        complaint.adminVerdict = data.adminVerdict
      }
      resolve({
        code: 'WORKLINK-000000',
        message: 'Phán quyết đã được cập nhật thành công',
      })
    }, 500)
  })
}
// ============================================
// END MOCK DATA
// ============================================

const DisputePage = () => {
  // Filter states
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<AdminVerdict | ''>('')
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })

  // Modal states
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isVerdictModalOpen, setIsVerdictModalOpen] = useState(false)

  // Debounce search text (500ms)
  const debouncedSearch = useDebouncedValue(searchText, 500)

  const queryClient = useQueryClient()

  // Query for fetching complaints
  const {
    data: queryData,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['complaints', pagination.current, pagination.pageSize, statusFilter, debouncedSearch],
    queryFn: async () => {
      // ============================================
      // API THẬT - Uncomment khi có API
      // ============================================
      // const response = await getComplaintsApi({
      //   page: pagination.current,
      //   maxSize: pagination.pageSize,
      //   status: statusFilter,
      // })
      // if (response.code !== 'WORKLINK-000000') {
      //   throw new Error('Failed to fetch complaints')
      // }
      // return response.data
      // ============================================

      // ============================================
      // MOCK DATA - Xóa khi có API thật
      // ============================================
      const response = await mockGetComplaintsApi({
        page: pagination.current,
        maxSize: pagination.pageSize,
        status: statusFilter,
      })
      if (response.code !== 'WORKLINK-000000') {
        throw new Error('Failed to fetch complaints')
      }
      return response.data
      // ============================================
    },
    placeholderData: (previousData) => previousData,
  })

  // Mutation for updating verdict
  const verdictMutation = useMutation({
    mutationFn: (data: { id: string; adminVerdict: 'UPHOLD_CANDIDATE' | 'UPHOLD_RECRUITER' }) => {
      // ============================================
      // API THẬT - Uncomment khi có API
      // ============================================
      // return updateComplaintVerdictApi(data)
      // ============================================

      // ============================================
      // MOCK DATA - Xóa khi có API thật
      // ============================================
      return mockUpdateComplaintVerdictApi(data)
      // ============================================
    },
    onSuccess: () => {
      message.success('Phán quyết đã được cập nhật thành công!')
      queryClient.invalidateQueries({ queryKey: ['complaints'] })
      setIsVerdictModalOpen(false)
      setSelectedComplaint(null)
    },
    onError: () => {
      message.error('Có lỗi xảy ra khi cập nhật phán quyết!')
    },
  })

  // Extracted data
  const complaints = queryData?.data ?? []
  const totalElements = queryData?.totalElements ?? 0

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleStatusChange = (value: AdminVerdict | '') => {
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

  const handleViewDetail = (record: Complaint) => {
    setSelectedComplaint(record)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedComplaint(null)
  }

  const handleOpenVerdictModal = (record: Complaint) => {
    setSelectedComplaint(record)
    setIsVerdictModalOpen(true)
  }

  const handleCloseVerdictModal = () => {
    setIsVerdictModalOpen(false)
    setSelectedComplaint(null)
  }

  const handleSubmitVerdict = (id: string, verdict: 'UPHOLD_CANDIDATE' | 'UPHOLD_RECRUITER') => {
    verdictMutation.mutate({ id, adminVerdict: verdict })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <PageHeader
        title="Quản lý khiếu nại"
        subtitle="Xem xét và phán quyết các khiếu nại từ nhà tuyển dụng và ứng viên"
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

      {/* Stats */}
      <DisputeStats complaints={MOCK_COMPLAINTS} />

      {/* Filters & Table */}
      <Card className="border-none! shadow-md!">
        <DisputeFilters
          searchText={searchText}
          statusFilter={statusFilter}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
        />
        <DisputeTable
          data={complaints}
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
      <DisputeDetailModal
        open={isDetailModalOpen}
        complaint={selectedComplaint}
        onClose={handleCloseDetailModal}
        onVerdict={handleOpenVerdictModal}
      />

      {/* Verdict Modal */}
      <DisputeVerdictModal
        open={isVerdictModalOpen}
        complaint={selectedComplaint}
        loading={verdictMutation.isPending}
        onClose={handleCloseVerdictModal}
        onSubmit={handleSubmitVerdict}
      />
    </div>
  )
}

export default DisputePage

