import type { ActionItem, CardKey } from './types';

/**
 * Generates context-aware action items based on the current date.
 * Includes monthly, quarterly, semiannual, and seasonal reminders.
 */
export function getActionItems(): ActionItem[] {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed
  const day = now.getDate();
  const items: ActionItem[] = [];

  // Monthly credit reminders (first 5 days)
  if (day <= 5) {
    items.push({
      priority: 'high',
      card: 'platinum',
      title: 'New month — use Platinum monthly credits',
      desc: 'Uber Cash ($15), Digital Entertainment ($25), Walmart+ auto-renews.',
    });
    items.push({
      priority: 'high',
      card: 'gold',
      title: 'New month — use Gold monthly credits',
      desc: 'Uber Cash ($10), Dining Credit ($10), Dunkin\' ($7).',
    });
  }

  // Quarterly resets (Jan, Apr, Jul, Oct)
  if ([0, 3, 6, 9].includes(month) && day <= 10) {
    items.push({
      priority: 'high',
      card: 'platinum',
      title: 'New quarter — Resy ($100) and lululemon ($75) credits reset',
      desc: 'Use your Platinum quarterly credits before the end of this quarter.',
    });
  }

  // Semiannual resets (Jan, Jul)
  if ([0, 6].includes(month) && day <= 10) {
    items.push({
      priority: 'high',
      card: 'platinum',
      title: 'Semiannual reset — Hotel Credit ($300) and Saks ($50)',
      desc: 'New FHR/THC hotel credit window and Saks credit available.',
    });
    items.push({
      priority: 'medium',
      card: 'gold',
      title: 'Semiannual reset — Gold Resy credit ($50)',
      desc: 'New Gold Resy dining credit window available.',
    });
  }

  // Rakuten payment date reminders
  const rakutenPayDates: [number, number][] = [[1, 15], [4, 15], [7, 15], [10, 15]];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  rakutenPayDates.forEach(([m, d]) => {
    if (month === m && day >= d - 7 && day <= d + 3) {
      items.push({
        priority: 'medium',
        card: 'both',
        title: `Rakuten payout around ${monthNames[m]} ${d}`,
        desc: 'Check your Rakuten account for confirmed points. 501+ confirmed points will transfer to MR.',
      });
    }
  });

  // December Uber bonus
  if (month === 11) {
    items.push({
      priority: 'medium',
      card: 'platinum',
      title: 'December Uber Cash bonus',
      desc: 'Platinum gets $35 total Uber Cash this month ($15 + $20 bonus). Don\'t let it expire!',
    });
  }

  // End-of-quarter reminders (last 10 days of Mar, Jun, Sep, Dec)
  if ([2, 5, 8, 11].includes(month) && day >= 21) {
    items.push({
      priority: 'high',
      card: 'platinum',
      title: 'Quarter ending soon — use quarterly credits',
      desc: 'Resy ($100/quarter) and lululemon ($75/quarter) credits don\'t roll over.',
    });
  }

  // End-of-half reminders (last 10 days of Jun, Dec)
  if ([5, 11].includes(month) && day >= 21) {
    items.push({
      priority: 'high',
      card: 'platinum',
      title: 'Half ending soon — use semiannual credits',
      desc: 'Saks ($50) and Hotel Credit ($300) semiannual windows close soon.',
    });
    items.push({
      priority: 'medium',
      card: 'gold',
      title: 'Half ending soon — use Gold Resy credit',
      desc: 'Gold Resy ($50 semiannual) doesn\'t roll over.',
    });
  }

  // Always show general best-card reminder
  items.push({
    priority: 'low',
    card: 'both',
    title: 'Check best-card before every purchase',
    desc: 'Gold for dining & groceries (4X). Platinum for flights & hotels (5X). Start at Rakuten for online shopping.',
  });

  return items;
}
