import { useState } from 'react'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const { Content } = Layout

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout className="min-h-screen">
      <Sidebar collapsed={collapsed} onCollapse={(collapsed: boolean) => setCollapsed(collapsed)} />
      
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 260,
          transition: 'margin-left 0.2s',
        }}
      >
        <Header />
        
        <Content
          className="bg-gray-50 p-6"
          style={{
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout


