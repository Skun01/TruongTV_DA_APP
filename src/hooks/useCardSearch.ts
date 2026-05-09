import { useMutation, useQuery } from '@tanstack/react-query'
import { cardService } from '@/services/cardService'
import type { CardAiExplainPayload } from '@/types/card'
import type { SearchCardsParams } from '@/types/search'

export const CARD_QUERY_KEYS = {
  all: ['cards'] as const,
  search: (params: SearchCardsParams) => ['cards', 'search', params] as const,
}

export function useCardSearch(params: SearchCardsParams, enabled: boolean) {
  return useQuery({
    queryKey: CARD_QUERY_KEYS.search(params),
    queryFn: async () => {
      const response = await cardService.search(params)
      return response
    },
    enabled,
  })
}

export function useExplainCard(cardId: string) {
  return useMutation({
    mutationFn: (payload: CardAiExplainPayload) => cardService.explain(cardId, payload),
  })
}
