# CLAUDE.md

Comprehensive guidance and reference for AI assistants and developers working on the **Recurly** (Smart Billing) mobile application codebase.

---

## 1. Project Overview

- **App Name**: Recurly (Recurly Smart Billing)
- **Package Name**: `react-native-suk`
- **Purpose**: A mobile subscription tracking and recurring expense management application designed to help users track active subscriptions, monitor upcoming renewals, analyze spending trends, and manage/cancel plans.
- **Core Features**:
  - **Authentication**: Sign-in, sign-up with email verification codes, and sign-out via **Clerk Expo** (`@clerk/expo`) with secure token caching (`expo-secure-store`).
  - **Home Dashboard**: Total balance overview, next renewal dates, upcoming subscription carousel, and expandable subscription list.
  - **Subscription Management**: Full list of subscriptions with expandable details (plan details, payment method, renewal date), filtering/sorting, cancellation flow, and a bottom sheet modal to add custom subscriptions.
  - **Monthly Insights**: Spending analytics with an interactive bar chart (`InsightsBarChart`), period summary card (`ExpensesSummaryCard`), and expense history.
  - **User Settings**: Profile overview (`UserDetailsCard`) dynamically pulling Clerk user details with fallback data, application metadata, and sign-out flow.
  - **Onboarding**: Visual introduction screen with branding and call-to-action to get started.

---

## 2. Technology Stack & Key Dependencies

| Layer | Technology | Version / Details |
|---|---|---|
| **Runtime & Framework** | React Native / Expo | Expo SDK `~57.0.25`, React Native `0.86.3`, React `19.2.3` |
| **Compiler** | React Compiler | Enabled via `app.json` (`experiments.reactCompiler: true`) |
| **Navigation & Routing** | Expo Router | `~57.0.23` (File-based routing, Typed routes enabled) |
| **Styling** | NativeWind & Tailwind CSS | NativeWind `5.0.0-rc.0`, Tailwind CSS `4.1.12`, `react-native-css` `3.1.0-rc.0` |
| **CSS Preprocessing** | LightningCSS & PostCSS | `lightningcss` `1.30.1`, `@tailwindcss/postcss` `4.1.12` |
| **Authentication** | Clerk Expo | `@clerk/expo` `^4.10.1` with `expo-secure-store` token cache |
| **Gestures & Animation**| Reanimated & Gesture Handler | `react-native-reanimated` `4.5.1`, `react-native-gesture-handler` `~2.32.0`, `react-native-worklets` `0.10.1` |
| **Typography & Fonts** | Expo Font | Plus Jakarta Sans (`Light`, `Regular`, `Medium`, `SemiBold`, `Bold`, `ExtraBold`) |
| **Icons & Images** | Assets & Static Icons | PNG-based vector assets stored in `assets/icons/` and `assets/images/` |

---

## 3. Essential Commands & Development Workflow

> **CRITICAL**: This is an Expo SDK 57 project. Always use `npx expo install` instead of `npm install` or `yarn add` when adding dependencies to ensure SDK-compatible versions.

### Starting Development
```bash
# Start Expo development server (interactive Metro bundler)
npx expo start
# Or using npm scripts:
npm start

# Run on iOS simulator
npx expo start --ios
# or: npm run ios

# Run on Android emulator
npx expo start --android
# or: npm run android

# Run on Web
npx expo start --web
# or: npm run web
```

### Type Checking & Diagnostics
```bash
# Run TypeScript type check (MUST PASS before completing any task)
npx tsc --noEmit

# Diagnose Expo dependencies and configuration
npx expo-doctor

# Fix dependency version mismatches automatically
npx expo install --fix
```

### Installing Dependencies
```bash
# ALWAYS install new packages via expo:
npx expo install <package-name>
```

### Native Builds & EAS
```bash
# Development build locally:
npx expo run:ios
npx expo run:android

# Cloud build with EAS CLI:
npx eas-cli build --profile development
```

---

## 4. Project Directory Structure

```
react-native-suk/
├── assets/
│   ├── fonts/               # Plus Jakarta Sans .ttf font files
│   ├── icons/               # 20+ app and vendor logos (e.g., spotify, figma, netflix)
│   └── images/              # App icon, splash patterns, avatars, badge graphics
├── constants/
│   ├── data.ts              # Mock datasets (tabs, subscriptions, expenses, user data)
│   ├── icons.ts             # Icon imports and IconKey map
│   ├── images.ts            # Image imports and image mapping
│   └── theme.ts             # Color palette, spacing scales, radii, and component tokens
├── lib/
│   └── utils.ts             # Helpers: formatCurrency, formatSubscriptionDateTime, formatShortDate
├── src/
│   ├── app/                 # Expo Router screens and route layouts (routes ONLY)
│   │   ├── _layout.tsx      # Root layout: ClerkProvider, font loading, splash screen
│   │   ├── Onboarding.tsx   # Intro screen (/Onboarding)
│   │   ├── (auth)/          # Authentication route group (Stack layout)
│   │   │   ├── _layout.tsx  # Auth Stack
│   │   │   ├── sign-in.tsx  # Sign-in screen with Clerk password auth
│   │   │   └── sign-up.tsx  # Sign-up screen with email code verification flow
│   │   ├── (tabs)/          # Protected bottom tab navigation
│   │   │   ├── _layout.tsx  # Floating pill tab bar layout with Clerk auth guard
│   │   │   ├── index.tsx    # Home screen (Balance, Upcoming, All Subscriptions)
│   │   │   ├── subscription.tsx # My Subscriptions screen (Manage, Filter, Expand)
│   │   │   ├── insight.tsx  # Monthly Insights screen (Interactive chart, expenses summary)
│   │   │   └── setting.tsx  # Settings & profile screen (User details, sign out)
│   │   └── subscription/
│   │       └── [id].tsx     # Dynamic subscription detail route
│   └── components/          # Reusable UI components
│       ├── AddSubscriptionModal.tsx      # Bottom-sheet modal to add custom subscription
│       ├── BalanceCard.tsx               # Total subscription cost balance widget
│       ├── ExpensesSummaryCard.tsx       # Expense overview card with percentage change
│       ├── HomeHeader.tsx                # User avatar header with Add subscription button
│       ├── InsightsBarChart.tsx          # Custom interactive bar chart with selection tooltip
│       ├── ListHeading.tsx               # Section header with title and action button
│       ├── ScreenHeader.tsx              # Generic header with title and menu action
│       ├── SubscriptionCard.tsx          # Expandable subscription card with actions
│       ├── UpcomingSubscriptionCard.tsx  # Horizontal scroll card for upcoming renewals
│       ├── UserDetailsCard.tsx           # Profile display card pulling Clerk user data
│       └── index.ts                      # Barrel export for all components
├── type.d.ts                # Global TypeScript declarations (Subscription, Tab, Expenses)
├── global.css               # Tailwind CSS v4 setup, theme variables, and component utility classes
├── app.json                 # Expo project configuration (plugins, fonts, schemes, splash)
├── babel.config.js          # Babel config using babel-preset-expo
├── metro.config.js          # Metro config wrapped with NativeWind
├── tsconfig.json            # TypeScript config with path aliases (@/*, @/constants/*, etc.)
└── package.json             # Dependencies and npm scripts
```

---

## 5. Navigation & Routing Architecture

- **Framework**: Expo Router (v57) file-based routing.
- **Route Restrictions**: All files inside `src/app/` are screens or layouts. **Never** place non-route code (such as components, hooks, or constants) inside `src/app/`.
- **Layout Stack**:
  1. `src/app/_layout.tsx`: Root `Stack` layout configured with `headerShown: false`, wrapping everything in `ClerkProvider` with `tokenCache`.
  2. `src/app/(auth)/_layout.tsx`: `Stack` layout for sign-in and sign-up flows.
  3. `src/app/(tabs)/_layout.tsx`: Floating custom bottom `Tabs` navigator.
     - **Auth Guard**: Automatically redirects unauthenticated users to `/(auth)/sign-in` using Clerk's `useAuth()` (`isSignedIn`).
     - Includes animated floating pill tab bar with safe-area bottom offset.
- **Dynamic Routes**: `src/app/subscription/[id].tsx` reads params via `useLocalSearchParams<{ id: string }>()`.
- **Navigation imports**: Import `router`, `Link`, and `useLocalSearchParams` exclusively from `expo-router`.

---

## 6. Styling, Theme & UI System

### NativeWind v5 + Tailwind CSS v4
- Configured in `global.css` using `@theme` definitions and `@layer components` utility classes.
- **Colors** (defined in `constants/theme.ts` & `global.css`):
  - `background`: `#fff9e3` (warm cream background)
  - `primary` / `foreground`: `#081126` (dark navy / charcoal)
  - `card`: `#fff8e7`
  - `muted`: `#f6eecf`
  - `mutedForeground`: `rgba(0, 0, 0, 0.6)`
  - `accent`: `#ea7a53` (vibrant coral orange)
  - `border`: `rgba(0, 0, 0, 0.1)`
  - `success`: `#16a34a`
  - `destructive`: `#dc2626`
  - `subscription`: `#8fd1bd` (soft mint/sage)
- **Typography**:
  - `font-sans`: `sans-regular` (Plus Jakarta Sans Regular)
  - `font-sans-light`: `sans-light`
  - `font-sans-medium`: `sans-medium`
  - `font-sans-semibold`: `sans-semibold`
  - `font-sans-bold`: `sans-bold`
  - `font-sans-extrabold`: `sans-extrabold`

### Common Reusable Component Classes (in `global.css`)
- Header: `.home-header`, `.home-user`, `.home-avatar`, `.home-user-name`
- Cards: `.home-balance-card`, `.upcoming-card`, `.sub-card`, `.sub-card-expanded`
- Sections: `.list-head`, `.list-title`, `.list-action`, `.list-action-text`
- Modals: `.modal-overlay`, `.modal-container`, `.modal-header`, `.modal-title`, `.modal-body`
- Forms: `.auth-field`, `.auth-label`, `.auth-input`, `.auth-button`

---

## 7. TypeScript & Path Aliases

TypeScript configuration (`tsconfig.json`) supports the following path aliases:
- `@/*` -> `./src/*`
- `@/constants/*` -> `./constants/*`
- `@/lib/*` -> `./lib/*`
- `@/assets/*` -> `./assets/*`

### Core Interfaces (`type.d.ts`)
- `Subscription`: Represents a service subscription (`id`, `name`, `icon`, `price`, `billing`, `status`, `category`, `paymentMethod`, `renewalDate`, `startDate`, `color`).
- `UpcomingSubscription`: Represents an upcoming charge (`id`, `name`, `icon`, `price`, `daysLeft`).
- `DailyExpense`: Daily chart breakdown (`day`, `amount`).
- `ExpensesSummary`: Monthly overview figures (`title`, `period`, `amount`, `percentageChange`).

---

## 8. Authentication & State Management

- **Provider**: `@clerk/expo` (`ClerkProvider`)
- **Token Cache**: Secure storage backed by `expo-secure-store` via `@clerk/expo/token-cache`.
- **Environment Variable**: `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is loaded from `.env`.
- **Hooks in Use**:
  - `useAuth()`: Inspects `isSignedIn` and `isLoaded`, provides `signOut()`.
  - `useUser()`: Provides current user profile info (`user.fullName`, `user.imageUrl`, email).
  - `useSignIn()`: Handles email/password sign-in.
  - `useSignUp()`: Handles user registration and email code verification (`signUp.verifications.verifyEmailCode`).
- **Data State**: Currently maintained in local component state (`useState`) initialized with mock records from `constants/data.ts`. When extending with backend APIs or persistent databases, maintain clean abstraction layers under `src/lib/` or `src/services/`.

---

## 9. Development Best Practices & Conventions

1. **Safe Area Insets**:
   - Always query `useSafeAreaInsets()` from `react-native-safe-area-context`.
   - Apply padding to screen containers: `paddingTop: Math.max(insets.top, 16)`.
   - On bottom scroll views, ensure bottom padding compensates for both safe area and floating tab bar height (`paddingBottom: Math.max(insets.bottom, 24) + 96`).

2. **Continuous Native Generation (CNG)**:
   - Do **NOT** manually edit `android/` or `ios/` folders if present. Native configurations belong in `app.json` plugins.

3. **Accessibility**:
   - Provide `accessibilityRole` (`button`, `header`, etc.) and `accessibilityLabel` on interactive elements (`Pressable`, touchables).

4. **Formatting & Utilities**:
   - Currency: Use `formatCurrency(value, currency)` from `@/lib/utils`.
   - Dates: Use `formatSubscriptionDateTime(dateString)` or `formatShortDate(dateString)`.

5. **Verification**:
   - Always verify TypeScript compilation (`npx tsc --noEmit`) before completing any modification.
