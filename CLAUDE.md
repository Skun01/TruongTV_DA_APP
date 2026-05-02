# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Scope

- This folder is `learning-app`, the React + TypeScript learner frontend for TachoProject.
- Root-level project rules also apply (from `../CLAUDE.md`), especially frontend constraints:
  - Vietnamese UI text from constants files, no hardcoded JSX text.
  - Service layer for API calls (no direct axios in pages/components).
  - React Query for server state, Zustand for client-only state.
  - Use `goey-toast`, `@phosphor-icons/react`, and shadcn/ui-first component strategy.
  - Dialogs/modals must be separate files.

## Common Commands

Run from `learning-app/`:

- Install deps: `npm install`
- Start dev server: `npm run dev` (Vite)
- Build production bundle: `npm run build`
- Lint: `npm run lint`
- Preview production build: `npm run preview`

## High-Level Architecture

## Design System: Tacho

This app has its own design system, distinct from `learning-admin`:

- **Aesthetic:** "The Great Wave" — indigo depth on weathered cream. High-end editorial, intentional asymmetry.
- **Color:** Warm indigo palette. Light: `--primary` `#002453`, `--surface` `#fff9eb`. Dark: toggle via class `dark` on `<html>`, not `prefers-color-scheme`.
- **Typography:** `font-family: "Nunito", "Kiwi Maru", system-ui, sans-serif`. Display headers use Kiwi Maru 700, body uses Nunito.
- **Elevation:** No shadow on cards — tonal layering only. Floating elements (modal/popover): `box-shadow: 0 16px 48px rgba(29, 28, 19, 0.05)`.
- **Animation:** Slow, intentional (shoji-screen feel). No bouncy transitions.

Full spec: `DESIGN.md`.

## Runtime Composition

- Entry: `src/main.tsx` — calls `setupInterceptors()` before render, renders `<App />` in StrictMode.
- App shell: `src/App.tsx` — providers (HelmetProvider, QueryClientProvider, GooeyToaster) + router.
- Route trees: guest routes and protected routes.
- `AdminLayout` is NOT used here — learner app has its own layout.

## Auth + Session Model

- Axios client: `src/services/api.ts` — `baseURL` from `VITE_API_BASE_URL` (fallback `/api`), `withCredentials: true`.
- Interceptors: `src/services/setupInterceptors.ts` — request injects Bearer token from Zustand, 401 refresh flow retries pending requests.
- Auth store: `src/stores/authStore.ts` — in-memory access token + user, `init()` performs refresh + `/auth/me` at startup.
- Route guards: guest vs. protected route trees.

## Data and Feature Layering

1. `src/services/*Service.ts` — HTTP boundary per domain.
2. `src/hooks/use*` — React Query wrappers for list/detail/mutation flows.
3. `src/pages/*` — route-level orchestration.
4. `src/components/*` — reusable UI + domain feature components.
5. `src/lib/validations/*` — Zod schemas for form validation.
6. `src/constants/*` — Vietnamese copy and domain labels/messages.
7. `src/types/*` — API and domain DTO typings.

## Important Conventions

- API envelope: `ApiResponse<T>` normalized in `src/types/api.ts`.
- Forms: react-hook-form + zod from `src/lib/validations`.
- Toast entrypoint: `src/components/ui/goey-toaster.tsx` (exports `gooeyToast`).
- Import alias `@/*` maps to `src/*` (see `tsconfig.json` + `vite.config.ts`).
- shadcn configured in `components.json` (Phosphor icon library).

## Gap: Shared Frontend Rules

`frontend-rules/STYLE_GUIDES.md` and `frontend-rules/API_GUIDES.md` referenced in the root CLAUDE.md do not exist yet. Frontend conventions are currently only documented inline in this CLAUDE.md and `learning-admin/CLAUDE.md`. If you need to reference shared conventions, check both of those files first.