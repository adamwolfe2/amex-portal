import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Bell,
  ListChecks,
  Flame,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Check,
  CreditCard,
  CalendarClock,
  ChevronRight,
} from "lucide-react";
import {
  MONTHLY_PRICE,
  ANNUAL_PRICE,
  LIFETIME_PRICE,
} from "@/lib/referral";
import { CARDS } from "@/lib/data";

const features = [
  {
    icon: LayoutDashboard,
    title: "Benefit Tracker",
    description:
      "Track every credit across both cards with real-time status updates and usage history.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description:
      "Get notified before monthly, quarterly, and annual credits reset so you never leave money behind.",
  },
  {
    icon: ListChecks,
    title: "Setup Wizard",
    description:
      "Step-by-step enrollment guides for every perk. No more digging through Amex fine print.",
  },
  {
    icon: Flame,
    title: "Savings Streak",
    description:
      "Gamified tracking keeps you engaged and motivated to claim every dollar you are owed.",
  },
  {
    icon: TrendingUp,
    title: "ROI Dashboard",
    description:
      "See exactly whether your cards are paying for themselves with real-time return calculations.",
  },
  {
    icon: BookOpen,
    title: "Knowledge Base",
    description:
      "Tips, hacks, and strategies curated from the community to squeeze maximum value from your cards.",
  },
] as const;

const pricingPlans = [
  {
    name: "Monthly",
    price: MONTHLY_PRICE,
    period: "/mo",
    description: "Cancel anytime",
    highlight: false,
    label: null,
  },
  {
    name: "Annual",
    price: ANNUAL_PRICE,
    period: "/yr",
    description: `Save $${MONTHLY_PRICE * 12 - ANNUAL_PRICE} vs monthly`,
    highlight: true,
    label: "BEST VALUE",
  },
  {
    name: "Lifetime",
    price: LIFETIME_PRICE,
    period: "",
    description: "One-time payment",
    highlight: false,
    label: null,
  },
] as const;

const stats = [
  {
    value: "$4,500+",
    label: "in annual value tracked",
    icon: CreditCard,
  },
  {
    value: "40+",
    label: "benefits catalogued",
    icon: ListChecks,
  },
  {
    value: "3",
    label: "reset cadences monitored",
    icon: CalendarClock,
  },
] as const;

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fafaf9]/90 backdrop-blur-sm border-b border-[#e0ddd9]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="CreditOS"
              width={32}
              height={21}
              className="rounded"
            />
            <span className="text-base font-semibold text-[#111111]">
              CreditOS
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-[#666666] hover:text-[#111111] transition-colors px-3 py-2"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-medium text-white bg-[#1a1a2e] hover:bg-[#2a2a3e] transition-colors px-4 py-2 rounded-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center pt-24 sm:pt-16 pb-12 sm:pb-0">
        <div className="max-w-5xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-16 items-center">
            <div className="space-y-10 sm:space-y-8">
              <div className="space-y-6 sm:space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111111] tracking-tight leading-[1.1]">
                  Stop leaving money on the table.
                </h1>
                <p className="text-lg sm:text-xl text-[#666666] leading-relaxed max-w-lg">
                  Your Amex Platinum and Gold cards come with over{" "}
                  <span className="text-[#111111] font-semibold">
                    $4,500/year in credits
                  </span>
                  . Most cardholders miss more than half of them. CreditOS makes
                  sure you do not.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center gap-2 text-base font-semibold text-white bg-[#1a1a2e] hover:bg-[#2a2a3e] transition-colors px-8 py-4 sm:py-3.5 rounded-xl sm:rounded-lg"
                >
                  Start Tracking
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 text-base font-medium text-[#666666] hover:text-[#111111] border border-[#e0ddd9] hover:border-[#ccc9c4] transition-colors px-8 py-4 sm:py-3.5 rounded-xl sm:rounded-lg"
                >
                  See How It Works
                </a>
              </div>
              <div className="flex items-center flex-wrap gap-6 gap-y-3 pt-2">
                <div className="flex items-center gap-2 text-sm text-[#666666]">
                  <Check className="h-4 w-4 text-[#8B6914]" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#666666]">
                  <Check className="h-4 w-4 text-[#8B6914]" />
                  <span>Setup in 2 minutes</span>
                </div>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end pt-4 sm:pt-0">
              <div className="relative w-full max-w-md overflow-hidden pb-8">
                <Image
                  src="/platinum-card.png"
                  alt="Amex Platinum Card"
                  width={400}
                  height={252}
                  className="relative z-10 rounded-xl shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500"
                  priority
                />
                <Image
                  src="/gold-card.png"
                  alt="Amex Gold Card"
                  width={400}
                  height={252}
                  className="absolute top-8 left-12 rounded-xl shadow-xl transform rotate-6 hover:rotate-0 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem Section ── */}
      <section className="py-20 sm:py-32 border-t border-[#e0ddd9]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] tracking-tight">
              You are paying ${(CARDS.platinum.annualFee + CARDS.gold.annualFee).toLocaleString()}+/year in annual fees.
              <br className="hidden sm:block" />
              Are you getting your money&apos;s worth?
            </h2>
            <p className="text-lg text-[#666666] leading-relaxed">
              Between the Platinum (${CARDS.platinum.annualFee}) and Gold (${CARDS.gold.annualFee}) cards, you are paying
              over ${(CARDS.platinum.annualFee + CARDS.gold.annualFee).toLocaleString()} in annual fees alone. These cards pack over 40
              benefits with monthly, quarterly, and annual reset windows. The
              problem? Most cardholders miss 60%+ of their available credits.
            </p>
          </div>
          <div className="mt-12 sm:mt-16 grid sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center space-y-3 p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#f0efed]">
                <CreditCard className="h-5 w-5 text-[#1a1a2e]" />
              </div>
              <p className="text-3xl font-bold text-[#111111]">40+</p>
              <p className="text-sm text-[#666666]">
                Benefits across both cards that require active tracking
              </p>
            </div>
            <div className="text-center space-y-3 p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#f0efed]">
                <CalendarClock className="h-5 w-5 text-[#1a1a2e]" />
              </div>
              <p className="text-3xl font-bold text-[#111111]">3 Cadences</p>
              <p className="text-sm text-[#666666]">
                Monthly, quarterly, and annual resets you need to remember
              </p>
            </div>
            <div className="text-center space-y-3 p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#f0efed]">
                <TrendingUp className="h-5 w-5 text-[#1a1a2e]" />
              </div>
              <p className="text-3xl font-bold text-[#111111]">60%+</p>
              <p className="text-sm text-[#666666]">
                Credits missed by the average cardholder every year
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Grid ── */}
      <section id="features" className="py-20 sm:py-32 border-t border-[#e0ddd9] scroll-mt-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-5 sm:space-y-4 mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] tracking-tight">
              Everything you need to maximize your cards
            </h2>
            <p className="text-lg text-[#666666]">
              Built specifically for Amex Platinum and Gold cardholders who
              refuse to leave money on the table.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group p-6 rounded-xl border border-[#e0ddd9] bg-white hover:border-[#ccc9c4] transition-colors"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#f0efed] group-hover:bg-[#1a1a2e] transition-colors mb-4">
                    <Icon className="h-5 w-5 text-[#1a1a2e] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-base font-semibold text-[#111111] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#666666] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Social Proof / Stats ── */}
      <section className="py-20 sm:py-32 border-t border-[#e0ddd9] bg-[#1a1a2e]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-10 sm:gap-12">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-2">
                    <Icon className="h-5 w-5 text-[#8B6914]" />
                  </div>
                  <p className="text-4xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/60">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Pricing Section ── */}
      <section id="pricing" className="py-20 sm:py-32 border-t border-[#e0ddd9]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-5 sm:space-y-4 mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-[#666666]">
              Pay less than 1% of the value you will recover. No hidden fees, no
              surprises.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 sm:gap-8 max-w-3xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-6 rounded-xl border bg-white text-center space-y-6 ${
                  plan.highlight
                    ? "border-[#1a1a2e] ring-1 ring-[#1a1a2e]"
                    : "border-[#e0ddd9]"
                }`}
              >
                {plan.label && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold text-[#666666] bg-[#f0efed] px-3 py-1 rounded-full tracking-wide">
                    {plan.label}
                  </span>
                )}
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-[#111111]">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-[#666666]">{plan.description}</p>
                </div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-[#111111]">
                    ${plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-[#666666]">
                      {plan.period}
                    </span>
                  )}
                </div>
                <Link
                  href="/sign-up"
                  className={`inline-flex items-center justify-center w-full gap-2 text-sm font-semibold px-6 py-3 rounded-lg transition-colors ${
                    plan.highlight
                      ? "text-white bg-[#1a1a2e] hover:bg-[#2a2a3e]"
                      : "text-[#111111] bg-[#f0efed] hover:bg-[#e0ddd9]"
                  }`}
                >
                  Get Started
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 sm:py-32 border-t border-[#e0ddd9]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] tracking-tight text-center mb-10 sm:mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-0 divide-y divide-[#e0ddd9]">
            <details className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-[#111111]">
                What is CreditOS?
                <ChevronRight className="h-4 w-4 text-[#666666] transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-[15px] text-[#666666] leading-relaxed">
                CreditOS is a benefits tracking platform for American Express
                Platinum and Gold cardholders. It helps you track, claim, and
                maximize over $4,500 per year in card credits so you never leave
                money on the table.
              </p>
            </details>
            <details className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-[#111111]">
                Which Amex cards does CreditOS support?
                <ChevronRight className="h-4 w-4 text-[#666666] transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-[15px] text-[#666666] leading-relaxed">
                CreditOS currently supports the American Express Platinum Card
                and the American Express Gold Card. We track all monthly,
                quarterly, and annual benefits for both cards.
              </p>
            </details>
            <details className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-[#111111]">
                How does the 7-day free trial work?
                <ChevronRight className="h-4 w-4 text-[#666666] transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-[15px] text-[#666666] leading-relaxed">
                Sign up for the annual plan and get full access to every feature
                for 7 days. If CreditOS is not for you, cancel before the trial
                ends and you will not be charged.
              </p>
            </details>
            <details className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-[#111111]">
                Can I cancel anytime?
                <ChevronRight className="h-4 w-4 text-[#666666] transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-[15px] text-[#666666] leading-relaxed">
                Yes. You can cancel your subscription at any time from Settings
                in your dashboard. Monthly plans end at the close of the current
                billing period. Annual and lifetime plans include a 30-day
                refund window.
              </p>
            </details>
            <details className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-[#111111]">
                Is my payment information secure?
                <ChevronRight className="h-4 w-4 text-[#666666] transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-[15px] text-[#666666] leading-relaxed">
                Absolutely. Stripe handles all payment processing. CreditOS
                never sees or stores your credit card details.
              </p>
            </details>
            <details className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-[#111111]">
                Do I need to give CreditOS access to my Amex account?
                <ChevronRight className="h-4 w-4 text-[#666666] transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-[15px] text-[#666666] leading-relaxed">
                No. CreditOS does not connect to your American Express account.
                You manually track your benefits, and we provide the reminders,
                guides, and analytics to help you claim every dollar.
              </p>
            </details>
            <details className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-[#111111]">
                What happens if I miss a credit reset?
                <ChevronRight className="h-4 w-4 text-[#666666] transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-[15px] text-[#666666] leading-relaxed">
                CreditOS sends reminders before each reset deadline so you have
                time to act. Your dashboard also highlights unclaimed benefits
                with urgency indicators as deadlines approach.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 sm:py-32 border-t border-[#e0ddd9]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] tracking-tight">
              Your benefits are resetting.
              <br />
              Start tracking today.
            </h2>
            <p className="text-lg text-[#666666]">
              Every month you wait is money you will never get back. Set up
              CreditOS in two minutes and start claiming what is yours.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 text-base font-semibold text-white bg-[#1a1a2e] hover:bg-[#2a2a3e] transition-colors px-10 py-4 rounded-xl sm:rounded-lg w-full sm:w-auto"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 sm:py-8 border-t border-[#e0ddd9]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="CreditOS"
              width={24}
              height={16}
              className="rounded"
            />
            <span className="text-sm font-semibold text-[#111111]">
              CreditOS
            </span>
          </div>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <Link
              href="/apply"
              className="text-sm text-[#666666] hover:text-[#111111] transition-colors"
            >
              Become an Ambassador
            </Link>
            <Link
              href="/feedback"
              className="text-sm text-[#666666] hover:text-[#111111] transition-colors"
            >
              Send Feedback
            </Link>
            <Link
              href="/terms"
              className="text-sm text-[#666666] hover:text-[#111111] transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-[#666666] hover:text-[#111111] transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/refunds"
              className="text-sm text-[#666666] hover:text-[#111111] transition-colors"
            >
              Refunds
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
