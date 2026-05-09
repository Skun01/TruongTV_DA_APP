import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { CONVERSATION_ERROR_MESSAGES } from '@/constants/errors'
import { getApiErrorMessage } from '@/lib/apiError'
import { conversationService } from '@/services/conversationService'
import type {
  GetConversationsParams,
  StartConversationRequest,
} from '@/types/conversation'

export const CONVERSATION_QUERY_KEYS = {
  all: ['conversations'] as const,
  scenarios: ['conversations', 'scenarios'] as const,
  list: (params: GetConversationsParams) =>
    ['conversations', 'list', params] as const,
  detail: (id: string) => ['conversations', 'detail', id] as const,
  result: (id: string) => ['conversations', 'result', id] as const,
}

export function useConversationScenarios() {
  return useQuery({
    queryKey: CONVERSATION_QUERY_KEYS.scenarios,
    queryFn: () => conversationService.getScenarios(),
  })
}

export function useConversations(params: GetConversationsParams, enabled = true) {
  return useQuery({
    queryKey: CONVERSATION_QUERY_KEYS.list(params),
    queryFn: () => conversationService.getConversations(params),
    enabled,
  })
}

export function useConversationResult(conversationId: string, enabled = true) {
  return useQuery({
    queryKey: CONVERSATION_QUERY_KEYS.result(conversationId),
    queryFn: () => conversationService.getResult(conversationId),
    enabled: enabled && Boolean(conversationId),
  })
}

export function useConversationDetail(conversationId: string, enabled = true) {
  return useQuery({
    queryKey: CONVERSATION_QUERY_KEYS.detail(conversationId),
    queryFn: () => conversationService.getConversationDetail(conversationId),
    enabled: enabled && Boolean(conversationId),
  })
}

export function useCompleteConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (conversationId: string) =>
      conversationService.completeConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATION_QUERY_KEYS.all })
    },
    onError: (error) => {
      gooeyToast.error(
        getApiErrorMessage(error, CONVERSATION_ERROR_MESSAGES.default),
      )
    },
  })
}

export function useStartConversation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: StartConversationRequest) =>
      conversationService.startConversation(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CONVERSATION_QUERY_KEYS.all })
      navigate(`/ai-conversations/${data.conversationId}`)
    },
    onError: (error) => {
      gooeyToast.error(
        getApiErrorMessage(error, CONVERSATION_ERROR_MESSAGES.default),
      )
    },
  })
}

export function useSendMessage(conversationId: string) {
  return useMutation({
    mutationFn: (userMessage: string) =>
      conversationService.sendMessage(conversationId, { userMessage }),
  })
}

export function useDeleteConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (conversationId: string) =>
      conversationService.deleteConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONVERSATION_QUERY_KEYS.all })
      gooeyToast.success(CONVERSATION_ERROR_MESSAGES.conversationDeleted)
    },
    onError: (error) => {
      gooeyToast.error(
        getApiErrorMessage(error, CONVERSATION_ERROR_MESSAGES.default),
      )
    },
  })
}
