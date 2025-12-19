import type { ApiResponse } from './api-response'

// Candidate (Người lao động)
export interface Candidate {
  userId: string
  fullName: string
  gender: string
  dateOfBirth: string
  location: string
  rating: number
}

// Candidate List Data
export interface CandidateListData {
  page: number
  maxSize: number
  totalElements: number
  totalPages: number
  data: Candidate[]
}

// Candidate List Response
export interface CandidateListResponse extends ApiResponse<CandidateListData> {
  data: CandidateListData
}

// Candidate List Params
export interface CandidateListParams {
  page?: number
  maxSize?: number
  search?: string
  gender?: string
}

