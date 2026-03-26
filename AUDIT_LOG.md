# CreditOS — Full Codebase Audit Log

**Date:** 2026-03-25
**Auditor:** Claude Opus 4.6
**Project:** CreditOS (amex-portal)
**Stack:** Next.js 16.2.0, React 19, TypeScript strict, Drizzle ORM, Neon PostgreSQL, Clerk, Stripe, Tailwind v4, shadcn/ui

---

## Phase 0: Discovery Summary

- 18 pages (13 protected, 2 public, 2 auth, 1 redirect)
- 11 API routes (webhooks for Clerk + Stripe, CRUD for claims/checklist, checkout, cron)
- 15 components (8 dashboard, 1 sidebar, 1 wizard, 5 shadcn/ui)
- 6 DB tables (users, benefit_claims, referrals, checklist_progress, ambassador_applications, feedback_responses)
- Static data: 46 benefits, 27 checklist items, 20 tips, 21 tools, 8 best-card rules, 24 sources
- Deployed on Vercel with Cron, CSP headers, HSTS

---

## Phase 1: Fixes Completed

### 1.1 Dead Code & Unused Imports
- Removed `Badge` import from `components/dashboard/not-enrolled.tsx` (replaced with text label)
- Removed `Badge` import from `components/dashboard/upcoming-resets.tsx` (replaced with text label)
- Replaced dynamic imports in `app/api/webhooks/clerk/route.ts` with top-level imports

### 1.2 Type Safety & Error Handling
- **FIXED:** 3 API routes missing `try/catch` on `request.json()` — added `.catch(() => ({}))` fallback
  - `app/api/claims/route.ts`
  - `app/api/user/onboarding/route.ts`
  - `app/api/user/checklist/route.ts`
- **FIXED:** Stripe webhook subscription retrieval wrapped in try/catch (line 60-62)
- **FIXED:** Clerk webhook referral assignment simplified (`refCode` instead of `referrer.referralCode`)

### 1.3 Consistency & Design Rules
- **FIXED:** Colored badges in `not-enrolled.tsx` and `upcoming-resets.tsx` replaced with grey text labels per design rule
- **FIXED:** Accessibility — added `title` attribute to truncated benefit names in `not-enrolled.tsx`

### 1.4 Security
- **FIXED:** Rate limiter memory leak — added periodic cleanup of stale entries (every 5 min)
- **FIXED:** Environment variable validation at startup (`lib/env.ts`) — fails fast if critical vars missing
- **PASS:** No hardcoded secrets found
- **PASS:** No SQL injection (Drizzle ORM parameterized queries)
- **PASS:** No XSS (no dangerouslySetInnerHTML)
- **PASS:** All webhooks verify signatures
- **PASS:** All public endpoints rate-limited
- **PASS:** `.env` files in `.gitignore`

### 1.5 Performance
- **FIXED:** `enrollment-wizard.tsx` — added `useMemo` for sorted array and value calculations (prevented recalculation on every render)

---

## Phase 2-5: Issues Found But NOT Fixed

### Critical (Fix These First)

**A. Stripe checkout redirect fails**
- Root cause: Stripe price ID env vars (`STRIPE_MONTHLY_PRICE_ID`, `STRIPE_ANNUAL_PRICE_ID`, `STRIPE_PRICE_ID`) likely invalid/missing on Vercel
- Error message improved to surface "Payment system is not configured" to users
- **Action needed:** Verify Stripe dashboard has valid prices; update Vercel env vars
- Severity: CRITICAL

### High Priority

**B. No test suite exists**
- Zero test files found (no Jest, Vitest, or Playwright configuration)
- No unit, integration, or E2E tests
- **Action needed:** Set up Vitest + Playwright, write tests for critical paths
- Severity: HIGH

**C. Stripe localhost fallback in production**
- `lib/stripe.ts` line 32: `const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"`
- If `NEXT_PUBLIC_APP_URL` is unset in production, Stripe redirects go to localhost
- **Action needed:** Set `NEXT_PUBLIC_APP_URL` on Vercel or make it required
- Severity: HIGH

**D. No pagination on large queries**
- `getAllActiveUsers()` returns ALL users — will degrade as user count grows
- `getReferralsByReferrer()` returns all referrals without limit
- `/api/claims` GET returns all claims without pagination
- **Action needed:** Add cursor/offset pagination to list endpoints
- Severity: HIGH (as user base grows)

### Medium Priority

**E. Console statements in production code**
- 15 instances of `console.error`/`console.warn`/`console.log` across API routes
- Should use structured logging (e.g., Pino) for production traceability
- Severity: MEDIUM

**F. No double-click protection on forms**
- Apply and feedback forms lack submit button debouncing
- Could result in duplicate ambassador applications or feedback entries
- Severity: MEDIUM

**G. Referral code collision algorithm**
- 5 retries with random generation could theoretically fail
- At scale (100K+ users), collision probability increases significantly
- **Action needed:** Use UUID-based codes or check-then-generate with DB unique constraint
- Severity: MEDIUM

**H. Missing rate limiting on authenticated endpoints**
- `/api/claims`, `/api/user/checklist`, `/api/user/onboarding`, `/api/user/status` have no rate limiting
- Only public endpoints (apply, feedback, checkout) are rate-limited
- Severity: MEDIUM

**I. Cron job sends to ALL users regardless of subscription**
- `getAllActiveUsers()` fetches everyone including free-tier users
- Should filter to paid subscribers or users who opted in to emails
- Severity: MEDIUM

### Low Priority

**J. No soft deletes on any table**
- Deleted records are permanently removed
- No audit trail for who changed what
- Severity: LOW

**K. Data freshness concerns**
- Benefits, tips, tools, sources are static TypeScript arrays
- No versioning or update dates
- External URLs may become stale
- Severity: LOW

**L. No timezone awareness in action items**
- `lib/data/actions.ts` uses server time, not user's timezone
- Monthly reset reminders may appear on wrong day for users in different timezones
- Severity: LOW

---

## Build & Lint Status

- Build: PASS (zero errors, zero warnings)
- Lint: PASS (zero errors)
- TypeScript: PASS (strict mode, no `any` types)
