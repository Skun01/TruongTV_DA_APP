import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type {
  ActiveSessionResponse,
  ExamResultResponse,
  ExamSessionHistoryItemResponse,
  ExamSessionResponse,
  GetExamSessionsParams,
  GetJlptExamsParams,
  JlptExamDetailResponse,
  JlptExamListItemResponse,
  SaveAnswerPayload,
  SaveAnswerResponse,
  StartExamSessionPayload,
  SubmitSessionResponse,
} from '@/types/jlptExam'
import api from './api'

export const jlptExamService = {
  async getPublishedExams(params: GetJlptExamsParams) {
    const response = await api.get<PaginatedResponse<JlptExamListItemResponse>>(
      '/jlpt-exams',
      { params },
    )
    return {
      items: response.data.data ?? [],
      meta: response.data.metaData ?? null,
    }
  },

  async getExamDetail(examId: string): Promise<JlptExamDetailResponse> {
    const response = await api.get<ApiResponse<JlptExamDetailResponse>>(
      `/jlpt-exams/${examId}`,
    )
    if (!response.data.data) {
      throw new Error('Exam_NotFound_404')
    }
    return response.data.data
  },

  async checkActiveSession(examId: string): Promise<ActiveSessionResponse> {
    const response = await api.get<ApiResponse<ActiveSessionResponse>>(
      '/exam-sessions/active',
      { params: { examId } },
    )
    return response.data.data ?? { hasActiveSession: false, sessionId: null }
  },

  async startSession(payload: StartExamSessionPayload): Promise<ExamSessionResponse> {
    const response = await api.post<ApiResponse<ExamSessionResponse>>(
      '/exam-sessions',
      payload,
    )
    if (!response.data.data) {
      throw new Error('ExamSession_ExamNotPublished_400')
    }
    return response.data.data
  },

  async getSession(sessionId: string): Promise<ExamSessionResponse> {
    const response = await api.get<ApiResponse<ExamSessionResponse>>(
      `/exam-sessions/${sessionId}`,
    )
    if (!response.data.data) {
      throw new Error('ExamSession_NotFound_404')
    }
    return response.data.data
  },

  async saveAnswer(sessionId: string, payload: SaveAnswerPayload): Promise<SaveAnswerResponse> {
    const response = await api.post<ApiResponse<SaveAnswerResponse>>(
      `/exam-sessions/${sessionId}/answers`,
      payload,
    )
    return response.data.data
  },

  async submitSession(sessionId: string): Promise<SubmitSessionResponse> {
    const response = await api.post<ApiResponse<SubmitSessionResponse>>(
      `/exam-sessions/${sessionId}/submit`,
    )
    if (!response.data.data) {
      throw new Error('ExamSession_NotFound_404')
    }
    return response.data.data
  },

  async getResult(sessionId: string): Promise<ExamResultResponse> {
    const response = await api.get<ApiResponse<ExamResultResponse>>(
      `/exam-sessions/${sessionId}/result`,
    )
    if (!response.data.data) {
      throw new Error('ExamSession_NotFound_404')
    }
    return response.data.data
  },

  async getSessionHistory(params: GetExamSessionsParams) {
    const response = await api.get<PaginatedResponse<ExamSessionHistoryItemResponse>>(
      '/exam-sessions',
      { params },
    )
    return {
      items: response.data.data ?? [],
      meta: response.data.metaData ?? null,
    }
  },
}
