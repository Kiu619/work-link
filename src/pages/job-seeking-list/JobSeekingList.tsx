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
import type { CandidateJobPost, JobPostStatus } from '@/types/job-post'
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Card, message } from 'antd'
import type { TablePaginationConfig } from 'antd/es/table'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { getCandidateJobPostsApi, updateJobPostStatusApi } from '@/apis'

const JobSeekingList = () => {
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
      const response = await getCandidateJobPostsApi({
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
    mutationFn: updateJobPostStatusApi,
    // ============================================
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

export default JobSeekingList
