import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * EmptyState — dùng chung cho list/detail không có dữ liệu.
 *  • Icon ở slot `icon` (kích thước ~48px, weight duotone của Phosphor).
 *  • `title` + `description` + optional `action`.
 *  • Style tonal-only, không shadow.
 */

interface EmptyStateProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  compact?: boolean
}

function EmptyState({
  icon,
  title,
  description,
  action,
  compact = false,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'gap-3 py-8 px-4' : 'gap-4 py-14 px-6',
        className,
      )}
      {...props}
    >
      {icon ? (
        <div
          aria-hidden
          className="flex items-center justify-center rounded-2xl bg-surface-container-high p-4 text-on-surface-variant"
        >
          {icon}
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5 max-w-md">
        <h3 className="font-heading-vn text-lg font-semibold text-foreground">
          {title}
        </h3>
        {description ? (
          <p className="text-sm leading-relaxed text-on-surface-variant">
            {description}
          </p>
        ) : null}
      </div>

      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}

export { EmptyState }
