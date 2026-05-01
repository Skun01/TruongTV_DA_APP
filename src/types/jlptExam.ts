export type JlptLevel = 'N1' | 'N2' | 'N3' | 'N4' | 'N5'

export type SectionType = 'Moji' | 'Bunpou' | 'Dokkai' | 'Choukai'

export type OptionLabel = 'A' | 'B' | 'C' | 'D'

export type OptionType = 'Text' | 'Image' | 'TextAndImage'

export type ExamSessionStatus = 'InProgress' | 'Submitted' | 'TimedOut'

export interface GetJlptExamsParams {
  keyword?: string
  level?: JlptLevel
  page?: number
  pageSize?: number
}

export interface GetExamSessionsParams {
  examId?: string
  status?: ExamSessionStatus
  page?: number
  pageSize?: number
}

export interface StartExamSessionPayload {
  examId: string
}

export interface SaveAnswerPayload {
  questionId: string
  selectedOptionId: string | null
}

export interface JlptExamListItemResponse {
  id: string
  title: string
  level: JlptLevel
  totalDurationMinutes: number
  sectionsCount: number
  questionsCount: number
  createdAt: string
  updatedAt: string | null
}

export interface JlptExamSectionSummary {
  sectionId: string
  sectionType: SectionType
  orderIndex: number
  durationMinutes: number
  questionGroupsCount: number
  questionsCount: number
}

export interface JlptExamDetailResponse {
  id: string
  title: string
  level: JlptLevel
  totalDurationMinutes: number
  sectionsCount: number
  questionsCount: number
  sections: JlptExamSectionSummary[]
  createdAt: string
  updatedAt: string | null
}

export interface ExamOptionResponse {
  optionId: string
  label: OptionLabel
  text: string
  imageUrl: string | null
  optionType: OptionType
}

export interface ExamQuestionResponse {
  questionId: string
  questionText: string
  imageUrl: string | null
  imageCaption: string | null
  orderIndex: number
  options: ExamOptionResponse[]
  selectedOptionId: string | null
}

export interface ExamQuestionGroupResponse {
  groupId: string
  passageText: string | null
  audioUrl: string | null
  instruction: string | null
  orderIndex: number
  mondaiType: string | null
  questions: ExamQuestionResponse[]
}

export interface ExamSessionSectionResponse {
  sectionId: string
  sectionType: SectionType
  orderIndex: number
  durationMinutes: number
  questionGroups: ExamQuestionGroupResponse[]
}

export interface ExamSessionResponse {
  sessionId: string
  examId: string
  examTitle: string
  level: JlptLevel
  status: ExamSessionStatus
  startedAt: string
  submittedAt: string | null
  expiresAt: string
  serverNow: string
  sections: ExamSessionSectionResponse[]
}

export interface ActiveSessionResponse {
  hasActiveSession: boolean
  sessionId: string | null
}

export interface SaveAnswerResponse {
  questionId: string
  selectedOptionId: string | null
  savedAt: string
}

export interface SectionScoreResponse {
  sectionId: string
  sectionType: SectionType
  score: number
  maxScore: number
  passScore: number
  isPassed: boolean
}

export interface SubmitSessionResponse {
  sessionId: string
  totalScore: number
  correctCount: number
  wrongCount: number
  unansweredCount: number
  isPassed: boolean
  sectionScores: SectionScoreResponse[]
}

export interface ResultOptionResponse {
  optionId: string
  label: OptionLabel
  text: string
  imageUrl: string | null
  optionType: OptionType
}

export interface ResultQuestionResponse {
  questionId: string
  questionText: string
  imageUrl: string | null
  explanation: string | null
  sectionType: SectionType
  selectedOptionId: string | null
  correctOptionId: string
  isCorrect: boolean
  options: ResultOptionResponse[]
}

export interface ExamResultResponse {
  sessionId: string
  examId: string
  examTitle: string
  level: JlptLevel
  totalScore: number
  isPassed: boolean
  startedAt: string
  submittedAt: string | null
  sectionScores: SectionScoreResponse[]
  questions: ResultQuestionResponse[]
}

export interface ExamSessionHistoryItemResponse {
  sessionId: string
  examId: string
  examTitle: string
  level: JlptLevel
  status: ExamSessionStatus
  totalScore: number | null
  isPassed: boolean | null
  startedAt: string
  submittedAt: string | null
}
