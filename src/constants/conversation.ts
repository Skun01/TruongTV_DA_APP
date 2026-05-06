export const CONVERSATION_COPY = {
  pageTitle: 'Luyện hội thoại AI',
  pageDescription: 'Trò chuyện với AI bằng tiếng Nhật trong các kịch bản thực tế',

  // Scenario names (backend provides these, but we can override display)
  scenarioNames: {
    Shopping: 'Đi Shopping',
    Interview: 'Phỏng vấn xin việc',
    Direction: 'Hỏi đường',
    Meeting: 'Gặp gỡ bạn mới',
    Restaurant: 'Nhà hàng',
    Custom: 'Tự nhập kịch bản',
  },

  // Level labels
  levelLabels: {
    N5: 'N5 - Sơ cấp',
    N4: 'N4 - Cơ bản',
    N3: 'N3 - Trung cấp',
    N2: 'N2 - Trung cao cấp',
    N1: 'N1 - Nâng cao',
  },

  // Start page
  selectScenario: 'Chọn kịch bản',
  selectLevel: 'Chọn trình độ JLPT',
  startConversation: 'Bắt đầu trò chuyện',
  customScenarioPlaceholder: 'Nhập kịch bản tùy chỉnh...',

  // Chat interface
  chatPlaceholder: 'Nhập tin nhắn bằng tiếng Nhật...',
  sendMessage: 'Gửi',
  endConversation: 'Kết thúc',
  typing: 'AI đang trả lời...',

  // Vocabulary highlight
  newWord: 'Từ mới',
  grammarPoint: 'Ngữ pháp',

  // Result page
  resultTitle: 'Kết quả cuộc hội thoại',
  totalMessages: 'Tổng tin nhắn',
  duration: 'Thời gian',
  newWordsLearned: 'Từ mới đã học',
  grammarPointsLearned: 'Cấu trúc ngữ pháp',
  feedback: 'Nhận xét từ AI',
  yourScore: 'Điểm số của bạn',
  conversationEnded: 'Cuộc hội thoại đã kết thúc',

  // History page
  historyTitle: 'Lịch sử hội thoại',
  noHistory: 'Chưa có cuộc hội thoại nào',
  startFirst: 'Bắt đầu cuộc hội thoại đầu tiên của bạn!',
  viewAll: 'Xem tất cả',

  // Status
  statusActive: 'Đang diễn ra',
  statusCompleted: 'Đã kết thúc',

  // Dialogs
  confirmEndTitle: 'Kết thúc cuộc hội thoại',
  confirmEndMessage: 'Bạn có chắc muốn kết thúc cuộc hội thoại không? Bạn sẽ nhận được kết quả và feedback từ AI.',
  cancel: 'Hủy',
  processing: 'Đang xử lý...',

  // Delete dialog
  deleteTitle: 'Xóa cuộc hội thoại?',
  deleteMessage: 'Hành động này không thể hoàn tác. Cuộc hội thoại này sẽ bị xóa vĩnh viễn.',
  delete: 'Xóa',
  deleting: 'Đang xóa...',

  // Actions
  continueConversation: 'Tiếp tục',
  deleteConversation: 'Xóa',
  backToList: 'Quay lại danh sách',

  // Empty state
  emptyScenarios: 'Không có kịch bản nào khả dụng',

  // Errors
  sendFailed: 'Không thể gửi tin nhắn. Vui lòng thử lại.',
  loadFailed: 'Không thể tải cuộc hội thoại. Vui lòng thử lại.',
} as const
