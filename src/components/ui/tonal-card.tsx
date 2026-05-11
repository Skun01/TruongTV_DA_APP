import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * TonalCard — card theo ngôn ngữ Tacho:
 *  • Không shadow, không border 4 cạnh.
 *  • Dựa vào tonal layering giữa các surface container.
 *  • `tone` chọn bề mặt (low / lowest / highest / inkTint).
 *
 * Lưu ý: vẫn giữ `@/components/ui/card.tsx` gốc của shadcn để các component cũ
 * không bị ảnh hưởng. Chỗ nào cần Tacho-flavor thì dùng TonalCard.
 */

const tonalCardVariants = cva(
  'rounded-xl transition-colors duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
  {
    variants: {
      tone: {
        /** Card chuẩn — "lift" nhẹ trên nền surface-container-low. */
        raised: 'bg-surface-container-lowest text-foreground',
        /** Card nền mềm hơn — dùng khi muốn "chìm" vào layout. */
        soft: 'bg-surface-container-low text-foreground',
        /** Focal point card — CTA/hero cards. */
        focal: 'bg-surface-container-highest text-foreground',
        /** Nền tint indigo 6% — hero CTA nhẹ. */
        inkTint:
          'bg-[color-mix(in_srgb,var(--primary)_6%,var(--surface-container-low))] text-foreground',
      },
      interactive: {
        true:
          'cursor-pointer hover:bg-[color-mix(in_srgb,var(--primary)_4%,var(--surface-container-lowest))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        false: '',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      tone: 'raised',
      interactive: false,
      padding: 'md',
    },
  },
)

type TonalCardProps = React.ComponentProps<'div'> &
  VariantProps<typeof tonalCardVariants>

function TonalCard({
  className,
  tone,
  interactive,
  padding,
  ...props
}: TonalCardProps) {
  return (
    <div
      data-slot="tonal-card"
      className={cn(tonalCardVariants({ tone, interactive, padding }), className)}
      {...props}
    />
  )
}

function TonalCardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-1.5', className)} {...props} />
}

function TonalCardTitle({ className, ...props }: React.ComponentProps<'h3'>) {
  return (
    <h3
      className={cn(
        'font-heading-vn text-[1.25rem] font-semibold leading-tight tracking-[0.01em] text-foreground',
        className,
      )}
      {...props}
    />
  )
}

function TonalCardDescription({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn('text-sm text-on-surface-variant leading-relaxed', className)}
      {...props}
    />
  )
}

function TonalCardBody({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('mt-4', className)} {...props} />
}

function TonalCardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('mt-6 flex items-center gap-3', className)}
      {...props}
    />
  )
}

export {
  TonalCard,
  TonalCardHeader,
  TonalCardTitle,
  TonalCardDescription,
  TonalCardBody,
  TonalCardFooter,
  tonalCardVariants,
}
