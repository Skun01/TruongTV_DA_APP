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

interface StartExamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isStarting: boolean
  onConfirm: () => void
}

export function StartExamDialog({
  open,
  onOpenChange,
  isStarting,
  onConfirm,
}: StartExamDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{JLPT_EXAM_COPY.startConfirmTitle}</DialogTitle>
          <DialogDescription>{JLPT_EXAM_COPY.startConfirmMessage}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isStarting}
          >
            {JLPT_EXAM_COPY.startCancelAction}
          </Button>
          <Button onClick={onConfirm} disabled={isStarting}>
            {isStarting && (
              <SpinnerGapIcon size={16} className="mr-1.5 animate-spin" />
            )}
            {JLPT_EXAM_COPY.startConfirmAction}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
