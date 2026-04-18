import { useRef } from 'react'
import {
  TextBolderIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  XIcon,
  FloppyDiskIcon,
} from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface CardNoteEditorProps {
  initialContent?: string
  onSave: (htmlContent: string) => void
  onCancel: () => void
  isSaving?: boolean
}

/**
 * Rich text note editor — toolbar (B, I, U, A+, A-) + editable area + Cancel/Save.
 * Reusable for all card types.
 */
export function CardNoteEditor({
  initialContent = '',
  onSave,
  onCancel,
  isSaving = false,
}: CardNoteEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  const preventFocusLoss = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  const execFormat = (cmd: string) => {
    document.execCommand(cmd, false)
  }

  const changeFontSize = (increase: boolean) => {
    const current = document.queryCommandValue('fontSize')
    const numSize = parseInt(current) || 3
    const next = increase ? Math.min(numSize + 1, 7) : Math.max(numSize - 1, 1)
    document.execCommand('fontSize', false, String(next))
  }

  const handleSave = () => {
    const html = editorRef.current?.innerHTML?.trim() ?? ''
    if (!html || html === '<br>') return
    onSave(html)
  }

  return (
    <Card className="py-0 feature-card">
      <CardContent className="p-4 flex flex-col gap-3">
        {/* Toolbar */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onMouseDown={preventFocusLoss} onClick={() => execFormat('bold')} title="In đậm">
            <TextBolderIcon size={16} weight="bold" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onMouseDown={preventFocusLoss} onClick={() => execFormat('italic')} title="In nghiêng">
            <TextItalicIcon size={16} weight="bold" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onMouseDown={preventFocusLoss} onClick={() => execFormat('underline')} title="Gạch chân">
            <TextUnderlineIcon size={16} weight="bold" />
          </Button>

          <Separator orientation="vertical" className="h-5 mx-1" />

          <Button variant="ghost" size="sm" className="h-8 px-1.5 text-xs font-semibold" onMouseDown={preventFocusLoss} onClick={() => changeFontSize(false)} title="Giảm chữ">
            A-
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-1.5 text-xs font-semibold" onMouseDown={preventFocusLoss} onClick={() => changeFontSize(true)} title="Tăng chữ">
            A+
          </Button>
        </div>

        <Separator />

        {/* Editable area */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-label="Soạn ghi chú"
          className="min-h-[100px] max-h-[200px] overflow-y-auto rounded-lg p-3 text-sm text-foreground outline-none border border-border focus:ring-1 focus:ring-primary/40 transition-all"
          dangerouslySetInnerHTML={{ __html: initialContent }}
        />

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={isSaving} className="gap-1">
            <XIcon size={14} />
            Hủy
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving} className="gap-1">
            <FloppyDiskIcon size={14} />
            Lưu
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
