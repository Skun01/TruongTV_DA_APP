import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { SHADOWING_COPY } from '@/constants/shadowing'
import { SHADOWING_ERROR_MESSAGES } from '@/constants/errors'
import { getApiErrorMessage } from '@/lib/apiError'
import { shadowingService } from '@/services/shadowingService'
import type {
  GetShadowingAttemptHistoryParams,
  GetShadowingTopicsParams,
  SubmitShadowingAttemptRequest,
} from '@/types/shadowing'

// ── Query Keys ─────────────────────────────────────────────────────────────────

export const SHADOWING_QUERY_KEYS = {
  all: ['shadowing'] as const,
  topics: () => [...SHADOWING_QUERY_KEYS.all, 'topics'] as const,
  topic: (topicId: string) => [...SHADOWING_QUERY_KEYS.all, 'topic', topicId] as const,
  topicProgress: (topicId: string) => [...SHADOWING_QUERY_KEYS.all, 'progress', topicId] as const,
  topicSentenceProgress: (topicId: string) =>
    [...SHADOWING_QUERY_KEYS.all, 'sentence-progress', topicId] as const,
  topicResume: (topicId: string) => [...SHADOWING_QUERY_KEYS.all, 'resume', topicId] as const,
  attempt: (attemptId: string) => [...SHADOWING_QUERY_KEYS.all, 'attempt', attemptId] as const,
  attemptHistory: (params?: GetShadowingAttemptHistoryParams) =>
    [...SHADOWING_QUERY_KEYS.all, 'history', params] as const,
  sentenceProgress: (sentenceId: string) =>
    [...SHADOWING_QUERY_KEYS.all, 'sentence', sentenceId, 'progress'] as const,
}

// ── Topic Queries ──────────────────────────────────────────────────────────────

export function useShadowingTopics(params?: GetShadowingTopicsParams) {
  return useQuery({
    queryKey: SHADOWING_QUERY_KEYS.topics(),
    queryFn: () => shadowingService.getTopics(params),
  })
}

export function useShadowingTopic(topicId: string, enabled = true) {
  return useQuery({
    queryKey: SHADOWING_QUERY_KEYS.topic(topicId),
    queryFn: () => shadowingService.getTopic(topicId),
    enabled: enabled && Boolean(topicId),
  })
}

export function useShadowingTopicProgress(topicId: string, enabled = true) {
  return useQuery({
    queryKey: SHADOWING_QUERY_KEYS.topicProgress(topicId),
    queryFn: () => shadowingService.getTopicProgress(topicId),
    enabled: enabled && Boolean(topicId),
  })
}

export function useShadowingTopicSentenceProgress(topicId: string, enabled = true) {
  return useQuery({
    queryKey: SHADOWING_QUERY_KEYS.topicSentenceProgress(topicId),
    queryFn: () => shadowingService.getTopicSentenceProgress(topicId),
    enabled: enabled && Boolean(topicId),
  })
}

export function useShadowingTopicResume(topicId: string, enabled = true) {
  return useQuery({
    queryKey: SHADOWING_QUERY_KEYS.topicResume(topicId),
    queryFn: () => shadowingService.getTopicResume(topicId),
    enabled: enabled && Boolean(topicId),
  })
}

// ── Attempt Queries ────────────────────────────────────────────────────────────

export function useShadowingAttempt(attemptId: string, enabled = true) {
  return useQuery({
    queryKey: SHADOWING_QUERY_KEYS.attempt(attemptId),
    queryFn: () => shadowingService.getAttempt(attemptId),
    enabled: enabled && Boolean(attemptId),
  })
}

export function useShadowingAttemptHistory(params?: GetShadowingAttemptHistoryParams) {
  return useQuery({
    queryKey: SHADOWING_QUERY_KEYS.attemptHistory(params),
    queryFn: () => shadowingService.getAttemptHistory(params),
  })
}

// ── Sentence Queries ───────────────────────────────────────────────────────────

export function useShadowingSentenceProgress(sentenceId: string, enabled = true) {
  return useQuery({
    queryKey: SHADOWING_QUERY_KEYS.sentenceProgress(sentenceId),
    queryFn: () => shadowingService.getSentenceProgress(sentenceId),
    enabled: enabled && Boolean(sentenceId),
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useSubmitShadowingAttempt() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SubmitShadowingAttemptRequest) => shadowingService.submitAttempt(payload),
    onSuccess: async (data) => {
      // Invalidate related queries
      await queryClient.invalidateQueries({
        queryKey: SHADOWING_QUERY_KEYS.topicProgress(data.topicId),
      })
      await queryClient.invalidateQueries({
        queryKey: SHADOWING_QUERY_KEYS.topicSentenceProgress(data.topicId),
      })
      await queryClient.invalidateQueries({
        queryKey: SHADOWING_QUERY_KEYS.topicResume(data.topicId),
      })
      await queryClient.invalidateQueries({
        queryKey: SHADOWING_QUERY_KEYS.attemptHistory(),
      })
      await queryClient.invalidateQueries({
        queryKey: SHADOWING_QUERY_KEYS.sentenceProgress(data.sentenceId),
      })

      gooeyToast.success(SHADOWING_COPY.attemptSubmitted)
    },
    onError: (error) => {
      gooeyToast.error(
        getApiErrorMessage(error, SHADOWING_ERROR_MESSAGES.default_shadowing),
      )
    },
  })
}
