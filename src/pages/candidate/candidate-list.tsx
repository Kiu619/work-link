// import { getCandidateListApi } from '@/apis'
import { PageHeader } from '@/components/common'
import {
  CandidateDetailModal,
  CandidateFilters,
  CandidateStats,
  CandidateTable,
} from '@/components/candidate'
import { useDebouncedValue } from '@/hooks/use-debounce'
import type { Candidate, CandidateListParams } from '@/types/candidate'
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Card } from 'antd'
import type { TablePaginationConfig } from 'antd/es/table'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

// ============================================
// MOCK DATA - Xóa khi có API thật
// ============================================
const MOCK_CANDIDATES: Candidate[] = [
  {
    userId: 'USR001',
    idCardNumber: '001095012345',
    frontIdCardImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
    fullName: 'Nguyễn Văn An',
    gender: 'Nam',
    dateOfBirth: '15/03/1995',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Xã Tân Phú, Huyện Củ Chi, TP. Hồ Chí Minh',
    placeOfResidence: 'Quận 1, TP. Hồ Chí Minh',
  },
  {
    userId: 'USR002',
    idCardNumber: '001098023456',
    frontIdCardImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    fullName: 'Trần Thị Bình',
    gender: 'Nữ',
    dateOfBirth: '22/08/1998',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Xã Đông Anh, Huyện Đông Anh, Hà Nội',
    placeOfResidence: 'Quận Hai Bà Trưng, Hà Nội',
  },
  {
    userId: 'USR003',
    idCardNumber: '048092034567',
    frontIdCardImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    fullName: 'Lê Hoàng Cường',
    gender: 'Nam',
    dateOfBirth: '10/12/1992',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Phường Hải Châu 1, Quận Hải Châu, Đà Nẵng',
    placeOfResidence: 'Quận Hải Châu, Đà Nẵng',
  },
  {
    userId: 'USR004',
    idCardNumber: '092100045678',
    frontIdCardImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    fullName: 'Phạm Thị Dung',
    gender: 'Nữ',
    dateOfBirth: '05/06/2000',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Xã Mỹ Khánh, Huyện Phong Điền, Cần Thơ',
    placeOfResidence: 'Quận Ninh Kiều, Cần Thơ',
  },
  {
    userId: 'USR005',
    idCardNumber: '075097056789',
    frontIdCardImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    fullName: 'Hoàng Văn Em',
    gender: 'Nam',
    dateOfBirth: '28/01/1997',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Xã Long Bình, TP. Biên Hòa, Đồng Nai',
    placeOfResidence: 'Thành phố Biên Hòa, Đồng Nai',
  },
  {
    userId: 'USR006',
    idCardNumber: '048096067890',
    frontIdCardImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    fullName: 'Võ Thị Phương',
    gender: 'Nữ',
    dateOfBirth: '14/09/1996',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Phường Thanh Khê Đông, Quận Thanh Khê, Đà Nẵng',
    placeOfResidence: 'Quận Thanh Khê, Đà Nẵng',
  },
  {
    userId: 'USR007',
    idCardNumber: '079094078901',
    frontIdCardImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    fullName: 'Đặng Minh Giang',
    gender: 'Nam',
    dateOfBirth: '03/04/1994',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh',
    placeOfResidence: 'Quận Bình Thạnh, TP. Hồ Chí Minh',
  },
  {
    userId: 'USR008',
    idCardNumber: '001099089012',
    frontIdCardImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    fullName: 'Bùi Thị Hạnh',
    gender: 'Nữ',
    dateOfBirth: '19/11/1999',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội',
    placeOfResidence: 'Quận Cầu Giấy, Hà Nội',
  },
  {
    userId: 'USR009',
    idCardNumber: '077093090123',
    frontIdCardImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    fullName: 'Ngô Đình Khang',
    gender: 'Nam',
    dateOfBirth: '07/07/1993',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Phường 2, TP. Vũng Tàu, Bà Rịa - Vũng Tàu',
    placeOfResidence: 'Thành phố Vũng Tàu, Bà Rịa - Vũng Tàu',
  },
  {
    userId: 'USR010',
    idCardNumber: '079101101234',
    frontIdCardImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    fullName: 'Lý Thị Mai',
    gender: 'Nữ',
    dateOfBirth: '25/02/2001',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Phường 4, Quận Gò Vấp, TP. Hồ Chí Minh',
    placeOfResidence: 'Quận Gò Vấp, TP. Hồ Chí Minh',
  },
  {
    userId: 'USR011',
    idCardNumber: '001096112345',
    frontIdCardImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    fullName: 'Trương Văn Nam',
    gender: 'Nam',
    dateOfBirth: '12/10/1996',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Phường Thạch Bàn, Quận Long Biên, Hà Nội',
    placeOfResidence: 'Quận Long Biên, Hà Nội',
  },
  {
    userId: 'USR012',
    idCardNumber: '046098123456',
    frontIdCardImage: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400',
    fullName: 'Phan Thị Oanh',
    gender: 'Nữ',
    dateOfBirth: '30/05/1998',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Phường Phú Hội, TP. Huế, Thừa Thiên Huế',
    placeOfResidence: 'Thành phố Huế, Thừa Thiên Huế',
  },
  {
    userId: 'USR013',
    idCardNumber: '079091134567',
    frontIdCardImage: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400',
    fullName: 'Đinh Công Phúc',
    gender: 'Nam',
    dateOfBirth: '08/08/1991',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Phường Tân Phong, Quận 7, TP. Hồ Chí Minh',
    placeOfResidence: 'Quận 7, TP. Hồ Chí Minh',
  },
  {
    userId: 'USR014',
    idCardNumber: '048097145678',
    frontIdCardImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    fullName: 'Huỳnh Thị Quỳnh',
    gender: 'Nữ',
    dateOfBirth: '16/03/1997',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Phường An Hải Bắc, Quận Sơn Trà, Đà Nẵng',
    placeOfResidence: 'Quận Sơn Trà, Đà Nẵng',
  },
  {
    userId: 'USR015',
    idCardNumber: '001095156789',
    frontIdCardImage: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400',
    fullName: 'Vũ Đức Rạng',
    gender: 'Nam',
    dateOfBirth: '21/12/1995',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Phường Hoàng Văn Thụ, Quận Hoàng Mai, Hà Nội',
    placeOfResidence: 'Quận Hoàng Mai, Hà Nội',
  },
]

// Mock API function - Simulate server behavior
const mockGetCandidateListApi = (
  params?: CandidateListParams
): Promise<{
  code: string
  data: {
    page: number
    maxSize: number
    totalElement: number
    totalPages: number
    data: Candidate[]
  }
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const page = params?.page ?? 1
      const maxSize = params?.maxSize ?? 10
      const search = params?.search?.toLowerCase() ?? ''
      const gender = params?.gender

      // Filter data
      const filteredData = MOCK_CANDIDATES.filter((candidate) => {
        const matchSearch =
          !search ||
          candidate.fullName.toLowerCase().includes(search) ||
          candidate.idCardNumber.toLowerCase().includes(search) ||
          candidate.placeOfResidence.toLowerCase().includes(search) ||
          candidate.placeOfOrigin.toLowerCase().includes(search)

        const matchGender = !gender || candidate.gender === gender

        return matchSearch && matchGender
      })

      // Pagination
      const totalElement = filteredData.length
      const totalPages = Math.ceil(totalElement / maxSize)
      const startIndex = (page - 1) * maxSize
      const paginatedData = filteredData.slice(startIndex, startIndex + maxSize)

      resolve({
        code: 'WORKLINK_000000',
        data: {
          page,
          maxSize,
          totalElement,
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

const CandidateList = () => {
  // Filter states
  const [searchText, setSearchText] = useState('')
  const [genderFilter, setGenderFilter] = useState<string | undefined>()
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })

  // Modal state
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Debounce search text (500ms)
  const debouncedSearch = useDebouncedValue(searchText, 500)

  const {
    data: queryData,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['candidates', pagination.current, pagination.pageSize, debouncedSearch, genderFilter],
    queryFn: async () => {
      // ============================================
      // API THẬT - Uncomment khi có API
      // ============================================
      // const response = await getCandidateListApi({
      //   page: pagination.current,
      //   maxSize: pagination.pageSize,
      //   search: debouncedSearch,
      //   gender: genderFilter,
      // })
      // if (response.code !== 'WORKLINK_000000') {
      //   throw new Error('Failed to fetch candidates')
      // }
      // return response.data
      // ============================================

      // ============================================
      // MOCK DATA - Xóa khi có API thật
      // ============================================
      const response = await mockGetCandidateListApi({
        page: pagination.current,
        maxSize: pagination.pageSize,
        search: debouncedSearch,
        gender: genderFilter,
      })
      if (response.code !== 'WORKLINK_000000') {
        throw new Error('Failed to fetch candidates')
      }
      return response.data
      // ============================================
    },
    placeholderData: (previousData) => previousData,
  })

  // Extracted data
  const candidates = queryData?.data ?? []
  const totalElement = queryData?.totalElement ?? 0

  // Statistics
  const stats = {
    total: totalElement,
    male: candidates.filter((c) => c.gender === 'Nam').length,
    female: candidates.filter((c) => c.gender === 'Nữ').length,
  }

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleGenderChange = (value: string | undefined) => {
    setGenderFilter(value)
    setPagination((prev) => ({ ...prev, current: 1 }))
  }

  const handleTableChange = (paginationConfig: TablePaginationConfig) => {
    setPagination({
      current: paginationConfig.current ?? 1,
      pageSize: paginationConfig.pageSize ?? 10,
    })
  }

  const handleRefresh = () => refetch()

  const handleViewDetail = (record: Candidate) => {
    setSelectedCandidate(record)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCandidate(null)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <PageHeader
        title="Danh sách người lao động"
        subtitle="Quản lý thông tin người lao động đã đăng ký trên hệ thống"
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
      <CandidateStats total={stats.total} male={stats.male} female={stats.female} />

      {/* Filters & Table */}
      <Card className="border-none! shadow-md!">
        <CandidateFilters
          searchText={searchText}
          genderFilter={genderFilter}
          onSearchChange={handleSearchChange}
          onGenderChange={handleGenderChange}
        />
        <CandidateTable
          data={candidates}
          loading={isFetching}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: totalElement,
          }}
          onTableChange={handleTableChange}
          onViewDetail={handleViewDetail}
        />
      </Card>

      {/* Detail Modal */}
      <CandidateDetailModal
        open={isModalOpen}
        candidate={selectedCandidate}
        onClose={handleCloseModal}
      />
    </div>
  )
}

export default CandidateList
