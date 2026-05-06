import type {
  ScenarioListResponse,
  StartConversationRequest,
  StartConversationResponse,
  SendMessageRequest,
  SendMessageResponse,
  ConversationResultResponse,
  ConversationListItemResponse,
  GetConversationsParams,
} from '@/types/conversation'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import api from './api'

export const conversationService = {
  async getScenarios(): Promise<ScenarioListResponse> {
    const response = await api.get<ApiResponse<ScenarioListResponse>>(
      '/conversations/scenarios',
    )
    return response.data.data ?? { scenarios: [] }
  },

  async startConversation(
    payload: StartConversationRequest,
  ): Promise<StartConversationResponse> {
    const response = await api.post<ApiResponse<StartConversationResponse>>(
      '/conversations/start',
      payload,
    )
    if (!response.data.data) {
      throw new Error('Failed to start conversation')
    }
    return response.data.data
  },

  async sendMessage(
    conversationId: string,
    payload: SendMessageRequest,
  ): Promise<SendMessageResponse> {
    const response = await api.post<ApiResponse<SendMessageResponse>>(
      `/conversations/${conversationId}/message`,
      payload,
    )
    if (!response.data.data) {
      throw new Error('Failed to send message')
    }
    return response.data.data
  },

  async getResult(conversationId: string): Promise<ConversationResultResponse> {
    const response = await api.get<ApiResponse<ConversationResultResponse>>(
      `/conversations/${conversationId}/result`,
    )
    if (!response.data.data) {
      throw new Error('Failed to get conversation result')
    }
    return response.data.data
  },

  async getConversations(
    params: GetConversationsParams,
  ): Promise<{
    items: ConversationListItemResponse[]
    meta: { totalItems: number; page: number; pageSize: number } | null
  }> {
    const response = await api.get<PaginatedResponse<ConversationListItemResponse>>(
      '/conversations',
      { params },
    )
    const meta = response.data.metaData
    return {
      items: response.data.data ?? [],
      meta: meta
        ? { totalItems: meta.total, page: meta.page, pageSize: meta.pageSize }
        : null,
    }
  },

  async deleteConversation(conversationId: string): Promise<boolean> {
    const response = await api.delete<ApiResponse<boolean>>(
      `/conversations/${conversationId}`,
    )
    return response.data.data ?? false
  },
}
