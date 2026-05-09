import type { CardType, JlptLevel } from '@/types/vocabulary'

export interface CardAiExplainPayload {
  userQuestion?: string
}

export interface CardAiExplanationResponse {
  cardId: string
  cardType: CardType
  title: string
  level: JlptLevel | null
  answer: string
  model: string
}
