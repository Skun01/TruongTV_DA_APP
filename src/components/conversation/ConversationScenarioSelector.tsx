import { useState } from 'react'
import {
  ShoppingBagIcon,
  BriefcaseIcon,
  MapPinIcon,
  HandshakeIcon,
  ForkKnifeIcon,
  SparkleIcon,
} from '@phosphor-icons/react'
import { CONVERSATION_COPY } from '@/constants/conversation'
import type { ConversationLevel, ScenarioItemResponse } from '@/types/conversation'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const SCENARIO_ICONS: Record<string, React.ReactNode> = {
  Shopping: <ShoppingBagIcon size={24} />,
  Interview: <BriefcaseIcon size={24} />,
  Direction: <MapPinIcon size={24} />,
  Meeting: <HandshakeIcon size={24} />,
  Restaurant: <ForkKnifeIcon size={24} />,
  Custom: <SparkleIcon size={24} />,
}
interface ConversationScenarioSelectorProps {
  scenarios: ScenarioItemResponse[]
  isLoading: boolean
  onStart: (scenarioId: string, level: ConversationLevel, customScenario?: string) => void
  isStarting: boolean
}

export function ConversationScenarioSelector({
  scenarios,
  isLoading,
  onStart,
  isStarting,
}: ConversationScenarioSelectorProps) {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<ConversationLevel>('N5')
  const [customScenario, setCustomScenario] = useState('')

  const handleStart = () => {
    if (!selectedScenario) return
    if (selectedScenario === 'Custom' && !customScenario.trim()) return
    onStart(
      selectedScenario,
      selectedLevel,
      selectedScenario === 'Custom' ? customScenario : undefined,
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-surface-container-low" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Scenario Selection */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          {CONVERSATION_COPY.selectScenario}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              onClick={() => setSelectedScenario(scenario.id)}
              className={`flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                selectedScenario === scenario.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border/50 bg-surface-container-low hover:bg-surface-container'
              }`}
            >
              <span className="text-muted-foreground">{SCENARIO_ICONS[scenario.id] || <SparkleIcon size={24} />}</span>
              <div>
                <p className="font-semibold text-foreground">{scenario.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {scenario.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Custom Scenario Input */}
      {selectedScenario === 'Custom' && (
        <section className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {CONVERSATION_COPY.customScenarioPlaceholder}
          </label>
          <textarea
            value={customScenario}
            onChange={(e) => setCustomScenario(e.target.value)}
            placeholder={CONVERSATION_COPY.customScenarioPlaceholder}
            className="min-h-24 w-full rounded-xl border border-border/50 bg-surface-container-low p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </section>
      )}

      {/* Level Selection */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">
          {CONVERSATION_COPY.selectLevel}
        </h2>
        <Select
          value={selectedLevel}
          onValueChange={(v) => setSelectedLevel(v as ConversationLevel)}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(['N5', 'N4', 'N3', 'N2', 'N1'] as ConversationLevel[]).map((level) => (
              <SelectItem key={level} value={level}>
                {CONVERSATION_COPY.levelLabels[level]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      {/* Start Button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          disabled={!selectedScenario || (selectedScenario === 'Custom' && !customScenario.trim()) || isStarting}
          onClick={handleStart}
        >
          {isStarting ? (
            <>
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {'...'}
            </>
          ) : (
            CONVERSATION_COPY.startConversation
          )}
        </Button>
      </div>
    </div>
  )
}
