/**
 * Tiếng Việt copy dùng chung cho empty/error/loading states trên toàn app.
 * Các module riêng vẫn có thể override khi cần ngữ cảnh cụ thể.
 */
export const FEEDBACK_COPY = {
  loading: {
    defaultLabel: 'Đang tải...',
  },
  empty: {
    defaultTitle: 'Chưa có dữ liệu',
    defaultDescription: 'Khi có dữ liệu mới, nội dung sẽ xuất hiện tại đây.',
  },
  error: {
    defaultTitle: 'Đã xảy ra lỗi',
    defaultDescription: 'Vui lòng thử lại sau ít phút.',
    retryLabel: 'Thử lại',
  },
  network: {
    title: 'Mất kết nối',
    description: 'Kiểm tra kết nối Internet rồi thử lại.',
  },
  forbidden: {
    title: 'Không có quyền truy cập',
    description: 'Bạn chưa được phân quyền cho nội dung này.',
  },
  notFound: {
    title: 'Không tìm thấy',
    description: 'Nội dung có thể đã bị xóa hoặc chưa được xuất bản.',
  },
} as const
