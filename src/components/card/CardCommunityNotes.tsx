import { useState } from 'react'
import { HeartIcon, UserCircleIcon } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { VOCAB_DETAIL_COPY } from '@/constants/vocabularyDetail'
import { vocabularyService } from '@/services/vocabularyService'
import type { UserCardNoteItem } from '@/types/vocabulary'

interface CardCommunityNotesProps {
  communityNotes: UserCardNoteItem[]
  onNotesChanged: () => void
}

/**
 * GHI CHÚ CỘNG ĐỒNG section — full width, wrapped in Card for visual distinction.
 * Shows only other users' notes.
 */
export function CardCommunityNotes({ communityNotes, onNotesChanged }: CardCommunityNotesProps) {
  const [likingIds, setLikingIds] = useState<Set<string>>(new Set())

  const handleToggleLike = async (noteId: string) => {
    if (likingIds.has(noteId)) return

    setLikingIds((prev) => new Set(prev).add(noteId))
    try {
      await vocabularyService.toggleNoteLike(noteId)
      onNotesChanged()
    } finally {
      setLikingIds((prev) => {
        const next = new Set(prev)
        next.delete(noteId)
        return next
      })
    }
  }

  return (
    <section className="flex flex-col gap-4" id="card-community-notes">
      <span className="section-title-text">
        {VOCAB_DETAIL_COPY.notes.title}
      </span>

      {communityNotes.length === 0 ? (
        <Card className="py-0 feature-card">
          <CardContent className="p-8 flex flex-col items-center gap-2 opacity-60">
            <p className="section-label-text text-center">{VOCAB_DETAIL_COPY.notes.empty}</p>
            <p className="section-caption-text text-center max-w-xs">{VOCAB_DETAIL_COPY.notes.emptyHint}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {communityNotes.map((note) => (
            <Card key={note.id} className="py-0 feature-card">
              <CardContent className="p-4 flex flex-col gap-3">
                {/* Author + time */}
                <div className="flex items-center gap-2">
                  <UserCircleIcon size={20} weight="fill" className="text-foreground/70" />
                  <span className="section-label-text text-foreground">{note.userName}</span>
                  <span className="section-meta-text">
                    {new Date(note.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                {/* Content */}
                <div
                  className="text-sm text-foreground leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: note.content }}
                />

                {/* Like */}
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-1 text-sm px-2 h-7 ${note.isLikedByMe ? 'text-red-500' : 'text-muted-foreground'}`}
                    onClick={() => handleToggleLike(note.id)}
                    disabled={likingIds.has(note.id)}
                  >
                    <HeartIcon size={14} weight={note.isLikedByMe ? 'fill' : 'regular'} />
                    {note.likesCount > 0 && note.likesCount}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
