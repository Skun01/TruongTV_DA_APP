import { GearIcon } from '@phosphor-icons/react'
import { LEARNING_COPY } from '@/constants/learning'
import type {
  FlashcardSide,
  MultipleChoiceDirection,
  StudyMode,
  StudySessionSettingsRequest,
} from '@/types/learning'

interface StudySettingsPanelProps {
  mode: StudyMode
  settings: StudySessionSettingsRequest
  onSettingsChange: (settings: StudySessionSettingsRequest) => void
}

export function StudySettingsPanel({
  mode,
  settings,
  onSettingsChange,
}: StudySettingsPanelProps) {
  const showFlashcardSettings = mode === 'Flashcard'
  const showMcqSettings = mode === 'MultipleChoice'
  const showShuffle = mode === 'MultipleChoice'

  if (!showFlashcardSettings && !showMcqSettings && !showShuffle) {
    return null
  }

  return (
    <section className="space-y-3">
      <h3 className="section-label-text flex items-center gap-2">
        <GearIcon size={16} />
        {LEARNING_COPY.settingsTitle}
      </h3>

      <div className="space-y-3 rounded-2xl p-4 feature-card">
        {showFlashcardSettings && (
          <>
            <SettingRow label={LEARNING_COPY.flashcardFrontLabel}>
              <SelectField
                value={settings.flashcardFront ?? 'Title'}
                options={LEARNING_COPY.flashcardSideLabels}
                onChange={(v) =>
                  onSettingsChange({
                    ...settings,
                    flashcardFront: v as FlashcardSide,
                  })
                }
              />
            </SettingRow>
            <SettingRow label={LEARNING_COPY.flashcardBackLabel}>
              <SelectField
                value={settings.flashcardBack ?? 'Summary'}
                options={LEARNING_COPY.flashcardSideLabels}
                onChange={(v) =>
                  onSettingsChange({
                    ...settings,
                    flashcardBack: v as FlashcardSide,
                  })
                }
              />
            </SettingRow>
          </>
        )}

        {showMcqSettings && (
          <SettingRow label={LEARNING_COPY.mcqDirectionLabel}>
            <SelectField
              value={settings.multipleChoiceQuestion ?? 'TitleToSummary'}
              options={LEARNING_COPY.mcqDirectionLabels}
              onChange={(v) =>
                onSettingsChange({
                  ...settings,
                  multipleChoiceQuestion: v as MultipleChoiceDirection,
                })
              }
            />
          </SettingRow>
        )}

        {showShuffle && (
          <SettingRow label={LEARNING_COPY.shuffleLabel}>
            <button
              type="button"
              onClick={() =>
                onSettingsChange({
                  ...settings,
                  shuffleOptions: !(settings.shuffleOptions ?? true),
                })
              }
              className={`relative h-6 w-11 rounded-full transition-colors ${
                (settings.shuffleOptions ?? true)
                  ? 'bg-primary'
                  : 'bg-muted-foreground/20'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  (settings.shuffleOptions ?? true) ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </SettingRow>
        )}
      </div>
    </section>
  )
}

function SettingRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

function SelectField({
  value,
  options,
  onChange,
}: {
  value: string
  options: Record<string, string>
  onChange: (value: string) => void
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-border/70 bg-background px-3 py-1.5 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-ring/20"
    >
      {Object.entries(options).map(([key, label]) => (
        <option key={key} value={key}>
          {label}
        </option>
      ))}
    </select>
  )
}
