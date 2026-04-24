import type { ShadowingLevel } from '@/types/shadowing'

// ── Page Copy ──────────────────────────────────────────────────────────────────

export const SHADOWING_COPY = {
  // ── Topic List Page ──────────────────────────────────────────────────────────
  pageTitle: 'Luyện phát âm Shadowing',
  pageDescription: 'Luyện phát âm tiếng Nhật bằng cách bắt chước người bản xứ.',
  searchPlaceholder: 'Tìm kiếm chủ đề...',
  filterByLevel: 'Lọc theo cấp độ',
  allLevels: 'Tất cả cấp độ',
  officialOnly: 'Chỉ hiển thị chủ đề chính thức',
  emptyTopics: 'Chưa có chủ đề nào. Hãy khám phá các chủ đề chính thức để bắt đầu luyện tập.',
  startPractice: 'Bắt đầu luyện tập',
  continuePractice: 'Tiếp tục luyện tập',
  sentencesCount: 'câu',
  byCreator: 'bởi',

  // ── Topic Detail Page ──────────────────────────────────────────────────────
  backToTopics: 'Quay lại danh sách',
  topicInfo: 'Thông tin chủ đề',
  sentencesList: 'Danh sách câu',
  startFromBeginning: 'Bắt đầu từ đầu',
  resumePractice: 'Tiếp tục từ câu trước',
  progressSummary: 'Tiến độ',
  completedSentences: 'câu đã luyện',
  bestScore: 'Điểm cao nhất',
  latestScore: 'Điểm gần nhất',

  // ── Practice Page ────────────────────────────────────────────────────────────
  practiceTitle: 'Luyện phát âm',
  listeningPhase: 'Nghe',
  recordingPhase: 'Thu âm',
  resultPhase: 'Kết quả',
  playAudio: 'Phát âm thanh',
  pauseAudio: 'Tạm dừng',
  startRecording: 'Bắt đầu thu âm',
  stopRecording: 'Dừng thu âm',
  submitting: 'Đang gửi...',
  retrySentence: 'Luyện lại câu này',
  nextSentence: 'Câu tiếp theo',
  backToTopic: 'Quay lại chủ đề',

  // ── Scores ───────────────────────────────────────────────────────────────────
  pronScore: 'Phát âm',
  accuracyScore: 'Độ chính xác',
  fluencyScore: 'Độ trôi chảy',
  completenessScore: 'Độ hoàn thành',
  prosodyScore: 'Ngữ điệu',
  scoreOutOf: '/100',

  // ── Attempt History ──────────────────────────────────────────────────────────
  historyTitle: 'Lịch sử luyện tập',
  emptyHistory: 'Chưa có lần luyện tập nào. Hãy bắt đầu luyện tập để xem kết quả.',
  attemptTime: 'Thời gian',
  attemptScore: 'Điểm số',
  viewDetails: 'Xem chi tiết',

  // ── Errors ───────────────────────────────────────────────────────────────────
  loadTopicsError: 'Không thể tải danh sách chủ đề.',
  loadTopicError: 'Không thể tải thông tin chủ đề.',
  loadProgressError: 'Không thể tải tiến độ.',
  submitAttemptError: 'Không thể gửi bản thu. Vui lòng thử lại.',
  micPermissionDenied: 'Vui lòng cho phép truy cập microphone để luyện tập.',
  audioPlaybackError: 'Không thể phát âm thanh.',

  // ── Levels ───────────────────────────────────────────────────────────────────
  levelLabels: {
    N1: 'N1',
    N2: 'N2',
    N3: 'N3',
    N4: 'N4',
    N5: 'N5',
  } satisfies Record<ShadowingLevel, string>,

  // ── Toast Messages ───────────────────────────────────────────────────────────
  attemptSubmitted: 'Đã gửi bản thu thành công!',
  practiceCompleted: 'Hoàn thành luyện tập!',
} as const
