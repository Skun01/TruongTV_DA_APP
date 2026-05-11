import * as React from 'react'
import { WarningCircleIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { FEEDBACK_COPY } from '@/constants/feedback'
import { getApiErrorMessage } from '@/lib/apiError'
import { cn } from '@/lib/utils'

/**
 * ErrorState — hiển thị lỗi page-level hoặc section-level.
 *  • Nhận `error` (Error/unknown) để tự resolve qua `getApiErrorMessage`.
 *  • Hoặc nhận trực tiếp `title`/`description`.
 */

interface ErrorStateProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  error?: unknown
  title?: React.ReactNode
  description?: React.ReactNode
  onRetry?: () => void
  retryLabel?: string
  compact?: boolean
}

function ErrorState({
  error,
  title,
  description,
  onRetry,
  retryLabel,
  compact = false,
  className,
  ...props
}: ErrorStateProps) {
  const resolvedDescription =
    description ?? (error ? getApiErrorMessage(error, FEEDBACK_COPY.error.defaultDescription) : FEEDBACK_COPY.error.defaultDescription)

  return (
    <div
      data-slot="error-state"
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'gap-3 py-8 px-4' : 'gap-4 py-14 px-6',
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--destructive)_12%,var(--surface-container-low))] p-4 text-destructive">
        <WarningCircleIcon size={40} weight="duotone" />
      </div>

      <div className="flex flex-col gap-1.5 max-w-md">
        <h3 className="font-heading-vn text-lg font-semibold text-foreground">
          {title ?? FEEDBACK_COPY.error.defaultTitle}
        </h3>
        <p className="text-sm leading-relaxed text-on-surface-variant">
          {resolvedDescription}
        </p>
      </div>

      {onRetry ? (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-2"
        >
          {retryLabel ?? FEEDBACK_COPY.error.retryLabel}
        </Button>
      ) : null}
    </div>
  )
}

export { ErrorState }
