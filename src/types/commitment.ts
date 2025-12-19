import type { ApiResponse } from './api-response'

// Work Location Type
export type WorkLocationType = 'ONSITE' | 'REMOTE'

// Recruiter Info in Commitment
export interface CommitmentRecruiter {
  userId: string
  fullName: string
  idCardNumber: string
  frontIdCardImage: string
  faceImage: string         // Ảnh mặt nhà tuyển dụng
}

// Candidate Info in Commitment
export interface CommitmentCandidate {
  userId: string
  fullName: string
  idCardNumber: string
  frontIdCardImage: string
  faceImage: string         // Ảnh mặt người lao động
}

// Job Info in Commitment
export interface CommitmentJob {
  id: string
  title: string
  description: string
  salaryMin: number
  salaryMax: number
  workLocationType: WorkLocationType
  workAddress?: string      // Có nếu ONSITE
  workLatitude?: number     // Có nếu ONSITE
  workLongitude?: number    // Có nếu ONSITE
}

// Commitment
export interface Commitment {
  id: string                          // Mã cam kết
  recruiter: CommitmentRecruiter      // Thông tin nhà tuyển dụng
  candidate: CommitmentCandidate      // Thông tin người lao động
  job: CommitmentJob                  // Thông tin công việc
  recruiterNote?: string              // Ghi chú của nhà tuyển dụng
  recruiterSignedAt: string           // Thời gian ký của nhà tuyển dụng (dd/MM/yyyy HH:mm:ss)
  candidateSignedAt: string           // Thời gian ký của ứng viên (dd/MM/yyyy HH:mm:ss)
  createdAt: string                   // Thời gian tạo cam kết
}

// Commitment List Data
export interface CommitmentListData {
  page: number
  maxSize: number
  totalElements: number
  totalPages: number
  data: Commitment[]
}

// Commitment List Response
export interface CommitmentListResponse extends ApiResponse<CommitmentListData> {
  data: CommitmentListData
}

// Commitment List Params
export interface CommitmentListParams {
  page?: number
  maxSize?: number
  search?: string
}

