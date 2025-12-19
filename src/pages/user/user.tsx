// import { getCandidateListApi } from '@/apis'
import { PageHeader } from '@/components/common'
import {
  UserDetailModal,
  UserFilters,
  UserStats,
  UserTable,
} from '@/components/user'
import { useDebouncedValue } from '@/hooks/use-debounce'
import type { User, UserListParams } from '@/types/user'
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button, Card } from 'antd'
import type { TablePaginationConfig } from 'antd/es/table'
import { useState } from 'react'

// ============================================
// MOCK DATA - Xóa khi có API thật
// ============================================
const MOCK_USERS: User[] = [
  {
    userId: 'USR001',
    idCardNumber: '001095012345',
    frontIdCardImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
    fullName: 'Nguyễn Văn An',
    phoneNumber: '0909090909',
    gender: 'Nam',
    dateOfBirth: '15/03/1995',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Xã Tân Phú, Huyện Củ Chi, TP. Hồ Chí Minh',
    placeOfResidence: 'Quận 1, TP. Hồ Chí Minh',
    rating: 4.5,
  },
  {
    userId: 'USR002',
    idCardNumber: '001098023456',
    frontIdCardImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    fullName: 'Trần Thị Bình',
    phoneNumber: '0909090909',
    gender: 'Nữ',
    dateOfBirth: '22/08/1998',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Xã Đông Anh, Huyện Đông Anh, Hà Nội',
    placeOfResidence: 'Quận Hai Bà Trưng, Hà Nội',
    rating: 4.0,
  },
  {
    userId: 'USR003',
    idCardNumber: '048092034567',
    frontIdCardImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    fullName: 'Lê Hoàng Cường',
    phoneNumber: '0909090909',
    gender: 'Nam',
    dateOfBirth: '10/12/1992',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Phường Hải Châu 1, Quận Hải Châu, Đà Nẵng',
    placeOfResidence: 'Quận Hải Châu, Đà Nẵng',
    rating: 3.5,
  },
  {
    userId: 'USR004',
    idCardNumber: '092100045678',
    frontIdCardImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    fullName: 'Phạm Thị Dung',
    phoneNumber: '0909090909',
    gender: 'Nữ',
    dateOfBirth: '05/06/2000',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Xã Mỹ Khánh, Huyện Phong Điền, Cần Thơ',
    placeOfResidence: 'Quận Ninh Kiều, Cần Thơ',
    rating: 3.0,
  },
  {
    userId: 'USR005',
    idCardNumber: '075097056789',
    frontIdCardImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    fullName: 'Hoàng Văn Em',
    phoneNumber: '0909090909',
    gender: 'Nam',
    dateOfBirth: '28/01/1997',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Xã Long Bình, TP. Biên Hòa, Đồng Nai',
    placeOfResidence: 'Thành phố Biên Hòa, Đồng Nai',
    rating: 2.5,
  },
  {
    userId: 'USR006',
    idCardNumber: '048096067890',
    frontIdCardImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    fullName: 'Võ Thị Phương',
    phoneNumber: '0909090909',
    gender: 'Nữ',
    dateOfBirth: '14/09/1996',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Phường Thanh Khê Đông, Quận Thanh Khê, Đà Nẵng',
    placeOfResidence: 'Quận Thanh Khê, Đà Nẵng',
    rating: 2.0,
  },
  {
    userId: 'USR007',
    idCardNumber: '079094078901',
    frontIdCardImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    fullName: 'Đặng Minh Giang',
    phoneNumber: '0909090909',
    gender: 'Nam',
    dateOfBirth: '03/04/1994',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh',
    placeOfResidence: 'Quận Bình Thạnh, TP. Hồ Chí Minh',
    rating: 1.5,
  },
  {
    userId: 'USR008',
    idCardNumber: '001099089012',
    frontIdCardImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    fullName: 'Bùi Thị Hạnh',
    phoneNumber: '0909090909',
    gender: 'Nữ',
    dateOfBirth: '19/11/1999',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội',
    placeOfResidence: 'Quận Cầu Giấy, Hà Nội',
    rating: 1.0,
  },
  {
    userId: 'USR009',
    idCardNumber: '077093090123',
    frontIdCardImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    fullName: 'Ngô Đình Khang',
    phoneNumber: '0909090909',
    gender: 'Nam',
    dateOfBirth: '07/07/1993',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Phường 2, TP. Vũng Tàu, Bà Rịa - Vũng Tàu',
    placeOfResidence: 'Thành phố Vũng Tàu, Bà Rịa - Vũng Tàu',
    rating: 0.5,
  },
  {
    userId: 'USR010',
    idCardNumber: '079101101234',
    frontIdCardImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    fullName: 'Lý Thị Mai',
    phoneNumber: '0909090909',
    gender: 'Nữ',
    dateOfBirth: '25/02/2001',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Phường 4, Quận Gò Vấp, TP. Hồ Chí Minh',
    placeOfResidence: 'Quận Gò Vấp, TP. Hồ Chí Minh',
    rating: 0.0,
  },
  {
    userId: 'USR011',
    idCardNumber: '001096112345',
    frontIdCardImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    fullName: 'Trương Văn Nam',
    phoneNumber: '0909090909',
    gender: 'Nam',
    dateOfBirth: '12/10/1996',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Phường Thạch Bàn, Quận Long Biên, Hà Nội',
    placeOfResidence: 'Quận Long Biên, Hà Nội',
    rating: 0.0,
  },
  {
    userId: 'USR012',
    idCardNumber: '046098123456',
    frontIdCardImage: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400',
    fullName: 'Phan Thị Oanh',
    phoneNumber: '0909090909',
    gender: 'Nữ',
    dateOfBirth: '30/05/1998',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Phường Phú Hội, TP. Huế, Thừa Thiên Huế',
    placeOfResidence: 'Thành phố Huế, Thừa Thiên Huế',
    rating: 0.0,
  },
  {
    userId: 'USR013',
    idCardNumber: '079091134567',
    frontIdCardImage: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400',
    fullName: 'Đinh Công Phúc',
    phoneNumber: '0909090909',
    gender: 'Nam',
    dateOfBirth: '08/08/1991',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Phường Tân Phong, Quận 7, TP. Hồ Chí Minh',
    placeOfResidence: 'Quận 7, TP. Hồ Chí Minh',
    rating: 0.0,
  },
  {
    userId: 'USR014',
    idCardNumber: '048097145678',
    frontIdCardImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    fullName: 'Huỳnh Thị Quỳnh',
    phoneNumber: '0909090909',
    gender: 'Nữ',
    dateOfBirth: '16/03/1997',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Phường An Hải Bắc, Quận Sơn Trà, Đà Nẵng',
    placeOfResidence: 'Quận Sơn Trà, Đà Nẵng',
    rating: 0.0,
  },
  {
    userId: 'USR015',
    idCardNumber: '001095156789',
    frontIdCardImage: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400',
    backIdCardImage: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400',
    fullName: 'Vũ Đức Rạng',
    phoneNumber: '0909090909',
    gender: 'Nam',
    dateOfBirth: '21/12/1995',
    nationality: 'Việt Nam',
    placeOfOrigin: 'Phường Hoàng Văn Thụ, Quận Hoàng Mai, Hà Nội',
    placeOfResidence: 'Quận Hoàng Mai, Hà Nội',
    rating: 0.0,
  },
]

// Mock API function - Simulate server behavior
const mockGetUserListApi = (
  params?: UserListParams
): Promise<{
  code: string
  data: {
    page: number
    maxSize: number
    totalElement: number
    totalPages: number
    data: User[]
  }
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const page = params?.page ?? 1
      const maxSize = params?.maxSize ?? 10
      const search = params?.search?.toLowerCase() ?? ''
      const gender = params?.gender

      // Filter data
      const filteredData = MOCK_USERS.filter((user) => {
        const matchSearch =
          !search ||
          user.fullName.toLowerCase().includes(search) ||
          user.idCardNumber.toLowerCase().includes(search) ||
          user.placeOfResidence.toLowerCase().includes(search) ||
          user.placeOfOrigin.toLowerCase().includes(search)

        const matchGender = !gender || user.gender === gender

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

const UserList = () => {
  // Filter states
  const [searchText, setSearchText] = useState('')
  const [genderFilter, setGenderFilter] = useState<string | undefined>()
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })

  // Modal state
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Debounce search text (500ms)
  const debouncedSearch = useDebouncedValue(searchText, 500)

  const {
    data: queryData,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['users', pagination.current, pagination.pageSize, debouncedSearch, genderFilter],
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
      const response = await mockGetUserListApi({
        page: pagination.current,
        maxSize: pagination.pageSize,
        search: debouncedSearch,
        gender: genderFilter,
      })
      if (response.code !== 'WORKLINK_000000') {
        throw new Error('Failed to fetch users')
      }
      return response.data
      // ============================================
    },
    placeholderData: (previousData) => previousData,
  })

  // Extracted data
  const users = queryData?.data ?? []
  const totalElement = queryData?.totalElement ?? 0

  // Statistics
  const stats = {
    total: totalElement,
    male: users.filter((r) => r.gender === 'Nam').length,
    female: users.filter((r) => r.gender === 'Nữ').length,
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

  const handleViewDetail = (record: User) => {
    setSelectedUser(record)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <PageHeader
        title="Danh sách người dùng"
        subtitle="Quản lý thông tin người dùng đã đăng ký trên hệ thống"
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
      <UserStats total={stats.total} male={stats.male} female={stats.female} />

      {/* Filters & Table */}
      <Card className="border-none! shadow-md!">
        <UserFilters
          searchText={searchText}
          genderFilter={genderFilter}
          onSearchChange={handleSearchChange}
          onGenderChange={handleGenderChange}
        />
        <UserTable
          data={users}
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
      <UserDetailModal
        open={isModalOpen}
        user={selectedUser}
        onClose={handleCloseModal}
      />
    </div>
  )
}

export default UserList
