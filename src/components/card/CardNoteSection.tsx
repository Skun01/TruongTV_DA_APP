import { useState } from 'react'
import {
  NoteBlankIcon,
  PencilSimpleIcon,
  UsersThreeIcon,
  HeartIcon,
  StackIcon,
} from '@phosphor-icons/react'
import { AddToDeckDialog } from '@/components/card/AddToDeckDialog'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CardNoteEditor } from '@/components/card/CardNoteEditor'
import { VOCAB_DETAIL_COPY } from '@/constants/vocabularyDetail'
import { vocabularyService } from '@/services/vocabularyService'
import type { UserCardNoteItem } from '@/types/vocabulary'

interface CardNoteSectionProps {
  cardId: string
  myNote: UserCardNoteItem | null
  onNotesChanged: () => void
  onScrollToNotes: () => void
}

/**
 * Right-sidebar note section — 3 states:
 *
 * 1. No note → "Thêm ghi chú" button
 * 2. Editing → CardNoteEditor (toolbar + textarea + save/cancel)
 * 3. Has note → My note card + [Sửa | Xem ghi chú người khác]
 *
 * Reusable for all card types.
 */
export function CardNoteSection({
  cardId,
  myNote,
  onNotesChanged,
  onScrollToNotes,
}: CardNoteSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [isDeckDialogOpen, setIsDeckDialogOpen] = useState(false)

  const handleSave = async (htmlContent: string) => {
    setIsSaving(true)
    try {
      if (myNote) {
        await vocabularyService.deleteNote(cardId, myNote.id)
      }
      const res = await vocabularyService.createNote(cardId, htmlContent)
      if (res.success) {
        setIsEditing(false)
        onNotesChanged()
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleLike = async () => {
    if (!myNote || isLiking) return
    setIsLiking(true)
    try {
      await vocabularyService.toggleNoteLike(myNote.id)
      onNotesChanged()
    } finally {
      setIsLiking(false)
    }
  }

  // ═══ STATE 2: Editing ═════════════════════════════════════════════════
  if (isEditing) {
    return (
      <div className="flex flex-col gap-3">
        <CardNoteEditor
          initialContent={myNote?.content ?? ''}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
          isSaving={isSaving}
        />
        <Button
          variant="outline"
          className="w-full justify-start gap-2 h-11"
          onClick={() => setIsDeckDialogOpen(true)}
        >
          <StackIcon size={18} weight="regular" />
          {VOCAB_DETAIL_COPY.actions.addToDeck}
        </Button>

        <AddToDeckDialog
          open={isDeckDialogOpen}
          cardId={cardId}
          onOpenChange={setIsDeckDialogOpen}
        />
      </div>
    )
  }

  // ═══ STATE 3: Has note ════════════════════════════════════════════════
  if (myNote) {
    return (
      <div className="flex flex-col gap-3">
        <Card className="py-0 feature-card">
          <CardContent className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="section-title-text">{VOCAB_DETAIL_COPY.notes.myNoteTitle}</span>
              <span className="section-meta-text">
                {new Date(myNote.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
            <div
              className="text-sm text-foreground leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: myNote.content }}
            />
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-1 text-sm px-2 h-7 ${myNote.isLikedByMe ? 'text-red-500' : 'text-muted-foreground'}`}
                onClick={handleToggleLike}
                disabled={isLiking}
              >
                <HeartIcon size={14} weight={myNote.isLikedByMe ? 'fill' : 'regular'} />
                {myNote.likesCount > 0 && myNote.likesCount}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 h-10" onClick={() => setIsEditing(true)}>
            <PencilSimpleIcon size={16} />
            {VOCAB_DETAIL_COPY.notes.edit}
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 h-10" onClick={onScrollToNotes}>
            <UsersThreeIcon size={16} />
            {VOCAB_DETAIL_COPY.notes.viewOthers}
          </Button>
        </div>

        <Button
          variant="outline"
          className="w-full justify-start gap-2 h-11"
          onClick={() => setIsDeckDialogOpen(true)}
        >
          <StackIcon size={18} weight="regular" />
          {VOCAB_DETAIL_COPY.actions.addToDeck}
        </Button>

        <AddToDeckDialog
          open={isDeckDialogOpen}
          cardId={cardId}
          onOpenChange={setIsDeckDialogOpen}
        />
      </div>
    )
  }

  // ═══ STATE 1: No note ═════════════════════════════════════════════════
  return (
    <div className="flex flex-col gap-3">
      <Button variant="outline" className="w-full justify-start gap-2 h-11" onClick={() => setIsEditing(true)}>
        <NoteBlankIcon size={18} weight="regular" />
        {VOCAB_DETAIL_COPY.actions.addNote}
      </Button>
      <Button
        variant="outline"
        className="w-full justify-start gap-2 h-11"
        onClick={() => setIsDeckDialogOpen(true)}
      >
        <StackIcon size={18} weight="regular" />
        {VOCAB_DETAIL_COPY.actions.addToDeck}
      </Button>

      <AddToDeckDialog
        open={isDeckDialogOpen}
        cardId={cardId}
        onOpenChange={setIsDeckDialogOpen}
      />
    </div>
  )
}
