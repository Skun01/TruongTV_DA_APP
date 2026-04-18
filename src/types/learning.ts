// ── Enums ────────────────────────────────────────────────────────────────────

export type StudyMode = 'FillInBlank' | 'MultipleChoice' | 'Flashcard'

export type FlashcardSide = 'Title' | 'Summary'

export type MultipleChoiceDirection = 'TitleToSummary' | 'SummaryToTitle'

export type FlashcardResult = 'Known' | 'Learning'

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

// ── Create Session Payload ───────────────────────────────────────────────────

export interface CreateSessionPayload {
  deckId?: string | null
  cardIds?: string[]
  mode: StudyMode
  settings?: StudySessionSettingsRequest | null
}
