export const VOCAB_DETAIL_COPY = {
  pageTitle: (word: string) => `${word} — Chi tiết từ vựng`,
  back: 'Quay lại',

  // Hero section
  cardType: 'Từ vựng',

  // Chi tiết card
  detail: {
    title: 'CHI TIẾT',
    dictMeaning: 'NGHĨA TỪ ĐIỂN',
    reading: 'CÁCH ĐỌC',
  },

  // Sidebar actions
  actions: {
    addNote: 'Thêm ghi chú',
    addToDeck: 'Thêm vào bộ thẻ',
  },

  // Tiến trình học
  progress: {
    title: 'TIẾN TRÌNH HỌC',
    nextReview: 'Ôn tập tiếp theo',
    lastReviewed: 'Lần ôn gần nhất',
    correctStreak: 'Chuỗi đúng',
    srsLevel: 'Cấp độ SRS',
    levelProgress: 'Tiến độ cấp độ',
    levelProgressValue: (current: number, total: number) => `Mức ${current}/${total}`,
    streakValue: (value: number) => `${value} lần đúng liên tiếp`,
    learningState: 'Trạng thái học',
    reviewStateDue: 'Đến hạn ôn',
    reviewStateUpcoming: 'Sắp đến hạn',
    mastered: 'Đã thành thạo',
    inProgress: 'Đang học',
    notReviewedYet: 'Chưa ôn lần nào',
    loadFailed: 'Không tải được tiến trình',
  },

  // Ví dụ
  examples: {
    title: 'VÍ DỤ',
    showMeaning: 'Hiện nghĩa',
    hideMeaning: 'Ẩn nghĩa',
  },

  // Từ liên quan
  related: {
    title: 'TỪ LIÊN QUAN',
    synonyms: 'Đồng nghĩa',
    antonyms: 'Trái nghĩa',
    phrases: 'Cụm từ liên quan',
  },

  // Ghi chú cộng đồng
  notes: {
    title: 'GHI CHÚ CỘNG ĐỒNG',
    myNoteTitle: 'Ghi chú của bạn',
    edit: 'Sửa',
    viewOthers: 'Xem của người khác',
    placeholder: 'Viết ghi chú để chia sẻ mẹo nhớ, cách dùng, hay bất cứ gì hữu ích...',
    submit: 'Gửi ghi chú',
    empty: 'Chưa có ghi chú nào',
    emptyHint: 'Hãy là người đầu tiên chia sẻ ghi chú cho từ này!',
    deleteConfirm: 'Bạn có chắc muốn xóa ghi chú này?',
  },

  audio: {
    play: 'Phát âm',
    unavailable: 'Chưa có audio',
    playError: 'Không thể phát audio. Vui lòng thử lại.',
  },

  deckDialog: {
    title: 'Thêm vào bộ thẻ cá nhân',
    readyStatus: 'Sẵn sàng thêm',
    existedStatus: 'Đã có trong bộ thẻ',
    deckLabel: 'Bộ thẻ',
    deckHint: 'Chọn bộ thẻ muốn lưu thẻ này',
    deckPlaceholder: 'Chọn bộ thẻ',
    folderLabel: 'Thư mục',
    folderHint: 'Chọn thư mục đích trong bộ thẻ',
    folderPlaceholder: 'Chọn thư mục',
    addAction: 'Thêm vào bộ thẻ',
    removeAction: 'Xóa khỏi bộ thẻ',
    cancel: 'Hủy',
    emptyDeckTitle: 'Bạn chưa có bộ thẻ cá nhân',
    emptyDeckHint: 'Hãy tạo một bộ thẻ trong thư viện để lưu thẻ học này.',
    openLibrary: 'Mở thư viện',
    emptyFolderHint: 'Bộ thẻ này chưa có thư mục. Vui lòng tạo thư mục trước khi thêm thẻ.',
    openDeckEditor: 'Mở trang chỉnh sửa bộ thẻ',
    existsInFolder: (folderTitle: string) => `Thẻ này đã có trong thư mục "${folderTitle}". Bạn có thể xóa khỏi bộ thẻ.`,
  },

  notFound: 'Không tìm thấy từ vựng',
  notFoundHint: 'Từ vựng này có thể đã bị xóa hoặc chưa được xuất bản.',
} as const
