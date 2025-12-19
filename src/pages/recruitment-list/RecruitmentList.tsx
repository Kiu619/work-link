import { getRecruiterJobPostsApi, updateRecruitmentStatusApi } from '@/apis'

import { PageHeader } from '@/components/common'
import {
  RecruitmentDetailModal,
  RecruitmentFilters,
  RecruitmentRejectModal,
  RecruitmentStats,
  RecruitmentTable,
} from '@/components/recruitment'
import { useDebouncedValue } from '@/hooks/use-debounce'
import type { RecruiterJobPost, RecruitmentStatus } from '@/types/recruitment'
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Card, message } from 'antd'
import type { TablePaginationConfig } from 'antd/es/table'
import { useState } from 'react'

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
      const response = await getRecruiterJobPostsApi({
        page: pagination.current,
        maxSize: pagination.pageSize,
        search: debouncedSearch,
        status: statusFilter || undefined,
      })
      if (response.code !== 'WORKLINK-000000') {
        throw new Error('Failed to fetch recruitment posts')
      }
      return response.data
    },
    placeholderData: (previousData) => previousData,
  })

  // Mutation for updating recruitment status
  const updateStatusMutation = useMutation({
    mutationFn: updateRecruitmentStatusApi,
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

