import type { ApiResponse } from '@/types/api'
import type {
  CardProgressResponse,
  CreateSessionPayload,
  DashboardSummaryResponse,
  DecksProgressResponse,
  ExamHistoryResponse,
  LearnerStreakResponse,
  ReviewDueCardsResponse,
  ReviewTodayResponse,
  StudyQuestionResponse,
  StudySessionResponse,
  StudySessionResultResponse,
  StudySessionSettingsRequest,
  StudySessionSettingsResponse,
  SubmitStudyAnswerRequest,
  SubmitStudyAnswerResponse,
  UpcomingReviewsResponse,
} from '@/types/learning'
import api from './api'

export const learningService = {
  // ── Session CRUD ─────────────────────────────────────────────────────────────

  async createSession(payload: CreateSessionPayload): Promise<StudySessionResponse> {
    const response = await api.post<ApiResponse<StudySessionResponse>>(
      '/learning/sessions',
      payload,
    )
    if (!response.data.data) {
      throw new Error('Learning_NoCardsAvailable_400')
    }
    return response.data.data
  },

  async getSession(sessionId: string): Promise<StudySessionResponse> {
    const response = await api.get<ApiResponse<StudySessionResponse>>(
      `/learning/sessions/${sessionId}`,
    )
    if (!response.data.data) {
      throw new Error('Learning_SessionNotFound_404')
    }
    return response.data.data
  },

  async deleteSession(sessionId: string): Promise<boolean> {
    const response = await api.delete<ApiResponse<boolean>>(
      `/learning/sessions/${sessionId}`,
    )
    return response.data.data === true
  },

  async getHistory(limit = 20): Promise<StudySessionResponse[]> {
    const response = await api.get<ApiResponse<StudySessionResponse[]>>(
      '/learning/history',
      { params: { limit } },
    )
    return response.data.data ?? []
  },

  // ── Study Flow ───────────────────────────────────────────────────────────────

  async getNextQuestion(sessionId: string): Promise<StudyQuestionResponse | null> {
    const response = await api.get<ApiResponse<StudyQuestionResponse | null>>(
      `/learning/sessions/${sessionId}/next`,
    )
    return response.data.data ?? null
  },

  async submitAnswer(
    sessionId: string,
    payload: SubmitStudyAnswerRequest,
  ): Promise<SubmitStudyAnswerResponse> {
    const response = await api.post<ApiResponse<SubmitStudyAnswerResponse>>(
      `/learning/sessions/${sessionId}/submit`,
      payload,
    )
    if (!response.data.data) {
      throw new Error('Learning_InvalidSubmission_400')
    }
    return response.data.data
  },

  async getResult(sessionId: string): Promise<StudySessionResultResponse> {
    const response = await api.get<ApiResponse<StudySessionResultResponse>>(
      `/learning/sessions/${sessionId}/result`,
    )
    if (!response.data.data) {
      throw new Error('Learning_SessionNotFound_404')
    }
    return response.data.data
  },

  async restartSession(sessionId: string): Promise<StudySessionResponse> {
    const response = await api.post<ApiResponse<StudySessionResponse>>(
      `/learning/sessions/${sessionId}/restart`,
      {},
    )
    if (!response.data.data) {
      throw new Error('Learning_SessionNotFound_404')
    }
    return response.data.data
  },

  // ── Review ───────────────────────────────────────────────────────────────────

  async getReviewToday(
    deckId?: string,
    folderIds?: string[],
  ): Promise<ReviewTodayResponse> {
    const params: Record<string, unknown> = {}
    if (deckId) params.deckId = deckId
    if (folderIds?.length) params.folderIds = folderIds

    const response = await api.get<ApiResponse<ReviewTodayResponse>>(
      '/learning/review/today',
      { params },
    )
    return response.data.data ?? { deckId: null, folderIds: [], dueCount: 0, totalCards: 0 }
  },

  async getDueCards(): Promise<ReviewDueCardsResponse> {
    const response = await api.get<ApiResponse<ReviewDueCardsResponse>>(
      '/learning/review/due-cards',
    )
    return response.data.data ?? { dueCount: 0, cardIds: [] }
  },

  // ── Card Progress ────────────────────────────────────────────────────────────

  async getCardProgress(cardId: string): Promise<CardProgressResponse> {
    const response = await api.get<ApiResponse<CardProgressResponse>>(
      `/learning/progress/cards/${cardId}`,
    )
    if (!response.data.data) {
      throw new Error('Common_404')
    }
    return response.data.data
  },

  // ── Streak ──────────────────────────────────────────────────────────────────

  async getStreak(): Promise<LearnerStreakResponse> {
    const response = await api.get<ApiResponse<LearnerStreakResponse>>(
      '/learning/streak',
    )
    return response.data.data ?? { currentStreak: 0, longestStreak: 0, lastStudyDate: null }
  },

  // ── Upcoming Reviews ────────────────────────────────────────────────────────

  async getUpcomingReviews(days = 7): Promise<UpcomingReviewsResponse> {
    const response = await api.get<ApiResponse<UpcomingReviewsResponse>>(
      '/learning/review/upcoming',
      { params: { days } },
    )
    return response.data.data ?? { dueToday: 0, dueTomorrow: 0, dueThisWeek: 0, dueByDay: [] }
  },

  // ── Deck Progress ───────────────────────────────────────────────────────────

  async getDecksProgress(): Promise<DecksProgressResponse> {
    const response = await api.get<ApiResponse<DecksProgressResponse>>(
      '/learning/decks/progress',
    )
    return response.data.data ?? { decks: [] }
  },

  // ── Dashboard Summary ───────────────────────────────────────────────────────

  async getDashboardSummary(): Promise<DashboardSummaryResponse> {
    const response = await api.get<ApiResponse<DashboardSummaryResponse>>(
      '/learning/dashboard/summary',
    )
    if (!response.data.data) {
      throw new Error('Common_404')
    }
    return response.data.data
  },

  // ── Exam History ────────────────────────────────────────────────────────────

  async getExamHistory(limit = 5): Promise<ExamHistoryResponse> {
    const response = await api.get<ApiResponse<ExamHistoryResponse>>(
      '/learning/dashboard/exam-history',
      { params: { limit } },
    )
    return response.data.data ?? { items: [], stats: { totalExamsTaken: 0, totalPassed: 0, totalFailed: 0, averageScore: 0, passRate: 0 } }
  },

  // ── Settings ─────────────────────────────────────────────────────────────────

  async getSettings(): Promise<StudySessionSettingsResponse> {
    const response = await api.get<ApiResponse<StudySessionSettingsResponse>>(
      '/learning/settings/me',
    )
    return response.data.data ?? {
      flashcardFront: 'Title',
      flashcardBack: 'Summary',
      multipleChoiceQuestion: 'TitleToSummary',
      shuffleOptions: true,
    }
  },

  async updateSettings(
    payload: StudySessionSettingsRequest,
  ): Promise<StudySessionSettingsResponse> {
    const response = await api.put<ApiResponse<StudySessionSettingsResponse>>(
      '/learning/settings/me',
      payload,
    )
    if (!response.data.data) {
      throw new Error('Validation_400')
    }
    return response.data.data
  },
}
