# CreditOS — Business Snapshot & GTM Plan

---

## Executive Summary

**What it is:** CreditOS is a habit-tracking and optimization SaaS for American Express Platinum ($895/yr fee) and Gold ($325/yr fee) cardholders. The platform tracks 29 benefits worth a combined ~$3,400+ in annual value, gamifies monthly credit claiming (streaks, ROI dashboards, achievements), and sends automated reminders to prevent money from expiring on the table.

**Core thesis:** Amex charges $895/year for the Platinum card. Most cardholders capture less than 50% of available benefits, meaning they're effectively paying $500+ for a $200 card. CreditOS turns that into a 3–4x ROI story. A user who pays $50/yr for CreditOS and unlocks an extra $800 in benefits they were already missing has a 16x return. The product *sells itself* if the target user understands the math.

**Why now:** Amex Platinum is one of the most Googled and Reddit-discussed credit cards in America. There are 3M+ active Platinum cardholders. The "is Amex Platinum worth it" search has millions of monthly queries. There is zero dominant SaaS product in this niche.

---

## Unit Economics

**Pricing:**
- Monthly: $10/mo ($120/yr)
- Annual: $50/yr
- Lifetime: $150 one-time

**Infrastructure cost per user/month:**

| Service | Free Tier | Per-user cost at scale |
|---|---|---|
| Vercel (hosting) | 100GB bandwidth | ~$0.01–0.05/user/mo |
| Neon PostgreSQL | 0.5GB compute | ~$0.01–0.02/user/mo |
| Clerk (auth) | 10,000 MAU free | ~$0.02/user/mo after |
| Upstash Redis | 10,000 req/day free | ~$0.00–0.01/user/mo |
| Resend (email) | 3,000 emails/mo free | ~$0.001/email |
| Vercel Cron | Included | $0 |
| **Total** | | **~$0.05–0.10/user/month** |

**There are NO AI/LLM API calls in this product.** All computation is pure TypeScript logic on static data. Cost per user is effectively $0.05–0.10/month. This is an extremely high-margin SaaS.

**Unit economics model:**

| Metric | Monthly Plan | Annual Plan | Lifetime |
|---|---|---|---|
| Revenue | $10/mo | $50/yr ($4.17/mo) | $150 once |
| Infra COGS | $0.08/mo | $0.08/mo | $0.08/mo |
| Gross Margin | **99.2%** | **98.1%** | ~99% |
| Stripe fees (2.9%+$0.30) | $0.59/mo | $1.75/yr | $4.65 |
| **Net per user/mo** | **~$9.33** | **~$3.98** | $145 amortized |

**LTV estimates:**
- Monthly churn target: 3–5% (benefits tracker = high retention if habit forms)
- Monthly plan LTV: $10 / 0.04 = **$250**
- Annual plan LTV: 2 year avg renewal × $50 = **$100**
- Lifetime LTV: **$150** (no churn risk, worst for MRR, best for cash)

**EBITDA at 100 paying users:**
- 100 users, blended $6/mo → $600 MRR → $7,200 ARR
- Infra cost: ~$10/mo
- **EBITDA margin: ~98%** (pre-marketing)

**Break-even CAC:** Given $250 LTV on monthly plan, you can afford up to **$125 CAC** and still be 2:1 LTV:CAC. At $50 LTV annual, keep CAC under $25. With zero marginal infra cost, this is almost purely a distribution problem.

---

## The 5 ICPs (Highest Leverage, Highest ROI)

### ICP #1 — The Points & Miles Optimizer (Highest volume, easiest close)
- **Who:** 28–45 year old, earns $100K+, HHI $150K+, has held Amex Platinum 1–3 years. Reads The Points Guy, Doctor of Credit, View From The Wing daily. Already tracks points in spreadsheets or AwardWallet.
- **Pain:** Knows all the benefits exist. Still forgets to use Uber Cash on the last day of the month. Has never enrolled in CLEAR or Fine Hotels & Resorts. Slightly embarrassed about it.
- **Why they buy:** They already care deeply about optimization. This is a $50/yr tool that recovers $500+ they're already entitled to. The ROI math is instant.
- **Where to find them:** r/churning (3.7M members), r/amex (400K), r/creditcards (1.2M), The Points Guy newsletter, Frequent Miler readers
- **Cold message angle:** "You're leaving $847/year on the table. Here's the 3 Amex credits most Platinum holders forget."

### ICP #2 — The High-Earner Busy Professional (Highest LTV, lowest price sensitivity)
- **Who:** Lawyer, doctor, consultant, banker, 32–50 years old, $200K–$500K income. Has Amex Platinum because their firm/clients suggested it or for lounge access. Too busy to think about benefits. Paying $895/yr and using maybe $400 of it.
- **Pain:** They know they're wasting money but don't have time to optimize. They'd pay $10/mo if someone just told them what to do each month.
- **Why they buy:** Time savings + peace of mind. They're paying $895/yr; $120/yr for a dashboard that recovers $600 is a no-brainer.
- **Where to find them:** LinkedIn (filter: attorney/associate/partner/VP/director), Blind (tech workers), BigLaw forums, White Coat Investor community
- **Cold message angle:** "Your Amex Platinum pays for itself 3x over if you use it right. Most people don't. This tool does it automatically."

### ICP #3 — The Personal Finance Content Consumer (Distribution multiplier)
- **Who:** 25–38, actively building wealth, follows Graham Stephan, Andrei Jikh, Humphrey Yang on YouTube. Has Amex Platinum or Gold because a creator told them to. Treats credit card optimization as part of their financial identity.
- **Pain:** Inspired but overwhelmed. Knows the benefits exist from a YouTube video but doesn't have a system.
- **Why they buy:** Social proof + simplicity. If their favorite creator uses it, they will too.
- **Where to find them:** YouTube comment sections on Amex videos, r/personalfinance, r/financialindependence
- **Cold message angle:** Dream 100 methodology — see below.

### ICP #4 — The Small Business Owner / Freelancer with Amex Business Platinum (High referral potential)
- **Who:** Agency owner, consultant, freelancer, 30–50, uses Amex Business Platinum ($695/yr). Has employees or contractors who also have Amex cards. Thinks about expense optimization regularly.
- **Pain:** Multiple cards, multiple credits, no centralized tracking. Losing money on $200 airline credits, Dell credits, etc. every year.
- **Why they buy:** Clear dollar ROI. They calculate ROI on everything. $50/yr that recovers $1,000+ in credits they were already paying for is an easy yes.
- **Where to find them:** Small business Facebook groups, Agency Highway Slack, Traffic Think Tank, Entrepreneur subreddits
- **Note:** Enterprise/team version opportunity — they'd pay for a team dashboard for their finance team.

### ICP #5 — The Travel Hacker / Digital Nomad (Viral sharing potential)
- **Who:** 25–40, location-flexible, remote worker or full-time traveler. Uses Amex Platinum specifically for lounge access, Global Entry, hotel credits. Very active on Twitter/X travel communities.
- **Pain:** Uses the travel benefits but consistently forgets dining/streaming/Uber credits because they're not at home. Loses $50–$100/mo in monthly credits.
- **Why they buy:** FOMO + gamification. The streak mechanic resonates — they're already habit-driven. Will share their "streak" and "savings unlocked" on Twitter/X.
- **Where to find them:** Twitter/X #travelhack, Nomad List, Remote Year alumni
- **Cold message angle:** Show the activity grid / streak screenshot. "47 Amex credits this year. $2,340 captured. Here's my dashboard."

---

## Dream 100 — The Audience Owners to Target

The concept: instead of selling to 1,000 users one at a time, find the 100 people who already have the audience of your user, and partner with them. One deal = hundreds of users.

### Tier 1 — Direct Partnership (Revenue share / affiliate)

These people have audiences of 100K–5M Amex Platinum holders. One email mention or video = 500–2,000 trial signups.

| Person / Channel | Platform | Audience Size | Angle |
|---|---|---|---|
| The Points Guy (Brian Kelly) | Blog + YouTube | 1M+ email | Affiliate deal — already links to card benefits tools |
| Frequent Miler (Nick Reyes/Greg) | Blog + podcast | 200K readers | Niche but perfectly aligned, love optimization tools |
| Andrei Jikh | YouTube | 2.5M subs | Already covers Amex in multiple videos, PF audience |
| Humphrey Yang | YouTube/TikTok | 3M+ | PF + credit cards, viral-friendly content |
| Jarrad Morrow | YouTube | 300K | Amex-specific videos, engaged audience |
| AskSebby | YouTube | 400K | Pure credit card optimization content |
| ProudMoney | YouTube | 150K | PF + rewards cards |
| DansDeals (Dan Eleff) | Blog | 500K | Legendary deal community |
| Doctor of Credit | Blog | 2M monthly | Go-to for card benefit hacks |
| View From The Wing (Gary Leff) | Blog | 1M monthly | Business travelers, Platinum cardholders |

**Affiliate terms to offer:** 30% commission = $15/mo or $15–$45 per referral. Low enough to be sustainable, high enough to be compelling.

### Tier 2 — Community Infiltration (Free distribution)

| Community | Platform | Size | Strategy |
|---|---|---|---|
| r/churning | Reddit | 3.7M | Post "I built a tracker for Amex credits — here's what I learned" |
| r/amex | Reddit | 400K | Post the ROI dashboard screenshot |
| r/personalfinance | Reddit | 18M | "Tool I built to stop wasting my Amex Platinum fee" |
| Amex Offers Facebook Group | Facebook | 50K+ | Direct product fit |
| Points and Miles Facebook groups | Facebook | Multiple 100K+ | Post benefit recovery stories |
| Travel hacker Twitter/X | Twitter/X | #travelhack, #pointsnerd | Show streak/activity grid |

### Tier 3 — Podcasts to Pitch (Get on as a guest)

| Podcast | Host | Angle |
|---|---|---|
| Miles per Day Podcast | Various | "How I built a tool that recovered $3,400 in Amex benefits" |
| Stacking Benjamins | Joe Saul-Sehy (400K) | PF + tools angle |
| So Money | Farnoosh Torabi (300K) | Money habits, gamification angle |
| Travel Miles 101 | Various | "Simple system to capture all your credits" |

### Creator Outreach Script

> Subject: Partnership idea — your Amex Platinum audience
>
> Hey [Name], big fan of your [specific video on Amex Platinum].
>
> I built CreditOS — a SaaS that helps Amex Platinum/Gold holders track and capture their $3,400+ in annual benefits. Most cardholders recover less than 50% of what they're entitled to.
>
> I'd love to offer your audience a free trial + your custom affiliate link at 30% commission ($15–$45 per referral). Given how well your [X] video performed, I think a "how I use CreditOS to maximize my Platinum" video would genuinely help your audience and generate solid income for you.
>
> Happy to give you free lifetime access first so you can see it. Worth a quick call?

---

## 7-Day Revenue Plan

### Day 1–2: Activate your existing tools

**Using Cursive (lead gen):**
- Build list: LinkedIn profiles with titles attorney, consultant, financial advisor, VP, director, partner, surgeon, executive
- Add filter: company type = Big Law, McKinsey/BCG/Bain, investment banks, FAANG — highest density of Platinum cardholders
- Target size: 500–1,000 highly qualified leads for first campaign

**Using Email Bison (email infrastructure):**
- Campaign 1 — Cold email sequence:
  - Subject: "Your Amex Platinum costs $895/yr. Are you getting $895 back?"
  - Body: 3 sentences about the average capture rate (47%), link to landing page with ROI demo visible, CTA = "See your free benefit score (2 min)"
  - Sequence: 3 emails over 10 days (Day 1, Day 4, Day 10)
- Send to 500 leads → expect 2–5% click rate → 10–25 trial signups → 2–5 paying users at $10/mo or $50/yr first week

### Day 3: Reddit organic posts (free, high ROI)

Post in r/amex, r/churning, r/personalfinance:
- Title: "I tracked every Amex Platinum benefit for a year — here's what most people miss"
- Include the activity grid screenshot, the ROI number, soft CTA
- One well-written post in r/personalfinance can hit 50K upvotes. Even 500 upvotes = hundreds of signups.

### Day 4: DM 10 YouTube creators

Use the outreach script above. Target AskSebby, Jarrad Morrow, Andrei Jikh's team. Just 1 yes from someone with 300K subscribers = potentially 1,000+ trials.

### Day 5: Twitter/X thread

Write a thread: "I analyzed 29 Amex Platinum benefits and built a tracker. Here's the $3,400 most people leave on the table:"
- Each tweet = one benefit category with the dollar amount
- Final tweet: "Built CreditOS to never miss one of these again. Link in bio."
- Target: 10+ retweets from travel/PF community → organic reach

### Day 6–7: Launch on Product Hunt

- CreditOS fits perfectly: SaaS, personal finance, clean UI, unique niche
- Product Hunt drives 500–2,000 trial signups on a good launch day
- Headline: "Stop leaving $3,400/year on the table — Amex benefits tracker"
- Tagline: "Gamified benefit tracking for Platinum & Gold cardholders"

---

## Hiring Plan

**Don't hire yet** until $5K MRR. Until then:
- You run the Dream 100 outreach (email + DMs)
- You post the Reddit/Twitter content
- Cursive + Email Bison handle cold outreach at zero marginal cost

**First hire at $5K MRR:**
- Part-time content writer / SEO ($1,500–2,500/mo) — thousands of monthly searches for "is Amex Platinum worth it" and "Amex Platinum benefits". Ranking for these = free compounding traffic forever.

**Second hire at $15K MRR:**
- Growth/partnerships person ($3,000–5,000/mo) — sole job is working the Dream 100 list, getting affiliate deals signed, managing creator relationships.

**Enterprise add-on (future):**
- "Teams" tier at $25/user/mo for corporate card programs, financial advisors, travel management companies. Infrastructure already supports this with minimal dev work.

---

## The One Number That Matters Right Now

You need **10 paying users** to prove the model. At $50/yr each, that's $500 ARR and proof that strangers will pay for this. Fastest path to 10 paying users this week:

1. Post one Reddit thread in r/personalfinance (free, 30 min)
2. Send 500 cold emails via Cursive + Email Bison to Tier 1 professionals
3. DM 5 YouTube creators with the affiliate pitch

That's 3 actions. If all three convert at the floor of realistic expectations, you hit 10 paying users by end of next week.
