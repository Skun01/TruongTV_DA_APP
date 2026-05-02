import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { BooksIcon, CertificateIcon, LightningIcon, MicrophoneIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { NavbarLogo } from './NavbarLogo'
import { NavbarSearch } from './NavbarSearch'
import { NavbarNotifications } from './NavbarNotifications'
import { NavbarUserMenu } from './NavbarUserMenu'
import { NAVBAR_COPY } from '@/constants/navbar'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-surface-container-low/92 backdrop-blur-[12px] shadow-[0_4px_32px_0_rgba(29,28,19,0.08)]'
          : 'bg-surface-container-low border-b border-border/50'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 md:gap-3">
          <NavbarLogo />

          <div className="hidden md:flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="items-center gap-1.5 text-secondary hover:text-primary shrink-0"
            >
              <Link to="/library">
                <BooksIcon size={16} weight="duotone" />
                {NAVBAR_COPY.library}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="items-center gap-1.5 text-secondary hover:text-primary shrink-0"
            >
              <Link to="/quick-learn">
                <LightningIcon size={16} weight="duotone" />
                {NAVBAR_COPY.quickLearn}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="items-center gap-1.5 text-secondary hover:text-primary shrink-0"
            >
              <Link to="/shadowing">
                <MicrophoneIcon size={16} weight="duotone" />
                {NAVBAR_COPY.shadowing}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="items-center gap-1.5 text-secondary hover:text-primary shrink-0"
            >
              <Link to="/jlpt">
                <CertificateIcon size={16} weight="duotone" />
                {NAVBAR_COPY.jlpt}
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <NavbarSearch />
          <NavbarNotifications />
          <NavbarUserMenu />
        </div>
      </nav>
    </header>
  )
}
