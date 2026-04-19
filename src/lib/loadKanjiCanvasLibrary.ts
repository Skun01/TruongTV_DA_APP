const KANJI_CANVAS_CORE_SCRIPT_ID = 'kanji-canvas-core-script'
const KANJI_CANVAS_PATTERNS_SCRIPT_ID = 'kanji-canvas-patterns-script'

const KANJI_CANVAS_CORE_SCRIPT_SRC = '/vendor/kanjicanvas/kanji-canvas.min.js'
const KANJI_CANVAS_PATTERNS_SCRIPT_SRC = '/vendor/kanjicanvas/ref-patterns.js'

let loadPromise: Promise<void> | null = null

function appendScript(scriptId: string, scriptSrc: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById(scriptId)
    if (existingScript) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.id = scriptId
    script.src = scriptSrc
    script.async = false
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Không thể tải script: ${scriptSrc}`))
    document.body.appendChild(script)
  })
}

export async function loadKanjiCanvasLibrary() {
  if (window.KanjiCanvas && window.KanjiCanvas.refPatterns.length > 0) {
    return
  }

  if (!loadPromise) {
    loadPromise = (async () => {
      await appendScript(KANJI_CANVAS_CORE_SCRIPT_ID, KANJI_CANVAS_CORE_SCRIPT_SRC)
      await appendScript(
        KANJI_CANVAS_PATTERNS_SCRIPT_ID,
        KANJI_CANVAS_PATTERNS_SCRIPT_SRC,
      )
    })().catch((error) => {
      loadPromise = null
      throw error
    })
  }

  await loadPromise
}
