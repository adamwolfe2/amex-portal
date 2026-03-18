import type { OnboardingStep } from './types';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: 'ob-airline', title: 'Select your preferred airline', desc: 'Go to Benefits → select airline for $200 fee credit. Do this first.', priority: 'high' },
  { id: 'ob-uber', title: 'Link card to Uber', desc: 'Add Platinum to Uber app wallet. $15/month Uber Cash + Uber One starts immediately.', priority: 'high' },
  { id: 'ob-digital', title: 'Enroll in Digital Entertainment', desc: 'Activate $25/month credit for Disney+, Hulu, NYT, Peacock, etc.', priority: 'high' },
  { id: 'ob-resy', title: 'Enroll in Resy credit', desc: 'Activate $100/quarter Resy dining credit before eating out.', priority: 'high' },
  { id: 'ob-priority-pass', title: 'Enroll in Priority Pass', desc: 'Register for lounge access — takes a few days for card to arrive.', priority: 'high' },
  { id: 'ob-hilton', title: 'Link Hilton Honors', desc: 'Activate complimentary Gold status for upgrades and perks.', priority: 'high' },
  { id: 'ob-marriott', title: 'Link Marriott Bonvoy', desc: 'Activate complimentary Gold Elite status.', priority: 'high' },
  { id: 'ob-lululemon', title: 'Enroll in lululemon credit', desc: '$75/quarter at lululemon after enrollment.', priority: 'medium' },
  { id: 'ob-saks', title: 'Enroll in Saks credit', desc: '$50 semiannual at Saks Fifth Avenue.', priority: 'medium' },
  { id: 'ob-walmart', title: 'Set up Walmart+ monthly', desc: 'Subscribe to monthly (not annual) plan for $12.95/mo credit.', priority: 'medium' },
  { id: 'ob-clear', title: 'Enroll in CLEAR+', desc: '$209/year credit for CLEAR+ biometric security.', priority: 'medium' },
  { id: 'ob-global-entry', title: 'Apply for Global Entry', desc: '$120 credit every 4 years. Apply and pay with Platinum.', priority: 'medium' },
  { id: 'ob-cell', title: 'Pay phone bill with Platinum', desc: 'Activates up to $800/claim cell phone protection.', priority: 'medium' },
  { id: 'ob-rakuten', title: 'Link Rakuten to MR', desc: 'Set Rakuten to earn MR points instead of cash back. Link your MR-eligible account.', priority: 'medium' },
  { id: 'ob-car-rental', title: 'Enroll in car rental programs', desc: 'Hertz, Avis, National — premium status and upgrades.', priority: 'low' },
];
