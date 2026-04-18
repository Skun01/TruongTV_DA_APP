import { API_ERROR_MESSAGES } from '@/types/api'

export const DECK_ERROR_MESSAGES: Record<string, string> = {
  Deck_NotFound_404: 'Không tìm thấy bộ thẻ.',
  Deck_FolderNotFound_404: 'Không tìm thấy thư mục trong bộ thẻ.',
  Deck_CardNotFound_404: 'Không tìm thấy thẻ trong thư mục đã chọn.',
  Deck_Forbidden_403: 'Bạn không có quyền truy cập hoặc chỉnh sửa bộ thẻ này.',
  Deck_ForkSourceInvalid_400: 'Bộ thẻ này không thể sao chép vào thư viện cá nhân.',
  Deck_CardDuplicatedInDeck_400: 'Thẻ này đã tồn tại ở thư mục khác trong cùng bộ thẻ.',
  Deck_InvalidReorderPayload_400: 'Dữ liệu sắp xếp không hợp lệ. Vui lòng thử lại.',
  Validation_400: 'Dữ liệu chưa hợp lệ. Vui lòng kiểm tra lại.',
  default: 'Không thể xử lý thao tác với bộ thẻ. Vui lòng thử lại.',
}

export const LEARNING_ERROR_MESSAGES: Record<string, string> = {
  Learning_SessionNotFound_404: 'Không tìm thấy phiên học.',
  Learning_SessionCompleted_400: 'Phiên học đã hoàn thành.',
  Learning_InvalidMode_400: 'Chế độ học không hợp lệ.',
  Learning_InvalidScope_400: 'Phạm vi thẻ không hợp lệ.',
  Learning_CardNotInSession_400: 'Thẻ không thuộc phiên học này.',
  Learning_InvalidSubmission_400: 'Câu trả lời không hợp lệ hoặc đã nộp rồi.',
  Learning_NoCardsAvailable_400: 'Không có thẻ nào để học.',
  default_learning: 'Không thể xử lý thao tác học tập. Vui lòng thử lại.',
}

export const ERROR_MESSAGES = {
  ...API_ERROR_MESSAGES,
  ...DECK_ERROR_MESSAGES,
  ...LEARNING_ERROR_MESSAGES,
} as const

