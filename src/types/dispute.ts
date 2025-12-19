import type { ApiResponse } from './api-response'

// Category
export interface Category {
  name: string
  description: string
  occupation: Occupation
}

// Occupation
export interface Occupation {
  name: string
  description: string
}

// User trong Commitment
export interface DisputeUser {
  fullName: string
  gender: string
  dateOfBirth: string
}

// Activity - Checkin/Checkout
export interface Activity {
  id: string
  activityType: string
  longitude: number
  latitude: number
  candidateVerifyImageUrl: string
  images: string[]
  actionTime: string
}

// RecruiterJobPost trong Dispute
export interface DisputeRecruiterJobPost {
  id: string
  userId: string
  title: string
  description: string
  quantityNeeded: number
  category: Category
  workLocationType: 'ONSITE' | 'REMOTE'
  workAddress?: string
  workLatitude?: number
  workLongitude?: number
  salaryMin: number
  salaryMax: number
  applyBeforeDate: string
  jobStartDate: string
  jobEndDate: string
  expiresAt: string
  fraudReason?: string
  rejectionReason?: string
  viewCount: number
  applicationCount: number
}

// CandidateJobPost trong Dispute
export interface DisputeCandidateJobPost {
  id: string
  userId: string
  title: string
  description: string
  workLocationType: 'ONSITE' | 'REMOTE'
  workAddress?: string
  category: Category
  workLatitude?: number
  workLongitude?: number
  workRadiusKm?: number
  salaryMin: number
  salaryMax: number
  availableFrom: string
  availableTo: string
  expiresAt: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  fraudReason?: string
  rejectionReason?: string
  viewCount: number
}

// Commitment Status
export type CommitmentStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

// Commitment trong Dispute
export interface DisputeCommitment {
  jobApplicationId: string
  candidate: DisputeUser
  recruiter: DisputeUser
  recruiterJobPost: DisputeRecruiterJobPost
  candidateJobPost: DisputeCandidateJobPost
  checkin?: Activity
  checkout?: Activity
  workLocationType: 'ONSITE' | 'REMOTE'
  workAddress?: string
  workLatitude?: number
  workLongitude?: number
  agreedSalary: number
  startTime: string
  endTime: string
  status: CommitmentStatus
  recruiterVerifyImageUrl?: string
  candidateVerifyImageUrl?: string
  note?: string
}

// Admin Verdict
export type AdminVerdict = 'UPHOLD_CANDIDATE' | 'UPHOLD_RECRUITER' | null

// View User
export type ViewUser = 'CANDIDATE' | 'RECRUITER'

// Complaint (Khiếu nại)
export interface Complaint {
  id: string
  commitmentId: string
  rejectReasonDetail: string
  rejectEvidenceImages: string[]
  adminVerdict: AdminVerdict
  commitment: DisputeCommitment
  viewUser: ViewUser
  createAt: string
}

// Complaint List Data
export interface ComplaintListData {
  page: number
  maxSize: number
  totalElements: number
  totalPages: number
  data: Complaint[]
}

// Complaint List Response
export interface ComplaintListResponse extends ApiResponse<ComplaintListData> {
  data: ComplaintListData
}

// Complaint List Params
export interface ComplaintListParams {
  page?: number
  maxSize?: number
  status?: AdminVerdict | ''
}

// Update Complaint Verdict Request
export interface UpdateComplaintVerdictRequest {
  id: string
  adminVerdict: 'UPHOLD_CANDIDATE' | 'UPHOLD_RECRUITER'
}

// Update Complaint Verdict Response
export interface UpdateComplaintVerdictResponse extends ApiResponse<null> {
  data: null
}

