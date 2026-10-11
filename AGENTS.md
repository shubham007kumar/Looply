# Looply — Developer & Agent Guidelines

This is the **Looply** mobile application, structured as a **Turborepo monorepo** using **pnpm workspaces**. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

---

## 1. Monorepo Architecture

- **Mobile App**: `apps/mobile/` (`@looply/mobile`) — Expo SDK 57, React 19, Expo Router
- **Backend & Database**: `packages/backend/` (`@looply/backend` — Supabase client & SQL migrations)
- **Shared Types**: `packages/types/` (`@looply/types` — Canonical TypeScript models for subscriptions, expenses & users)
- **Shared Configs**: `packages/tsconfig/` (`@looply/tsconfig` — Base tsconfig files)

---

## 2. Expo SDK 57 — Do Not Trust Training Data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `apps/mobile/package.json` (currently Expo SDK 57).
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch `https://docs.expo.dev/llms.txt` — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

---

## 3. Essential Commands & Workspaces

This project uses **pnpm** and **Turborepo** (`pnpm-workspace.yaml` and `turbo.json` present at root).

```bash
pnpm mobile                              # start the Expo mobile dev server
pnpm run typecheck                       # typecheck all workspaces in parallel via Turborepo
pnpm run lint                            # lint across workspaces
cd apps/mobile && npx expo install <pkg> # ALWAYS use for packages with native modules
pnpm --filter @looply/mobile add <pkg>   # add a JS/TS package to the mobile app
cd apps/mobile && npx expo-doctor        # diagnose Expo dependency and config issues
```

Always run `pnpm run typecheck` before declaring any task done.

---

## 4. Navigation & Routing (Expo Router v57)

- Use **Expo Router** for all navigation.
- Routes live in `apps/mobile/src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `apps/mobile/src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` exclusively from `expo-router`.
- Layout structure:
  - `apps/mobile/src/app/_layout.tsx`: Root layout with `ClerkProvider` and font loading.
  - `apps/mobile/src/app/(auth)/_layout.tsx`: Auth stack for sign-in and sign-up.
  - `apps/mobile/src/app/(tabs)/_layout.tsx`: Protected floating pill bottom tabs with Clerk auth guard.
- Docs: https://docs.expo.dev/router/introduction.md

---

## 5. Backend & Database (Supabase + Clerk)

- Database operations use `@looply/backend` (`import { ... } from "@looply/backend"`).
- User data is secured via PostgreSQL Row Level Security (RLS) policies matching Clerk's JWT token (`auth.jwt() ->> 'sub' = user_id`).
- Live subscriptions are queried through the `useSubscriptions()` hook in `apps/mobile/src/hooks/useSubscriptions.ts`, featuring optimistic updates and offline mock data fallback.
- SQL migrations live in `packages/backend/migrations/001_initial_schema.sql`.

---

## 6. Design System & Theme Tokens

### NativeWind v5 + Tailwind CSS v4
- Colors (defined in `apps/mobile/constants/theme.ts` & `apps/mobile/global.css`):
  - `background`: `#fff9e3` (warm cream background)
  - `primary` / `foreground`: `#081126` (dark navy / charcoal)
  - `card`: `#fff8e7`
  - `muted`: `#f6eecf`
  - `mutedForeground`: `rgba(0, 0, 0, 0.6)`
  - `accent`: `#ea7a53` (coral orange)
  - `border`: `rgba(0, 0, 0, 0.1)`
  - `success`: `#16a34a`
  - `destructive`: `#dc2626`
- Typography:
  - Font family: Plus Jakarta Sans (`Regular`, `Light`, `Medium`, `SemiBold`, `Bold`, `ExtraBold`)
- Safe Area Handling:
  - Container padding: `paddingTop: Math.max(insets.top, 16)`
  - Bottom scroll padding: `paddingBottom: Math.max(insets.bottom, 24) + 96` (compensating for floating tab bar)

---

## 7. Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `npx eas-cli@latest <command>`; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

---

## 8. Continuous Native Generation (CNG) Rules

- If `apps/mobile/ios/` and `apps/mobile/android/` directories do not exist, they are generated. Never create or edit them by hand — configure native behavior in `apps/mobile/app.json` and config plugins.
- Expo Go only includes bundled native modules. After adding a library with native code, the app needs a development build: `cd apps/mobile && npx expo run:ios|android` locally, or `npx eas-cli@latest build --profile development`.
- Prefer recommended Expo modules over third-party libraries. Docs: https://docs.expo.dev/versions/latest/index.md
