import { type ThemeConfig } from 'antd'

export const antdTheme: ThemeConfig = {
  token: {
    // Brand colors - Màu đỏ vàng của Bộ LĐTBXH
    colorPrimary: '#eab308',      // Vàng chủ đạo
    colorSuccess: '#16a34a',
    colorWarning: '#dc2626',      // Đỏ
    colorError: '#dc2626',
    colorInfo: '#2563eb',
    
    // Typography
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    fontSizeHeading1: 32,
    fontSizeHeading2: 24,
    fontSizeHeading3: 20,
    fontSizeLG: 16,
    fontSizeSM: 12,
    
    // Border & Radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 4,
    
    // Spacing
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    
    // Colors
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f9fafb', // gray-50
    colorText: '#1f2937',     // gray-800
    colorTextSecondary: '#6b7280', // gray-500
    colorBorder: '#d1d5db',   // gray-300
    colorBorderSecondary: '#e5e7eb', // gray-200
    
    // Shadow
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    boxShadowSecondary: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 48,
      fontWeight: 500,
      primaryShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.3)',
      defaultHoverBg: '#f3f4f6',
      defaultHoverColor: '#1f2937',
      defaultHoverBorderColor: '#d1d5db',
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
      paddingInline: 12,
      paddingBlock: 8,
      hoverBorderColor: '#eab308',
      activeBorderColor: '#eab308',
    },
    Form: {
      labelFontSize: 14,
      labelColor: '#374151',
      labelHeight: 24,
      itemMarginBottom: 20,
      verticalLabelPadding: '0 0 8px',
    },
    Card: {
      borderRadius: 16,
      paddingLG: 24,
      headerBg: '#ffffff',
      actionsBg: '#f9fafb',
    },
    Message: {
      contentBg: '#ffffff',
      contentPadding: '12px 16px',
      borderRadius: 8,
    },
    Modal: {
      borderRadius: 16,
      paddingContentHorizontal: 24,
      paddingContentVertical: 20,
    },
  }
}
