import { CardsThreeIcon, ListChecksIcon, PencilLineIcon } from '@phosphor-icons/react'
import { LEARNING_COPY } from '@/constants/learning'
import type { StudyMode } from '@/types/learning'

interface StudyModeSelectorProps {
  value: StudyMode
  onChange: (mode: StudyMode) => void
}

const MODES: Array<{
  mode: StudyMode
  icon: typeof CardsThreeIcon
  iconWeight: 'duotone'
}> = [
  { mode: 'Flashcard', icon: CardsThreeIcon, iconWeight: 'duotone' },
  { mode: 'MultipleChoice', icon: ListChecksIcon, iconWeight: 'duotone' },
  { mode: 'FillInBlank', icon: PencilLineIcon, iconWeight: 'duotone' },
]

export function StudyModeSelector({ value, onChange }: StudyModeSelectorProps) {
  return (
    <section className="space-y-3">
      <h3 className="section-label-text">{LEARNING_COPY.selectModeTitle}</h3>

      <div className="grid gap-2 sm:grid-cols-3">
        {MODES.map(({ mode, icon: Icon }) => {
          const isSelected = value === mode

          return (
            <button
              key={mode}
              type="button"
              onClick={() => onChange(mode)}
              className={`flex flex-col items-start gap-2 rounded-2xl p-4 text-left transition-all duration-200 ${
                isSelected
                  ? 'ring-2 ring-primary bg-primary/5 dark:bg-primary/10'
                  : 'section-card-surface section-card-elevation hover:section-card-elevation-hover'
              }`}
            >
              <Icon
                size={24}
                weight="duotone"
                className={isSelected ? 'text-primary' : 'text-muted-foreground'}
              />
              <div>
                <p
                  className={`text-sm font-bold ${
                    isSelected ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {LEARNING_COPY.modeLabels[mode]}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {LEARNING_COPY.modeDescriptions[mode]}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
