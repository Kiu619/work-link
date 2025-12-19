import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '@/pages/auth/login'
import Dashboard from '@/pages/dashboard'
import CandidateList from '@/pages/candidate/candidate-list'
import JobSeekerList from '@/pages/candidate/job-seeker-list'
import { MainLayout } from '@/components/layout'
import { useAdminStore } from '@/store/admin'
import RecruiterList from './pages/recruiter/recruiter-list'
import RecruitmentList from './pages/recruiter/recruitment-list'
import CommitmentPage from './pages/connection/commitment'

// Protected Route - Yêu cầu đăng nhập, sử dụng MainLayout (Sidebar + Header)
const PrivateRoute = () => {
  // const isAuthenticated = useAdminStore((state) => state.isAuthenticated)

  // if (!isAuthenticated()) {
  //   return <Navigate to="/login" replace={true} />
  // }
  return <MainLayout />
}

// Public Route - Redirect nếu đã đăng nhập
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated)

  if (isAuthenticated()) {
    return <Navigate to="/" replace={true} />
  }
  return <>{children}</>
}

function App() {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Người lao động */}
        <Route path="/candidate-list" element={<CandidateList />} />
        <Route path="/job-seeker-list" element={<JobSeekerList />} />

        {/* Nhà tuyển dụng */}
        <Route path="/recruiter-list" element={<RecruiterList />} />
        <Route path="/recruitment-list" element={<RecruitmentList />} />

        {/* Kết nối */}
        <Route path="/successful-connections" element={<Dashboard />} />
        <Route path="/e-commitments" element={<CommitmentPage />} />

        {/* Xét duyệt */}
        <Route path="/suspicious-posts" element={<Dashboard />} />
        <Route path="/disputes" element={<Dashboard />} />

        {/* Thống kê */}
        <Route path="/labor-distribution" element={<Dashboard />} />
        <Route path="/job-shortage" element={<Dashboard />} />

        {/* Khác */}
        <Route path="/reports" element={<Dashboard />} />
        <Route path="/settings" element={<Dashboard />} />
      </Route>

      {/* Public Routes - Không có Sidebar + Header */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* 404 - Redirect về trang chủ */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
