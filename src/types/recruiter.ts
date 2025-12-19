import type { ApiResponse } from './api-response'

export interface Recruiter {
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
  rating: number
}

export interface RecruiterListData {
  page: number
  maxSize: number
  totalElement: number
  totalPages: number
  data: Recruiter[]
}

export interface RecruiterListResponse extends ApiResponse<RecruiterListData> {
  data: RecruiterListData
}

export interface RecruiterListParams {
  page?: number
  maxSize?: number
  search?: string    // Tìm kiếm theo tên, ID, địa chỉ
  gender?: string    // Lọc theo giới tính: 'Nam' | 'Nữ'
}
