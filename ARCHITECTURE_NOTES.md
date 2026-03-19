# CreditOS Architecture Notes

## Tech Stack
- **Framework**: Next.js 16 (App Router), React 19
- **Language**: TypeScript (strict mode)
- **Auth**: Clerk (`@clerk/nextjs`) — proxy.ts protects all non-public routes
- **Database**: Neon PostgreSQL (serverless) via Drizzle ORM
- **Payments**: Stripe (subscriptions + one-time for lifetime)
- **UI**: Tailwind CSS v4, shadcn/ui, Lucide React icons
- **Toasts**: Sonner
- **Validation**: Zod
- **Deployment**: Vercel

## Directory Structure
```
app/
  (app)/       - Protected routes (sidebar layout, requires auth)
  api/         - 10 API routes (claims, checkout, referrals, user/*, webhooks/*)
  apply/       - Public ambassador application
  feedback/    - Public feedback survey
  sign-in/     - Clerk sign-in
  sign-up/     - Clerk sign-up
components/
  dashboard/   - Dashboard widgets (stat-card, progress, resets, actions)
  sidebar.tsx  - Responsive sidebar nav
  ui/          - shadcn/ui primitives
lib/
  db/          - Drizzle schema, queries, connection
  data/        - Hardcoded product data (benefits, tips, tools, etc.)
  stripe.ts    - Stripe checkout session creation
  referral.ts  - Commission constants and code generation
  validation.ts - Zod schemas for all API inputs
  rate-limit.ts - In-memory per-IP rate limiter
```

## Key Patterns
- **Auth**: `auth()` from Clerk in every protected API route, `proxy.ts` handles middleware
- **Data**: Benefits/tips/tools are hardcoded in `lib/data/` (not DB) for speed
- **DB**: 6 tables — users, benefitClaims, referrals, ambassadorApplications, feedbackResponses, checklistProgress
- **Pricing**: $10/mo, $50/yr (7-day trial), $150 lifetime — constants in `lib/referral.ts`
- **Referrals**: 30% commission, tracked via Stripe webhook + unique constraint

## Design System
- Light theme only (no dark mode)
- No emojis (Lucide icons only)
- Primary: `#1a1a2e` (navy), Gold: `#8B6914`, Background: `#fafaf9`
- Font: Satoshi (Fontshare)
- Borders: `#e0ddd9`, rounded-lg
