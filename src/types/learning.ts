// ── Enums ────────────────────────────────────────────────────────────────────

export type StudyMode = 'FillInBlank' | 'MultipleChoice' | 'Flashcard'

export type FlashcardSide = 'Title' | 'Summary'

export type MultipleChoiceDirection = 'TitleToSummary' | 'SummaryToTitle'

export type FlashcardResult = 'Known' | 'Learning'
export type LearningQuestionSource = 'Sentence' | 'CardPrompt'

export type SrsLevel =
  | 'level_1' | 'level_2' | 'level_3' | 'level_4'
  | 'level_5' | 'level_6' | 'level_7' | 'level_8'
  | 'level_9' | 'level_10' | 'level_11' | 'level_12'

export type CardType = 'Vocab' | 'Grammar' | 'Kanji'

// ── Settings ─────────────────────────────────────────────────────────────────

export interface StudySessionSettingsRequest {
  flashcardFront?: FlashcardSide | null
  flashcardBack?: FlashcardSide | null
  multipleChoiceQuestion?: MultipleChoiceDirection | null
  shuffleOptions?: boolean | null
}

export interface StudySessionSettingsResponse {
  flashcardFront: FlashcardSide
  flashcardBack: FlashcardSide
  multipleChoiceQuestion: MultipleChoiceDirection
  shuffleOptions: boolean
}

// ── Session ──────────────────────────────────────────────────────────────────

export interface StudySessionResponse {
  id: string
  deckId: string | null
  deckTitle: string | null
  mode: StudyMode
  folderIds: string[]
  totalCards: number
  completedCards: number
  remainingCards: number
  correctCount: number
  incorrectCount: number
  submittedAttempts: number
  retryCards: number
  skippedCardIds: string[]
  createdAt: string
  completedAt: string | null
  settings: StudySessionSettingsResponse
}

// ── Question ─────────────────────────────────────────────────────────────────

export interface StudyQuestionOptionResponse {
  id: string
  text: string
}

export interface StudyQuestionResponse {
  sessionId: string
  cardId: string
  cardType: CardType
  mode: StudyMode
  prompt: string
  questionText: string | null
  secondaryText: string | null
  hint: string | null
  frontText: string | null
  backText: string | null
  sentenceId: string | null
  questionSource: LearningQuestionSource
  attemptNo: number
  maxAttempts: number
  acceptedAnswerCount: number
  allowsMultipleSelection: boolean
  options: StudyQuestionOptionResponse[]
  isCompleted: boolean
}

// ── Submit ───────────────────────────────────────────────────────────────────

export interface SubmitStudyAnswerRequest {
  cardId: string
  answers: string[]
  selectedOptionIds: string[]
  flashcardResult: FlashcardResult | null
}

export interface SubmitStudyAnswerResponse {
  isCorrect: boolean
  cardId: string
  mode: StudyMode
  acceptedAnswers: string[]
  canonicalAnswer: string | null
  submittedAnswers: string[]
  normalizedSubmittedAnswers: string[]
  completedQuestionText: string | null
  sentenceId: string | null
  attemptNo: number
  maxAttempts: number
  willRepeat: boolean
  isFinalAttempt: boolean
  srsLevel: SrsLevel
  nextReviewAt: string
  isMastered: boolean
  consecutiveCorrect: number
  completedCards: number
  remainingCards: number
}

// ── Result ───────────────────────────────────────────────────────────────────

export interface StudySessionResultResponse {
  sessionId: string
  deckId: string | null
  deckTitle: string | null
  mode: StudyMode
  totalCards: number
  completedCards: number
  correctCount: number
  incorrectCount: number
  accuracy: number
  createdAt: string
  completedAt: string | null
  settings: StudySessionSettingsResponse
}

// ── Review ───────────────────────────────────────────────────────────────────

export interface ReviewTodayResponse {
  deckId: string | null
  folderIds: string[]
  dueCount: number
  totalCards: number
}

export interface ReviewDueCardsResponse {
  dueCount: number
  cardIds: string[]
}

// ── Card Progress ────────────────────────────────────────────────────────────

export interface CardProgressResponse {
  cardId: string
  cardType: CardType
  title: string
  summary: string
  srsLevel: SrsLevel
  nextReviewAt: string
  lastReviewedAt: string | null
  consecutiveCorrect: number
  isMastered: boolean
  lastSentenceId: string | null
}

// ── Streak ───────────────────────────────────────────────────────────────────

export interface LearnerStreakResponse {
  currentStreak: number
  longestStreak: number
  lastStudyDate: string | null
}

// ── Upcoming Reviews ─────────────────────────────────────────────────────────

export interface DailyReviewCount {
  date: string
  count: number
}

export interface UpcomingReviewsResponse {
  dueToday: number
  dueTomorrow: number
  dueThisWeek: number
  dueByDay: DailyReviewCount[]
}

// ── Deck Progress ────────────────────────────────────────────────────────────

export interface DeckProgressItem {
  deckId: string
  deckTitle: string
  totalCards: number
  masteredCards: number
  dueCards: number
  learningCards: number
  completionPercent: number
}

export interface DecksProgressResponse {
  decks: DeckProgressItem[]
}

// ── Dashboard Summary ────────────────────────────────────────────────────────

export interface UpcomingReviewsSummary {
  dueToday: number
  dueTomorrow: number
  dueThisWeek: number
}

export interface RecentSessionSummary {
  id: string
  deckTitle: string | null
  mode: StudyMode
  correctCount: number
  incorrectCount: number
  accuracy: number
  completedAt: string | null
}

export interface DashboardSummaryResponse {
  streak: LearnerStreakResponse
  todayReview: ReviewTodayResponse
  upcomingReviews: UpcomingReviewsSummary
  deckProgress: DeckProgressItem[]
  recentSessions: RecentSessionSummary[]
}

// ── Exam History ─────────────────────────────────────────────────────────────

export interface ExamHistoryItem {
  examSessionId: string
  examId: string
  examTitle: string
  examLevel: string
  startedAt: string
  submittedAt: string | null
  totalScore: number | null
  maxScore: number
  isPassed: boolean | null
  accuracy: number
}

export interface ExamHistoryStats {
  totalExamsTaken: number
  totalPassed: number
  totalFailed: number
  averageScore: number
  passRate: number
}

export interface ExamHistoryResponse {
  items: ExamHistoryItem[]
  stats: ExamHistoryStats
}

// ── Create Session Payload ───────────────────────────────────────────────────

export interface CreateSessionPayload {
  deckId?: string | null
  cardIds?: string[]
  mode: StudyMode
  settings?: StudySessionSettingsRequest | null
}
