import { useCallback, useEffect, useRef, useState } from 'react'
import { ClockIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { JLPT_EXAM_COPY } from '@/constants/jlptExam'

interface ExamSessionTimerProps {
  expiresAt: string
  serverNow: string
  onExpired?: () => void
}

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function ExamSessionTimer({ expiresAt, serverNow, onExpired }: ExamSessionTimerProps) {
  const mountTimeMs = useRef(Date.now()).current
  const expiresAtMs = useRef(new Date(expiresAt).getTime()).current
  const serverNowInitialMs = useRef(new Date(serverNow).getTime()).current
  const serverOffset = serverNowInitialMs - mountTimeMs

  const [, setTick] = useState(0)
  const expiredCalled = useRef(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const currentServerTime = Date.now() + serverOffset
  const remaining = Math.max(0, Math.floor((expiresAtMs - currentServerTime) / 1000))

  const handleExpired = useCallback(() => {
    if (!expiredCalled.current && onExpired) {
      expiredCalled.current = true
      onExpired()
    }
  }, [onExpired])

  useEffect(() => {
    if (remaining <= 0) {
      handleExpired()
    }
  }, [remaining, handleExpired])

  const isWarning = remaining > 0 && remaining <= 300
  const isExpired = remaining <= 0

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-mono font-semibold',
        isExpired && 'bg-destructive/10 text-destructive',
        isWarning && 'bg-amber-500/10 text-amber-600 animate-pulse',
        !isExpired && !isWarning && 'bg-muted text-primary',
      )}
    >
      <ClockIcon size={18} weight={isWarning || isExpired ? 'fill' : 'regular'} />
      {isExpired ? (
        <span>{JLPT_EXAM_COPY.timeExpired}</span>
      ) : (
        <span>{formatTime(remaining)}</span>
      )}
    </div>
  )
}
