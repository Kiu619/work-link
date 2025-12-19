import type { LoginResponse, LogoutResponse } from '@/types/admin'
import type { CandidateListParams, CandidateListResponse } from '@/types/candidate'
import type { JobPostListParams, JobPostListResponse, UpdateJobPostStatusRequest, UpdateJobPostStatusResponse } from '@/types/job-post'
import type { RecruitmentListParams, RecruitmentListResponse, UpdateRecruitmentStatusRequest, UpdateRecruitmentStatusResponse } from '@/types/recruitment'
import type { CommitmentListParams, CommitmentListResponse } from '@/types/commitment'
import authorizedAxiosInstance from '@/utils/authorizedAxios'

const loginApi = async (phoneNumber: string, password: string): Promise<LoginResponse> => {
  const response = await authorizedAxiosInstance.post<LoginResponse>(
    '/authentication-service/v1/auth/login', 
    { phoneNumber, password }
  )
  return response.data
}

const logoutApi = async (): Promise<LogoutResponse> => {
  const response = await authorizedAxiosInstance.post<LogoutResponse>(
    '/authentication-service/v1/auth/logout'
  )
  return response.data
}

const getCandidateListApi = async (params?: CandidateListParams): Promise<CandidateListResponse> => {
  const response = await authorizedAxiosInstance.get<CandidateListResponse>(
    '/government-service/v1/candidates',
    {
      params: {
        page: params?.page ?? 1,
        maxSize: params?.maxSize ?? 20,
        search: params?.search || undefined,   // Tìm kiếm
        gender: params?.gender || undefined,   // Lọc giới tính
      }
    }
  )
  return response.data
}

const getCandidateJobPostsApi = async (params?: JobPostListParams): Promise<JobPostListResponse> => {
  const response = await authorizedAxiosInstance.get<JobPostListResponse>(
    '/government-service/v1/candidates/job-posts',
    {
      params: {
        page: params?.page ?? 1,
        maxSize: params?.maxSize ?? 20,
        status: params?.status || undefined,
        search: params?.search || undefined,
      }
    }
  )
  return response.data
}

const updateJobPostStatusApi = async (data: UpdateJobPostStatusRequest): Promise<UpdateJobPostStatusResponse> => {
  const response = await authorizedAxiosInstance.put<UpdateJobPostStatusResponse>(
    '/government-service/v1/candidates/update-status',
    data
  )
  return response.data
}

// Recruiter Job Posts APIs
const getRecruiterJobPostsApi = async (params?: RecruitmentListParams): Promise<RecruitmentListResponse> => {
  const response = await authorizedAxiosInstance.get<RecruitmentListResponse>(
    '/government-service/v1/recruiters/job-posts',
    {
      params: {
        page: params?.page ?? 1,
        maxSize: params?.maxSize ?? 20,
        status: params?.status || undefined,
        search: params?.search || undefined,
      }
    }
  )
  return response.data
}

const updateRecruitmentStatusApi = async (data: UpdateRecruitmentStatusRequest): Promise<UpdateRecruitmentStatusResponse> => {
  const response = await authorizedAxiosInstance.put<UpdateRecruitmentStatusResponse>(
    '/government-service/v1/recruiters/update-status',
    data
  )
  return response.data
}

// Commitment APIs
const getCommitmentsApi = async (params?: CommitmentListParams): Promise<CommitmentListResponse> => {
  const response = await authorizedAxiosInstance.get<CommitmentListResponse>(
    '/government-service/v1/commitments',
    {
      params: {
        page: params?.page ?? 1,
        maxSize: params?.maxSize ?? 20,
        search: params?.search || undefined,
      }
    }
  )
  return response.data
}

export { 
  loginApi, 
  logoutApi, 
  getCandidateListApi, 
  getCandidateJobPostsApi, 
  updateJobPostStatusApi,
  getRecruiterJobPostsApi,
  updateRecruitmentStatusApi,
  getCommitmentsApi
}
