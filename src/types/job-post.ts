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

// Candidate Owner - Chủ sở hữu bài đăng
export interface CandidateOwner {
  fullName: string
  gender: string
  dateOfBirth: string // dd/MM/yyyy
}

// Evaluation - Đánh giá từ AI
export interface Evaluation {
  detectedRole: string      // người tìm việc, nhà tuyển dụng, không xác định
  isViolation: boolean      // Có vi phạm không
  violationType: string     // Loại vi phạm
  severityLevel: string     // Mức độ nghiêm trọng
  confidenceScore: number   // Độ tin cậy (0 -> 1)
  detectedIssues: string[]  // Danh sách vấn đề phát hiện
  reason: string            // Lý do chi tiết
  suggestedAction: string   // Hành động gợi ý
}

// Job Post Status
export type JobPostStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

// Work Location Type
export type WorkLocationType = 'ONSITE' | 'REMOTE'

// CandidateJobPost - Tin tìm việc
export interface CandidateJobPost {
  id: string
  userId: string
  title: string
  description: string
  workLocationType: WorkLocationType
  workAddress?: string        // Có nếu ONSITE
  category: Category
  owner: CandidateOwner
  evaluation?: Evaluation
  workLatitude?: number       // Có nếu ONSITE
  workLongitude?: number      // Có nếu ONSITE
  workRadiusKm?: number       // Có nếu ONSITE
  salaryMin: number
  salaryMax: number
  availableFrom: string       // dd/MM/yyyy HH:mm:ss
  availableTo: string         // dd/MM/yyyy HH:mm:ss
  expiresAt: string           // dd/MM/yyyy HH:mm:ss
  status: JobPostStatus
  fraudReason?: string        // Lý do AI đánh giá không hợp lệ
  rejectionReason?: string    // Lý do admin reject
  viewCount: number
}

// Job Post List Data
export interface JobPostListData {
  page: number
  maxSize: number
  totalElements: number  // API trả về totalElements (có s)
  totalPages: number
  data: CandidateJobPost[]
}

// Job Post List Response
export interface JobPostListResponse extends ApiResponse<JobPostListData> {
  data: JobPostListData
}

// Job Post List Params
export interface JobPostListParams {
  page?: number
  maxSize?: number
  status?: JobPostStatus | ''  // Lọc theo trạng thái
  search?: string              // Tìm kiếm
}

// Update Job Post Status Request
export interface UpdateJobPostStatusRequest {
  id: string                    // ID tin tìm việc
  status: JobPostStatus         // Trạng thái mới
  rejectionReason?: string      // Lý do từ chối (bắt buộc nếu status = REJECTED)
}

// Update Job Post Status Response
export interface UpdateJobPostStatusResponse {
  code: string
  type: string
  message: string
  data: null | object
}

