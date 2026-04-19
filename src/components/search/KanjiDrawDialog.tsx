import { useEffect, useState } from 'react'
import { EraserIcon, PencilSimpleIcon } from '@phosphor-icons/react'
import { gooeyToast } from '@/components/ui/goey-toaster'
import { Button } from '@/components/ui/button'
import { SEARCH_COPY } from '@/constants/search'
import { loadKanjiCanvasLibrary } from '@/lib/loadKanjiCanvasLibrary'

const KANJI_CANVAS_ID = 'search-kanji-canvas'

interface KanjiDrawPanelProps {
  open: boolean
  onPickKanji: (kanjiCharacter: string) => void
}

export function KanjiDrawPanel({
  open,
  onPickKanji,
}: KanjiDrawPanelProps) {
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false)
  const [hasLoadError, setHasLoadError] = useState(false)
  const [candidateList, setCandidateList] = useState<string[]>([])
  const [hasRecognized, setHasRecognized] = useState(false)

  useEffect(() => {
    if (!open) {
      return
    }

    let cancelled = false
    setCandidateList([])
    setHasRecognized(false)
    setHasLoadError(false)
    setIsLoadingLibrary(true)

    const setupCanvas = async () => {
      try {
        await loadKanjiCanvasLibrary()
        if (cancelled) {
          return
        }

        if (!window.KanjiCanvas) {
          throw new Error('KanjiCanvas chưa sẵn sàng.')
        }

        // Panel sẽ unmount khi đóng, vì vậy cần init lại canvas mỗi lần mở.
        window.KanjiCanvas.init(KANJI_CANVAS_ID)
        window.KanjiCanvas.erase(KANJI_CANVAS_ID)
      } catch {
        if (!cancelled) {
          setHasLoadError(true)
        }
      } finally {
        if (!cancelled) {
          setIsLoadingLibrary(false)
        }
      }
    }

    void setupCanvas()

    return () => {
      cancelled = true
    }
  }, [open])

  const handleRecognize = () => {
    if (!window.KanjiCanvas) {
      gooeyToast.error(SEARCH_COPY.handwriting.loadError)
      return
    }

    try {
      const rawCandidates = window.KanjiCanvas.recognize(KANJI_CANVAS_ID)
      const parsedCandidates = (rawCandidates ?? '')
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 10)
      setHasRecognized(true)
      setCandidateList(parsedCandidates)
      if (parsedCandidates.length === 0) {
        gooeyToast.info(SEARCH_COPY.handwriting.noCandidates)
      }
    } catch {
      gooeyToast.error(SEARCH_COPY.handwriting.recognizeError)
    }
  }

  const handleUndo = () => {
    window.KanjiCanvas?.deleteLast(KANJI_CANVAS_ID)
  }

  const handleClear = () => {
    window.KanjiCanvas?.erase(KANJI_CANVAS_ID)
    setCandidateList([])
    setHasRecognized(false)
  }

  const handlePickCandidate = (candidate: string) => {
    onPickKanji(candidate)
  }

  const isActionDisabled = isLoadingLibrary || hasLoadError

  if (!open) {
    return null
  }

  return (
    <div className="w-[min(20rem,calc(100vw-3rem))] rounded-3xl border border-border/70 bg-card p-3 shadow-[0_2px_12px_0_rgba(29,28,19,0.08)] dark:bg-surface-container-high dark:shadow-[0_8px_22px_0_rgba(0,0,0,0.28)]">
      <div className="flex flex-col gap-4">
        {isLoadingLibrary ? (
          <p className="text-sm text-muted-foreground">
            {SEARCH_COPY.handwriting.loading}
          </p>
        ) : hasLoadError ? (
          <p className="text-sm text-destructive">
            {SEARCH_COPY.handwriting.loadError}
          </p>
        ) : (
          <p className="text text-muted-foreground">
            {SEARCH_COPY.handwriting.canvasHint}
          </p>
        )}

        <div className="rounded-2xl border border-border bg-card p-3">
          <canvas
            id={KANJI_CANVAS_ID}
            width={224}
            height={224}
            className="mx-auto block h-56 w-56 rounded-xl bg-background touch-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={isActionDisabled}
          >
            <PencilSimpleIcon size={20} weight="regular" className="-scale-x-100" />
            {SEARCH_COPY.handwriting.undoButton}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={isActionDisabled}
          >
            <EraserIcon size={20} weight="regular" />
            {SEARCH_COPY.handwriting.clearButton}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleRecognize}
            disabled={isActionDisabled}
            className="ml-auto"
          >
            {SEARCH_COPY.handwriting.recognizeButton}
          </Button>
        </div>

        {candidateList.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {candidateList.map((candidate, index) => (
              <Button
                key={`${candidate}-${index}`}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePickCandidate(candidate)}
              >
                {candidate}
              </Button>
            ))}
          </div>
        )}

        {hasRecognized && candidateList.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {SEARCH_COPY.handwriting.noCandidates}
          </p>
        )}
      </div>
    </div>
  )
}
