import type { FlashcardSide, MultipleChoiceDirection, StudyMode } from '@/types/learning'

export const LEARNING_COPY = {
  // ── Quick Learn page ─────────────────────────────────────────────────────────
  pageTitle: 'Học nhanh',
  pageDescription: 'Chọn bộ thẻ và bắt đầu học ngay.',
  heading: 'Học nhanh',
  bookmarkedDecksSection: 'Bộ thẻ đã lưu',
  myDecksSection: 'Bộ thẻ của tôi',
  emptyBookmarked: 'Chưa lưu bộ thẻ nào. Khám phá thư viện để lưu bộ thẻ yêu thích.',
  emptyMyDecks: 'Chưa tạo bộ thẻ nào. Vào thư viện để tạo bộ thẻ riêng.',
  goToLibrary: 'Đi đến thư viện',
  selectDeckHint: 'Chọn một bộ thẻ để bắt đầu',
  cardsCount: 'thẻ',
  foldersCount: 'thư mục',

  // ── Folder / Card selection ──────────────────────────────────────────────────
  selectCardsTitle: 'Chọn thẻ học',
  selectAll: 'Chọn tất cả',
  deselectAll: 'Bỏ chọn tất cả',
  selectedCount: 'thẻ đã chọn',
  noCardsInFolder: 'Thư mục này chưa có thẻ.',
  backToDecks: 'Chọn bộ thẻ khác',

  // ── Mode selection ───────────────────────────────────────────────────────────
  selectModeTitle: 'Chế độ học',
  startSession: 'Bắt đầu học',
  noCardsSelected: 'Vui lòng chọn ít nhất 1 thẻ để bắt đầu.',

  modeLabels: {
    Flashcard: 'Flashcard',
    MultipleChoice: 'Trắc nghiệm',
    FillInBlank: 'Điền từ',
  } satisfies Record<StudyMode, string>,

  modeDescriptions: {
    Flashcard: 'Lật thẻ — đánh giá bản thân "Đã biết" hoặc "Đang học".',
    MultipleChoice: 'Chọn đáp án đúng trong 4 lựa chọn.',
    FillInBlank: 'Nhập câu trả lời trực tiếp.',
  } satisfies Record<StudyMode, string>,

  // ── Settings ─────────────────────────────────────────────────────────────────
  settingsTitle: 'Tuỳ chỉnh',
  flashcardFrontLabel: 'Mặt trước',
  flashcardBackLabel: 'Mặt sau',
  mcqDirectionLabel: 'Hướng câu hỏi',
  shuffleLabel: 'Trộn đáp án',
  defaultFlashcardFrontLabel: 'Mặt trước flashcard',
  defaultMcqQuestionLabel: 'Câu hỏi trắc nghiệm',
  defaultShuffleFlashcardLabel: 'Trộn thẻ flashcard',
  noSettingsForMode: 'Chế độ này sử dụng cài đặt mặc định.',
  languageOptionLabels: {
    Vietnamese: 'Tiếng Việt',
    Japanese: 'Tiếng Nhật',
  },

  flashcardSideLabels: {
    Title: 'Tiêu đề (Nhật)',
    Summary: 'Nghĩa (Việt)',
  } satisfies Record<FlashcardSide, string>,

  mcqDirectionLabels: {
    TitleToSummary: 'Nhật → Việt',
    SummaryToTitle: 'Việt → Nhật',
  } satisfies Record<MultipleChoiceDirection, string>,

  // ── Study page ───────────────────────────────────────────────────────────────
  studyTitle: 'Phiên học',
  nextCard: 'Tiếp theo',
  known: 'Đã biết',
  learning: 'Đang học',
  checkAnswer: 'Kiểm tra',
  flipCardHint: 'Nhấn để lật thẻ',
  keyboardShortcutTitle: 'Phím tắt Flashcard',
  keyboardShortcutDescription: 'Dùng bàn phím để chọn nhanh khi đã lật thẻ.',
  keyboardShortcutOpenAriaLabel: 'Mở bảng phím tắt Flashcard',
  keyboardSpaceKey: 'Space',
  keyboardUpArrowKey: '↑',
  keyboardDownArrowKey: '↓',
  keyboardLeftArrowKey: '←',
  keyboardRightArrowKey: '→',
  keyboardSpaceAction: 'Lật thẻ',
  keyboardUpArrowAction: 'Lật thẻ',
  keyboardDownArrowAction: 'Lật thẻ',
  keyboardLeftArrowAction: 'Chọn Đang học (vuốt trái)',
  keyboardRightArrowAction: 'Chọn Đã biết (vuốt phải)',
  inputPlaceholder: 'Nhập câu trả lời...',
  correct: 'Chính xác!',
  incorrect: 'Chưa đúng',
  acceptedAnswers: 'Đáp án đúng:',
  canonicalAnswer: 'Đáp án chuẩn:',
  completedQuestionText: 'Câu hoàn chỉnh:',
  attemptProgress: (attemptNo: number, maxAttempts: number) => `Lượt ${attemptNo}/${maxAttempts}`,
  retryQueued: 'Thẻ này sẽ quay lại cuối phiên.',
  retryQueueCount: (count: number) => `${count} thẻ chờ làm lại`,
  skippedCardsNotice: (count: number, totalCards: number) =>
    `${count} thẻ không phù hợp với chế độ đã chọn và đã được bỏ qua. Phiên này còn ${totalCards} thẻ hợp lệ.`,
  fillInBlankSentenceSource: 'Câu ví dụ',
  fillInBlankPromptSource: 'Gợi ý từ thẻ',
  srsLevelUp: 'Tăng bậc',
  srsLevelDown: 'Giảm bậc',
  mastered: 'Đã thành thạo!',
  sessionCompleted: 'Hoàn thành phiên học!',
  viewResult: 'Xem kết quả',
  exitStudy: 'Thoát',
  exitConfirmTitle: 'Thoát phiên học?',
  exitConfirmMessage: 'Tiến trình hiện tại sẽ được lưu lại.',
  exitConfirmAction: 'Thoát',
  exitCancelAction: 'Tiếp tục học',

  // ── Result page ──────────────────────────────────────────────────────────────
  resultTitle: 'Kết quả phiên học',
  resultDescription: 'Xem kết quả chi tiết phiên học.',
  accuracy: 'Độ chính xác',
  totalCards: 'Tổng thẻ',
  correctCards: 'Đúng',
  incorrectCards: 'Sai',
  restart: 'Học lại',
  backToDashboard: 'Về trang chủ',
  backToQuickLearn: 'Học bộ khác',
  gradeExcellent: 'Xuất sắc!',
  gradeExcellentSub: 'Bạn đã làm rất tốt hôm nay!',
  gradeGood: 'Tốt lắm!',
  gradeGoodSub: 'Tiếp tục phấn đấu nhé!',
  gradeKeepGoing: 'Cố lên!',
  gradeKeepGoingSub: 'Ôn tập thêm để tiến bộ hơn nhé!',

  // ── Dashboard ────────────────────────────────────────────────────────────────
  dashboardTitle: 'Dashboard',
  dashboardDescription: 'Tổng quan học tập của bạn trên Tacho.',
  greeting: 'Xin chào,',
  closeDialog: 'Đóng',
  dueToday: 'Cần ôn tập',
  reviewSubtitle: 'Nội dung đến hạn học',
  reviewHint: 'Nên ôn tập sớm nhé',
  expandReviewAriaLabel: 'Mở rộng chi tiết ôn tập',
  dueCardsLabel: 'Thẻ cần ôn',
  totalCardsScope: 'Tổng thẻ đã học',
  reviewNow: 'Ôn tập ngay',
  noDueCards: 'Không có thẻ cần ôn tập hôm nay. Tuyệt vời!',
  recentSessions: 'Lịch sử học gần đây',
  noSessions: 'Chưa có phiên học nào. Bắt đầu học ngay!',
  continueSession: 'Tiếp tục',
  deleteSession: 'Xóa',
  deleteSessionConfirmTitle: 'Xóa phiên học?',
  deleteSessionConfirmMessage: 'Bạn chắc chắn muốn xóa phiên học này?',
  deleteSessionConfirm: 'Xóa',
  sessionDeleted: 'Đã xóa phiên học.',
  settingsSectionTitle: 'Cài đặt học tập mặc định',
  settingsModalDescription: 'Tuỳ chỉnh mặc định cho Flashcard và Trắc nghiệm.',
  settingsSaved: 'Đã lưu cài đặt.',
  saveSettings: 'Lưu cài đặt',

  // ── Streak widget ──────────────────────────────────────────────────────────
  streakTitle: 'Chuỗi học tập',
  currentStreakLabel: 'Hiện tại',
  longestStreakLabel: 'Kỷ lục',
  lastStudyDateLabel: 'Ngày học gần nhất',
  streakUnit: 'ngày',
  noStreakYet: 'Chưa có chuỗi học tập. Bắt đầu học ngay!',

  // ── Upcoming reviews widget ────────────────────────────────────────────────
  upcomingTitle: 'Lịch ôn tập sắp tới',
  dueTodayLabel: 'Hôm nay',
  dueTomorrowLabel: 'Ngày mai',
  dueThisWeekLabel: 'Tuần này',
  noUpcomingReviews: 'Không có thẻ cần ôn trong tuần này.',
  upcomingChartLabel: 'Dự báo ôn tập',

  // ── Deck progress widget ───────────────────────────────────────────────────
  deckProgressTitle: 'Tiến trình bộ thẻ',
  deckProgressViewAll: 'Xem tất cả',
  deckMasteredLabel: 'Thành thạo',
  deckDueLabel: 'Cần ôn',
  deckLearningLabel: 'Đang học',
  deckCompletionLabel: 'Hoàn thành',
  noDeckProgress: 'Chưa có tiến trình bộ thẻ nào.',

  // ── Exam history widget ────────────────────────────────────────────────────
  examHistoryTitle: 'Lịch sử thi',
  examHistoryViewAll: 'Xem thêm',
  examsTakenLabel: 'Số lần thi',
  examPassedLabel: 'Đạt',
  examFailedLabel: 'Chưa đạt',
  examPassRateLabel: 'Tỷ lệ đạt',
  examAvgScoreLabel: 'Điểm trung bình',
  noExamHistory: 'Chưa có lịch sử thi. Thử sức với đề thi JLPT!',
  examScoreLabel: 'Điểm',
  examAccuracyLabel: 'Độ chính xác',
  examPassedBadge: 'Đạt',
  examFailedBadge: 'Chưa đạt',

  // ── Review mode dialog ───────────────────────────────────────────────────────
  reviewModeTitle: 'Chọn chế độ ôn tập',
  reviewModeDescription: 'Có {count} thẻ cần ôn. Chọn chế độ để bắt đầu.',
  startReview: 'Bắt đầu ôn tập',

  // ── Session mode labels for history ──────────────────────────────────────────
  sessionModeLabel: {
    Flashcard: 'Flashcard',
    MultipleChoice: 'Trắc nghiệm',
    FillInBlank: 'Điền từ',
  } satisfies Record<StudyMode, string>,
} as const
