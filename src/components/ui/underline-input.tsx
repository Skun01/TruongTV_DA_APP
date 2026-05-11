import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * UnderlineInput — input dạng "sổ tay" chỉ có gạch chân mảnh.
 *  • Theo DESIGN.md: bottom-only border, `--outline-variant` 40% opacity.
 *  • Focus: border chuyển sang `--primary` dần, không shadow.
 *  • Dùng cho form scholarly feel (auth, profile, card notes).
 *
 * Không thay thế `Input` gốc của shadcn — chỗ nào cần kiểu bottom-border
 * thì import `UnderlineInput`.
 */

type UnderlineInputProps = React.ComponentProps<'input'>

const UnderlineInput = React.forwardRef<HTMLInputElement, UnderlineInputProps>(
  function UnderlineInput({ className, type, ...props }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="underline-input"
        className={cn(
          'w-full bg-transparent px-0.5 py-2 text-base text-foreground outline-none transition-colors',
          'border-0 border-b border-[color-mix(in_srgb,var(--outline-variant)_60%,transparent)]',
          'placeholder:text-on-surface-variant',
          'focus-visible:border-primary',
          'disabled:cursor-not-allowed disabled:opacity-60',
          'aria-invalid:border-destructive',
          className,
        )}
        {...props}
      />
    )
  },
)

/**
 * FilledInput — block input phẳng không border, nền `--surface-container-highest`.
 *  • Dùng khi cần input "rõ hình" hơn (search prominent, settings block).
 */

type FilledInputProps = React.ComponentProps<'input'>

const FilledInput = React.forwardRef<HTMLInputElement, FilledInputProps>(
  function FilledInput({ className, type, ...props }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="filled-input"
        className={cn(
          'h-11 w-full rounded-xl bg-surface-container-highest px-4 text-base text-foreground outline-none transition-colors',
          'placeholder:text-on-surface-variant',
          'focus-visible:ring-2 focus-visible:ring-primary/35',
          'disabled:cursor-not-allowed disabled:opacity-60',
          'aria-invalid:ring-2 aria-invalid:ring-destructive/40',
          className,
        )}
        {...props}
      />
    )
  },
)

export { UnderlineInput, FilledInput }
