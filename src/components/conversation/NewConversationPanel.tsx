import { CONVERSATION_COPY } from '@/constants/conversation'
import { ConversationScenarioSelector } from './ConversationScenarioSelector'
import { Button } from '@/components/ui/button'
import type { ConversationLevel, ScenarioItemResponse } from '@/types/conversation'

interface NewConversationPanelProps {
  scenarios: ScenarioItemResponse[]
  isLoading: boolean
  onStart: (scenarioId: string, level: ConversationLevel, customScenario?: string) => void
  isStarting: boolean
  onClose: () => void
}

export function NewConversationPanel({
  scenarios,
  isLoading,
  onStart,
  isStarting,
  onClose,
}: NewConversationPanelProps) {
  return (
    <div className="mb-8 rounded-2xl border border-border/50 bg-surface-container-low p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          {CONVERSATION_COPY.startConversation}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          {CONVERSATION_COPY.close}
        </Button>
      </div>
      <ConversationScenarioSelector
        scenarios={scenarios}
        isLoading={isLoading}
        onStart={onStart}
        isStarting={isStarting}
      />
    </div>
  )
}
