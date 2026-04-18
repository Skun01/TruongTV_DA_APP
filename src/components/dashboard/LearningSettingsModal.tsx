import { GearIcon } from '@phosphor-icons/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LearningSettingsCard } from '@/components/dashboard/LearningSettingsCard'
import { LEARNING_COPY } from '@/constants/learning'
import type {
  StudySessionSettingsRequest,
  StudySessionSettingsResponse,
} from '@/types/learning'

interface LearningSettingsModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  settings: StudySessionSettingsResponse | undefined
  isLoading: boolean
  onSave: (payload: StudySessionSettingsRequest) => void
  isPending: boolean
}

export function LearningSettingsModal({
  isOpen,
  onOpenChange,
  settings,
  isLoading,
  onSave,
  isPending,
}: LearningSettingsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[calc(100vh-32px)] overflow-y-auto"
        aria-describedby="learning-settings-modal-description"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GearIcon size={20} weight="duotone" />
            {LEARNING_COPY.settingsSectionTitle}
          </DialogTitle>
          <DialogDescription id="learning-settings-modal-description">
            {LEARNING_COPY.settingsModalDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6">
          <LearningSettingsCard
            settings={settings}
            isLoading={isLoading}
            onSave={onSave}
            isPending={isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
