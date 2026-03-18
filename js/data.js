// ============================================================
// Amex OS — Manual-Control Rewards Operating System
// Structured Data for Platinum & Gold + Rakuten + Best-Card
// ============================================================

const CARDS = {
  platinum: { name: 'Platinum Card', short: 'Platinum', color: '#1a1a2e', annualFee: 895 },
  gold: { name: 'Gold Card', short: 'Gold', color: '#8B6914', annualFee: 325 }
};

// Benefits Database
const BENEFITS = [
  // ── PLATINUM BENEFITS ──
  {
    id: 'plat-uber-cash',
    card: 'platinum',
    name: 'Uber Cash',
    value: 200,
    cadence: 'monthly',
    resetDay: 1,
    category: 'Transportation',
    description: '$15/month in Uber Cash, plus $20 bonus in December.',
    action: 'Add Platinum to your Uber account and keep it available for eligible U.S. rides or Uber Eats orders.',
    caveats: 'Uber Cash does not roll over. December includes an extra $20 for a total of $35 that month.',
    enrollmentRequired: false,
    portalLink: 'https://www.uber.com',
    sourceUrl: 'https://www.americanexpress.com/en-us/account/get-started/platinum/benefits-overview',
    sourceLabel: 'Amex Platinum Benefits Overview'
  },
  {
    id: 'plat-uber-one',
    card: 'platinum',
    name: 'Uber One Membership',
    value: 120,
    cadence: 'annual',
    resetDay: null,
    category: 'Transportation',
    description: 'Complimentary Uber One membership worth up to $120/year.',
    action: 'Activate Uber One in your Uber account with Platinum linked for the eligible auto-renewing membership.',
    caveats: 'Terms apply. Keep the eligible Platinum Card linked in Uber for the benefit.',
    enrollmentRequired: false,
    portalLink: 'https://www.uber.com',
    sourceUrl: 'https://www.americanexpress.com/en-us/account/get-started/platinum/benefits-overview',
    sourceLabel: 'Amex Platinum Benefits Overview'
  },
  {
    id: 'plat-digital-entertainment',
    card: 'platinum',
    name: 'Digital Entertainment Credit',
    value: 300,
    cadence: 'monthly',
    resetDay: 1,
    category: 'Entertainment',
    description: 'Up to $25/month on eligible subscriptions like Disney+, the Disney Bundle, ESPN streaming services, Hulu, The New York Times, Paramount+, Peacock, The Wall Street Journal, YouTube Premium, and YouTube TV.',
    action: 'Enroll first, then use Platinum to pay eligible subscriptions billed directly by participating providers.',
    caveats: 'Enrollment required. Only participating providers qualify, and the eligible list can change.',
    enrollmentRequired: true,
    portalLink: 'https://www.americanexpress.com/en-us/account/get-started/platinum/benefits-overview',
    sourceUrl: 'https://www.americanexpress.com/en-us/account/get-started/platinum/benefits-overview',
    sourceLabel: 'Amex Platinum Benefits Overview'
  },
  {
    id: 'plat-resy',
    card: 'platinum',
    name: 'Resy Dining Credit',
    value: 400,
    cadence: 'quarterly',
    resetDay: null,
    resetMonths: [1, 4, 7, 10],
    category: 'Dining',
    description: 'Up to $100/quarter in statement credits at U.S. Resy restaurants or on other eligible Resy purchases after enrollment.',
    action: 'Enroll first, then use Platinum at eligible U.S. Resy restaurants or for other eligible Resy purchases.',
    caveats: 'Quarterly credit does not roll over. Eligible U.S. Resy restaurants and eligible Resy purchases only.',
    enrollmentRequired: true,
    portalLink: 'https://resy.com',
    sourceUrl: 'https://www.americanexpress.com/en-us/account/get-started/platinum/benefits-overview',
    sourceLabel: 'Amex Platinum Benefits Overview'
  },
  {
    id: 'plat-hotel-credit',
    card: 'platinum',
    name: 'Hotel Credit (FHR / THC)',
    value: 300,
    cadence: 'semiannual',
    resetDay: null,
    resetMonths: [1, 7],
    category: 'Travel',
    description: 'Up to $300 semiannually ($600/year) on prepaid FHR or THC bookings through Amex Travel.',
    action: 'Book a prepaid Fine Hotels + Resorts or The Hotel Collection stay through Amex Travel.',
    caveats: 'Must be prepaid through Amex Travel. THC requires 2-night minimum. Back-to-back stays at same property count as one stay. Resets Jan 1 and Jul 1.',
    enrollmentRequired: false,
    portalLink: 'https://www.americanexpress.com/en-us/travel/fine-hotels-and-resorts',
    sourceUrl: 'https://www.americanexpress.com/en-us/travel/cardmember-travel-benefits/',
    sourceLabel: 'Amex Travel Benefits'
  },
  {
    id: 'plat-airline-fee',
    card: 'platinum',
    name: 'Airline Fee Credit',
    value: 200,
    cadence: 'annual',
    resetDay: null,
    resetMonths: [1],
    category: 'Travel',
    description: 'Up to $200/year in incidental airline fees (baggage, seat selection, lounge passes, etc.) on your selected airline.',
    action: 'Select one airline in your Amex account (ideally by Jan 31). Make qualifying incidental purchases on that airline.',
    caveats: 'Only incidental fees are officially covered, not airfare. Select your airline before making purchases. Community workaround methods can change or stop working at any time.',
    enrollmentRequired: true,
    portalLink: 'https://www.americanexpress.com/en-us/account/get-started/platinum/benefits-overview',
    sourceUrl: 'https://www.americanexpress.com/en-us/account/get-started/platinum/benefits-overview',
    sourceLabel: 'Amex Platinum Benefits Overview'
  },
  {
    id: 'plat-clear',
    card: 'platinum',
    name: 'CLEAR+ Membership',
    value: 209,
    cadence: 'annual',
    resetDay: null,
    category: 'Travel',
    description: 'Up to $209/year statement credit for CLEAR+ membership.',
    action: 'Enroll in CLEAR+ and pay with Platinum card.',
    caveats: 'Covers CLEAR+ specifically. Statement credit posts after charge.',
    enrollmentRequired: true,
    portalLink: 'https://www.clearme.com',
    sourceUrl: 'https://www.americanexpress.com/en-us/account/get-started/platinum/benefits-overview',
    sourceLabel: 'Amex Platinum Benefits Overview'
  },
  {
    id: 'plat-walmart',
    card: 'platinum',
    name: 'Walmart+ Membership',
    value: 155,
    cadence: 'monthly',
    resetDay: 1,
    category: 'Shopping',
    description: 'Monthly statement credit for Walmart+ monthly plan (up to $12.95 + tax/month).',
    action: 'Enroll in Walmart+ monthly plan and pay with Platinum card.',
    caveats: 'Must use monthly plan, not annual. Credit covers up to $12.95 + applicable tax.',
    enrollmentRequired: true,
    portalLink: 'https://www.walmart.com/plus',
    sourceUrl: 'https://www.americanexpress.com/en-us/credit-cards/credit-intel/american-express-platinum-shopping-benefits/',
    sourceLabel: 'Amex Platinum Shopping Benefits'
  },
  {
    id: 'plat-saks',
    card: 'platinum',
    name: 'Saks Fifth Avenue Credit',
    value: 100,
    cadence: 'semiannual',
    resetDay: null,
    resetMonths: [1, 7],
    category: 'Shopping',
    description: 'Up to $50 Jan–Jun and $50 Jul–Dec at Saks Fifth Avenue.',
    action: 'Enroll in Amex Offers & Benefits. Shop at Saks Fifth Avenue (in-store or online) with Platinum.',
    caveats: 'Must enroll. $50 per half, does not roll over. Saks OFF 5TH does not qualify.',
    enrollmentRequired: true,
    portalLink: 'https://www.saksfifthavenue.com',
    sourceUrl: 'https://www.americanexpress.com/en-us/account/get-started/platinum/benefits-overview',
    sourceLabel: 'Amex Platinum Benefits Overview'
  },
  {
    id: 'plat-lululemon',
    card: 'platinum',
    name: 'lululemon Credit',
    value: 300,
    cadence: 'quarterly',
    resetDay: null,
    resetMonths: [1, 4, 7, 10],
    category: 'Shopping',
    description: 'Up to $75/quarter at lululemon after enrollment.',
    action: 'Enroll in Amex Offers & Benefits. Shop at lululemon with Platinum card.',
    caveats: 'Must enroll. Quarterly credit does not roll over.',
    enrollmentRequired: true,
    portalLink: 'https://www.lululemon.com',
    sourceUrl: 'https://www.americanexpress.com/en-us/credit-cards/credit-intel/american-express-platinum-shopping-benefits/',
    sourceLabel: 'Amex Platinum Shopping Benefits'
  },
  {
    id: 'plat-global-entry',
    card: 'platinum',
    name: 'Global Entry / TSA PreCheck Credit',
    value: 120,
    cadence: 'multi-year',
    resetDay: null,
    category: 'Travel',
    description: 'Up to $120 for Global Entry or $85 for TSA PreCheck. One credit every 4 years (GE) or 4.5 years (PreCheck).',
    action: 'Apply for Global Entry or TSA PreCheck. Pay application fee with Platinum card.',
    caveats: 'Only one program per cycle. Additional card members on eligible Platinum accounts also qualify. Can take up to 8 weeks to post.',
    enrollmentRequired: false,
    portalLink: 'https://www.americanexpress.com/en-us/benefits/travel/expedite-your-travel/',
    sourceUrl: 'https://www.americanexpress.com/en-us/benefits/travel/expedite-your-travel/',
    sourceLabel: 'Amex Global Entry / PreCheck'
  },
  {
    id: 'plat-lounge',
    card: 'platinum',
    name: 'Global Lounge Collection',
    value: null,
    cadence: 'ongoing',
    resetDay: null,
    category: 'Travel',
    description: 'Access to 1,550+ lounges worldwide including Centurion Lounges, Delta Sky Clubs (with restrictions), Priority Pass, Plaza Premium, Escape Lounges, and more.',
    action: 'Enroll in Priority Pass through your Amex benefits portal. Centurion access is automatic with Platinum.',
    caveats: 'Priority Pass enrollment required separately. Delta Sky Club: 10 visits/year, $50 per additional visit, unlimited after $75K annual spend; Basic Economy excluded. Centurion guest policy tied to $75K spend.',
    enrollmentRequired: true,
    portalLink: 'https://www.americanexpress.com/en-us/travel/lounges',
    sourceUrl: 'https://global.americanexpress.com/card-benefits/terms/platinum',
    sourceLabel: 'Amex Platinum Terms'
  },
  {
    id: 'plat-hilton-gold',
    card: 'platinum',
    name: 'Hilton Honors Gold Status',
    value: null,
    cadence: 'ongoing',
    resetDay: null,
    category: 'Hotel Status',
    description: 'Complimentary Hilton Honors Gold status. Includes room upgrades, 5th night free on reward stays, 80% bonus points.',
    action: 'Enroll through Amex Benefits portal to link Hilton Honors account.',
    caveats: 'Must enroll. Additional Platinum card members also eligible.',
    enrollmentRequired: true,
    portalLink: 'https://global.americanexpress.com/card-benefits/view-all/platinum',
    sourceUrl: 'https://global.americanexpress.com/card-benefits/terms/platinum',
    sourceLabel: 'Amex Platinum Terms'
  },
  {
    id: 'plat-marriott-gold',
    card: 'platinum',
    name: 'Marriott Bonvoy Gold Elite Status',
    value: null,
    cadence: 'ongoing',
    resetDay: null,
    category: 'Hotel Status',
    description: 'Complimentary Marriott Bonvoy Gold Elite status. Includes 25% bonus points and enhanced room at check-in.',
    action: 'Enroll through Amex Benefits portal to link Marriott Bonvoy account.',
    caveats: 'Must enroll. Additional Platinum card members also eligible.',
    enrollmentRequired: true,
    portalLink: 'https://global.americanexpress.com/card-benefits/view-all/platinum',
    sourceUrl: 'https://global.americanexpress.com/card-benefits/terms/platinum',
    sourceLabel: 'Amex Platinum Terms'
  },
  {
    id: 'plat-car-rental',
    card: 'platinum',
    name: 'Car Rental Privileges',
    value: null,
    cadence: 'ongoing',
    resetDay: null,
    category: 'Travel',
    description: 'Premium car rental status with Hertz, Avis, and National. Includes upgrades, skip-the-counter, and special rates.',
    action: 'Enroll in each program through Amex Benefits. Must pay with Platinum at rental.',
    caveats: 'Requires enrollment per program. Must pay with Platinum. Companion/Additional Gold not eligible for some privileges.',
    enrollmentRequired: true,
    portalLink: 'https://global.americanexpress.com/card-benefits/view-all/platinum',
    sourceUrl: 'https://global.americanexpress.com/card-benefits/terms/platinum',
    sourceLabel: 'Amex Platinum Terms'
  },
  {
    id: 'plat-fhr',
    card: 'platinum',
    name: 'Fine Hotels + Resorts Program',
    value: null,
    cadence: 'ongoing',
    resetDay: null,
    category: 'Travel',
    description: 'Access to FHR properties with perks: noon check-in, room upgrade, breakfast for two, $100 property credit, Wi-Fi, guaranteed 4pm checkout.',
    action: 'Book through Amex Travel FHR portal.',
    caveats: 'Back-to-back stays within 24 hours at same property count as one stay. Must book through Amex Travel.',
    enrollmentRequired: false,
    portalLink: 'https://www.americanexpress.com/en-us/travel/fine-hotels-and-resorts',
    sourceUrl: 'https://www.americanexpress.com/en-us/travel/fine-hotels-and-resorts',
    sourceLabel: 'Amex FHR'
  },
  {
    id: 'plat-5x-flights',
    card: 'platinum',
    name: '5X Points on Flights',
    value: null,
    cadence: 'ongoing',
    resetDay: null,
    category: 'Earning',
    description: '5X Membership Rewards on flights booked directly with airlines or through Amex Travel, up to $500,000/calendar year.',
    action: 'Book flights with Platinum card directly with airlines or through Amex Travel.',
    caveats: 'Cap of $500,000 in eligible purchases per calendar year.',
    enrollmentRequired: false,
    portalLink: 'https://www.americanexpress.com/en-us/travel/',
    sourceUrl: 'https://www.americanexpress.com/en-us/travel/cardmember-travel-benefits/',
    sourceLabel: 'Amex Travel Benefits'
  },
  {
    id: 'plat-5x-hotels',
    card: 'platinum',
    name: '5X Points on Prepaid Hotels',
    value: null,
    cadence: 'ongoing',
    resetDay: null,
    category: 'Earning',
    description: '5X Membership Rewards on prepaid hotels booked through Amex Travel.',
    action: 'Book prepaid hotel stays through Amex Travel with Platinum card.',
    caveats: 'Must be prepaid bookings through Amex Travel.',
    enrollmentRequired: false,
    portalLink: 'https://www.americanexpress.com/en-us/travel/',
    sourceUrl: 'https://www.americanexpress.com/en-us/travel/cardmember-travel-benefits/',
    sourceLabel: 'Amex Travel Benefits'
  },
  {
    id: 'plat-cell-phone',
    card: 'platinum',
    name: 'Cell Phone Protection',
    value: null,
    cadence: 'ongoing',
    resetDay: null,
    category: 'Insurance',
    description: 'Coverage can reimburse repair or replacement costs for a damaged or stolen eligible cell phone up to $800 per claim when the prior month’s wireless bill was paid with Platinum.',
    action: 'Pay your monthly wireless bill with Platinum and keep the covered phone line on that bill.',
    caveats: '$50 deductible per approved claim, maximum of 2 approved claims per 12-month period, and coverage is excess over other applicable insurance.',
    enrollmentRequired: false,
    portalLink: 'https://www.americanexpress.com/us/credit-cards/features-benefits/policies/cell-phone-protection.html',
    sourceUrl: 'https://global.americanexpress.com/card-benefits/detail/cell-phone-protection/platinum',
    sourceLabel: 'Amex Platinum Cell Phone Protection'
  },
  {
    id: 'plat-equinox',
    card: 'platinum',
    name: 'Equinox Credit',
    value: 300,
    cadence: 'annual',
    resetDay: null,
    category: 'Wellness',
    description: 'Up to $300/year in statement credits for Equinox memberships.',
    action: 'Enroll in Amex Offers & Benefits. Pay Equinox membership with Platinum.',
    caveats: 'Must enroll. Only covers eligible Equinox membership charges.',
    enrollmentRequired: true,
    portalLink: 'https://www.equinox.com',
    sourceUrl: 'https://www.americanexpress.com/en-us/credit-cards/credit-intel/american-express-platinum-shopping-benefits/',
    sourceLabel: 'Amex Platinum Shopping Benefits'
  },
  {
    id: 'plat-oura',
    card: 'platinum',
    name: 'Oura Ring Credit',
    value: 200,
    cadence: 'annual',
    resetDay: null,
    category: 'Wellness',
    description: 'Up to $200/year at Ouraring.com after enrollment.',
    action: 'Enroll in Amex Offers & Benefits. Purchase at Ouraring.com with Platinum.',
    caveats: 'Must enroll. Only purchases at Ouraring.com qualify.',
    enrollmentRequired: true,
    portalLink: 'https://ouraring.com',
    sourceUrl: 'https://www.americanexpress.com/en-us/credit-cards/credit-intel/american-express-platinum-shopping-benefits/',
    sourceLabel: 'Amex Platinum Shopping Benefits'
  },

  // ── GOLD BENEFITS ──
  {
    id: 'gold-uber-cash',
    card: 'gold',
    name: 'Uber Cash',
    value: 120,
    cadence: 'monthly',
    resetDay: 1,
    category: 'Transportation',
    description: '$10/month in Uber Cash for Uber Eats or Uber rides.',
    action: 'Add Gold to your Uber account for eligible U.S. rides or Uber Eats orders.',
    caveats: 'Uber Cash does not roll over. Add the card to Uber before using the monthly benefit.',
    enrollmentRequired: false,
    portalLink: 'https://www.uber.com',
    sourceUrl: 'https://www.americanexpress.com/en-us/account/get-started/gold/explore-benefits',
    sourceLabel: 'Amex Gold Benefits Guide'
  },
  {
    id: 'gold-resy',
    card: 'gold',
    name: 'Resy Dining Credit',
    value: 100,
    cadence: 'semiannual',
    resetDay: null,
    resetMonths: [1, 7],
    category: 'Dining',
    description: 'Up to $50 Jan–Jun and $50 Jul–Dec in statement credits at U.S. Resy restaurants or on other eligible Resy purchases after enrollment.',
    action: 'Enroll first, then use Gold at eligible U.S. Resy restaurants or for other eligible Resy purchases.',
    caveats: 'Enrollment required. Each semiannual credit window is use-it-or-lose-it.',
    enrollmentRequired: true,
    portalLink: 'https://resy.com',
    sourceUrl: 'https://www.americanexpress.com/en-us/account/get-started/gold/explore-benefits',
    sourceLabel: 'Amex Gold Benefits Guide'
  },
  {
    id: 'gold-dining-credit',
    card: 'gold',
    name: 'Dining Credit',
    value: 120,
    cadence: 'monthly',
    resetDay: 1,
    category: 'Dining',
    description: '$10/month at select restaurants: Grubhub, The Cheesecake Factory, Goldbelly, Wine.com, Five Guys, and others.',
    action: 'Enroll in Amex Offers & Benefits. Dine or order from eligible merchants with Gold card.',
    caveats: 'Must enroll. Only specific merchants qualify. Monthly credit resets on the 1st, does not roll over.',
    enrollmentRequired: true,
    portalLink: 'https://www.americanexpress.com/en-us/credit-cards/credit-intel/amex-gold-dining/',
    sourceUrl: 'https://www.americanexpress.com/en-us/credit-cards/credit-intel/amex-gold-dining/',
    sourceLabel: 'Amex Gold Dining Guide'
  },
  {
    id: 'gold-dunkin',
    card: 'gold',
    name: "Dunkin' Credit",
    value: 84,
    cadence: 'monthly',
    resetDay: 1,
    category: 'Dining',
    description: "Up to $7/month at Dunkin' after enrollment.",
    action: "Enroll in Amex Offers & Benefits. Pay at Dunkin' with Gold card.",
    caveats: 'Must enroll. Monthly credit does not roll over.',
    enrollmentRequired: true,
    portalLink: 'https://www.dunkindonuts.com',
    sourceUrl: 'https://www.americanexpress.com/en-us/account/get-started/gold/explore-benefits',
    sourceLabel: 'Amex Gold Benefits Guide'
  },
  {
    id: 'gold-hotel-collection',
    card: 'gold',
    name: 'The Hotel Collection Credit',
    value: 100,
    cadence: 'annual',
    resetDay: null,
    category: 'Travel',
    description: '$100 property credit on prepaid 2+ night stays at The Hotel Collection properties through Amex Travel.',
    action: 'Book a 2+ night prepaid stay at a THC property through Amex Travel with Gold card.',
    caveats: 'Requires 2-night minimum. Must book through Amex Travel.',
    enrollmentRequired: false,
    portalLink: 'https://www.americanexpress.com/en-us/travel/the-hotel-collection',
    sourceUrl: 'https://www.americanexpress.com/en-us/account/get-started/gold/explore-benefits',
    sourceLabel: 'Amex Gold Benefits Guide'
  },
  {
    id: 'gold-4x-dining',
    card: 'gold',
    name: '4X Points at Restaurants',
    value: null,
    cadence: 'ongoing',
    resetDay: null,
    category: 'Earning',
    description: '4X Membership Rewards at restaurants worldwide, up to $50,000/year.',
    action: 'Use Gold card at restaurants.',
    caveats: 'Depends on merchant coding. Restaurants inside hotels, casinos, food courts may not code correctly. Fast food does count. $50,000 annual cap.',
    enrollmentRequired: false,
    portalLink: null,
    sourceUrl: 'https://www.americanexpress.com/en-us/credit-cards/credit-intel/amex-gold-dining/',
    sourceLabel: 'Amex Gold Dining Guide'
  },
  {
    id: 'gold-4x-grocery',
    card: 'gold',
    name: '4X Points at U.S. Supermarkets',
    value: null,
    cadence: 'ongoing',
    resetDay: null,
    category: 'Earning',
    description: '4X Membership Rewards at U.S. supermarkets, up to $25,000/year.',
    action: 'Use Gold card at U.S. supermarkets.',
    caveats: 'Excludes Target, Walmart, warehouse clubs, convenience stores, meal kits, specialty stores. $25,000 annual cap, then 1X.',
    enrollmentRequired: false,
    portalLink: null,
    sourceUrl: 'https://www.americanexpress.com/us/rewards-info/retail.html',
    sourceLabel: 'Amex Rewards Category Rules'
  },
  {
    id: 'gold-travel-protections',
    card: 'gold',
    name: 'Travel Protections',
    value: null,
    cadence: 'ongoing',
    resetDay: null,
    category: 'Insurance',
    description: 'Baggage insurance, car rental loss/damage insurance, trip delay insurance, and Global Assist Hotline.',
    action: 'Book and pay for travel with Gold card to activate protections.',
    caveats: 'Specific terms and exclusions apply. See card benefits terms for details.',
    enrollmentRequired: false,
    portalLink: null,
    sourceUrl: 'https://www.americanexpress.com/en-us/account/get-started/gold/explore-benefits',
    sourceLabel: 'Amex Gold Benefits Guide'
  }
];

// Setup Checklist Tasks
const SETUP_TASKS = [
  // Platinum
  { id: 'setup-plat-airline', card: 'platinum', title: 'Select preferred airline for $200 fee credit', description: 'Choose your airline in your Platinum benefits flow. Do this by January 31 for the cleanest setup.', link: 'https://www.americanexpress.com/en-us/account/get-started/platinum/benefits-overview', priority: 'high' },
  { id: 'setup-plat-uber', card: 'platinum', title: 'Link Platinum to Uber account', description: 'Add your Platinum card to your Uber wallet to activate $15/month Uber Cash + Uber One.', link: 'https://www.uber.com', priority: 'high' },
  { id: 'setup-plat-priority-pass', card: 'platinum', title: 'Enroll in Priority Pass', description: 'Register for Priority Pass Select through your Platinum benefits hub. Required for many non-Centurion lounges.', link: 'https://global.americanexpress.com/card-benefits/view-all/platinum', priority: 'high' },
  { id: 'setup-plat-hilton', card: 'platinum', title: 'Enroll in Hilton Honors Gold', description: 'Link your Hilton Honors account through the Platinum benefits hub to activate complimentary Gold status.', link: 'https://global.americanexpress.com/card-benefits/view-all/platinum', priority: 'high' },
  { id: 'setup-plat-marriott', card: 'platinum', title: 'Enroll in Marriott Bonvoy Gold', description: 'Link your Marriott Bonvoy account through the Platinum benefits hub for complimentary Gold Elite status.', link: 'https://global.americanexpress.com/card-benefits/view-all/platinum', priority: 'high' },
  { id: 'setup-plat-car-rental', card: 'platinum', title: 'Enroll in car rental programs', description: 'Register for Hertz, Avis, and National privileges through the Platinum benefits hub.', link: 'https://global.americanexpress.com/card-benefits/view-all/platinum', priority: 'medium' },
  { id: 'setup-plat-clear', card: 'platinum', title: 'Enroll in CLEAR+', description: 'Sign up or link existing CLEAR+ membership. Pay with Platinum for up to $209 annual credit.', link: 'https://www.clearme.com', priority: 'medium' },
  { id: 'setup-plat-global-entry', card: 'platinum', title: 'Apply for Global Entry / TSA PreCheck', description: 'Apply and pay with Platinum. $120 for GE or $85 for PreCheck, every 4–4.5 years.', link: 'https://www.americanexpress.com/en-us/benefits/travel/expedite-your-travel/', priority: 'medium' },
  { id: 'setup-plat-digital', card: 'platinum', title: 'Enroll in Digital Entertainment credit', description: 'Activate the $25/month digital entertainment credit in your Platinum benefits flow.', link: 'https://www.americanexpress.com/en-us/account/get-started/platinum/benefits-overview', priority: 'high' },
  { id: 'setup-plat-resy', card: 'platinum', title: 'Enroll in Resy credit', description: 'Activate the $100/quarter Resy credit before using Platinum at eligible U.S. Resy restaurants.', link: 'https://www.americanexpress.com/en-us/account/get-started/platinum/benefits-overview', priority: 'high' },
  { id: 'setup-plat-saks', card: 'platinum', title: 'Enroll in Saks credit', description: 'Activate the $50 semiannual Saks credit in your Platinum shopping benefits flow.', link: 'https://www.americanexpress.com/en-us/credit-cards/credit-intel/american-express-platinum-shopping-benefits/', priority: 'medium' },
  { id: 'setup-plat-walmart', card: 'platinum', title: 'Set up Walmart+ monthly plan', description: 'Subscribe to Walmart+ monthly plan (not annual). Pay with Platinum for monthly credit.', link: 'https://www.walmart.com/plus', priority: 'medium' },
  { id: 'setup-plat-lululemon', card: 'platinum', title: 'Enroll in lululemon credit', description: 'Activate the $75/quarter lululemon credit in your Platinum shopping benefits flow.', link: 'https://www.americanexpress.com/en-us/credit-cards/credit-intel/american-express-platinum-shopping-benefits/', priority: 'medium' },
  { id: 'setup-plat-equinox', card: 'platinum', title: 'Enroll in Equinox credit (if applicable)', description: 'If you have an Equinox membership, enroll for up to $300/year in credits.', link: 'https://www.equinox.com', priority: 'low' },
  { id: 'setup-plat-oura', card: 'platinum', title: 'Enroll in Oura Ring credit (if applicable)', description: 'If you use an Oura Ring, enroll for up to $200/year at Ouraring.com.', link: 'https://ouraring.com', priority: 'low' },
  { id: 'setup-plat-cell', card: 'platinum', title: 'Pay cell phone bill with Platinum', description: 'Switch your cell phone bill payment to Platinum for up to $800/claim protection.', link: null, priority: 'medium' },

  // Gold
  { id: 'setup-gold-uber', card: 'gold', title: 'Link Gold to Uber account', description: 'Add Gold card to Uber to activate $10/month Uber Cash.', link: 'https://www.uber.com', priority: 'high' },
  { id: 'setup-gold-dining', card: 'gold', title: 'Enroll in Dining credit', description: 'Activate the $10/month dining credit for eligible merchants like Grubhub, The Cheesecake Factory, Goldbelly, Wine.com, and Five Guys.', link: 'https://www.americanexpress.com/en-us/credit-cards/credit-intel/amex-gold-dining/', priority: 'high' },
  { id: 'setup-gold-resy', card: 'gold', title: 'Enroll in Resy credit', description: 'Activate the $50 semiannual Resy credit before using Gold at eligible U.S. Resy restaurants.', link: 'https://www.americanexpress.com/en-us/account/get-started/gold/explore-benefits', priority: 'high' },
  { id: 'setup-gold-dunkin', card: 'gold', title: "Enroll in Dunkin' credit", description: "Activate the $7/month Dunkin' credit before paying with Gold at eligible U.S. Dunkin' locations.", link: 'https://www.americanexpress.com/en-us/account/get-started/gold/explore-benefits', priority: 'medium' }
];

// Tips & Data Points
const TIPS = [
  {
    id: 'tip-airline-seat',
    card: 'platinum',
    title: 'Airline credit triggers on seat upgrades and checked bags',
    description: 'Purchasing seat selections, checked bags, and in-flight purchases on your selected airline reliably triggers the $200 airline fee credit.',
    evidence: 'official',
    sourceUrl: 'https://www.americanexpress.com/en-us/account/get-started/platinum/benefits-overview',
    sourceLabel: 'Amex Platinum Benefits'
  },
  {
    id: 'tip-airline-award-taxes',
    card: 'platinum',
    title: 'Award ticket taxes and fees may count toward airline credit',
    description: 'When booking award flights on your selected airline, the taxes and fees charged to your Platinum card may trigger the airline fee credit, but this remains a workaround rather than an official use case.',
    evidence: 'editor-tested',
    sourceUrl: 'https://thriftytraveler.com/guides/credit-card/amex-platinum-travel-credit/',
    sourceLabel: 'Thrifty Traveler'
  },
  {
    id: 'tip-travelbank-dead',
    card: 'platinum',
    title: 'United TravelBank appears dead or unreliable in 2026',
    description: 'Recent community reports suggest United TravelBank is no longer reliably triggering the airline fee credit, so treat it as dead or highly unreliable rather than a core strategy.',
    evidence: 'dead',
    sourceUrl: 'https://www.reddit.com/r/AmexPlatinum/comments/1riynlx/united_travelbank_officially_on_the_excluded_list/',
    sourceLabel: 'Reddit r/AmexPlatinum'
  },
  {
    id: 'tip-southwest-small',
    card: 'platinum',
    title: 'Small Southwest fares may trigger credit (YMMV)',
    description: 'Some users report that Southwest tickets under $100 on the selected airline trigger the credit, but this is inconsistent and not officially supported.',
    evidence: 'community',
    sourceUrl: 'https://thriftytraveler.com/guides/credit-card/amex-platinum-travel-credit/',
    sourceLabel: 'Thrifty Traveler'
  },
  {
    id: 'tip-delta-ecredit',
    card: 'platinum',
    title: 'Delta eCredit purchases may trigger credit (YMMV)',
    description: 'Some reports of Delta eCredit purchases triggering the airline fee credit, but behavior is inconsistent.',
    evidence: 'community',
    sourceUrl: 'https://thepointsguy.com/credit-cards/choosing-your-amex-platinum-200-airline-fee-credit/',
    sourceLabel: 'The Points Guy'
  },
  {
    id: 'tip-airline-jan31',
    card: 'platinum',
    title: 'Select your airline by January 31',
    description: 'Amex says to choose your qualifying airline by January 31 each year, and any change should be made before you make incidental purchases.',
    evidence: 'official',
    sourceUrl: 'https://www.americanexpress.com/en-us/account/get-started/platinum/benefits-overview',
    sourceLabel: 'Amex Platinum Benefits Overview'
  },
  {
    id: 'tip-airline-separate',
    card: 'platinum',
    title: 'Keep incidental charges separate from airfare',
    description: 'Purchasing seat upgrades, bags, etc. as separate transactions (not bundled with airfare) triggers the credit more reliably.',
    evidence: 'editor-tested',
    sourceUrl: 'https://frequentmiler.com/amex-airline-fee-reimbursements-still-works/',
    sourceLabel: 'Frequent Miler'
  },
  {
    id: 'tip-fhr-hack',
    card: 'platinum',
    title: 'Use maxFHR to find the best FHR deals',
    description: 'maxFHR.com is a community-built tool that helps search FHR availability and compare pricing across properties to maximize your $300 semiannual credit.',
    evidence: 'community',
    sourceUrl: 'https://maxfhr.com/',
    sourceLabel: 'maxFHR'
  },
  {
    id: 'tip-fhr-back-to-back',
    card: 'platinum',
    title: 'FHR back-to-back stays count as one stay',
    description: 'Back-to-back stays within 24 hours at the same FHR property are treated as a single stay — you won\'t receive double benefits.',
    evidence: 'official',
    sourceUrl: 'https://www.americanexpress.com/en-us/travel/fine-hotels-and-resorts',
    sourceLabel: 'Amex FHR'
  },
  {
    id: 'tip-gold-grubhub-pickup',
    card: 'gold',
    title: 'Grubhub pickup orders trigger the dining credit',
    description: 'Small Grubhub pickup orders (no delivery fee) can trigger the $10 monthly dining credit reliably. Editor-tested.',
    evidence: 'editor-tested',
    sourceUrl: 'https://thepointsguy.com/credit-cards/unique-ways-maximize-american-express-gold-dining-credits/',
    sourceLabel: 'The Points Guy'
  },
  {
    id: 'tip-gold-grubhubplus',
    card: 'gold',
    title: 'Grubhub+ monthly charge triggers the dining credit',
    description: 'The monthly Grubhub+ subscription fee has been reported to trigger the $10 dining credit. Editor-tested.',
    evidence: 'editor-tested',
    sourceUrl: 'https://thepointsguy.com/credit-cards/unique-ways-maximize-american-express-gold-dining-credits/',
    sourceLabel: 'The Points Guy'
  },
  {
    id: 'tip-gold-resy-no-res',
    card: 'gold',
    title: 'Dining at a Resy restaurant without a reservation may work',
    description: 'Some Resy restaurants trigger the Resy credit even without a reservation, as long as the merchant is in the Resy network and you pay with Gold.',
    evidence: 'editor-tested',
    sourceUrl: 'https://thepointsguy.com/credit-cards/unique-ways-maximize-american-express-gold-dining-credits/',
    sourceLabel: 'The Points Guy'
  },
  {
    id: 'tip-gold-dunkin-preload',
    card: 'gold',
    title: "Dunkin' app preload triggers the credit",
    description: "Loading your Dunkin' app balance with your Gold card has been reported to trigger the $7 monthly credit.",
    evidence: 'community',
    sourceUrl: 'https://www.reddit.com/r/amex/comments/1op7ouk/amex_gold_credits_creative_strategies/',
    sourceLabel: 'Reddit r/amex'
  },
  {
    id: 'tip-gold-resy-giftcard',
    card: 'gold',
    title: 'Resy gift card purchases may trigger credit (YMMV)',
    description: 'Some community members report purchasing Resy gift cards triggers the Resy credit, but this is inconsistent.',
    evidence: 'community',
    sourceUrl: 'https://www.reddit.com/r/amex/comments/1op7ouk/amex_gold_credits_creative_strategies/',
    sourceLabel: 'Reddit r/amex'
  },
  {
    id: 'tip-gold-reset-first',
    card: 'gold',
    title: 'Monthly credits reset on the 1st of each month',
    description: 'All Gold monthly credits (dining, Dunkin\', Uber) reset on the first of each calendar month, not your statement cycle.',
    evidence: 'official',
    sourceUrl: 'https://www.americanexpress.com/en-us/credit-cards/credit-intel/amex-gold-dining/',
    sourceLabel: 'Amex Gold Dining Guide'
  },
  {
    id: 'tip-gold-merchant-coding',
    card: 'gold',
    title: 'Restaurant 4X depends on merchant coding',
    description: 'Restaurants inside hotels, casinos, food courts, and event venues may not code as restaurants and won\'t earn 4X. Fast food does count.',
    evidence: 'official',
    sourceUrl: 'https://www.americanexpress.com/us/rewards-info/retail.html',
    sourceLabel: 'Amex Rewards Category Rules'
  },
  {
    id: 'tip-gold-grocery-exclusions',
    card: 'gold',
    title: 'U.S. supermarket 4X has exclusions',
    description: 'Target, Walmart, warehouse clubs (Costco, Sam\'s), convenience stores, meal kit services, and specialty stores are excluded from the 4X supermarket bonus.',
    evidence: 'official',
    sourceUrl: 'https://www.americanexpress.com/us/rewards-info/retail.html',
    sourceLabel: 'Amex Rewards Category Rules'
  },
  {
    id: 'tip-pointme',
    card: 'both',
    title: 'Use point.me to search award flights',
    description: 'point.me for Membership Rewards is free for eligible Amex cardmembers. Search across airline partners for the best award redemptions.',
    evidence: 'official',
    sourceUrl: 'https://www.americanexpress.com/en-us/benefits/rewards/membership-rewards/',
    sourceLabel: 'Amex Membership Rewards'
  }
];

// Sources Library
const SOURCES = [
  { id: 'src-plat-overview', title: 'Amex Platinum Benefits Overview', url: 'https://www.americanexpress.com/en-us/account/get-started/platinum/benefits-overview', type: 'official', description: 'Primary official source for all Platinum card benefits, credits, and enrollment info.' },
  { id: 'src-gold-guide', title: 'Amex Gold Benefits Guide', url: 'https://www.americanexpress.com/en-us/account/get-started/gold/explore-benefits', type: 'official', description: 'Official Gold card benefits including dining credits, Uber Cash, and travel protections.' },
  { id: 'src-global-entry', title: 'Amex Global Entry / TSA PreCheck', url: 'https://www.americanexpress.com/en-us/benefits/travel/expedite-your-travel/', type: 'official', description: 'Official terms for Global Entry and TSA PreCheck statement credits.' },
  { id: 'src-mr-pointme', title: 'Amex Membership Rewards & point.me', url: 'https://www.americanexpress.com/en-us/benefits/rewards/membership-rewards/', type: 'official', description: 'Official Membership Rewards program details and point.me integration.' },
  { id: 'src-fhr', title: 'Fine Hotels + Resorts', url: 'https://www.americanexpress.com/en-us/travel/fine-hotels-and-resorts', type: 'official', description: 'Official FHR program with property benefits and booking terms.' },
  { id: 'src-travel-benefits', title: 'Amex Travel Benefits (5X, Hotel Credit)', url: 'https://www.americanexpress.com/en-us/travel/cardmember-travel-benefits/', type: 'official', description: 'Official 5X earning rates and $600 hotel credit details.' },
  { id: 'src-gold-dining', title: 'Amex Gold Dining Guide', url: 'https://www.americanexpress.com/en-us/credit-cards/credit-intel/amex-gold-dining/', type: 'official', description: 'Official Gold dining earning rates, credit rules, and reset schedule.' },
  { id: 'src-category-rules', title: 'Amex Rewards Category Rules', url: 'https://www.americanexpress.com/us/rewards-info/retail.html', type: 'official', description: 'Official merchant coding rules and category exclusions.' },
  { id: 'src-plat-terms', title: 'Amex Platinum Card Terms', url: 'https://global.americanexpress.com/card-benefits/terms/platinum', type: 'official', description: 'Official Platinum terms for lounges, hotel status, car rental, and more.' },
  { id: 'src-shopping', title: 'Amex Platinum Shopping Benefits', url: 'https://www.americanexpress.com/en-us/credit-cards/credit-intel/american-express-platinum-shopping-benefits/', type: 'official', description: 'Official lululemon, Walmart+, Oura, and Equinox credit details.' },
  { id: 'src-cpp', title: 'Amex Cell Phone Protection', url: 'https://www.americanexpress.com/us/credit-cards/features-benefits/policies/cell-phone-protection.html', type: 'official', description: 'Official Amex overview and guide links for eligible card cell phone protection benefits.' },
  { id: 'src-freq-miler', title: 'Frequent Miler — Airline Fee Reimbursements', url: 'https://frequentmiler.com/amex-airline-fee-reimbursements-still-works/', type: 'third-party', description: 'Detailed analysis of which airline fee purchases trigger the credit, updated regularly.' },
  { id: 'src-thrifty', title: 'Thrifty Traveler — Airline Credit Guide', url: 'https://thriftytraveler.com/guides/credit-card/amex-platinum-travel-credit/', type: 'third-party', description: 'Comprehensive airline credit guide with official and off-label methods.' },
  { id: 'src-tpg-airline', title: 'The Points Guy — Airline Credit', url: 'https://thepointsguy.com/credit-cards/choosing-your-amex-platinum-200-airline-fee-credit/', type: 'third-party', description: 'Guide on choosing airline and maximizing the $200 annual credit.' },
  { id: 'src-tpg-gold', title: 'The Points Guy — Gold Dining Strategies', url: 'https://thepointsguy.com/credit-cards/unique-ways-maximize-american-express-gold-dining-credits/', type: 'third-party', description: 'Editor-tested and community strategies for maximizing Gold dining credits.' },
  { id: 'src-reddit-tb', title: 'Reddit — TravelBank Excluded', url: 'https://www.reddit.com/r/AmexPlatinum/comments/1riynlx/united_travelbank_officially_on_the_excluded_list/', type: 'community', description: 'Community confirmation that United TravelBank is on the excluded list for 2026.' },
  { id: 'src-reddit-gold', title: 'Reddit — Gold Creative Strategies', url: 'https://www.reddit.com/r/amex/comments/1op7ouk/amex_gold_credits_creative_strategies/', type: 'community', description: 'Community-reported strategies for maximizing Gold card credits.' },
  { id: 'src-maxfhr', title: 'maxFHR', url: 'https://maxfhr.com/', type: 'community', description: 'Community tool for searching FHR availability and comparing prices.' },
  { id: 'src-pointme', title: 'point.me for Amex', url: 'https://point.me/amex', type: 'third-party', description: 'Free award flight search tool for Amex Membership Rewards holders.' },
  { id: 'src-resy', title: 'Resy', url: 'https://resy.com', type: 'third-party', description: 'Restaurant booking platform for Resy credit usage and venue lookup.' }
];

// Travel Tools
const TRAVEL_TOOLS = [
  { name: 'Fine Hotels + Resorts', url: 'https://www.americanexpress.com/en-us/travel/fine-hotels-and-resorts', description: 'Book FHR stays with $100 property credit, breakfast, upgrades, and more.', category: 'Hotels' },
  { name: 'The Hotel Collection', url: 'https://www.americanexpress.com/en-us/travel/the-hotel-collection', description: 'Book THC stays for $100 property credit on 2+ night prepaid stays.', category: 'Hotels' },
  { name: 'maxFHR', url: 'https://maxfhr.com/', description: 'Community tool to search FHR availability and compare rates across properties.', category: 'Hotels' },
  { name: 'Amex Travel', url: 'https://www.americanexpress.com/en-us/travel/', description: 'Book flights (5X) and prepaid hotels (5X) through the Amex Travel portal.', category: 'Booking' },
  { name: 'point.me for Amex', url: 'https://point.me/amex', description: 'Free award flight search across Membership Rewards airline partners.', category: 'Points' },
  { name: 'Resy', url: 'https://resy.com', description: 'Book restaurants for Resy dining credit eligibility.', category: 'Dining' },
  { name: 'Resy Venue List', url: 'https://resy.com/list-venues', description: 'Browse all Resy venues to find eligible restaurants near you.', category: 'Dining' },
  { name: 'Uber', url: 'https://www.uber.com', description: 'Rides and Uber Eats. Link your Amex card for automatic monthly Uber Cash.', category: 'Transportation' },
  { name: 'CLEAR+', url: 'https://www.clearme.com', description: 'Skip the security line with biometric ID. Up to $209/year covered by Platinum.', category: 'Airport' },
  { name: 'Global Entry Application', url: 'https://ttp.cbp.dhs.gov/', description: 'Apply for Global Entry ($120 covered by Platinum every 4 years).', category: 'Airport' },
  { name: 'Hilton Honors', url: 'https://www.hilton.com/en/hilton-honors/', description: 'Manage your complimentary Hilton Gold status (Platinum benefit).', category: 'Hotels' },
  { name: 'Marriott Bonvoy', url: 'https://www.marriott.com/loyalty/member-benefits.mi', description: 'Manage your complimentary Marriott Gold Elite status (Platinum benefit).', category: 'Hotels' },
  { name: 'Priority Pass', url: 'https://www.prioritypass.com', description: 'Access 1,300+ airport lounges worldwide. Enroll through Amex Benefits.', category: 'Airport' },
  { name: 'Amex Centurion Lounges', url: 'https://www.americanexpress.com/en-us/travel/lounges', description: 'Find Centurion Lounge locations and hours.', category: 'Airport' },
  { name: 'Saks Fifth Avenue', url: 'https://www.saksfifthavenue.com', description: 'Shop for $50 semiannual credit (Platinum benefit).', category: 'Shopping' },
  { name: 'lululemon', url: 'https://www.lululemon.com', description: 'Shop for $75 quarterly credit (Platinum benefit).', category: 'Shopping' },
  { name: 'Walmart+', url: 'https://www.walmart.com/plus', description: 'Monthly membership covered by Platinum (monthly plan only).', category: 'Shopping' }
];

// Evidence level metadata
const EVIDENCE_LEVELS = {
  'official': { label: 'Official', color: '#16a34a', bg: '#f0fdf4', description: 'Confirmed by Amex terms or official documentation' },
  'editor-tested': { label: 'Editor-Tested', color: '#2563eb', bg: '#eff6ff', description: 'Verified by trusted editorial sources' },
  'community': { label: 'Community Reported', color: '#d97706', bg: '#fffbeb', description: 'Reported by users — not guaranteed' },
  'dead': { label: 'Dead / Unreliable', color: '#dc2626', bg: '#fef2f2', description: 'Previously worked but no longer reliable' }
};

// ============================================================
// BEST-CARD ENGINE — Rule-based spending decisions
// ============================================================

const BEST_CARD_DECISIONS = [
  {
    id: 'dining',
    category: 'Dining / Restaurants',
    icon: '🍽️',
    recommended: 'gold',
    why: 'Gold earns 4X MR at restaurants worldwide (up to $50K/yr). Platinum only earns 1X at restaurants.',
    earn: '4X MR per dollar (Gold) vs 1X MR (Platinum)',
    exceptions: 'If paying at a Resy restaurant, use whichever card has the active Resy credit you want to trigger (Platinum: $100/quarter, Gold: $50/semiannual). Hotel restaurants, casinos, and food courts may not code as restaurants.',
    rakutenNote: 'If ordering through a Rakuten-eligible food delivery partner, start the session through Rakuten first to stack cashback/MR on top of your Gold 4X earn. The Rakuten portal earn is separate from the card earn.'
  },
  {
    id: 'groceries',
    category: 'Groceries / U.S. Supermarkets',
    icon: '🛒',
    recommended: 'gold',
    why: 'Gold earns 4X MR at U.S. supermarkets (up to $25K/yr). Platinum earns 1X.',
    earn: '4X MR per dollar (Gold) vs 1X MR (Platinum)',
    exceptions: 'Walmart, Target, Costco, Sam\'s Club, convenience stores, and specialty food shops are excluded from 4X. After $25K/yr you drop to 1X.',
    rakutenNote: 'Most grocery delivery (Instacart, etc.) may be available on Rakuten. Start through Rakuten, then pay with Gold for potential 4X + Rakuten MR stack.'
  },
  {
    id: 'flights',
    category: 'Flights',
    icon: '✈️',
    recommended: 'platinum',
    why: 'Platinum earns 5X MR on flights booked directly with airlines or through Amex Travel (up to $500K/yr).',
    earn: '5X MR per dollar (Platinum) vs 3X MR on flights via Amex Travel (Gold) or 1X direct',
    exceptions: 'Gold earns 3X on flights booked through Amex Travel only — if booking direct with airlines, Gold earns 1X. Always prefer Platinum for flights.',
    rakutenNote: 'Airline sites are occasionally on Rakuten, but rates are typically low (1-2X). The 5X Platinum earn usually outweighs any portal routing benefit. Check Rakuten first anyway — it\'s free incremental MR if available.'
  },
  {
    id: 'hotels',
    category: 'Hotels',
    icon: '🏨',
    recommended: 'platinum',
    why: 'Platinum earns 5X MR on prepaid hotels booked through Amex Travel. Plus the $300 semiannual FHR/THC credit stacks.',
    earn: '5X MR per dollar on Amex Travel prepaid (Platinum) vs 1X direct bookings',
    exceptions: 'If booking directly with a hotel chain (not via Amex Travel), both cards earn 1X. For Amex Travel bookings, Platinum is always better. Gold has a $100 THC property credit for 2+ night stays.',
    rakutenNote: 'Many hotel chains (Hilton, Marriott, IHG, etc.) have Rakuten listings. If booking direct, start via Rakuten to earn extra MR. When booking through Amex Travel, Rakuten doesn\'t apply.'
  },
  {
    id: 'portal-shopping',
    category: 'Portal Shopping (Amex Offers)',
    icon: '🛍️',
    recommended: 'platinum',
    why: 'Platinum has more credit-eligible merchants (lululemon $75/quarter, Saks $50/semiannual, Walmart+, etc.). Use Platinum when the purchase triggers a specific credit.',
    earn: 'Both cards earn 1X on general shopping. The value comes from stacking statement credits.',
    exceptions: 'If no credit is at stake, and you\'re buying from a supermarket or restaurant, use Gold for 4X. Otherwise, either card earns 1X on general retail.',
    rakutenNote: 'Rakuten is the primary portal play. Start at Rakuten, click through to the retailer, and pay with your Amex. You earn Rakuten MR on top of your card earn. This is the #1 stacking strategy.'
  },
  {
    id: 'rakuten',
    category: 'Rakuten Portal Purchases',
    icon: '🔄',
    recommended: 'gold',
    why: 'For most Rakuten purchases at general retailers, both cards earn 1X on the card side, but Gold gives 4X at supermarkets and restaurants if the merchant qualifies. Pay with whichever card earns the best multiplier on that merchant.',
    earn: 'Rakuten MR (varies by retailer, e.g. 1-15X) + card earn (1X–5X depending on category)',
    exceptions: 'If the Rakuten purchase is at a restaurant partner, use Gold for 4X stacking. If it\'s a flight, use Platinum for 5X. The Rakuten earn is always extra, regardless of which card you pay with.',
    rakutenNote: 'Rakuten MR transfers to your linked Membership Rewards account regardless of which Amex card you pay with. The card earn (1X, 4X, 5X) depends on merchant category. YMMV: community reports suggest Rakuten MR transfers work even if the paying card isn\'t the one linked for MR — but this is not officially guaranteed by Amex.'
  },
  {
    id: 'non-bonus',
    category: 'Non-Bonus / General Spend',
    icon: '💳',
    recommended: 'gold',
    why: 'Both earn 1X on non-category spend, so either works. Gold has a lower annual fee ($325 vs $895), so for non-bonus spend consider whether a different non-Amex card gives better returns.',
    earn: '1X MR per dollar (both cards)',
    exceptions: 'If you have a cashback card that earns 1.5–2% on everything, that may beat 1X MR on non-bonus spend depending on your cents-per-point valuation.',
    rakutenNote: 'Always check Rakuten before any online purchase. Even 1-2X extra MR via Rakuten is free value on top of your 1X card earn.'
  },
  {
    id: 'edge-cases',
    category: 'Edge Cases / YMMV',
    icon: '⚠️',
    recommended: 'varies',
    why: 'Some spending situations require judgment. Gift cards, prepaid purchases, and third-party payment processors may not code in bonus categories.',
    earn: 'Varies by merchant coding and category',
    exceptions: 'Venmo, PayPal, Cash App purchases generally code as 1X regardless of underlying merchant. Gift card purchases at supermarkets may earn 4X on Gold but violate some card terms. Proceed with caution.',
    rakutenNote: 'Rakuten stacking on lululemon (Platinum $75/quarter credit) is a popular community strategy. You can potentially earn: statement credit + Rakuten MR + 1X card MR. Similar stacking may work with other credit-eligible merchants available on Rakuten. Community-reported / YMMV — not an official Amex feature.'
  }
];

// ============================================================
// RAKUTEN RULES — Official timing and transfer data
// Source: Rakuten MR FAQ and help pages
// ============================================================

const RAKUTEN_RULES = {
  conversion: '$1 Cash Back = 100 Membership Rewards points',
  minimumTransfer: 'At least 501 confirmed points are needed before a payment date for transfer to MR.',
  carryOver: 'Balances of 500 or fewer confirmed points carry over to the next quarter.',
  firstTransfer: 'Points can transfer as soon as 15 days after your first qualifying purchase.',
  linkRequirement: 'You must link a Membership Rewards-eligible Amex account in Rakuten settings to earn MR instead of cash back.',
  paymentDates: [
    { date: 'February 15', quarter: 'Q4 (Oct–Dec earnings)' },
    { date: 'May 15', quarter: 'Q1 (Jan–Mar earnings)' },
    { date: 'August 15', quarter: 'Q2 (Apr–Jun earnings)' },
    { date: 'November 15', quarter: 'Q3 (Jul–Sep earnings)' }
  ],
  confirmationWindows: [
    { type: 'Online / In-Store', window: '3–14 weeks (20–100 days)' },
    { type: 'Dining', window: '3–5 days' },
    { type: 'Travel', window: '45–120 days' }
  ],
  stackingNotes: [
    'Rakuten MR is earned on top of your card\'s own MR earn rate. They are separate earning streams.',
    'Community reports suggest Rakuten MR transfers even if the paying card is not the MR-linked card, but this is not officially confirmed by Amex.',
    'Statement credits (like Platinum lululemon $75/quarter) can potentially stack with Rakuten portal earnings. Community-reported / YMMV.',
    'Rakuten In-Store cashback can also earn MR if your account is set to MR mode. Link a card in the Rakuten app for in-store offers.'
  ]
};

// ============================================================
// DEFAULT PORTFOLIO — initial state for new users
// ============================================================

const DEFAULT_PORTFOLIO = {
  platinum: {
    active: true,
    annualFeePaid: 895,
    pointsBalance: 0,
    cppValuation: 2.0,
    notes: ''
  },
  gold: {
    active: true,
    annualFeePaid: 325,
    pointsBalance: 0,
    cppValuation: 2.0,
    notes: ''
  }
};

const DEFAULT_RAKUTEN = {
  linked: false,
  pendingCashback: 0,
  confirmedPoints: 0,
  lifetimeMRTransferred: 0,
  lastTransferDate: null,
  notes: ''
};

// ============================================================
// ACTION CENTER — "What to do now" priorities
// ============================================================

function getActionItems() {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed
  const day = now.getDate();
  const items = [];

  // Monthly credit reminders (first 5 days)
  if (day <= 5) {
    items.push({
      priority: 'high',
      card: 'platinum',
      title: 'New month — use Platinum monthly credits',
      desc: 'Uber Cash ($15), Digital Entertainment ($25), Walmart+ auto-renews.'
    });
    items.push({
      priority: 'high',
      card: 'gold',
      title: 'New month — use Gold monthly credits',
      desc: 'Uber Cash ($10), Dining Credit ($10), Dunkin\' ($7).'
    });
  }

  // Quarterly resets (Jan, Apr, Jul, Oct)
  if ([0, 3, 6, 9].includes(month) && day <= 10) {
    items.push({
      priority: 'high',
      card: 'platinum',
      title: 'New quarter — Resy ($100) and lululemon ($75) credits reset',
      desc: 'Use your Platinum quarterly credits before the end of this quarter.'
    });
  }

  // Semiannual resets (Jan, Jul)
  if ([0, 6].includes(month) && day <= 10) {
    items.push({
      priority: 'high',
      card: 'platinum',
      title: 'Semiannual reset — Hotel Credit ($300) and Saks ($50)',
      desc: 'New FHR/THC hotel credit window and Saks credit available.'
    });
    items.push({
      priority: 'medium',
      card: 'gold',
      title: 'Semiannual reset — Gold Resy credit ($50)',
      desc: 'New Gold Resy dining credit window available.'
    });
  }

  // Rakuten payment date reminders
  const rakutenPayDates = [[1, 15], [4, 15], [7, 15], [10, 15]]; // month (0-indexed), day
  rakutenPayDates.forEach(([m, d]) => {
    if (month === m && day >= d - 7 && day <= d + 3) {
      items.push({
        priority: 'medium',
        card: 'both',
        title: `Rakuten payout around ${['Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan'][m]} ${d}`,
        desc: 'Check your Rakuten account for confirmed points. 501+ confirmed points will transfer to MR.'
      });
    }
  });

  // December Uber bonus
  if (month === 11) {
    items.push({
      priority: 'medium',
      card: 'platinum',
      title: 'December Uber Cash bonus',
      desc: 'Platinum gets $35 total Uber Cash this month ($15 + $20 bonus). Don\'t let it expire!'
    });
  }

  // End-of-quarter reminders (last 10 days of Mar, Jun, Sep, Dec)
  if ([2, 5, 8, 11].includes(month) && day >= 21) {
    items.push({
      priority: 'high',
      card: 'platinum',
      title: 'Quarter ending soon — use quarterly credits',
      desc: 'Resy ($100/quarter) and lululemon ($75/quarter) credits don\'t roll over.'
    });
  }

  // End-of-half reminders (last 10 days of Jun, Dec)
  if ([5, 11].includes(month) && day >= 21) {
    items.push({
      priority: 'high',
      card: 'platinum',
      title: 'Half ending soon — use semiannual credits',
      desc: 'Saks ($50) and Hotel Credit ($300) semiannual windows close soon.'
    });
    items.push({
      priority: 'medium',
      card: 'gold',
      title: 'Half ending soon — use Gold Resy credit',
      desc: 'Gold Resy ($50 semiannual) doesn\'t roll over.'
    });
  }

  // Always show general best-card reminder
  items.push({
    priority: 'low',
    card: 'both',
    title: 'Check best-card before every purchase',
    desc: 'Gold for dining & groceries (4X). Platinum for flights & hotels (5X). Start at Rakuten for online shopping.'
  });

  return items;
}

// ============================================================
// ONBOARDING — "I just got Platinum today" checklist
// ============================================================

const ONBOARDING_STEPS = [
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
  { id: 'ob-car-rental', title: 'Enroll in car rental programs', desc: 'Hertz, Avis, National — premium status and upgrades.', priority: 'low' }
];
