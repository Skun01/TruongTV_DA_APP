import type { ReactNode } from 'react'

interface QuestionTextRendererProps {
  text: string
  mondaiType: string | null
  sectionType: string
  optionTexts?: string[]
}

const KANJI_REGEX = /[一-鿿㐀-䶿]+/g
const BLANK_REGEX = /（[\s　]*）/g
const PARTICLES = /^(は|が|を|に|で|と|の|へ|も|から|まで|より|など|って|には|では|とは|からは|までは)+$/
const TRAILING_PARTICLES = /(は|が|を|に|で|と|の|へ|も|から|まで|より)$/

const COMMON_KANJI_WORDS = ['毎日', '毎朝', '毎週', '毎月', '毎年', '今日', '昨日', '明日', '今', '何']

function findTargetKanji(text: string, optionTexts: string[]): string | null {
  const segments = text.split(/[\s　]+/)

  for (const segment of segments) {
    const kanjiOnly = segment.replace(/[^一-鿿㐀-䶿]/g, '')
    if (kanjiOnly.length === 0) continue

    const kanjiWord = segment.match(/[一-鿿㐀-䶿]+/)?.[0]
    if (!kanjiWord) continue

    if (COMMON_KANJI_WORDS.includes(kanjiWord)) continue

    const avgOptionLen = optionTexts.length > 0
      ? optionTexts.reduce((sum, t) => sum + t.length, 0) / optionTexts.length
      : 0

    if (avgOptionLen > 0) {
      const expectedReading = kanjiWord.length * 2
      if (Math.abs(expectedReading - avgOptionLen) <= 2) {
        return kanjiWord
      }
    }

    return kanjiWord
  }

  const allKanji: string[] = []
  for (const match of text.matchAll(KANJI_REGEX)) {
    allKanji.push(match[0])
  }
  return allKanji.length > 0 ? allKanji[0] : null
}

function highlightSingleKanji(text: string, target: string): ReactNode[] {
  const idx = text.indexOf(target)
  if (idx === -1) return [text]

  const parts: ReactNode[] = []
  if (idx > 0) {
    parts.push(text.slice(0, idx))
  }
  parts.push(
    <span
      key={idx}
      className="border-b-2 border-primary font-semibold text-primary"
    >
      {target}
    </span>,
  )
  if (idx + target.length < text.length) {
    parts.push(text.slice(idx + target.length))
  }
  return parts
}

function findHiraganaTarget(text: string): { start: number; end: number } | null {
  const segments = text.split(/[\s　]+/)

  const skipWords = ['きのう', 'きょう', 'あした', 'まいにち', 'まいあさ', 'いま', 'あの', 'この', 'その', 'あそこ', 'ここ', 'そこ']
  const verbEndings = /(ます|ました|ません|です|でした|ている|ていた|ていました|ください|ましょう|ませんか)$/

  for (const segment of segments) {
    const cleaned = segment.replace(/[、。？！]/g, '')
    if (cleaned.length <= 1) continue
    if (skipWords.includes(cleaned)) continue
    if (PARTICLES.test(cleaned)) continue
    if (verbEndings.test(cleaned)) continue

    const stripped = cleaned.replace(TRAILING_PARTICLES, '')
    if (stripped.length <= 1) continue

    if (/[一-鿿]/.test(stripped)) continue

    const targetStart = text.indexOf(stripped)
    if (targetStart === -1) continue

    return { start: targetStart, end: targetStart + stripped.length }
  }

  return null
}

function highlightHiraganaTarget(text: string): ReactNode[] {
  const target = findHiraganaTarget(text)
  if (!target) return [text]

  const result: ReactNode[] = []
  if (target.start > 0) {
    result.push(text.slice(0, target.start))
  }
  result.push(
    <span
      key={target.start}
      className="border-b-2 border-primary font-semibold text-primary"
    >
      {text.slice(target.start, target.end)}
    </span>,
  )
  if (target.end < text.length) {
    result.push(text.slice(target.end))
  }

  return result
}

function renderBlank(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  let lastIndex = 0

  for (const match of text.matchAll(BLANK_REGEX)) {
    const start = match.index!
    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start))
    }
    parts.push(
      <span
        key={start}
        className="mx-0.5 inline-block min-w-[3em] border-b-2 border-primary/60 text-center"
      >
        {'　　'}
      </span>,
    )
    lastIndex = start + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 1 ? parts : [text]
}

export function QuestionTextRenderer({
  text,
  mondaiType,
  sectionType,
  optionTexts = [],
}: QuestionTextRendererProps) {
  let rendered: ReactNode[]

  if (sectionType === 'Moji') {
    if (mondaiType === 'Mondai1' || (mondaiType === null && KANJI_REGEX.test(text))) {
      KANJI_REGEX.lastIndex = 0
      const target = findTargetKanji(text, optionTexts)
      rendered = target ? highlightSingleKanji(text, target) : [text]
    } else if (mondaiType === 'Mondai2' || (mondaiType === null && !KANJI_REGEX.test(text) && !BLANK_REGEX.test(text))) {
      KANJI_REGEX.lastIndex = 0
      BLANK_REGEX.lastIndex = 0
      rendered = highlightHiraganaTarget(text)
    } else {
      rendered = renderBlank(text)
    }
  } else {
    rendered = renderBlank(text)
  }

  return (
    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-primary">
      {rendered}
    </p>
  )
}
