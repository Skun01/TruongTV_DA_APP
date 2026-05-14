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
}> = [
  { mode: 'Flashcard', icon: CardsThreeIcon },
  { mode: 'MultipleChoice', icon: ListChecksIcon },
  { mode: 'FillInBlank', icon: PencilLineIcon },
]

export function StudyModeSelector({ value, onChange }: StudyModeSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {MODES.map(({ mode, icon: Icon }) => {
        const isSelected = value === mode

        return (
          <button
            key={mode}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(mode)}
            className={`flex flex-col items-center justify-center gap-2 rounded-2xl px-4 py-4 text-center transition-all duration-200 ${
              isSelected
                ? 'feature-card-selected'
                : 'feature-card hover:feature-card-hover'
            }`}
          >
            <Icon
              size={24}
              weight="duotone"
              className={isSelected ? 'text-primary' : 'text-muted-foreground'}
            />
            <p
              className={`text-sm font-bold ${
                isSelected ? 'text-primary' : 'text-foreground'
              }`}
            >
              {LEARNING_COPY.modeLabels[mode]}
            </p>
          </button>
        )
      })}
    </div>
  )
}
