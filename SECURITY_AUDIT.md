# Security Audit Report
**Date:** 2026-03-19
**Project:** CreditOS (amex-portal)
**Auditor:** Claude Code (Automated Adversarial Audit)
**Branch:** security-audit/2026-03-19

## Executive Summary
- **Total Vulnerabilities Found:** 11
  - Critical: 0 (secrets never committed to git - verified)
  - High: 3
  - Medium: 5
  - Low: 3
- **Total Vulnerabilities Fixed:** 8
- **Remaining (Documented, Needs Infra):** 3

## Attack Surface Summary
- **Total API Endpoints:** 13 (GET + POST + DELETE across 10 route files)
- **Unprotected Endpoints Found:** 0 (all public endpoints are intentionally public)
- **Total Frontend Routes:** 17 (15 protected + 2 public)
- **Client-Only Protection:** 0 (all enforced server-side via proxy.ts middleware)
- **Database Tables:** 6
- **Sensitive Fields Identified:** 6 (email, stripeCustomerId, stripeSubscriptionId, referralCode, clerkId, Neon password)
- **Third-Party Integrations:** 4 (Clerk, Stripe, Neon, Fontshare CDN)

## Vulnerability Details

### [V-001] Stripe webhook accepts missing signature header
- **Severity:** High
- **Category:** Webhook Security
- **Location:** `app/api/webhooks/stripe/route.ts:16`
- **Description:** Used non-null assertion `!` on `stripe-signature` header. If header is missing, passes `null` to Stripe SDK which throws — but the error is indistinguishable from a tampered signature.
- **Impact:** No bypass possible (Stripe SDK rejects null signatures), but violates defense-in-depth.
- **Fix Applied:** Explicit null check before calling constructEvent; also validate STRIPE_WEBHOOK_SECRET exists.
- **Verified:** Yes

### [V-002] Console logs leak user IDs and full error objects
- **Severity:** Medium
- **Category:** Information Disclosure
- **Location:** `app/api/webhooks/stripe/route.ts:91,161`, `app/api/webhooks/clerk/route.ts:90`, `app/api/checkout/route.ts:40`
- **Description:** `console.log/error` statements included internal user IDs (purchaser.id, clerkId) and raw error objects that could contain stack traces or sensitive data.
- **Impact:** Log aggregators (Vercel, Datadog) would store PII. In a breach of logging infrastructure, user IDs are exposed.
- **Fix Applied:** Redacted all user IDs from logs. Error objects now log only `.message`.
- **Verified:** Yes

### [V-003] No security headers configured
- **Severity:** High
- **Category:** Misconfiguration
- **Location:** `vercel.json`
- **Description:** Missing CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy headers.
- **Impact:** App vulnerable to clickjacking (no X-Frame-Options), MIME sniffing attacks, and has no CSP to mitigate XSS.
- **Fix Applied:** Added full security headers to vercel.json including CSP scoped to Clerk, Stripe, Fontshare, and Neon domains.
- **Verified:** Yes

### [V-004] Referral cookie accepts unbounded input
- **Severity:** Medium
- **Category:** Input Validation
- **Location:** `proxy.ts:19`
- **Description:** The `ref` query parameter is stored as a cookie with no length validation. An attacker could pass a very large ref value to bloat cookies.
- **Impact:** Cookie overflow, potential header size issues. Low practical impact.
- **Fix Applied:** Added `ref.length <= 20` guard (referral codes are 8 chars).
- **Verified:** Yes

### [V-005] benefitId accepts any string in claims creation
- **Severity:** Medium
- **Category:** Input Validation
- **Location:** `lib/validation.ts:41`
- **Description:** The `benefitId` field in `claimsCreateSchema` accepted any string up to 200 chars. Should only accept known benefit IDs from the BENEFITS array.
- **Impact:** Users could create claims with invalid benefit IDs (data quality issue, not security breach).
- **Fix Applied:** Added `.refine()` that validates against `BENEFITS.map(b => b.id)`.
- **Verified:** Yes

### [V-006] Clerk avatar images used unoptimized flag
- **Severity:** Low
- **Category:** Performance / Configuration
- **Location:** `app/(app)/settings/page.tsx:149`
- **Description:** External Clerk avatar images used `unoptimized` prop, bypassing Next.js image optimization.
- **Fix Applied:** Configured `images.remotePatterns` in `next.config.ts` for Clerk domains; removed `unoptimized` flag.
- **Verified:** Yes

### [V-007] No rate limiting on checkout endpoint
- **Severity:** Medium
- **Category:** API Abuse
- **Location:** `app/api/checkout/route.ts`
- **Description:** The POST /api/checkout endpoint had no rate limiting, allowing potential Stripe session spam.
- **Fix Applied:** Added IP-based rate limiting (5 req/min) matching apply/feedback endpoints.
- **Verified:** Yes

### [V-008] In-memory rate limiter doesn't scale to serverless
- **Severity:** Medium
- **Category:** Architecture
- **Location:** `lib/rate-limit.ts`
- **Description:** Rate limiter uses an in-memory Map. On Vercel serverless, each function invocation gets fresh memory — rate limits don't persist across instances.
- **Impact:** Rate limiting is best-effort, not guaranteed. Sufficient for current traffic volume.
- **Fix Applied:** Not fixed (requires Upstash Redis infrastructure change).
- **Verified:** N/A — documented for future session

### [V-009] No explicit CORS configuration
- **Severity:** Low
- **Category:** Configuration
- **Location:** `next.config.ts`
- **Description:** No explicit CORS headers. Next.js defaults to same-origin which is secure.
- **Impact:** None currently (app and API are same-origin).
- **Fix Applied:** No change needed — secure by default.
- **Verified:** Yes

### [V-010] Webhook secret env vars use non-null assertion
- **Severity:** Low
- **Category:** Robustness
- **Location:** `app/api/webhooks/stripe/route.ts:23`
- **Description:** `process.env.STRIPE_WEBHOOK_SECRET!` could crash if env var is missing.
- **Fix Applied:** Added explicit null check with 500 response before using the secret.
- **Verified:** Yes

### [V-011] Follower count validation mismatch in apply schema
- **Severity:** Low
- **Category:** Validation
- **Location:** `lib/validation.ts:15-21`
- **Description:** The apply page UI uses "Under 1K" but the Zod schema expects "<1K". These must match for validation to pass.
- **Impact:** Form submissions with "Under 1K" would be rejected. Likely a latent bug.
- **Fix Applied:** Not fixed — needs UI/schema alignment decision from product.
- **Verified:** N/A

## Exploitation Scenario Results

### Scenario 1: Unauthorized Data Dump
- **Result:** Failed
- **Details:** All protected API endpoints return 401 without valid Clerk session. Proxy.ts middleware blocks unauthenticated access to all non-public routes server-side. Tested: /api/claims, /api/referrals, /api/user/status, /api/user/checklist.
- **Remediation:** N/A — already secure.

### Scenario 2: Account Takeover / IDOR
- **Result:** Failed
- **Details:** All data access queries filter by `userId` derived from Clerk auth (server-side). Claims DELETE uses `and(eq(id), eq(userId))` preventing cross-user deletion. No endpoint accepts a user ID in the request body for data access.
- **Remediation:** N/A — already secure.

### Scenario 3: API Abuse
- **Result:** Partially mitigated
- **Details:** Public endpoints (apply, feedback) have rate limiting. Checkout now has rate limiting. Protected endpoints rely on Clerk auth as implicit rate limiting (must have valid session). In-memory rate limiter is best-effort on serverless.
- **Remediation:** Rate limiting added to checkout. Redis-based limiter recommended for scale.

### Scenario 4: Injection Attacks
- **Result:** Failed
- **Details:** All database queries use Drizzle ORM parameterized queries. No raw SQL anywhere in the codebase. No `eval()`, `dangerouslySetInnerHTML`, or `innerHTML` usage found. All user input validated via Zod schemas before reaching DB.
- **Remediation:** N/A — already secure.

### Scenario 5: Insider Threat
- **Result:** Failed
- **Details:** No admin endpoints exist. No role escalation possible (all users are equal). No server-side command execution vectors. No debug/diagnostic endpoints exposed. Env vars only accessible server-side.
- **Remediation:** N/A — already secure.

## Dependency Audit
- **npm audit results:** 4 moderate vulnerabilities (all in esbuild via drizzle-kit — dev dependency only, not production)
- **Critical/High CVEs fixed:** None found
- **Remaining accepted risks:** esbuild dev server vulnerability (dev-only, not exploitable in production)

## Security Headers Status
| Header | Before | After |
|--------|--------|-------|
| HSTS | Missing | max-age=63072000; includeSubDomains; preload |
| CSP | Missing | Scoped to self + Clerk + Stripe + Fontshare + Neon |
| X-Frame-Options | Missing | DENY |
| X-Content-Type-Options | Missing | nosniff |
| Referrer-Policy | Missing | strict-origin-when-cross-origin |
| Permissions-Policy | Missing | camera=(), microphone=(), geolocation=() |

## Credentials That May Need Rotation
- **None** — `.env.local` was never committed to git (verified via `git log --all -- .env.local`). All secrets are safe.

## Remaining Risks & Recommendations
1. **Upgrade rate limiter to Upstash Redis** — in-memory Map doesn't persist across serverless instances
2. **Align follower count enum** between apply page UI ("Under 1K") and Zod schema ("<1K")
3. **Add E2E security tests** — Playwright tests that verify 401/403 on protected routes
4. **Monitor CSP violations** — Add `report-uri` or `report-to` directive to CSP header
5. **Consider Stripe customer portal** — for self-service subscription management (reduces support surface)
