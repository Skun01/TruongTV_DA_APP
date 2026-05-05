import { GearIcon } from '@phosphor-icons/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  const showShuffle = mode === 'MultipleChoice' || mode === 'FillInBlank'

  if (!showFlashcardSettings && !showMcqSettings && !showShuffle) {
    return (
      <section className="space-y-3">
        <h3 className="section-label-text flex items-center gap-2">
          <GearIcon size={16} />
          {LEARNING_COPY.settingsTitle}
        </h3>
        <div className="rounded-2xl p-4 feature-card">
          <p className="text-sm text-muted-foreground">
            {LEARNING_COPY.noSettingsForMode}
          </p>
        </div>
      </section>
    )
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
                    flashcardFront: v,
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
                    flashcardBack: v,
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
                  multipleChoiceQuestion: v,
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
  value: FlashcardSide
  options: Record<FlashcardSide, string>
  onChange: (value: FlashcardSide) => void
}): React.ReactElement
function SelectField({
  value,
  options,
  onChange,
}: {
  value: MultipleChoiceDirection
  options: Record<MultipleChoiceDirection, string>
  onChange: (value: MultipleChoiceDirection) => void
}): React.ReactElement
function SelectField<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: Record<T, string>
  onChange: (value: T) => void
}) {
  const optionEntries = Object.entries(options) as Array<[T, string]>

  return (
    <Select
      value={value}
      onValueChange={(nextValue) => onChange(nextValue as T)}
    >
      <SelectTrigger className="h-10 w-[172px] rounded-lg border-border/70 px-3 py-1.5 text-sm font-medium">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {optionEntries.map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
