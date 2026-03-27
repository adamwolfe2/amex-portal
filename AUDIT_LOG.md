# CreditOS — Audit Log

**Last Updated:** 2026-03-26
**Auditor:** Claude Opus 4.6
**Project:** CreditOS (amex-portal)
**Stack:** Next.js 16.2.0, React 19, TypeScript strict, Drizzle ORM, Neon PostgreSQL, Clerk, Stripe, Tailwind v4, shadcn/ui

---

## Project Stats

- **Total commits:** 38
- **Total files:** 142
- **Pages:** 18 (13 protected, 2 public, 2 auth, 1 redirect)
- **API routes:** 11 (webhooks for Clerk + Stripe, CRUD for claims/checklist, checkout, billing, cron)
- **Components:** 15+ (dashboard, sidebar, wizard, shadcn/ui)
- **DB tables:** 6 (users, benefit_claims, referrals, checklist_progress, ambassador_applications, feedback_responses)
- **Static data:** 46 benefits, 27 checklist items, 20 tips, 21 tools, 8 best-card rules, 24 sources

---

## Features Shipped

- Dashboard with benefit tracking, activity grid, and ROI summary
- Benefit vault with claim logging, export/import, and search
- Guided enrollment wizard with card selection
- Referral system with unique codes, tracking, and 30% commission
- Stripe checkout (monthly, annual, lifetime plans) with 7-day free trial
- Stripe billing portal for subscription management
- Clerk authentication with webhook sync
- Admin dashboard with user overview and email notifications
- Global search (Cmd+K) across benefits, tools, and tips
- Free/Pro gating with upgrade prompts
- Onboarding flow with card selection and celebration
- Progressive Web App (PWA) support
- SEO meta tags and OpenGraph
- Landing page with feature highlights
- Legal pages (Terms, Privacy)
- FAQ page
- Benefit detail pages with best-card recommendations
- Notification bell with action items
- Mobile-optimized layout (375px/390px+)
- Cron-based email reminders via Resend
- Upstash Redis rate limiting on public endpoints
- CSP headers and HSTS on Vercel

---

## Fixes Applied (Polish Pass — 2026-03-26)

- **Clipboard copy error handling:** Added try/catch to `copyReferralCode` in settings page and `copyLink` in refer page. On failure, shows toast instead of silent error.
- **Vault import validation:** Added `Array.isArray()` check on JSON import before processing. Rejects non-array files with clear error message.
- **Error boundary:** Confirmed `console.error` in `app/(app)/error.tsx` is acceptable (client-side error boundary logging).
- **Checkout toast:** Confirmed `checkout-toast.tsx` clears URL params via `window.history.replaceState` after showing toast.

---

## Previous Fixes (Audit — 2026-03-25)

- Removed dead imports (Badge) from not-enrolled and upcoming-resets components
- Replaced dynamic imports with top-level imports in Clerk webhook
- Added try/catch on `request.json()` in 3 API routes
- Wrapped Stripe webhook subscription retrieval in try/catch
- Replaced colored badges with grey text labels per design rules
- Added `title` attribute for truncated benefit names (accessibility)
- Added periodic cleanup to rate limiter (memory leak prevention)
- Added environment variable validation at startup
- Added `useMemo` to enrollment wizard for performance

---

## Known Remaining Items

### High Priority
- **No test suite:** Zero test files. Need Vitest + Playwright setup.
- **Stripe env vars:** Verify `STRIPE_MONTHLY_PRICE_ID`, `STRIPE_ANNUAL_PRICE_ID`, `STRIPE_PRICE_ID` are valid on Vercel.
- **Localhost fallback:** `lib/stripe.ts` falls back to `http://localhost:3000` if `NEXT_PUBLIC_APP_URL` is unset.
- **No pagination:** `getAllActiveUsers()`, `getReferralsByReferrer()`, and `/api/claims` return unbounded results.

### Medium Priority
- Console statements in API routes (15 instances) — should use structured logging.
- No double-click protection on apply/feedback forms.
- Referral code collision risk at scale (100K+ users).
- Missing rate limiting on authenticated endpoints.
- Cron job sends to all users regardless of subscription status.

### Low Priority
- No soft deletes or audit trail on any table.
- Static data arrays have no versioning or update dates.
- No timezone awareness in action item scheduling.

---

## Build & Lint Status

- **Build:** PASS
- **Lint:** PASS
- **TypeScript:** PASS (strict mode)
