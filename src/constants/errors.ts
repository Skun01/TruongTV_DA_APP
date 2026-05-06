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

export const SHADOWING_ERROR_MESSAGES: Record<string, string> = {
  Shadowing_TopicNotFound_404: 'Không tìm thấy chủ đề luyện phát âm.',
  Shadowing_AttemptNotFound_404: 'Không tìm thấy bản ghi luyện tập.',
  Shadowing_SentenceNotFound_404: 'Không tìm thấy câu luyện tập.',
  Shadowing_SentenceNotAttached_404: 'Câu này không thuộc chủ đề đã chọn.',
  Shadowing_InvalidAudio_400: 'File âm thanh không hợp lệ. Vui lòng thử lại.',
  Shadowing_AssessmentFailed_500: 'Không thể đánh giá phát âm. Vui lòng thử lại sau.',
  Shadowing_AzureNotConfigured_500: 'Hệ thống đánh giá phát âm đang bảo trì.',
  Validation_400: 'Dữ liệu chưa hợp lệ. Vui lòng kiểm tra lại.',
  default_shadowing: 'Không thể xử lý thao tác luyện phát âm. Vui lòng thử lại.',
}

export const JLPT_EXAM_ERROR_MESSAGES: Record<string, string> = {
  Exam_NotFound_404: 'Không tìm thấy đề thi.',
  ExamSession_ExamNotPublished_400: 'Đề thi chưa được xuất bản.',
  ExamSession_NotFound_404: 'Không tìm thấy phiên thi.',
  ExamSession_Forbidden_403: 'Bạn không có quyền truy cập phiên thi này.',
  ExamSession_AlreadySubmitted_400: 'Bài thi đã được nộp.',
  ExamSession_Expired_400: 'Phiên thi đã hết hạn.',
  ExamSession_QuestionNotInExam_400: 'Câu hỏi không thuộc đề thi này.',
  default_jlptExam: 'Không thể xử lý thao tác bài thi. Vui lòng thử lại.',
}

export const CONVERSATION_ERROR_MESSAGES: Record<string, string> = {
  Conversation_NotFound_404: 'Không tìm thấy cuộc hội thoại.',
  Conversation_AlreadyCompleted_400: 'Cuộc hội thoại đã kết thúc.',
  Conversation_GenerationFailed_500: 'Không thể tạo phản hồi AI. Vui lòng thử lại.',
  default: 'Không thể xử lý thao tác hội thoại. Vui lòng thử lại.',
  conversationDeleted: 'Đã xóa cuộc hội thoại.',
}

export const ERROR_MESSAGES = {
  ...API_ERROR_MESSAGES,
  ...DECK_ERROR_MESSAGES,
  ...LEARNING_ERROR_MESSAGES,
  ...SHADOWING_ERROR_MESSAGES,
  ...JLPT_EXAM_ERROR_MESSAGES,
  ...CONVERSATION_ERROR_MESSAGES,
} as const

