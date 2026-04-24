import type { ApiResponse } from '@/types/api'
import type {
  GetShadowingAttemptHistoryParams,
  GetShadowingTopicsParams,
  ShadowingAttemptHistoryItemResponse,
  ShadowingAttemptResponse,
  ShadowingSentenceProgressResponse,
  ShadowingTopicDetailResponse,
  ShadowingTopicListItemResponse,
  ShadowingTopicProgressResponse,
  ShadowingTopicResumeResponse,
  ShadowingTopicSentenceProgressItemResponse,
  SubmitShadowingAttemptRequest,
} from '@/types/shadowing'
import api from './api'

export const shadowingService = {
  // ── Topic List ───────────────────────────────────────────────────────────────

  async getTopics(
    params?: GetShadowingTopicsParams,
  ): Promise<{ items: ShadowingTopicListItemResponse[]; total: number; totalPage: number }> {
    const response = await api.get<ApiResponse<ShadowingTopicListItemResponse[]>>('/shadowing/topics', {
      params,
    })

    const data = response.data.data ?? []
    const metaData = response.data.metaData

    return {
      items: data,
      total: metaData?.total ?? data.length,
      totalPage: metaData ? Math.ceil(metaData.total / metaData.pageSize) : 1,
    }
  },

  // ── Topic Detail ─────────────────────────────────────────────────────────────

  async getTopic(topicId: string): Promise<ShadowingTopicDetailResponse> {
    const response = await api.get<ApiResponse<ShadowingTopicDetailResponse>>(`/shadowing/topics/${topicId}`)

    if (!response.data.data) {
      throw new Error('Shadowing_TopicNotFound_404')
    }

    return response.data.data
  },

  // ── Topic Progress ───────────────────────────────────────────────────────────

  async getTopicProgress(topicId: string): Promise<ShadowingTopicProgressResponse> {
    const response = await api.get<ApiResponse<ShadowingTopicProgressResponse>>(
      `/shadowing/topics/${topicId}/progress`,
    )

    if (!response.data.data) {
      throw new Error('Shadowing_TopicNotFound_404')
    }

    return response.data.data
  },

  // ── Sentence Progress List ───────────────────────────────────────────────────

  async getTopicSentenceProgress(topicId: string): Promise<ShadowingTopicSentenceProgressItemResponse[]> {
    const response = await api.get<ApiResponse<ShadowingTopicSentenceProgressItemResponse[]>>(
      `/shadowing/topics/${topicId}/sentences/progress`,
    )

    return response.data.data ?? []
  },

  // ── Resume ───────────────────────────────────────────────────────────────────

  async getTopicResume(topicId: string): Promise<ShadowingTopicResumeResponse> {
    const response = await api.get<ApiResponse<ShadowingTopicResumeResponse>>(`/shadowing/topics/${topicId}/resume`)

    if (!response.data.data) {
      throw new Error('Shadowing_TopicNotFound_404')
    }

    return response.data.data
  },

  // ── Attempt Submission ───────────────────────────────────────────────────────

  async submitAttempt(payload: SubmitShadowingAttemptRequest): Promise<ShadowingAttemptResponse> {
    const formData = new FormData()
    formData.append('topicId', payload.topicId)
    formData.append('sentenceId', payload.sentenceId)
    formData.append('audio', payload.audio)

    if (payload.locale) {
      formData.append('locale', payload.locale)
    }

    const response = await api.post<ApiResponse<ShadowingAttemptResponse>>('/shadowing/attempts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (!response.data.data) {
      throw new Error('Shadowing_AssessmentFailed_500')
    }

    return response.data.data
  },

  // ── Attempt Detail ───────────────────────────────────────────────────────────

  async getAttempt(attemptId: string): Promise<ShadowingAttemptResponse> {
    const response = await api.get<ApiResponse<ShadowingAttemptResponse>>(`/shadowing/attempts/${attemptId}`)

    if (!response.data.data) {
      throw new Error('Shadowing_AttemptNotFound_404')
    }

    return response.data.data
  },

  // ── Attempt History ──────────────────────────────────────────────────────────

  async getAttemptHistory(
    params?: GetShadowingAttemptHistoryParams,
  ): Promise<{ items: ShadowingAttemptHistoryItemResponse[]; total: number; totalPage: number }> {
    const response = await api.get<ApiResponse<ShadowingAttemptHistoryItemResponse[]>>('/shadowing/attempts/history', {
      params,
    })

    const data = response.data.data ?? []
    const metaData = response.data.metaData

    return {
      items: data,
      total: metaData?.total ?? data.length,
      totalPage: metaData ? Math.ceil(metaData.total / metaData.pageSize) : 1,
    }
  },

  // ── Single Sentence Progress ─────────────────────────────────────────────────

  async getSentenceProgress(sentenceId: string): Promise<ShadowingSentenceProgressResponse> {
    const response = await api.get<ApiResponse<ShadowingSentenceProgressResponse>>(
      `/shadowing/sentences/${sentenceId}/progress`,
    )

    if (!response.data.data) {
      throw new Error('Shadowing_SentenceNotFound_404')
    }

    return response.data.data
  },
}
