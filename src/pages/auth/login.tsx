import { Form, Input, Button, message } from 'antd'
import { PhoneOutlined, LockOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { loginApi } from '@/apis'
import { useAdminStore } from '@/store/admin'
import type { ApiResponse } from '@/types/api-response'
interface LoginForm {
  phoneNumber: string
  password: string
}

const Login = () => {
  const navigate = useNavigate()
  const setUser = useAdminStore((state) => state.setUser)
  const [form] = Form.useForm()

  const loginMutation = useMutation({
    mutationFn: ({ phoneNumber, password }: LoginForm) => loginApi(phoneNumber, password),
    onSuccess: (response, variables) => {
      if (response.code === 'WORKLINK-000000' && response.data) {
        message.success('Đăng nhập thành công!')
        setUser(response.data, variables.phoneNumber)
        
        // Lưu token vào localStorage để sử dụng cho các API call tiếp theo
        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('refreshToken', response.data.refreshToken)
        
        navigate('/')
      } else {
        message.error(response.message || 'Đăng nhập thất bại!')
      }
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: ApiResponse } }
      const errorMessage = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!'
      message.error(errorMessage)
    },
  })

  const onFinish = (values: LoginForm) => {
    loginMutation.mutate({
      phoneNumber: values.phoneNumber,
      password: values.password,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 via-yellow-50 to-red-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Login Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/logo.png"
              alt="Logo Bộ Lao động Thương binh Xã hội"
              className="w-32 h-32 object-contain drop-shadow-lg"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            HỆ THỐNG QUẢN TRỊ
          </h1>
          <p className="text-gray-600 font-medium">
            Bộ Lao động - Thương binh và Xã hội
          </p>
          <div className="w-20 h-1 bg-linear-to-r from-red-500 to-yellow-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Login Form */}
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="phoneNumber"
            label={<span className="text-gray-700 font-medium">Số điện thoại</span>}
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập số điện thoại!',
              },
              {
                pattern: /^[0-9]{10,11}$/,
                message: 'Số điện thoại phải có 10-11 chữ số!',
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined className="text-gray-400" />}
              placeholder="Nhập số điện thoại"
              className="rounded-lg"
              maxLength={11}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span className="text-gray-700 font-medium">Mật khẩu</span>}
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!',
              },
              {
                min: 6,
                message: 'Mật khẩu phải có ít nhất 6 ký tự!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập mật khẩu"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item className="mb-4">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 bg-linear-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 border-none rounded-lg font-medium text-base shadow-lg hover:shadow-xl transition-all duration-300"
              loading={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </Form.Item>
        </Form>

        {/* Footer */}
        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Bộ Lao động - Thương binh và Xã hội
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
