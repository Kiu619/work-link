import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import viVN from 'antd/locale/vi_VN'
import '@/index.css'
import App from '@/App'
import { antdTheme } from '@/theme/antd-theme'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ConfigProvider locale={viVN} theme={antdTheme}>
          <App />
        </ConfigProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
