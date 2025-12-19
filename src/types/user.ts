import type { ApiResponse } from './api-response'

export interface User {
  userId: string
  idCardNumber: string
  frontIdCardImage: string
  backIdCardImage: string
  fullName: string
  phoneNumber: string
  gender: string
  dateOfBirth: string
  nationality: string
  placeOfOrigin: string
  placeOfResidence: string
  rating: number
}

export interface UserListData {
  page: number
  maxSize: number
  totalElement: number
  totalPages: number
  data: User[]
}

export interface UserListResponse extends ApiResponse<UserListData> {
  data: UserListData
}

export interface UserListParams {
  page?: number
  maxSize?: number
  search?: string    // Tìm kiếm theo tên, ID, địa chỉ
  gender?: string    // Lọc theo giới tính: 'Nam' | 'Nữ'
}
