import { useNavigate } from 'react-router'
import { CaretDownIcon, HouseIcon, UserIcon, SignOutIcon, MoonIcon, SunIcon, GearIcon } from '@phosphor-icons/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import { useLogout } from '@/hooks/useAuth'
import { NAVBAR_COPY } from '@/constants/navbar'

//Helper
function getInitials(name: string | undefined): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function NavbarUserMenu() {
  const user = useAuthStore((s) => s.user)
  const { mutate: logout, isPending: isLoggingOut } = useLogout()
  const { theme, toggleTheme } = useThemeStore()
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-surface-container outline-none focus-visible:ring-1 focus-visible:ring-ring"
          aria-label={NAVBAR_COPY.profileMenuAriaLabel}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user?.avatarUrl ?? undefined}
              alt={user?.displayName ?? NAVBAR_COPY.avatarFallbackAlt}
            />
            <AvatarFallback
              className="text-xs font-bold"
              style={{
                backgroundColor: 'var(--secondary-container)',
                color: 'var(--on-secondary-container)',
              }}
            >
              {getInitials(user?.displayName)}
            </AvatarFallback>
          </Avatar>
          <span
            className="hidden lg:block text-sm font-medium max-w-[120px] truncate"
            style={{ color: 'var(--on-surface)' }}
          >
            {user?.displayName}
          </span>
          <CaretDownIcon
            size={13}
            weight="bold"
            className="hidden lg:block"
            style={{ color: 'var(--on-surface-variant)' }}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-52"
        style={{ backgroundColor: 'var(--surface-container-low)' }}
      >
        {/* User info header */}
        <div className="px-3 py-2">
          <p
            className="text-sm font-semibold truncate"
            style={{ color: 'var(--on-surface)' }}
          >
            {user?.displayName}
          </p>
          <p
            className="text-xs truncate"
            style={{ color: 'var(--on-surface-variant)' }}
          >
            {user?.email}
          </p>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => navigate('/dashboard')}
          className="gap-2 cursor-pointer"
          style={{ color: 'var(--on-surface)' }}
        >
          <HouseIcon size={15} weight="duotone" style={{ color: 'var(--secondary)' }} />
          {NAVBAR_COPY.profileMenu.dashboard}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate('/profile')}
          className="gap-2 cursor-pointer"
          style={{ color: 'var(--on-surface)' }}
        >
          <UserIcon size={15} weight="duotone" style={{ color: 'var(--secondary)' }} />
          {NAVBAR_COPY.profileMenu.profile}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate('/dashboard?modal=learning-settings')}
          className="gap-2 cursor-pointer"
          style={{ color: 'var(--on-surface)' }}
        >
          <GearIcon size={15} weight="duotone" style={{ color: 'var(--secondary)' }} />
          {NAVBAR_COPY.profileMenu.learningSettings}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Theme toggle — dùng div thay MenuItem để không đóng dropdown khi click switch */}
        <div
          className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-sm cursor-pointer select-none"
          style={{ color: 'var(--on-surface)' }}
          onClick={toggleTheme}
        >
          <div className="flex items-center gap-2">
            {isDark
              ? <MoonIcon size={15} weight="duotone" style={{ color: 'var(--secondary)' }} />
              : <SunIcon size={15} weight="duotone" style={{ color: 'var(--secondary)' }} />
            }
            <span className="text-sm">{NAVBAR_COPY.profileMenu.darkMode}</span>
          </div>
          <Switch
            checked={isDark}
            onCheckedChange={toggleTheme}
            aria-label={NAVBAR_COPY.themeSwitchAriaLabel}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => !isLoggingOut && logout()}
          disabled={isLoggingOut}
          className="gap-2 cursor-pointer"
          style={{ color: 'var(--destructive)' }}
        >
          <SignOutIcon size={15} style={{ color: 'var(--destructive)' }} />
          {isLoggingOut ? NAVBAR_COPY.logoutLoading : NAVBAR_COPY.profileMenu.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
