# Looply — Smart Subscriptions 🔄

> A modern, mobile-first subscription tracking and recurring expense management application built with **React Native (Expo SDK 57)**, **Turborepo**, **pnpm Workspaces**, **Clerk Authentication**, and a scalable **Supabase (PostgreSQL)** backend secured with **Row Level Security (RLS)**.

---

## 📱 Features

- **📊 Home Dashboard**: Real-time total balance calculation, upcoming renewal countdown carousel, and expandable subscription list.
- **🔐 Secure Authentication**: Email/password authentication and email code verification powered by **Clerk Expo** (`@clerk/expo`) with secure token caching (`expo-secure-store`).
- **🛡️ Secure Backend with RLS**: Fully isolated user data stored in **Supabase PostgreSQL** using Row Level Security policies verified via Clerk's JWT tokens (`auth.jwt() ->> 'sub' = user_id`).
- **⚡ Reactive Data Layer**: Optimistic updates for adding and cancelling subscriptions, with automatic offline fallback to initial datasets.
- **📈 Monthly Insights**: Visual spending analytics with an interactive weekly bar chart and period expense summaries.
- **🎨 Modern Design System**: Warm cream aesthetic styled with **NativeWind v5** and **Tailwind CSS v4**, paired with Plus Jakarta Sans typography.
- **🚀 Turborepo Monorepo**: High-performance multi-package architecture decoupling mobile presentation, backend services, and shared TypeScript models.

---

## 🏗️ Architecture & Monorepo Layout

```
react-native-suk/
├── apps/
│   └── mobile/                       # Looply Mobile Application (Expo SDK 57)
│       ├── app.json                  # Expo config (name: Looply, slug: looply)
│       ├── src/
│       │   ├── app/                  # Expo Router file-based screens & layouts
│       │   ├── components/           # Reusable UI components
│       │   └── hooks/                # React hooks (useSubscriptions.ts)
│       ├── constants/                # Theme tokens, data, icons
│       └── assets/                   # Fonts and graphics
│
├── packages/
│   ├── backend/                      # Supabase client & data access services (@looply/backend)
│   │   ├── migrations/               # 001_initial_schema.sql (PostgreSQL + RLS)
│   │   └── src/                      # client.ts, subscriptions.ts
│   │
│   ├── types/                        # Shared TypeScript models & mappers (@looply/types)
│   │   └── src/                      # Subscription, Expense, and User types
│   │
│   └── tsconfig/                     # Shared TypeScript base configs (@looply/tsconfig)
│
├── .npmrc                            # pnpm hoisted node-linker configuration
├── pnpm-workspace.yaml               # Monorepo workspaces definition
├── turbo.json                        # Turborepo task pipeline
├── package.json                      # Monorepo root package.json (looply-monorepo)
└── CLAUDE.md                         # Assistant guidelines
```

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Monorepo Engine** | [Turborepo](https://turbo.build) & [pnpm](https://pnpm.io) | Turborepo `2.11.7`, pnpm `10.29.2` |
| **Mobile Runtime** | [Expo](https://expo.dev) / [React Native](https://reactnative.dev) | Expo SDK `~57.0.25`, React Native `0.86.3`, React `19.2.3` |
| **Routing** | [Expo Router](https://docs.expo.dev/router/introduction) | `~57.0.23` (File-based typed routes) |
| **Styling** | [NativeWind](https://www.nativewind.dev) & Tailwind CSS | NativeWind `5.0.0-rc.0`, Tailwind CSS `4.1.12` |
| **Authentication** | [Clerk](https://clerk.com) | `@clerk/expo` `^4.10.1` + `expo-secure-store` |
| **Backend & DB** | [Supabase](https://supabase.com) (PostgreSQL) | `@supabase/supabase-js` `^2.49.1` with Row Level Security |
| **Compiler** | React Compiler | Enabled via `app.json` (`experiments.reactCompiler: true`) |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v20` or higher
- **pnpm**: `v9` or `v10` (`corepack enable` or `npm install -g pnpm`)

### 2. Install Dependencies
Install all workspace dependencies from the root directory:
```bash
pnpm install
```

### 3. Configure Environment Variables
Create a `.env` file inside `apps/mobile/` by copying the example template:
```bash
cp .env.example apps/mobile/.env
```

Open `apps/mobile/.env` and supply your credentials:
```ini
# Clerk Authentication
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# Supabase PostgreSQL Backend
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> **Note**: If Supabase credentials are left empty, the app runs gracefully using built-in mock data for offline development.

---

## 🗄️ Supabase Backend Setup

To connect Looply to a live Supabase PostgreSQL database:

1. **Create a Free Supabase Project**:
   - Go to [supabase.com](https://supabase.com) and create a new project.
2. **Execute Database Migrations**:
   - Navigate to the **SQL Editor** in your Supabase Dashboard.
   - Copy the contents of [`packages/backend/migrations/001_initial_schema.sql`](file:///Users/naruto/Desktop/react-native-suk/packages/backend/migrations/001_initial_schema.sql) and run it.
   - This creates `subscriptions` and `user_settings` tables and activates Row Level Security (RLS) policies.
3. **Configure Clerk JWT Template**:
   - In your [Clerk Dashboard](https://dashboard.clerk.com), go to **Configure > JWT Templates**.
   - Create a new template with the name **`supabase`**.
   - Under Supabase **Project Settings > API**, copy your **JWT Secret** and configure it with Clerk so Supabase can verify tokens signed by Clerk.
4. **Update Mobile Environment**:
   - Copy your Supabase **Project URL** and **anon key** into `apps/mobile/.env`.

---

## 📜 Available Scripts

Run scripts from the monorepo root:

| Command | Description |
|---|---|
| `pnpm mobile` | Start the Expo Metro bundler for the mobile app |
| `pnpm dev` | Run the Turborepo development pipeline |
| `pnpm run typecheck` | Run TypeScript type checks across all workspaces in parallel |
| `pnpm mobile:ios` | Launch the mobile app in the iOS Simulator |
| `pnpm mobile:android` | Launch the mobile app in the Android Emulator |
| `pnpm mobile:web` | Run the mobile app in a web browser |

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
