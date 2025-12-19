import {
  BarChartOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
  FileProtectOutlined,
  FileTextOutlined,
  LinkOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  SettingOutlined,
  TeamOutlined,
  WarningOutlined
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Layout, Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

const { Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

const menuItems: MenuItem[] = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: 'Tổng quan',
  },
  {
    key: 'candidate',
    icon: <TeamOutlined />,
    label: 'Người lao động',
    children: [
      {
        key: '/candidate-list',
        icon: <TeamOutlined />,
        label: 'Danh sách người lao động',
      },
      {
        key: '/job-seeker-list',
        icon: <SearchOutlined />,
        label: 'Danh sách người tìm việc',
      },
    ],
  },
  {
    key: 'recruiter',
    icon: <TeamOutlined />,
    label: 'Nhà tuyển dụng',
    children: [
      {
        key: '/recruiter-list',
        icon: <TeamOutlined />,
        label: 'Danh sách nhà tuyển dụng',
      },
      {
        key: '/recruitment-list',
        icon: <SearchOutlined />,
        label: 'Danh sách việc tìm người',
      },
    ],
  },
  {
    key: 'connection',
    icon: <LinkOutlined />,
    label: 'Kết nối',
    children: [
      {
        key: '/successful-connections',
        icon: <LinkOutlined />,
        label: 'Kết nối thành công',
      },
      {
        key: '/e-commitments',
        icon: <FileProtectOutlined />,
        label: 'Cam kết điện tử',
      },
    ],
  },
  {
    key: 'review',
    icon: <WarningOutlined />,
    label: 'Xét duyệt',
    children: [
      {
        key: '/suspicious-posts',
        icon: <WarningOutlined />,
        label: 'Tin nghi ngờ',
      },
      {
        key: '/disputes',
        icon: <ExclamationCircleOutlined />,
        label: 'Tranh chấp',
      },
    ],
  },
  {
    key: 'analytics',
    icon: <BarChartOutlined />,
    label: 'Thống kê',
    children: [
      {
        key: '/labor-distribution',
        icon: <EnvironmentOutlined />,
        label: 'Phân bổ theo khu vực',
      },
      {
        key: '/job-shortage',
        icon: <BarChartOutlined />,
        label: 'Nghề thiếu người',
      },
    ],
  },
  {
    key: '/reports',
    icon: <FileTextOutlined />,
    label: 'Xuất báo cáo',
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: 'Cài đặt',
  },
]

interface SidebarProps {
  collapsed: boolean
  onCollapse: (collapsed: boolean) => void
}

const Sidebar = ({ collapsed, onCollapse }: SidebarProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key)
  }

  return (
    <Sider
      trigger={
        <button
          className='bg-[#FFFDE6] w-full text-black cursor-pointer'
          onClick={() => onCollapse(!collapsed)}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      }
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={260}
      className="bg-white! border-r border-gray-200 shadow-sm"
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div className="h-full flex flex-col justify-between">
      <div>
        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo"
              className={`${collapsed ? 'w-10 h-10' : 'w-12 h-12'} object-contain transition-all duration-300`}
            />
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-red-600 text-sm leading-tight">BỘ LĐTBXH</span>
                <span className="text-xs text-gray-500">WorkLink</span>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          // defaultOpenKeys={['registration', 'connection', 'review', 'analytics']}
          items={menuItems}
          onClick={handleMenuClick}
          className="border-none mt-2"
          style={{
            background: 'transparent',
          }}
        />
      </div>
      </div>

    </Sider>
  )
}

export default Sidebar

