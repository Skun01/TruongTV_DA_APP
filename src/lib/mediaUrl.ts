const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL ?? ''

function getApiOrigin(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return new URL(API_BASE_URL, window.location.origin).origin
  } catch {
    return window.location.origin
  }
}

export function resolveMediaUrl(url?: string | null): string | null {
  if (!url) {
    return null
  }

  const trimmedUrl = url.trim()
  if (!trimmedUrl) {
    return null
  }

  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl
  }

  if (trimmedUrl.startsWith('blob:')) {
    return trimmedUrl // blob: URLs are absolute, pass through as-is
  }

  if (trimmedUrl.startsWith('//')) {
    if (typeof window === 'undefined') {
      return `https:${trimmedUrl}`
    }
    return `${window.location.protocol}${trimmedUrl}`
  }

  if (trimmedUrl.startsWith('/')) {
    const apiOrigin = getApiOrigin()
    return apiOrigin ? `${apiOrigin}${trimmedUrl}` : trimmedUrl
  }

  return trimmedUrl
}

/**
 * Resolve a path relative to BACKEND_BASE_URL (e.g. `/kanji-svg/08033.svg`).
 * Handles two cases:
 * 1. Backend returns a path like `/kanji-svg/08033.svg` → prepend VITE_BACKEND_BASE_URL
 * 2. Backend returns a literal template `{BASE_URL}/kanji-svg/08033.svg` → substitute with VITE_BACKEND_BASE_URL
 */
export function resolveBackendUrl(url: string): string {
  if (!url) return url

  if (/^https?:\/\//i.test(url)) return url

  return url.replace(/\{BASE_URL\}/g, BACKEND_BASE_URL)
}
