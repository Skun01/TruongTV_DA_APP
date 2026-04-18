import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { LEARNING_COPY } from '@/constants/learning'
import { LEARNING_ERROR_MESSAGES } from '@/constants/errors'
import { getApiErrorMessage } from '@/lib/apiError'
import { learningService } from '@/services/learningService'
import type {
  CreateSessionPayload,
  StudySessionSettingsRequest,
  SubmitStudyAnswerRequest,
} from '@/types/learning'

// ── Query Keys ─────────────────────────────────────────────────────────────────

export const LEARNING_QUERY_KEYS = {
  all: ['learning'] as const,
  sessions: () => [...LEARNING_QUERY_KEYS.all, 'sessions'] as const,
  session: (sessionId: string) => [...LEARNING_QUERY_KEYS.sessions(), sessionId] as const,
  history: (limit: number) => [...LEARNING_QUERY_KEYS.all, 'history', limit] as const,
  nextQuestion: (sessionId: string) => [...LEARNING_QUERY_KEYS.all, 'next', sessionId] as const,
  result: (sessionId: string) => [...LEARNING_QUERY_KEYS.all, 'result', sessionId] as const,
  reviewToday: (deckId?: string) => [...LEARNING_QUERY_KEYS.all, 'review-today', deckId] as const,
  dueCards: () => [...LEARNING_QUERY_KEYS.all, 'due-cards'] as const,
  cardProgress: (cardId: string) => [...LEARNING_QUERY_KEYS.all, 'progress', cardId] as const,
  settings: () => [...LEARNING_QUERY_KEYS.all, 'settings'] as const,
}

// ── Review & Dashboard ─────────────────────────────────────────────────────────

export function useReviewToday(deckId?: string) {
  return useQuery({
    queryKey: LEARNING_QUERY_KEYS.reviewToday(deckId),
    queryFn: () => learningService.getReviewToday(deckId),
  })
}

export function useDueCards(enabled = true) {
  return useQuery({
    queryKey: LEARNING_QUERY_KEYS.dueCards(),
    queryFn: () => learningService.getDueCards(),
    enabled,
  })
}

export function useStudyHistory(limit = 10) {
  return useQuery({
    queryKey: LEARNING_QUERY_KEYS.history(limit),
    queryFn: () => learningService.getHistory(limit),
  })
}

export function useCardProgress(cardId: string, enabled = true) {
  return useQuery({
    queryKey: LEARNING_QUERY_KEYS.cardProgress(cardId),
    queryFn: () => learningService.getCardProgress(cardId),
    enabled: enabled && Boolean(cardId),
  })
}

// ── Settings ───────────────────────────────────────────────────────────────────

export function useLearningSettings() {
  return useQuery({
    queryKey: LEARNING_QUERY_KEYS.settings(),
    queryFn: () => learningService.getSettings(),
  })
}

export function useUpdateLearningSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: StudySessionSettingsRequest) =>
      learningService.updateSettings(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(LEARNING_QUERY_KEYS.settings(), data)
      gooeyToast.success(LEARNING_COPY.settingsSaved)
    },
    onError: (error) => {
      gooeyToast.error(
        getApiErrorMessage(error, LEARNING_ERROR_MESSAGES.default_learning),
      )
    },
  })
}

// ── Session CRUD ───────────────────────────────────────────────────────────────

export function useCreateSession() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateSessionPayload) =>
      learningService.createSession(payload),
    onSuccess: async (session) => {
      queryClient.setQueryData(LEARNING_QUERY_KEYS.session(session.id), session)
      await queryClient.invalidateQueries({ queryKey: LEARNING_QUERY_KEYS.sessions() })
      navigate(`/study/${session.id}`)
    },
    onError: (error) => {
      gooeyToast.error(
        getApiErrorMessage(error, LEARNING_ERROR_MESSAGES.default_learning),
      )
    },
  })
}

export function useSessionDetail(sessionId: string, enabled = true) {
  return useQuery({
    queryKey: LEARNING_QUERY_KEYS.session(sessionId),
    queryFn: () => learningService.getSession(sessionId),
    enabled: enabled && Boolean(sessionId),
  })
}

export function useDeleteSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sessionId: string) => learningService.deleteSession(sessionId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: LEARNING_QUERY_KEYS.all })
      gooeyToast.success(LEARNING_COPY.sessionDeleted)
    },
    onError: (error) => {
      gooeyToast.error(
        getApiErrorMessage(error, LEARNING_ERROR_MESSAGES.default_learning),
      )
    },
  })
}

export function useRestartSession() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sessionId: string) => learningService.restartSession(sessionId),
    onSuccess: async (session) => {
      queryClient.setQueryData(LEARNING_QUERY_KEYS.session(session.id), session)
      await queryClient.invalidateQueries({ queryKey: LEARNING_QUERY_KEYS.all })
      navigate(`/study/${session.id}`)
    },
    onError: (error) => {
      gooeyToast.error(
        getApiErrorMessage(error, LEARNING_ERROR_MESSAGES.default_learning),
      )
    },
  })
}

// ── Study Flow ─────────────────────────────────────────────────────────────────

export function useNextQuestion(sessionId: string, enabled = true) {
  return useQuery({
    queryKey: LEARNING_QUERY_KEYS.nextQuestion(sessionId),
    queryFn: () => learningService.getNextQuestion(sessionId),
    enabled: enabled && Boolean(sessionId),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })
}

export function useSubmitAnswer(sessionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SubmitStudyAnswerRequest) =>
      learningService.submitAnswer(sessionId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: LEARNING_QUERY_KEYS.session(sessionId),
      })
    },
    onError: (error) => {
      gooeyToast.error(
        getApiErrorMessage(error, LEARNING_ERROR_MESSAGES.default_learning),
      )
    },
  })
}

export function useSessionResult(sessionId: string, enabled = true) {
  return useQuery({
    queryKey: LEARNING_QUERY_KEYS.result(sessionId),
    queryFn: () => learningService.getResult(sessionId),
    enabled: enabled && Boolean(sessionId),
  })
}
