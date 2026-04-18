import { GearIcon, SpinnerGapIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
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
      <section className="space-y-3">
        <h2 className="section-title-text">{LEARNING_COPY.settingsSectionTitle}</h2>
        <div className="h-48 animate-pulse rounded-2xl section-card-surface" />
      </section>
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

  return (
    <section className="space-y-3">
      <h2 className="section-title-text flex items-center gap-2">
        <GearIcon size={20} weight="duotone" />
        {LEARNING_COPY.settingsSectionTitle}
      </h2>

      <div className="space-y-4 rounded-2xl p-5 section-card-surface section-card-elevation">
        <SettingRow label={LEARNING_COPY.flashcardFrontLabel}>
          <SelectField
            value={(current.flashcardFront as string) ?? 'Title'}
            options={LEARNING_COPY.flashcardSideLabels}
            onChange={(v) => updateDraft({ flashcardFront: v as FlashcardSide })}
          />
        </SettingRow>

        <SettingRow label={LEARNING_COPY.flashcardBackLabel}>
          <SelectField
            value={(current.flashcardBack as string) ?? 'Summary'}
            options={LEARNING_COPY.flashcardSideLabels}
            onChange={(v) => updateDraft({ flashcardBack: v as FlashcardSide })}
          />
        </SettingRow>

        <SettingRow label={LEARNING_COPY.mcqDirectionLabel}>
          <SelectField
            value={(current.multipleChoiceQuestion as string) ?? 'TitleToSummary'}
            options={LEARNING_COPY.mcqDirectionLabels}
            onChange={(v) =>
              updateDraft({ multipleChoiceQuestion: v as MultipleChoiceDirection })
            }
          />
        </SettingRow>

        <SettingRow label={LEARNING_COPY.shuffleLabel}>
          <button
            type="button"
            onClick={() =>
              updateDraft({
                shuffleOptions: !(current.shuffleOptions ?? true),
              })
            }
            className={`relative h-6 w-11 rounded-full transition-colors ${
              (current.shuffleOptions ?? true)
                ? 'bg-primary'
                : 'bg-muted-foreground/20'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                (current.shuffleOptions ?? true) ? 'translate-x-5' : ''
              }`}
            />
          </button>
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
