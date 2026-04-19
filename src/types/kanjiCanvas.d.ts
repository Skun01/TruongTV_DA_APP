interface KanjiCanvasApi {
  refPatterns: unknown[]
  init: (canvasId: string) => void
  erase: (canvasId: string) => void
  deleteLast: (canvasId: string) => void
  recognize: (canvasId: string) => string | void
}

declare global {
  interface Window {
    KanjiCanvas?: KanjiCanvasApi
  }
}

export {}
