import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { JLPT_EXAM_ERROR_MESSAGES } from '@/constants/errors'
import { getApiErrorMessage } from '@/lib/apiError'
import { jlptExamService } from '@/services/jlptExamService'
import type {
  GetExamSessionsParams,
  GetJlptExamsParams,
  SaveAnswerPayload,
} from '@/types/jlptExam'

export const JLPT_EXAM_QUERY_KEYS = {
  all: ['jlpt-exams'] as const,
  list: (params: GetJlptExamsParams) => ['jlpt-exams', 'list', params] as const,
  detail: (examId: string) => ['jlpt-exams', 'detail', examId] as const,
  activeSession: (examId: string) => ['jlpt-exams', 'active-session', examId] as const,
  session: (sessionId: string) => ['exam-sessions', sessionId] as const,
  result: (sessionId: string) => ['exam-sessions', 'result', sessionId] as const,
  history: (params: GetExamSessionsParams) => ['exam-sessions', 'history', params] as const,
}

export function useJlptExams(params: GetJlptExamsParams) {
  return useQuery({
    queryKey: JLPT_EXAM_QUERY_KEYS.list(params),
    queryFn: () => jlptExamService.getPublishedExams(params),
  })
}

export function useJlptExamDetail(examId: string, enabled = true) {
  return useQuery({
    queryKey: JLPT_EXAM_QUERY_KEYS.detail(examId),
    queryFn: () => jlptExamService.getExamDetail(examId),
    enabled: enabled && Boolean(examId),
  })
}

export function useActiveExamSession(examId: string, enabled = true) {
  return useQuery({
    queryKey: JLPT_EXAM_QUERY_KEYS.activeSession(examId),
    queryFn: () => jlptExamService.checkActiveSession(examId),
    enabled: enabled && Boolean(examId),
  })
}

export function useExamSession(sessionId: string, enabled = true) {
  return useQuery({
    queryKey: JLPT_EXAM_QUERY_KEYS.session(sessionId),
    queryFn: () => jlptExamService.getSession(sessionId),
    enabled: enabled && Boolean(sessionId),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })
}

export function useStartExamSession() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (examId: string) => jlptExamService.startSession({ examId }),
    onSuccess: (session) => {
      queryClient.setQueryData(JLPT_EXAM_QUERY_KEYS.session(session.sessionId), session)
      navigate(`/jlpt/session/${session.sessionId}`)
    },
    onError: (error) => {
      gooeyToast.error(getApiErrorMessage(error, JLPT_EXAM_ERROR_MESSAGES.default_jlptExam))
    },
  })
}

export function useSaveAnswer(sessionId: string) {
  return useMutation({
    mutationFn: (payload: SaveAnswerPayload) =>
      jlptExamService.saveAnswer(sessionId, payload),
  })
}

export function useSubmitExamSession(sessionId: string) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => jlptExamService.submitSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JLPT_EXAM_QUERY_KEYS.all })
      navigate(`/jlpt/session/${sessionId}/result`)
    },
    onError: (error) => {
      gooeyToast.error(getApiErrorMessage(error, JLPT_EXAM_ERROR_MESSAGES.default_jlptExam))
    },
  })
}

export function useExamResult(sessionId: string, enabled = true) {
  return useQuery({
    queryKey: JLPT_EXAM_QUERY_KEYS.result(sessionId),
    queryFn: () => jlptExamService.getResult(sessionId),
    enabled: enabled && Boolean(sessionId),
  })
}

export function useExamSessionHistory(params: GetExamSessionsParams) {
  return useQuery({
    queryKey: JLPT_EXAM_QUERY_KEYS.history(params),
    queryFn: () => jlptExamService.getSessionHistory(params),
  })
}
