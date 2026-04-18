import { SpinnerGapIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { LEARNING_COPY } from '@/constants/learning'
import type {
  FlashcardSide,
  MultipleChoiceDirection,
  StudySessionSettingsResponse,
  StudySessionSettingsRequest,
} from '@/types/learning'
import { useState } from 'react'

interface LearningSettingsCardProps {
  settings: StudySessionSettingsResponse | undefined
  isLoading: boolean
  onSave: (payload: StudySessionSettingsRequest) => void
  isPending: boolean
}

type LanguageOption = 'Japanese' | 'Vietnamese'

export function LearningSettingsCard({
  settings,
  isLoading,
  onSave,
  isPending,
}: LearningSettingsCardProps) {
  const [draft, setDraft] = useState<StudySessionSettingsRequest | null>(null)

  const current = draft ?? settings
  const isDirty =
    draft !== null &&
    settings !== undefined &&
    (draft.flashcardFront !== settings.flashcardFront ||
      draft.flashcardBack !== settings.flashcardBack ||
      draft.multipleChoiceQuestion !== settings.multipleChoiceQuestion ||
      draft.shuffleOptions !== settings.shuffleOptions)

  if (isLoading) {
    return (
      <div className="h-48 animate-pulse rounded-2xl section-card-surface" />
    )
  }

  if (!current) return null

  function updateDraft(patch: Partial<StudySessionSettingsRequest>) {
    setDraft((prev) => ({
      flashcardFront: prev?.flashcardFront ?? settings?.flashcardFront ?? 'Title',
      flashcardBack: prev?.flashcardBack ?? settings?.flashcardBack ?? 'Summary',
      multipleChoiceQuestion:
        prev?.multipleChoiceQuestion ??
        settings?.multipleChoiceQuestion ??
        'TitleToSummary',
      shuffleOptions: prev?.shuffleOptions ?? settings?.shuffleOptions ?? true,
      ...patch,
    }))
  }

  function toLanguageOption(side: FlashcardSide): LanguageOption {
    return side === 'Title' ? 'Japanese' : 'Vietnamese'
  }

  function toFlashcardSides(frontLanguage: LanguageOption): Pick<
    StudySessionSettingsRequest,
    'flashcardFront' | 'flashcardBack'
  > {
    return frontLanguage === 'Japanese'
      ? { flashcardFront: 'Title', flashcardBack: 'Summary' }
      : { flashcardFront: 'Summary', flashcardBack: 'Title' }
  }

  function toMcqDirection(questionLanguage: LanguageOption): MultipleChoiceDirection {
    return questionLanguage === 'Japanese'
      ? 'TitleToSummary'
      : 'SummaryToTitle'
  }

  const flashcardFrontLanguage = toLanguageOption(
    current.flashcardFront ?? 'Title',
  )
  const mcqQuestionLanguage: LanguageOption = (current.multipleChoiceQuestion ?? 'TitleToSummary') === 'TitleToSummary'
      ? 'Japanese'
      : 'Vietnamese'

  return (
    <div className="space-y-4 rounded-2xl p-5 section-card-surface section-card-elevation">
      <SettingRow label={LEARNING_COPY.defaultFlashcardFrontLabel}>
        <SelectField
          value={flashcardFrontLanguage}
          options={LEARNING_COPY.languageOptionLabels}
          onChange={(v) => updateDraft(toFlashcardSides(v))}
        />
      </SettingRow>

      <SettingRow label={LEARNING_COPY.defaultMcqQuestionLabel}>
        <SelectField
          value={mcqQuestionLanguage}
          options={LEARNING_COPY.languageOptionLabels}
          onChange={(v) =>
            updateDraft({
              multipleChoiceQuestion: toMcqDirection(v),
            })
          }
        />
      </SettingRow>

      <SettingRow label={LEARNING_COPY.defaultShuffleFlashcardLabel}>
        <Switch
          checked={current.shuffleOptions ?? true}
          onCheckedChange={(checked) =>
            updateDraft({
              shuffleOptions: checked,
            })}
        />
      </SettingRow>

      {isDirty && (
        <Button
          onClick={() => {
            if (draft) {
              onSave(draft)
              setDraft(null)
            }
          }}
          disabled={isPending}
          className="w-full rounded-full"
        >
          {isPending && (
            <SpinnerGapIcon size={16} className="animate-spin" />
          )}
          {LEARNING_COPY.saveSettings}
        </Button>
      )}
    </div>
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
  value: LanguageOption
  options: Record<LanguageOption, string>
  onChange: (value: LanguageOption) => void
}) {
  return (
    <Select
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue === 'Japanese' || nextValue === 'Vietnamese') {
          onChange(nextValue)
        }
      }}
    >
      <SelectTrigger className="h-10 w-[180px] rounded-lg border-border/70 px-3 py-1.5 text-sm font-medium">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(options).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
