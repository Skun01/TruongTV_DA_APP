import { KeyboardIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { LEARNING_COPY } from '@/constants/learning'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface StudyKeyboardShortcutsProps {
  visible: boolean
}

export function StudyKeyboardShortcuts({ visible }: StudyKeyboardShortcutsProps) {
  const [open, setOpen] = useState(false)

  if (!visible) {
    return null
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={LEARNING_COPY.keyboardShortcutOpenAriaLabel}
        className="feature-card hover:feature-card-hover fixed bottom-6 left-6 z-40 flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors"
      >
        <KeyboardIcon size={20} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{LEARNING_COPY.keyboardShortcutTitle}</DialogTitle>
            <DialogDescription>
              {LEARNING_COPY.keyboardShortcutDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 pb-2">
            <ShortcutRow
              hotkey={LEARNING_COPY.keyboardSpaceKey}
              action={LEARNING_COPY.keyboardSpaceAction}
            />
            <ShortcutRow
              hotkey={LEARNING_COPY.keyboardUpArrowKey}
              action={LEARNING_COPY.keyboardUpArrowAction}
            />
            <ShortcutRow
              hotkey={LEARNING_COPY.keyboardDownArrowKey}
              action={LEARNING_COPY.keyboardDownArrowAction}
            />
            <ShortcutRow
              hotkey={LEARNING_COPY.keyboardLeftArrowKey}
              action={LEARNING_COPY.keyboardLeftArrowAction}
            />
            <ShortcutRow
              hotkey={LEARNING_COPY.keyboardRightArrowKey}
              action={LEARNING_COPY.keyboardRightArrowAction}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ShortcutRow({ hotkey, action }: { hotkey: string; action: string }) {
  return (
    <div className="feature-card flex items-center gap-3 rounded-xl px-3 py-2.5">
      <kbd className="min-w-8 rounded-md border border-border/70 bg-background px-2 py-1 text-center text-sm font-semibold text-foreground">
        {hotkey}
      </kbd>
      <span className="text-sm text-muted-foreground">{action}</span>
    </div>
  )
}
