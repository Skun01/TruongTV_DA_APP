export type ConversationScenario = 'Shopping' | 'Interview' | 'Direction' | 'Meeting' | 'Restaurant' | 'Custom'

export type ConversationLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1'

export type ConversationStatus = 'Active' | 'Completed'

export interface ScenarioItemResponse {
  id: ConversationScenario
  name: string
  icon: string
  description: string
}

export interface ScenarioListResponse {
  scenarios: ScenarioItemResponse[]
}

export interface StartConversationRequest {
  scenario: ConversationScenario
  level: ConversationLevel
  customScenario?: string
}

export interface AIVocabularyItem {
  word: string
  reading: string
  meaning: string
  example: string
}

export interface AIMessageResponse {
  text: string
  suggestions: string[]
  newVocabulary?: AIVocabularyItem[]
  grammarPoints?: string[]
}

export interface ConversationSummary {
  totalMessages: number
  userMessagesCount: number
  newWordsLearned: number
}

export interface StartConversationResponse {
  conversationId: string
  aiMessage: AIMessageResponse
}

export interface SendMessageRequest {
  userMessage: string
}

export interface SendMessageResponse {
  aiMessage: AIMessageResponse
  summary: ConversationSummary
}

export interface ConversationResultResponse {
  conversationId: string
  scenario: string
  level: ConversationLevel
  duration: string
  totalMessages: number
  newVocabulary: AIVocabularyItem[]
  grammarPoints: string[]
  feedback: string
  score: number
}

export interface ConversationListItemResponse {
  conversationId: string
  scenario: string
  level: ConversationLevel
  status: ConversationStatus
  startedAt: string
  completedAt: string | null
  totalMessages: number
  score: number | null
}

export interface ConversationMessage {
  id: string
  sender: 'User' | 'AI'
  text: string
  suggestions: string[]
  newVocabulary?: AIVocabularyItem[]
  grammarPoints?: string[]
  timestamp: string
}

export interface ConversationSession {
  conversationId: string
  scenario: string
  level: ConversationLevel
  status: ConversationStatus
  startedAt: string
  messages: ConversationMessage[]
  summary?: ConversationSummary
}

export interface GetConversationsParams {
  page?: number
  pageSize?: number
}
