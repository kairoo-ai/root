# Kairoo - Full App Build Design Spec

**Date:** 2026-06-14  
**Status:** Approved for planning  
**Scope:** End-to-end authenticated product - auth, dashboard, all AI tools, billing, settings, dark theme fix

---

## 1. What We're Building

Kairoo is an AI-powered career + learning SaaS. The marketing site and engine stubs already exist. This build makes everything **real**: auth, gated app shell, working AI feature UIs, billing, usage metering, and user settings - shipped to Vercel with Cloudflare.

**Not in scope:** the marketing pages (already done), the investor pages, e2e tests, admin panel.

---

## 2. Stack

| Layer         | Choice                                    | Notes                                                                       |
| ------------- | ----------------------------------------- | --------------------------------------------------------------------------- |
| Framework     | Next.js 15 App Router                     | existing                                                                    |
| UI Components | HeroUI v3 + AceternityUI + tw-animate-css | HeroUI already installed; add Aceternity components inline                  |
| Animation     | Framer Motion + Anime.js                  | both already installed                                                      |
| Auth          | Clerk                                     | `@clerk/nextjs` - new install                                               |
| Database      | Neon (Postgres) + Drizzle ORM             | new install: `drizzle-orm`, `@neondatabase/serverless`, `drizzle-kit`       |
| Billing       | Razorpay                                  | new install: `razorpay` (server), `razorpay` JS SDK (client via CDN/script) |
| AI            | Gemini via `engines/ai` gateway           | existing - already wired                                                    |
| Deploy        | Vercel + Cloudflare                       | existing pipeline                                                           |

---

## 3. Dark Theme Fix

**Problem:** Current dark tokens use `navy-950` as background (`oklch(0.18 0.035 255)`) - has a visible blue/purple cast. Cards use `navy-900`. Borders are `navy-800`. The result feels washed and off-brand.

**Fix:** Add new OLED-dark semantic layer in `scripts/build-tokens.ts` + regenerate:

```
--background:   oklch(0.09 0.005 255)   /* near-black, minimal chroma */
--card:         oklch(0.12 0.006 255)   /* just barely lifted */
--card-border:  oklch(0.18 0.008 255)   /* visible but subtle */
--sidebar:      oklch(0.075 0.004 255)  /* slightly darker than bg */
```

Keep teal-400 as primary in dark mode (no change). Keep the aurora background gradient - just ensure it sits behind true-dark surfaces so the glow reads correctly.

---

## 4. Route Architecture

New route groups to add alongside existing `(marketing)/` and `investors/`:

### `app/(auth)/` - Auth Shell

Centered layout, no sidebar. Pages:

- `/sign-in` - Clerk `<SignIn>` component, branded
- `/sign-up` - Clerk `<SignUp>` component, branded
- `/verify` - email verification holding page

### `app/(app)/` - Authenticated Product Shell

Wide sidebar (Option C - selected). Pages under this group:

| Route                | Page                                                                |
| -------------------- | ------------------------------------------------------------------- |
| `/dashboard`         | Main dashboard (stats, quick-launch, activity, usage, goals)        |
| `/tools`             | Full tool browser - all 38 AI features in a searchable grid         |
| `/tools/[featureId]` | Individual AI tool page (input form → streaming response → history) |
| `/roadmaps`          | Career roadmaps list + create                                       |
| `/roadmaps/[id]`     | Single roadmap detail view                                          |
| `/activity`          | Full activity/history feed                                          |
| `/progress`          | XP, streaks, skill chart, weekly/monthly view                       |
| `/settings`          | Tabbed settings: Profile, Billing, Notifications, Security          |
| `/settings/billing`  | Plan, usage, Razorpay checkout, invoice history                     |

---

## 5. Component Architecture

### New shells

`components/shells/AppShell.tsx` - wide sidebar + topbar + content slot  
`components/shells/AuthShell.tsx` - centered, full-screen

### Sidebar (`components/layout/Sidebar.tsx`)

- Logo + brand badge
- User pill (avatar, name, plan) - Clerk `useUser()`
- Grouped nav: Overview / Career AI / Learning / Account
- Footer upgrade card with credit progress bar
- Collapses to icon-only on mobile (`<768px`)

### Topbar (`components/layout/AppTopbar.tsx`)

- Breadcrumb, ⌘K search (`cmdk`), notifications bell, help icon
- Theme toggle

### Dashboard blocks (colocated in `app/(app)/dashboard/_components/`)

- `WelcomeBanner` - greeting, active roadmap CTA
- `StatsGrid` - 4 stat cards (AI runs, roadmaps, study hours, XP)
- `QuickLaunch` - top 4 tool cards
- `ActivityFeed` - recent events
- `UsageRing` - SVG ring chart + breakdown bars
- `WeeklyGoals` - checklist with XP rewards

### AI Tool UI (colocated in `app/(app)/tools/_components/`)

- `ToolInputForm` - dynamic form from `FeatureDef.inputs` (text/textarea/select)
- `ToolOutput` - streaming Markdown output with copy, share, save
- `ToolHistory` - previous runs for this tool (from DB)
- `ToolHeader` - icon, name, description, tier badge

---

## 6. Data Layer

### Schema (`data/schema/`)

```
users          - clerk_id (PK), email, name, avatar, created_at
subscriptions  - user_id (FK), plan (free|pro|enterprise), status, razorpay_subscription_id, current_period_end
usage_events   - id, user_id, feature_id, tokens_used, created_at
roadmaps       - id, user_id, title, goal, plan_json, status, created_at
activity_log   - id, user_id, type, payload_json, created_at
```

### Repositories (implement the stubs in `data/repositories/`)

- `users.repo.ts` - upsertByClerkId, findById
- `subscriptions.repo.ts` - findByUserId, upsert
- `usage.repo.ts` - record, getRemainingCredits, getMonthlyBreakdown

---

## 7. Auth Integration (Clerk)

- Install `@clerk/nextjs`
- Add `ClerkProvider` in `app/layout.tsx`
- `middleware.ts` - protect all `/(app)/*` routes; allow `/(auth)/*`, `/(marketing)/*`, `/api/webhooks/*`
- `app/api/webhooks/clerk/route.ts` - sync Clerk user events → `users` table (user.created, user.updated, user.deleted)
- `server/auth/session.ts` - implement `requireUser()` using `auth()` from Clerk

---

## 8. AI Features

`app/(app)/tools/[featureId]/page.tsx` - server component fetches feature def from registry, passes to client  
`app/api/ai/route.ts` - already exists; ensure it:

1. Calls `requireUser()`
2. Checks credits via `usage.repo.getRemainingCredits()`
3. Calls `engines/ai/gateway` with the feature's prompt
4. Streams response back
5. Records usage on completion

**Streaming:** use `ReadableStream` + `StreamingTextResponse` pattern. Client uses `useEffect` + `EventSource` or `fetch` with streaming reader.

---

## 9. Billing (Razorpay)

### Plans

| Plan       | Credits/mo | Price     |
| ---------- | ---------- | --------- |
| Free       | 10         | ₹0        |
| Pro        | 100        | ₹499/mo   |
| Enterprise | Unlimited  | ₹1,999/mo |

### Flow

1. User clicks "Upgrade" → `POST /api/billing/create-order` → creates Razorpay order
2. Client opens Razorpay checkout modal (Razorpay.js)
3. On success → `POST /api/billing/verify` → verify signature → upsert subscription in DB
4. `app/api/webhooks/razorpay/route.ts` - handles `subscription.activated`, `payment.failed`, `subscription.cancelled`

### API routes

- `app/api/billing/create-order/route.ts`
- `app/api/billing/verify/route.ts`
- `app/api/webhooks/razorpay/route.ts`

---

## 10. Animations

### Framer Motion

- Sidebar nav items: staggered entrance on mount (`staggerChildren: 0.04`)
- Page transitions: `AnimatePresence` + slide+fade between routes
- Stat cards: count-up animation on mount
- Tool output: character-by-character streaming fade-in

### Anime.js

- Dashboard welcome banner: subtle particle/dot field background
- XP level-up: burst animation on goal completion
- Progress ring: draw-on animation for usage ring

### AceternityUI components to use

- `BackgroundGradient` - wrap individual tool cards on hover
- `SparklesCore` - subtle sparkle effect in welcome banner
- `TextGenerateEffect` - AI output character animation
- `CardSpotlight` - stat cards and tool cards hover effect
- `Meteors` - settings/billing page hero

---

## 11. Settings Pages

### `/settings` (tabbed)

- **Profile** - name, avatar (Clerk managed), timezone, career goal
- **Billing** - current plan badge, usage bar, upgrade/downgrade CTA, invoice history table
- **Notifications** - email prefs (weekly digest, goal reminders, new feature)
- **Security** - connected accounts (from Clerk), active sessions, danger zone

---

## 12. Environment Variables Needed

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Neon
DATABASE_URL=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=

# AI (existing)
GOOGLE_GENERATIVE_AI_API_KEY=
```

---

## 13. Deployment

- `vercel.json` - no changes needed; Vercel auto-detects Next.js
- Neon: provision DB, set `DATABASE_URL` in Vercel env
- Clerk: create app, set publishable/secret keys in Vercel env
- Razorpay: create account (free), get test keys, add to Vercel env
- Cloudflare: DNS already pointing at Vercel - no changes

---

## 14. Implementation Order

1. **Dark theme fix** - update tokens, regenerate, verify `/style` page
2. **Clerk install + middleware** - auth working, routes protected
3. **Neon + Drizzle** - schema, migrations, repo implementations
4. **App shell** - `(app)` route group, `AppShell`, `Sidebar`, `AppTopbar`
5. **Dashboard** - all dashboard blocks wired to real data
6. **Auth pages** - `/sign-in`, `/sign-up` with Clerk components
7. **Tools browser** - `/tools` grid + `/tools/[featureId]` individual tool UI
8. **AI streaming** - wire the API route end-to-end with credit metering
9. **Roadmaps** - list + detail pages, create flow
10. **Billing** - Razorpay integration, `/settings/billing`
11. **Settings** - all tabs
12. **Progress page** - XP, streaks, charts
13. **Animations** - Framer Motion transitions, Anime.js effects, AceternityUI components
14. **Polish + deploy** - responsive fixes, Vercel env setup, smoke test
