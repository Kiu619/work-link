import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '@/pages/auth/login'
import Dashboard from '@/pages/dashboard'
import { MainLayout } from '@/components/layout'
import { useAdminStore } from '@/store/admin'
import RecruitmentList from './pages/recruitment-list/RecruitmentList'
import CommitmentPage from './pages/connection/commitment'
import UserList from './pages/user/user'
import JobSeekingList from '@/pages/job-seeking-list/JobSeekingList'
import DisputePage from '@/pages/dispute/Dispute'

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

        {/* Người dùng */}
        <Route path="/nguoi-dung" element={<UserList />} />

        {/* Tin tức */}
        <Route path="/tin-tuyen-dung" element={<RecruitmentList />} />
        <Route path="/tin-tim-viec" element={<JobSeekingList />} />

        <Route path="/cam-ket-dien-tu" element={<CommitmentPage />} />

        <Route path="/tranh-chap" element={<DisputePage />} />

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
