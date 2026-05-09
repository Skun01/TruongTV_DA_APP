import type { ApiResponse } from '@/types/api'
import type { CardAiExplainPayload, CardAiExplanationResponse } from '@/types/card'
import type { SearchCardSummary, SearchCardsParams } from '@/types/search'
import api from './api'

function buildSearchParams(params: SearchCardsParams) {
  return {
    q: params.q,
    cardType: params.cardType,
    level: params.level,
    page: params.page,
    pageSize: params.pageSize,
  }
}

export const cardService = {
  async search(params: SearchCardsParams): Promise<ApiResponse<SearchCardSummary[]>> {
    const response = await api.get<ApiResponse<SearchCardSummary[]>>('/cards/search', {
      params: buildSearchParams(params),
    })

    return response.data
  },

  async explain(
    cardId: string,
    payload: CardAiExplainPayload = {},
  ): Promise<ApiResponse<CardAiExplanationResponse>> {
    const response = await api.post<ApiResponse<CardAiExplanationResponse>>(
      `/cards/${cardId}/explain`,
      payload,
    )

    return response.data
  },
}
