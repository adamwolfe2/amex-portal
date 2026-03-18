import type { RakutenRules, DefaultPortfolio, DefaultRakuten } from './types';

export const RAKUTEN_INFO: RakutenRules = {
  conversion: '$1 Cash Back = 100 Membership Rewards points',
  minimumTransfer: 'At least 501 confirmed points are needed before a payment date for transfer to MR.',
  carryOver: 'Balances of 500 or fewer confirmed points carry over to the next quarter.',
  firstTransfer: 'Points can transfer as soon as 15 days after your first qualifying purchase.',
  linkRequirement: 'You must link a Membership Rewards-eligible Amex account in Rakuten settings to earn MR instead of cash back.',
  paymentDates: [
    { date: 'February 15', quarter: 'Q4 (Oct-Dec earnings)' },
    { date: 'May 15', quarter: 'Q1 (Jan-Mar earnings)' },
    { date: 'August 15', quarter: 'Q2 (Apr-Jun earnings)' },
    { date: 'November 15', quarter: 'Q3 (Jul-Sep earnings)' },
  ],
  confirmationWindows: [
    { type: 'Online / In-Store', window: '3-14 weeks (20-100 days)' },
    { type: 'Dining', window: '3-5 days' },
    { type: 'Travel', window: '45-120 days' },
  ],
  stackingNotes: [
    'Rakuten MR is earned on top of your card\'s own MR earn rate. They are separate earning streams.',
    'Community reports suggest Rakuten MR transfers even if the paying card is not the MR-linked card, but this is not officially confirmed by Amex.',
    'Statement credits (like Platinum lululemon $75/quarter) can potentially stack with Rakuten portal earnings. Community-reported / YMMV.',
    'Rakuten In-Store cashback can also earn MR if your account is set to MR mode. Link a card in the Rakuten app for in-store offers.',
  ],
};

export const DEFAULT_PORTFOLIO: DefaultPortfolio = {
  platinum: {
    active: true,
    annualFeePaid: 895,
    pointsBalance: 0,
    cppValuation: 2.0,
    notes: '',
  },
  gold: {
    active: true,
    annualFeePaid: 325,
    pointsBalance: 0,
    cppValuation: 2.0,
    notes: '',
  },
};

export const DEFAULT_RAKUTEN: DefaultRakuten = {
  linked: false,
  pendingCashback: 0,
  confirmedPoints: 0,
  lifetimeMRTransferred: 0,
  lastTransferDate: null,
  notes: '',
};
