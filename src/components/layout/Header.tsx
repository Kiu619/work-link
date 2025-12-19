import { useAdminStore } from '@/store/admin'
import {
  BellOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Avatar, Badge, Button, Dropdown, Layout, Space } from 'antd'

const { Header: AntHeader } = Layout

const Header = () => {
  const phoneNumber = useAdminStore((state) => state.phoneNumber)
  const logout = useAdminStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
  }

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin cá nhân',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt tài khoản',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
      onClick: handleLogout,
    },
  ]

  const notificationItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div className="py-2">
          <p className="font-medium text-gray-800">Có 5 tin đăng mới cần duyệt</p>
          <p className="text-xs text-gray-500">2 phút trước</p>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div className="py-2">
          <p className="font-medium text-gray-800">Tranh chấp mới từ Hà Nội</p>
          <p className="text-xs text-gray-500">15 phút trước</p>
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div className="py-2">
          <p className="font-medium text-gray-800">Báo cáo tuần đã sẵn sàng</p>
          <p className="text-xs text-gray-500">1 giờ trước</p>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'view-all',
      label: <span className="text-blue-600">Xem tất cả thông báo</span>,
    },
  ]

  return (
    <AntHeader
      className="bg-white! border-b border-gray-200 px-6! flex items-center justify-between"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
      }}
    >
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          className="w-10! h-10! flex items-center justify-center"
        /> */}
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold text-gray-800">
            Hệ thống Quản lý Việc làm
          </h1>
        </div>
      </div>

      {/* Right side */}
      <Space size="middle">
        {/* Help */}
        <Button
          type="text"
          icon={<QuestionCircleOutlined />}
          className="text-gray-600! hover:text-blue-600!"
        />

        {/* Notifications */}
        <Dropdown
          menu={{ items: notificationItems }}
          placement="bottomRight"
          trigger={['click']}
          overlayClassName="w-80"
        >
          <Badge count={3} size="small">
            <Button
              type="text"
              icon={<BellOutlined />}
              className="text-gray-600! hover:text-blue-600!"
            />
          </Badge>
        </Dropdown>

        {/* User Menu */}
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
            <Avatar
              icon={<UserOutlined />}
              className="bg-red-500!"
            />
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-medium text-gray-800">
                {phoneNumber || 'Admin'}
              </span>
              <span className="text-xs text-gray-500">Quản trị viên</span>
            </div>
          </div>
        </Dropdown>
      </Space>
    </AntHeader>
  )
}

export default Header

