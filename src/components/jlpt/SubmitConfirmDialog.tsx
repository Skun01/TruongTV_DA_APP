import { SpinnerGapIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { JLPT_EXAM_COPY } from '@/constants/jlptExam'

interface SubmitConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unansweredCount: number
  isSubmitting: boolean
  onConfirm: () => void
}

export function SubmitConfirmDialog({
  open,
  onOpenChange,
  unansweredCount,
  isSubmitting,
  onConfirm,
}: SubmitConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{JLPT_EXAM_COPY.submitConfirmTitle}</DialogTitle>
          <DialogDescription>
            {JLPT_EXAM_COPY.submitConfirmMessage}
            {unansweredCount > 0 && (
              <>
                <br />
                <span className="mt-1 inline-block font-medium text-amber-600">
                  {JLPT_EXAM_COPY.submitConfirmUnanswered.replace(
                    '{count}',
                    String(unansweredCount),
                  )}
                </span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {JLPT_EXAM_COPY.submitCancelAction}
          </Button>
          <Button onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting && (
              <SpinnerGapIcon size={16} className="mr-1.5 animate-spin" />
            )}
            {JLPT_EXAM_COPY.submitConfirmAction}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface ExitConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function ExitConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
}: ExitConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{JLPT_EXAM_COPY.exitConfirmTitle}</DialogTitle>
          <DialogDescription>{JLPT_EXAM_COPY.exitConfirmMessage}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {JLPT_EXAM_COPY.exitCancelAction}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {JLPT_EXAM_COPY.exitConfirmAction}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
