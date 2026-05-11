import type { CSSProperties, ReactNode } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  children: ReactNode
  mainClassName?: string
  mainStyle?: CSSProperties
  /** Ẩn Footer cho các trang immersive (study session, exam session). */
  hideFooter?: boolean
  /** Ẩn padding-top bù navbar khi trang tự quản lý header riêng. */
  disableTopPadding?: boolean
}

/**
 * AppLayout — khung cho protected pages.
 *  • Navbar fixed 64px → `pt-16` mặc định.
 *  • Nền `--surface` toàn page để đồng nhất với Tacho.
 */
export function AppLayout({
  children,
  mainClassName,
  mainStyle,
  hideFooter = false,
  disableTopPadding = false,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-surface text-foreground">
      <Navbar />
      <main
        className={cn(
          !disableTopPadding && 'pt-16',
          'min-h-[calc(100vh-4rem)]',
          mainClassName,
        )}
        style={mainStyle}
      >
        {children}
      </main>
      {!hideFooter ? <Footer /> : null}
    </div>
  )
}
