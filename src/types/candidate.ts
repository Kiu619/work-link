import type { ApiResponse } from './api-response'

export interface Candidate {
  userId: string
  idCardNumber: string
  frontIdCardImage: string
  backIdCardImage: string
  fullName: string
  gender: string
  dateOfBirth: string
  nationality: string
  placeOfOrigin: string
  placeOfResidence: string
}

export interface CandidateListData {
  page: number
  maxSize: number
  totalElement: number
  totalPages: number
  data: Candidate[]
}

export interface CandidateListResponse extends ApiResponse<CandidateListData> {
  data: CandidateListData
}

export interface CandidateListParams {
  page?: number
  maxSize?: number
  search?: string    // Tìm kiếm theo tên, ID, địa chỉ
  gender?: string    // Lọc theo giới tính: 'Nam' | 'Nữ'
}
