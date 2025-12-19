import type { ApiResponse } from './api-response'

// Occupation - Ngành nghề cụ thể
export interface Occupation {
  name: string
  description: string
}

// Category - Nhóm ngành lớn
export interface Category {
  name: string
  description: string
  occupation: Occupation
}

// Recruiter Owner - Chủ sở hữu bài đăng
export interface RecruiterOwner {
  userId: string
  fullName: string
  gender: string
  dateOfBirth: string // dd/MM/yyyy
}

// Evaluation - Đánh giá từ AI
export interface Evaluation {
  detectedRole: string        // người tìm việc, nhà tuyển dụng, không xác định
  isViolation: boolean        // Có vi phạm không
  violationType: string       // Loại vi phạm
  severityLevel: string       // Mức độ nghiêm trọng
  confidenceScore: number     // Độ tin cậy (0 -> 1)
  detectedIssues: string[]    // Danh sách vấn đề phát hiện
  reason: string              // Lý do chi tiết
  suggestedAction: string     // Hành động gợi ý
}

// Recruitment Status
export type RecruitmentStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

// Work Location Type
export type WorkLocationType = 'ONSITE' | 'REMOTE'

// RecruiterJobPost - Tin tuyển dụng
export interface RecruiterJobPost {
  id: string
  userId: string
  title: string
  description: string
  quantityNeeded: number          // Số lượng cần tuyển
  category: Category
  evaluation?: Evaluation | null
  workLocationType: WorkLocationType
  owner: RecruiterOwner
  workAddress?: string            // Có nếu ONSITE
  workLatitude?: number           // Có nếu ONSITE
  workLongitude?: number          // Có nếu ONSITE
  salaryMin: number
  salaryMax: number
  applyBeforeDate: string         // Thời gian nhận đơn (dd/MM/yyyy HH:mm:ss)
  jobStartDate: string            // Thời gian bắt đầu (dd/MM/yyyy HH:mm:ss)
  jobEndDate: string              // Thời gian kết thúc (dd/MM/yyyy HH:mm:ss)
  expiresAt: string               // Hết hạn (dd/MM/yyyy HH:mm:ss)
  status: RecruitmentStatus
  fraudReason?: string | null     // Lý do AI đánh giá không hợp lệ
  rejectionReason?: string | null // Lý do admin reject
  viewCount: number
  applicationCount: number        // Số lượng ứng tuyển
}

// Recruitment List Data
export interface RecruitmentListData {
  page: number
  maxSize: number
  totalElements: number
  totalPages: number
  data: RecruiterJobPost[]
}

// Recruitment List Response
export interface RecruitmentListResponse extends ApiResponse<RecruitmentListData> {
  data: RecruitmentListData
}

// Recruitment List Params
export interface RecruitmentListParams {
  page?: number
  maxSize?: number
  status?: RecruitmentStatus | ''
  search?: string
}

// Update Recruitment Status Request
export interface UpdateRecruitmentStatusRequest {
  id: string
  status: RecruitmentStatus
  rejectionReason?: string
}

// Update Recruitment Status Response
export interface UpdateRecruitmentStatusResponse {
  code: string
  type: string
  message: string
  data: null | object
}

