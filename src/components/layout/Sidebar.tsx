import {
  BarChartOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  LinkOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReconciliationOutlined,
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
    key: '/nguoi-dung',
    icon: <TeamOutlined />,
    label: 'Người dùng'
  },
  {
    key: '/tin-tuc',
    icon: <ReconciliationOutlined />,
    label: 'Tin tức',
    children: [
      {
        key: '/tin-tuyen-dung',
        icon: <SearchOutlined />,
        label: 'Danh sách tin tuyển dụng',
      },
      {
        key: '/tin-tim-viec',
        icon: <SearchOutlined />,
        label: 'Danh sách tin tìm việc',
      },
    ],
  },
  {
    key: '/cam-ket-dien-tu',
    icon: <LinkOutlined />,
    label: 'Cam kết'
  },
  {
    key: '/tranh-chap',
    icon: <WarningOutlined />,
    label: 'Tranh chấp',
  },
  {
    key: '/thong-ke',
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

