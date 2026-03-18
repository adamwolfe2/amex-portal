// ============================================================
// Amex OS — TypeScript Type Definitions
// ============================================================

export type CardKey = 'platinum' | 'gold';

export type CardInfo = {
  name: string;
  short: string;
  color: string;
  annualFee: number;
};

export type Cards = Record<CardKey, CardInfo>;

export type BenefitCadence =
  | 'monthly'
  | 'quarterly'
  | 'semiannual'
  | 'annual'
  | 'multi-year'
  | 'ongoing';

export type BenefitCategory =
  | 'Transportation'
  | 'Entertainment'
  | 'Dining'
  | 'Travel'
  | 'Shopping'
  | 'Wellness'
  | 'Hotel Status'
  | 'Earning'
  | 'Insurance';

export type Benefit = {
  id: string;
  card: CardKey;
  name: string;
  value: number | null;
  cadence: BenefitCadence;
  resetDay: number | null;
  resetMonths?: number[];
  category: BenefitCategory;
  description: string;
  action: string;
  caveats: string;
  enrollmentRequired: boolean;
  portalLink: string | null;
  sourceUrl: string;
  sourceLabel: string;
};

export type SetupPriority = 'high' | 'medium' | 'low';

export type SetupTask = {
  id: string;
  card: CardKey;
  title: string;
  description: string;
  link: string | null;
  priority: SetupPriority;
};

export type EvidenceLevel = 'official' | 'editor-tested' | 'community' | 'dead';

export type Tip = {
  id: string;
  card: CardKey | 'both';
  title: string;
  description: string;
  evidence: EvidenceLevel;
  sourceUrl: string;
  sourceLabel: string;
};

export type SourceType = 'official' | 'third-party' | 'community';

export type Source = {
  id: string;
  title: string;
  url: string;
  type: SourceType;
  description: string;
};

export type TravelToolCategory =
  | 'Hotels'
  | 'Booking'
  | 'Points'
  | 'Dining'
  | 'Transportation'
  | 'Airport'
  | 'Shopping';

export type TravelTool = {
  name: string;
  url: string;
  description: string;
  category: TravelToolCategory;
};

export type EvidenceLevelMeta = {
  label: string;
  color: string;
  bg: string;
  description: string;
};

export type BestCardRecommendation = CardKey | 'varies';

export type BestCardDecision = {
  id: string;
  category: string;
  icon: string;
  recommended: BestCardRecommendation;
  why: string;
  earn: string;
  exceptions: string;
  rakutenNote: string;
};

export type RakutenPaymentDate = {
  date: string;
  quarter: string;
};

export type RakutenConfirmationWindow = {
  type: string;
  window: string;
};

export type RakutenRules = {
  conversion: string;
  minimumTransfer: string;
  carryOver: string;
  firstTransfer: string;
  linkRequirement: string;
  paymentDates: RakutenPaymentDate[];
  confirmationWindows: RakutenConfirmationWindow[];
  stackingNotes: string[];
};

export type PortfolioCardState = {
  active: boolean;
  annualFeePaid: number;
  pointsBalance: number;
  cppValuation: number;
  notes: string;
};

export type DefaultPortfolio = Record<CardKey, PortfolioCardState>;

export type DefaultRakuten = {
  linked: boolean;
  pendingCashback: number;
  confirmedPoints: number;
  lifetimeMRTransferred: number;
  lastTransferDate: string | null;
  notes: string;
};

export type ActionPriority = 'high' | 'medium' | 'low';

export type ActionItem = {
  priority: ActionPriority;
  card: CardKey | 'both';
  title: string;
  desc: string;
};

export type OnboardingStep = {
  id: string;
  title: string;
  desc: string;
  priority: SetupPriority;
};
