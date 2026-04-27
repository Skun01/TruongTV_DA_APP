// Shadowing Module Types for learning-app
// API Endpoints: /api/shadowing/*

// ── Enums ────────────────────────────────────────────────────────────────────

export type ShadowingLevel = 'N1' | 'N2' | 'N3' | 'N4' | 'N5'

export type ShadowingVisibility = 'Public' | 'Private'

export type ShadowingStatus = 'Draft' | 'Published' | 'Archived'

// ── Request Types ───────────────────────────────────────────────────────────

export interface GetShadowingTopicsParams {
  q?: string
  level?: ShadowingLevel
  visibility?: ShadowingVisibility
  officialOnly?: boolean
  page?: number
  pageSize?: number
}

export interface GetShadowingAttemptHistoryParams {
  topicId?: string
  sentenceId?: string
  page?: number
  pageSize?: number
}

export interface SubmitShadowingAttemptRequest {
  topicId: string
  sentenceId: string
  locale?: string
  audio: File
}

// ── Response Types ───────────────────────────────────────────────────────────

export interface ShadowingTopicListItemResponse {
  id: string
  title: string
  description: string
  coverImageUrl: string | null
  level: ShadowingLevel | null
  visibility: ShadowingVisibility
  status: ShadowingStatus
  isOfficial: boolean
  sentencesCount: number
  isOwner: boolean
  creatorId: string
  creatorName: string
  createdAt: string
  updatedAt: string | null
}

export interface ShadowingTopicSentenceResponse {
  sentenceId: string
  position: number
  text: string
  meaning: string
  audioUrl: string | null
  level: ShadowingLevel | null
  note: string | null
}

export interface ShadowingTopicDetailResponse {
  id: string
  title: string
  description: string
  coverImageUrl: string | null
  level: ShadowingLevel | null
  visibility: ShadowingVisibility
  status: ShadowingStatus
  isOfficial: boolean
  sentencesCount: number
  isOwner: boolean
  creatorId: string
  creatorName: string
  sentences: ShadowingTopicSentenceResponse[]
  createdAt: string
  updatedAt: string | null
}

export interface ShadowingAttemptResponse {
  attemptId: string
  topicId: string
  topicTitle: string
  sentenceId: string
  sentenceText: string
  audioAssetId: string
  audioUrl: string
  locale: string
  recognizedText: string | null
  pronScore: number | null
  accuracyScore: number | null
  fluencyScore: number | null
  completenessScore: number | null
  prosodyScore: number | null
  errorTypes: string[]
  wordAssessments: ShadowingAttemptWordAssessmentResponse[]
  durationMs: number | null
  createdAt: string
}

export interface ShadowingAttemptWordAssessmentResponse {
  word: string
  displayWord: string | null
  accuracyScore: number | null
  errorType: string | null
}

export interface ShadowingAttemptHistoryItemResponse {
  attemptId: string
  topicId: string
  topicTitle: string
  sentenceId: string
  sentenceText: string
  locale: string
  pronScore: number | null
  accuracyScore: number | null
  fluencyScore: number | null
  completenessScore: number | null
  prosodyScore: number | null
  createdAt: string
}

export interface ShadowingSentenceProgressResponse {
  sentenceId: string
  attemptsCount: number
  bestPronScore: number | null
  latestPronScore: number | null
  lastAttemptAt: string | null
}

export interface ShadowingTopicProgressResponse {
  topicId: string
  sentencesCount: number
  attemptedSentencesCount: number
  completedSentencesCount: number
  bestPronScore: number | null
  latestPronScore: number | null
  lastAttemptAt: string | null
}

export interface ShadowingTopicSentenceProgressItemResponse {
  sentenceId: string
  position: number
  text: string
  meaning: string
  audioUrl: string | null
  level: ShadowingLevel | null
  attemptsCount: number
  bestPronScore: number | null
  latestPronScore: number | null
  lastAttemptAt: string | null
  hasAttempted: boolean
}

export interface ShadowingTopicResumeResponse {
  topicId: string
  recommendedSentenceId: string | null
  lastAttemptSentenceId: string | null
  attemptedSentencesCount: number
  remainingSentencesCount: number
  latestPronScore: number | null
  lastAttemptAt: string | null
}

