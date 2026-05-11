import { cn } from "@/lib/utils"

/**
 * Skeleton — placeholder theo ngôn ngữ Tacho.
 *  • Dùng `--surface-container-high` thay vì accent để tonal đồng nhất.
 *  • Pulse chậm (1600ms) để không gây chú ý thái quá.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-md bg-surface-container-high/80 motion-safe:animate-pulse motion-safe:[animation-duration:1600ms]",
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
