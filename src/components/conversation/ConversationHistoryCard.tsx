import { useNavigate } from 'react-router'
import {
  TrashIcon,
  ShoppingBagIcon,
  BriefcaseIcon,
  MapPinIcon,
  HandshakeIcon,
  ForkKnifeIcon,
  SparkleIcon,
} from '@phosphor-icons/react'
import { CONVERSATION_COPY } from '@/constants/conversation'
import type { ConversationListItemResponse } from '@/types/conversation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState } from 'react'

const SCENARIO_ICONS: Record<string, React.ReactNode> = {
  Shopping: <ShoppingBagIcon size={20} />,
  Interview: <BriefcaseIcon size={20} />,
  Direction: <MapPinIcon size={20} />,
  Meeting: <HandshakeIcon size={20} />,
  Restaurant: <ForkKnifeIcon size={20} />,
  Custom: <SparkleIcon size={20} />,
}

interface ConversationHistoryCardProps {
  item: ConversationListItemResponse
  onDelete: (conversationId: string) => void
  isDeleting: boolean
}

export function ConversationHistoryCard({
  item,
  onDelete,
  isDeleting,
}: ConversationHistoryCardProps) {
  const navigate = useNavigate()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const formattedDate = new Date(item.startedAt).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const handleClick = () => {
    if (item.status === 'Active') {
      navigate(`/ai-conversations/${item.conversationId}`)
    } else {
      navigate(`/ai-conversations/${item.conversationId}/result`)
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(item.conversationId)
    setShowDeleteDialog(false)
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        className="flex cursor-pointer items-center gap-4 rounded-2xl border border-border/50 bg-surface-container-low p-4 transition-colors hover:bg-surface-container"
      >
        {/* Icon */}
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-muted-foreground"
          style={{ backgroundColor: 'var(--surface-container-highest)' }}
        >
          {SCENARIO_ICONS[item.scenario] || <SparkleIcon size={20} />}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-foreground truncate">{item.scenario}</p>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                item.status === 'Active'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {item.status === 'Active'
                ? CONVERSATION_COPY.statusActive
                : CONVERSATION_COPY.statusCompleted}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{item.level}</span>
            <span>•</span>
            <span>{item.totalMessages} tin nhắn</span>
            {item.score !== null && (
              <>
                <span>•</span>
                <span className="font-medium text-primary">{item.score}/100</span>
              </>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{formattedDate}</p>
        </div>

        {/* Actions */}
        <div className="shrink-0">
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={(e) => e.stopPropagation()}
              >
                <TrashIcon size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{CONVERSATION_COPY.deleteTitle}</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                {CONVERSATION_COPY.deleteMessage}
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  {CONVERSATION_COPY.cancel}
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? CONVERSATION_COPY.deleting : CONVERSATION_COPY.delete}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  )
}
