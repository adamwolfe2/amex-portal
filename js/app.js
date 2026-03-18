// ============================================================
// Amex OS — Application Logic (Manual Control Build)
// ============================================================

let currentView = 'dashboard';
let currentBenefitFilter = 'all';
let currentTipFilter = 'all';
let currentTravelFilter = 'all';
let currentSourceFilter = 'all';

// ── Navigation ──
function navigate(view) {
  currentView = view;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));

  const el = document.getElementById('view-' + view);
  if (el) el.classList.add('active');

  const link = document.querySelector(`[data-view="${view}"]`);
  if (link) link.classList.add('active');

  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');

  // Scroll to top
  window.scrollTo(0, 0);

  // Update hash
  window.location.hash = view;

  // Refresh content
  const renderers = {
    dashboard: renderDashboard,
    checklist: renderChecklist,
    benefits: renderBenefits,
    calendar: renderCalendar,
    vault: renderVault,
    travel: renderTravel,
    tips: renderTips,
    sources: renderSources,
    bestcard: renderBestCard,
    actions: renderActions,
    rakuten: renderRakuten,
    portfolio: renderPortfolio,
    onboarding: renderOnboarding
  };
  if (renderers[view]) renderers[view]();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('open');
}

// ── Initialize ──
function init() {
  // Check storage
  const badge = document.getElementById('storageBadge');
  const label = document.getElementById('storageLabel');
  if (StorageAdapter.getBackend() === 'localStorage') {
    label.textContent = 'localStorage active';
  } else {
    badge.classList.add('fallback');
    label.textContent = 'Session only (demo mode)';
  }

  // Storage notice in vault
  if (StorageAdapter.getBackend() !== 'localStorage') {
    document.getElementById('vaultNotice').textContent =
      'Hosted demo — data is stored in memory only and will be lost on page reload. Use Export to save.';
  }

  // Init default portfolio if missing
  if (!StorageAdapter.get('amexos_portfolio')) {
    StorageAdapter.set('amexos_portfolio', DEFAULT_PORTFOLIO);
  }
  if (!StorageAdapter.get('amexos_rakuten')) {
    StorageAdapter.set('amexos_rakuten', DEFAULT_RAKUTEN);
  }

  // Populate vault benefit select
  const sel = document.getElementById('vaultBenefit');
  BENEFITS.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b.id;
    opt.textContent = `${b.name} (${CARDS[b.card].short})`;
    sel.appendChild(opt);
  });

  // Handle hash routing
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById('view-' + hash)) {
    navigate(hash);
  } else {
    navigate('dashboard');
  }

  // Keyboard shortcut for search
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape') {
      closeSearch();
    }
  });
}

// ── Portfolio Math Helpers ──
function getPortfolio() {
  return StorageAdapter.get('amexos_portfolio') || DEFAULT_PORTFOLIO;
}

function getRakutenData() {
  return StorageAdapter.get('amexos_rakuten') || DEFAULT_RAKUTEN;
}

function calcPortfolioMath() {
  const portfolio = getPortfolio();
  const vault = StorageAdapter.get('amexos_vault') || [];

  const platFee = portfolio.platinum.annualFeePaid || 895;
  const goldFee = portfolio.gold.annualFeePaid || 325;
  const totalFees = platFee + goldFee;

  const platPoints = portfolio.platinum.pointsBalance || 0;
  const goldPoints = portfolio.gold.pointsBalance || 0;
  const totalPoints = platPoints + goldPoints;

  const platCpp = portfolio.platinum.cppValuation || 2.0;
  const goldCpp = portfolio.gold.cppValuation || 2.0;

  const platPointValue = platPoints * platCpp / 100;
  const goldPointValue = goldPoints * goldCpp / 100;
  const totalPointValue = platPointValue + goldPointValue;

  // Calculate total credits available from BENEFITS
  const totalCreditsValue = BENEFITS.filter(b => b.value).reduce((sum, b) => sum + b.value, 0);

  // Captured value from vault
  const capturedValue = vault.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  const availableValue = totalCreditsValue - capturedValue;
  const effectiveFee = totalFees - capturedValue;

  // Rakuten
  const rak = getRakutenData();
  const rakPendingValue = (rak.pendingCashback || 0);
  const rakConfirmedPts = (rak.confirmedPoints || 0);
  const rakLifetimeMR = (rak.lifetimeMRTransferred || 0);

  return {
    platFee, goldFee, totalFees,
    platPoints, goldPoints, totalPoints,
    platCpp, goldCpp,
    platPointValue, goldPointValue, totalPointValue,
    totalCreditsValue, capturedValue, availableValue, effectiveFee,
    rakPendingValue, rakConfirmedPts, rakLifetimeMR
  };
}

// ── Dashboard (Control Center) ──
function renderDashboard() {
  const m = calcPortfolioMath();
  const checklist = StorageAdapter.get('amexos_checklist') || {};

  const platTasks = SETUP_TASKS.filter(t => t.card === 'platinum');
  const goldTasks = SETUP_TASKS.filter(t => t.card === 'gold');
  const platDone = platTasks.filter(t => checklist[t.id]).length;
  const goldDone = goldTasks.filter(t => checklist[t.id]).length;
  const totalTasks = SETUP_TASKS.length;
  const totalDone = platDone + goldDone;

  // KPI stats - enhanced with portfolio math
  document.getElementById('dashStats').innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Effective Annual Fee</div>
      <div class="stat-value" style="${m.effectiveFee <= 0 ? 'color:var(--green)' : ''}">${m.effectiveFee <= 0 ? '-' : ''}$${Math.abs(m.effectiveFee).toLocaleString()}</div>
      <div class="stat-sub">$${m.totalFees.toLocaleString()} fees − $${m.capturedValue.toLocaleString()} captured</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Points Balance</div>
      <div class="stat-value">${m.totalPoints.toLocaleString()}</div>
      <div class="stat-sub">≈ $${m.totalPointValue.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})} at ${m.platCpp}¢/pt</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Credits Captured</div>
      <div class="stat-value">$${m.capturedValue.toLocaleString()}</div>
      <div class="stat-sub">of $${m.totalCreditsValue.toLocaleString()} available</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Setup Progress</div>
      <div class="stat-value">${totalDone}/${totalTasks}</div>
      <div class="stat-sub">${Math.round((totalDone / totalTasks) * 100)}% complete</div>
    </div>
  `;

  // Progress bars
  document.getElementById('platProgress').textContent = `${platDone} / ${platTasks.length}`;
  document.getElementById('platBar').style.width = `${platTasks.length ? (platDone / platTasks.length * 100) : 0}%`;
  document.getElementById('goldProgress').textContent = `${goldDone} / ${goldTasks.length}`;
  document.getElementById('goldBar').style.width = `${goldTasks.length ? (goldDone / goldTasks.length * 100) : 0}%`;

  // Upcoming resets
  renderUpcomingResets();

  // Unenrolled benefits
  renderUnenrolled(checklist);

  // Action items preview
  renderDashboardActions();
}

function renderDashboardActions() {
  const actions = getActionItems().slice(0, 4);
  const container = document.getElementById('dashActionPreview');
  if (!container) return;

  if (actions.length === 0) {
    container.innerHTML = '<div style="font-size:0.8rem;color:var(--text-muted);padding:8px 0;">No urgent actions right now.</div>';
    return;
  }

  container.innerHTML = actions.map(a => `
    <div class="action-preview-item">
      <div class="priority-dot ${a.priority}"></div>
      <div>
        <div style="font-size:0.8rem;font-weight:600;">${a.title}</div>
        <div style="font-size:0.73rem;color:var(--text-secondary);">${a.desc}</div>
      </div>
    </div>
  `).join('');
}

function renderUpcomingResets() {
  const now = new Date();
  const resets = [];

  BENEFITS.forEach(b => {
    if (b.cadence === 'monthly') {
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      resets.push({ date: nextMonth, name: b.name, card: b.card, type: 'Monthly reset' });
    } else if (b.cadence === 'quarterly' && b.resetMonths) {
      b.resetMonths.forEach(m => {
        const d = new Date(now.getFullYear(), m - 1, 1);
        if (d > now) resets.push({ date: d, name: b.name, card: b.card, type: 'Quarterly reset' });
      });
    } else if (b.cadence === 'semiannual' && b.resetMonths) {
      b.resetMonths.forEach(m => {
        const d = new Date(now.getFullYear(), m - 1, 1);
        if (d > now) resets.push({ date: d, name: b.name, card: b.card, type: 'Semiannual reset' });
      });
    } else if (b.cadence === 'annual' && b.resetMonths) {
      b.resetMonths.forEach(m => {
        const d = new Date(now.getFullYear(), m - 1, 1);
        if (d > now) resets.push({ date: d, name: b.name, card: b.card, type: 'Annual reset' });
      });
    }
  });

  resets.sort((a, b) => a.date - b.date);
  const upcoming = resets.slice(0, 8);

  const container = document.getElementById('upcomingResets');
  if (upcoming.length === 0) {
    container.innerHTML = '<li class="upcoming-item"><span class="upcoming-text" style="color:var(--text-muted)">No upcoming resets in the remainder of this year</span></li>';
    return;
  }

  container.innerHTML = upcoming.map(r => `
    <li class="upcoming-item">
      <span class="upcoming-date">${r.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
      <span class="upcoming-text">${r.name}</span>
      <span class="badge badge-${r.card === 'platinum' ? 'platinum' : 'gold'}">${CARDS[r.card].short}</span>
    </li>
  `).join('');
}

function renderUnenrolled(checklist) {
  const enrollmentBenefits = BENEFITS.filter(b => b.enrollmentRequired);
  const unenrolled = enrollmentBenefits.filter(b => {
    const relatedTask = SETUP_TASKS.find(t => t.card === b.card && t.title.toLowerCase().includes(b.name.toLowerCase().split(' ')[0]));
    return !relatedTask || !checklist[relatedTask.id];
  });

  const container = document.getElementById('unenrolledList');
  if (unenrolled.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>All tracked enrollment steps are complete.</p></div>';
    return;
  }

  container.innerHTML = unenrolled.slice(0, 6).map(b => `
    <div class="unenrolled-item">
      <span>${b.name}</span>
      <span class="badge badge-${b.card === 'platinum' ? 'platinum' : 'gold'}">${CARDS[b.card].short}</span>
    </div>
  `).join('');
}

// ── Setup Checklist ──
function renderChecklist() {
  const checklist = StorageAdapter.get('amexos_checklist') || {};
  const container = document.getElementById('checklistContent');

  const groups = [
    { key: 'platinum', title: 'Platinum Card', tasks: SETUP_TASKS.filter(t => t.card === 'platinum') },
    { key: 'gold', title: 'Gold Card', tasks: SETUP_TASKS.filter(t => t.card === 'gold') }
  ];

  container.innerHTML = groups.map(group => {
    const done = group.tasks.filter(t => checklist[t.id]).length;
    return `
      <div class="checklist-group">
        <div class="checklist-group-header">
          <span class="badge badge-${group.key}">${group.title}</span>
          <span class="checklist-count">${done} / ${group.tasks.length} complete</span>
        </div>
        ${group.tasks.map(task => {
          const isDone = checklist[task.id];
          return `
            <div class="checklist-item ${isDone ? 'completed' : ''}">
              <div class="priority-dot ${task.priority}"></div>
              <div class="checklist-checkbox ${isDone ? 'checked' : ''}" onclick="toggleCheck('${task.id}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>
              </div>
              <div class="checklist-text">
                <div class="checklist-title">${task.title}</div>
                <div class="checklist-desc">${task.description}</div>
                ${task.link ? `<a class="checklist-link" href="${task.link}" target="_blank" rel="noopener">Open portal →</a>` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }).join('');
}

function toggleCheck(id) {
  const checklist = StorageAdapter.get('amexos_checklist') || {};
  checklist[id] = !checklist[id];
  StorageAdapter.set('amexos_checklist', checklist);
  renderChecklist();
}

// ── Benefits Database ──
function renderBenefits() {
  filterBenefits();
}

function setFilter(filter, el) {
  currentBenefitFilter = filter;
  document.querySelectorAll('#benefitFilters .filter-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  filterBenefits();
}

function filterBenefits() {
  const query = (document.getElementById('benefitSearch').value || '').toLowerCase();
  let filtered = BENEFITS;

  if (currentBenefitFilter !== 'all') {
    if (currentBenefitFilter === 'enrollment') {
      filtered = filtered.filter(b => b.enrollmentRequired);
    } else if (['monthly', 'quarterly', 'semiannual', 'annual'].includes(currentBenefitFilter)) {
      filtered = filtered.filter(b => b.cadence === currentBenefitFilter);
    } else {
      filtered = filtered.filter(b => b.card === currentBenefitFilter);
    }
  }

  if (query) {
    filtered = filtered.filter(b =>
      b.name.toLowerCase().includes(query) ||
      b.description.toLowerCase().includes(query) ||
      b.category.toLowerCase().includes(query) ||
      (b.caveats && b.caveats.toLowerCase().includes(query))
    );
  }

  const container = document.getElementById('benefitsList');
  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No benefits match your search.</p></div>';
    return;
  }

  container.innerHTML = filtered.map(b => `
    <div class="benefit-card" id="benefit-${b.id}">
      <div class="benefit-card-header">
        <span class="benefit-name">${b.name}</span>
        ${b.value ? `<span class="benefit-value">$${b.value.toLocaleString()}/yr</span>` : ''}
      </div>
      <div class="benefit-meta">
        <span class="badge badge-${b.card === 'platinum' ? 'platinum' : 'gold'}">${CARDS[b.card].short}</span>
        <span class="badge badge-muted">${cadenceLabel(b.cadence)}</span>
        ${b.enrollmentRequired ? '<span class="badge badge-orange">Enrollment Required</span>' : ''}
        <span class="badge badge-muted">${b.category}</span>
      </div>
      <div class="benefit-desc">${b.description}</div>
      <div class="benefit-details">
        <div class="benefit-detail-row">
          <span class="benefit-detail-label">Action</span>
          <span class="benefit-detail-value">${b.action}</span>
        </div>
        ${b.caveats ? `
          <div class="benefit-detail-row">
            <span class="benefit-detail-label">Caveats</span>
            <span class="benefit-detail-value">${b.caveats}</span>
          </div>
        ` : ''}
        ${b.portalLink ? `
          <div class="benefit-detail-row">
            <span class="benefit-detail-label">Portal</span>
            <span class="benefit-detail-value"><a href="${b.portalLink}" target="_blank" rel="noopener">${b.portalLink}</a></span>
          </div>
        ` : ''}
        <div class="benefit-detail-row">
          <span class="benefit-detail-label">Source</span>
          <span class="benefit-detail-value"><a href="${b.sourceUrl}" target="_blank" rel="noopener">${b.sourceLabel}</a></span>
        </div>
      </div>
      <button class="benefit-expand-btn" onclick="toggleBenefitExpand('${b.id}')">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"/></svg>
        <span>Details</span>
      </button>
    </div>
  `).join('');
}

function toggleBenefitExpand(id) {
  const card = document.getElementById('benefit-' + id);
  card.classList.toggle('expanded');
  const btn = card.querySelector('.benefit-expand-btn span');
  btn.textContent = card.classList.contains('expanded') ? 'Less' : 'Details';
}

function cadenceLabel(c) {
  const map = {
    'monthly': 'Monthly',
    'quarterly': 'Quarterly',
    'semiannual': 'Semiannual',
    'annual': 'Annual',
    'multi-year': 'Multi-Year',
    'ongoing': 'Ongoing'
  };
  return map[c] || c;
}

// ── Calendar ──
function renderCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const months = {};

  BENEFITS.forEach(b => {
    if (b.cadence === 'monthly') {
      for (let m = 0; m < 12; m++) {
        const key = m;
        if (!months[key]) months[key] = [];
        months[key].push({ name: b.name, card: b.card, type: 'Monthly reset', value: b.value ? `$${Math.round(b.value / 12)}` : null });
      }
    } else if (b.cadence === 'quarterly' && b.resetMonths) {
      b.resetMonths.forEach(m => {
        const key = m - 1;
        if (!months[key]) months[key] = [];
        months[key].push({ name: b.name, card: b.card, type: 'Quarterly reset', value: b.value ? `$${Math.round(b.value / 4)}` : null });
      });
    } else if (b.cadence === 'semiannual' && b.resetMonths) {
      b.resetMonths.forEach(m => {
        const key = m - 1;
        if (!months[key]) months[key] = [];
        months[key].push({ name: b.name, card: b.card, type: 'Semiannual reset', value: b.value ? `$${Math.round(b.value / 2)}` : null });
      });
    } else if (b.cadence === 'annual' && b.resetMonths) {
      b.resetMonths.forEach(m => {
        const key = m - 1;
        if (!months[key]) months[key] = [];
        months[key].push({ name: b.name, card: b.card, type: 'Annual reset', value: b.value ? `$${b.value}` : null });
      });
    }
  });

  // Add Rakuten payment dates
  const rakMonths = [1, 4, 7, 10]; // Feb, May, Aug, Nov (0-indexed)
  rakMonths.forEach(m => {
    if (!months[m]) months[m] = [];
    months[m].push({ name: 'Rakuten MR payout date (15th)', card: 'both', type: 'Rakuten', value: null });
  });

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const container = document.getElementById('calendarContent');
  let html = '<div class="calendar-timeline">';

  for (let m = 0; m < 12; m++) {
    const items = months[m] || [];
    if (items.length === 0) continue;
    const isPast = m < now.getMonth();
    const isCurrent = m === now.getMonth();

    html += `
      <div class="calendar-month" style="${isPast ? 'opacity:0.5' : ''}">
        <div class="calendar-month-header">
          ${isCurrent ? '● ' : ''}${monthNames[m]} ${year}
        </div>
        ${items.map(item => `
          <div class="calendar-item">
            <div class="calendar-dot" style="background:${item.card === 'platinum' ? 'var(--platinum)' : item.card === 'both' ? 'var(--blue)' : 'var(--gold)'}"></div>
            <span class="calendar-item-text">${item.name}${item.value ? ` — ${item.value}` : ''}</span>
            <span class="badge badge-${item.card === 'platinum' ? 'platinum' : item.card === 'both' ? 'blue' : 'gold'}">${item.card === 'both' ? 'Rakuten' : CARDS[item.card].short}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  html += '</div>';
  container.innerHTML = html;
}

// ── ICS Export ──
function downloadICS() {
  const year = new Date().getFullYear();
  let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Amex OS//Manual Control Center//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Amex OS Reminders
`;

  BENEFITS.forEach(b => {
    if (b.cadence === 'monthly') {
      for (let m = 0; m < 12; m++) {
        const d = new Date(year, m, 1);
        ics += makeEvent(b.name + ' — Use monthly credit', d, `${b.description}\n\nCard: ${CARDS[b.card].name}`, b.id + '-' + m);
      }
    } else if (b.cadence === 'quarterly' && b.resetMonths) {
      b.resetMonths.forEach((m, i) => {
        const d = new Date(year, m - 1, 1);
        ics += makeEvent(b.name + ' — Quarterly reset', d, `${b.description}\n\nCard: ${CARDS[b.card].name}`, b.id + '-q' + i);
      });
    } else if (b.cadence === 'semiannual' && b.resetMonths) {
      b.resetMonths.forEach((m, i) => {
        const d = new Date(year, m - 1, 1);
        ics += makeEvent(b.name + ' — Semiannual window opens', d, `${b.description}\n\nCard: ${CARDS[b.card].name}`, b.id + '-s' + i);
      });
    }
  });

  // Add Rakuten payment dates
  const rakDates = [[1, 15], [4, 15], [7, 15], [10, 15]];
  rakDates.forEach(([m, d], i) => {
    const date = new Date(year, m, d);
    ics += makeEvent('Rakuten MR Payout — Check confirmed points', date, 'Confirmed points over 500 will transfer to your Membership Rewards account.', 'rakuten-pay-' + i);
  });

  ics += 'END:VCALENDAR';

  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `amex-os-reminders-${year}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

function makeEvent(summary, date, description, uid) {
  const ds = formatICSDate(date);
  const de = formatICSDate(new Date(date.getTime() + 86400000));
  return `BEGIN:VEVENT
DTSTART;VALUE=DATE:${ds}
DTEND;VALUE=DATE:${de}
SUMMARY:${escapeICS(summary)}
DESCRIPTION:${escapeICS(description)}
UID:${uid}@amex-os
BEGIN:VALARM
TRIGGER:-PT9H
ACTION:DISPLAY
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
`;
}

function formatICSDate(d) {
  return d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0');
}

function escapeICS(str) {
  return str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

// ── Vault ──
function renderVault() {
  const entries = StorageAdapter.get('amexos_vault') || [];
  const container = document.getElementById('vaultEntries');

  if (entries.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        <p>No entries yet. Add your first claimed benefit to start tracking.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = entries.map((entry, i) => {
    const benefit = BENEFITS.find(b => b.id === entry.benefitId);
    const benefitName = benefit ? benefit.name : entry.benefitId;
    const card = benefit ? benefit.card : 'platinum';

    return `
      <div class="vault-entry">
        <div class="vault-entry-header">
          <span class="vault-entry-title">${benefitName}</span>
          <span class="badge badge-${card === 'platinum' ? 'platinum' : 'gold'}">${card === 'platinum' ? 'Platinum' : 'Gold'}</span>
        </div>
        ${entry.date ? `
          <div class="vault-field">
            <span class="vault-field-label">Date</span>
            <span class="vault-field-value">${entry.date}</span>
          </div>
        ` : ''}
        ${entry.amount ? `
          <div class="vault-field">
            <span class="vault-field-label">Amount</span>
            <span class="vault-field-value">$${parseFloat(entry.amount).toFixed(2)}</span>
          </div>
        ` : ''}
        ${entry.username ? `
          <div class="vault-field">
            <span class="vault-field-label">Login</span>
            <span class="vault-field-value masked" id="vault-user-${i}">••••••••</span>
            <button class="vault-reveal-btn" onclick="toggleMask('vault-user-${i}', '${escapeAttr(entry.username)}')">Reveal</button>
          </div>
        ` : ''}
        ${entry.notes ? `
          <div class="vault-field">
            <span class="vault-field-label">Notes</span>
            <span class="vault-field-value">${escapeHtml(entry.notes)}</span>
          </div>
        ` : ''}
        <button class="btn btn-sm" style="margin-top:8px;color:var(--red);border-color:var(--red-bg);" onclick="deleteVaultEntry(${i})">Delete</button>
      </div>
    `;
  }).join('');
}

function toggleVaultForm() {
  const form = document.getElementById('vaultForm');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function saveVaultEntry() {
  const benefitId = document.getElementById('vaultBenefit').value;
  const date = document.getElementById('vaultDate').value;
  const amount = document.getElementById('vaultAmount').value;
  const username = document.getElementById('vaultUsername').value;
  const notes = document.getElementById('vaultNotes').value;

  if (!benefitId) {
    alert('Please select a benefit.');
    return;
  }

  const entries = StorageAdapter.get('amexos_vault') || [];
  entries.push({ benefitId, date, amount, username, notes, createdAt: new Date().toISOString() });
  StorageAdapter.set('amexos_vault', entries);

  document.getElementById('vaultBenefit').value = '';
  document.getElementById('vaultDate').value = '';
  document.getElementById('vaultAmount').value = '';
  document.getElementById('vaultUsername').value = '';
  document.getElementById('vaultNotes').value = '';
  toggleVaultForm();

  renderVault();
}

function deleteVaultEntry(index) {
  if (!confirm('Delete this vault entry?')) return;
  const entries = StorageAdapter.get('amexos_vault') || [];
  entries.splice(index, 1);
  StorageAdapter.set('amexos_vault', entries);
  renderVault();
}

function toggleMask(elementId, value) {
  const el = document.getElementById(elementId);
  if (el.classList.contains('masked')) {
    el.classList.remove('masked');
    el.textContent = value;
  } else {
    el.classList.add('masked');
    el.textContent = '••••••••';
  }
}

// ── Travel Tools ──
function renderTravel() {
  filterTravel();
}

function setTravelFilter(filter, el) {
  currentTravelFilter = filter;
  document.querySelectorAll('#travelFilters .filter-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  filterTravel();
}

function filterTravel() {
  let filtered = TRAVEL_TOOLS;
  if (currentTravelFilter !== 'all') {
    filtered = filtered.filter(t => t.category === currentTravelFilter);
  }

  const container = document.getElementById('travelTools');
  container.innerHTML = filtered.map(t => `
    <div class="tool-card">
      <div class="tool-card-header">
        <span class="tool-name"><a href="${t.url}" target="_blank" rel="noopener">${t.name}</a></span>
        <span class="badge badge-muted">${t.category}</span>
      </div>
      <div class="tool-desc">${t.description}</div>
    </div>
  `).join('');
}

// ── Tips ──
function renderTips() {
  filterTips();
}

function setTipFilter(filter, el) {
  currentTipFilter = filter;
  document.querySelectorAll('#tipsFilters .filter-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  filterTips();
}

function filterTips() {
  let filtered = TIPS;
  if (currentTipFilter !== 'all') {
    if (['official', 'editor-tested', 'community', 'dead'].includes(currentTipFilter)) {
      filtered = filtered.filter(t => t.evidence === currentTipFilter);
    } else {
      filtered = filtered.filter(t => t.card === currentTipFilter || t.card === 'both');
    }
  }

  const container = document.getElementById('tipsList');
  container.innerHTML = filtered.map(t => {
    const ev = EVIDENCE_LEVELS[t.evidence];
    return `
      <div class="tip-card ${t.evidence === 'dead' ? 'dead' : ''}">
        <div class="tip-header">
          <span class="tip-title">${t.title}</span>
          <span class="badge" style="background:${ev.bg};color:${ev.color}">${ev.label}</span>
        </div>
        <div class="tip-desc">${t.description}</div>
        <div class="tip-meta" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;">
          ${t.card !== 'both' ? `<span class="badge badge-${t.card === 'platinum' ? 'platinum' : 'gold'}">${CARDS[t.card] ? CARDS[t.card].short : 'Both'}</span>` : '<span class="badge badge-muted">Both Cards</span>'}
        </div>
        <div class="tip-source">
          Source: <a href="${t.sourceUrl}" target="_blank" rel="noopener">${t.sourceLabel}</a>
        </div>
      </div>
    `;
  }).join('');
}

// ── Sources ──
function renderSources() {
  filterSources();
}

function setSourceFilter(filter, el) {
  currentSourceFilter = filter;
  document.querySelectorAll('#sourceFilters .filter-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  filterSources();
}

function filterSources() {
  let filtered = SOURCES;
  if (currentSourceFilter !== 'all') {
    filtered = filtered.filter(s => s.type === currentSourceFilter);
  }

  const container = document.getElementById('sourcesList');
  container.innerHTML = filtered.map(s => {
    const typeLabel = { 'official': 'AX', 'third-party': 'TP', 'community': 'CM' }[s.type] || '?';
    return `
      <div class="source-card">
        <div class="source-icon ${s.type}">${typeLabel}</div>
        <div class="source-text">
          <div class="source-title"><a href="${s.url}" target="_blank" rel="noopener">${s.title}</a></div>
          <div class="source-desc">${s.description}</div>
          <div class="source-url">${s.url}</div>
        </div>
        <span class="badge badge-${s.type === 'official' ? 'green' : s.type === 'third-party' ? 'blue' : 'orange'}">${s.type === 'official' ? 'Official' : s.type === 'third-party' ? 'Third-Party' : 'Community'}</span>
      </div>
    `;
  }).join('');
}

// ============================================================
// NEW VIEWS
// ============================================================

// ── Best Card View ──
function renderBestCard() {
  const container = document.getElementById('bestCardContent');

  container.innerHTML = BEST_CARD_DECISIONS.map(d => {
    const rec = d.recommended === 'varies' ? 'Varies' :
                d.recommended === 'gold' ? 'Use Gold' : 'Use Platinum';
    const recClass = d.recommended === 'gold' ? 'badge-gold' :
                     d.recommended === 'platinum' ? 'badge-platinum' : 'badge-muted';

    return `
      <div class="bestcard-card" id="bc-${d.id}">
        <div class="bestcard-header">
          <span class="bestcard-icon">${d.icon}</span>
          <div class="bestcard-title-group">
            <span class="bestcard-category">${d.category}</span>
            <span class="badge ${recClass}">${rec}</span>
          </div>
        </div>
        <div class="bestcard-why">${d.why}</div>
        <div class="bestcard-details">
          <div class="bestcard-row">
            <span class="bestcard-label">Earn</span>
            <span>${d.earn}</span>
          </div>
          <div class="bestcard-row">
            <span class="bestcard-label">Exceptions</span>
            <span>${d.exceptions}</span>
          </div>
          <div class="bestcard-row bestcard-rakuten-note">
            <span class="bestcard-label">Rakuten</span>
            <span>${d.rakutenNote}</span>
          </div>
        </div>
        <button class="benefit-expand-btn" onclick="toggleBCExpand('${d.id}')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"/></svg>
          <span>Details</span>
        </button>
      </div>
    `;
  }).join('');
}

function toggleBCExpand(id) {
  const card = document.getElementById('bc-' + id);
  card.classList.toggle('expanded');
  const btn = card.querySelector('.benefit-expand-btn span');
  btn.textContent = card.classList.contains('expanded') ? 'Less' : 'Details';
}

// ── Action Center View ──
function renderActions() {
  const container = document.getElementById('actionsContent');
  const actions = getActionItems();

  if (actions.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No actions needed right now. You\'re all caught up!</p></div>';
    return;
  }

  const grouped = {
    high: actions.filter(a => a.priority === 'high'),
    medium: actions.filter(a => a.priority === 'medium'),
    low: actions.filter(a => a.priority === 'low')
  };

  let html = '';
  const labels = { high: 'Do Now', medium: 'This Week', low: 'Ongoing' };

  for (const [pri, items] of Object.entries(grouped)) {
    if (items.length === 0) continue;
    html += `
      <div class="action-group">
        <div class="action-group-header">
          <div class="priority-dot ${pri}"></div>
          <span>${labels[pri]}</span>
        </div>
        ${items.map(a => `
          <div class="action-item">
            <div class="action-item-content">
              <div class="action-item-title">${a.title}</div>
              <div class="action-item-desc">${a.desc}</div>
            </div>
            ${a.card !== 'both' ? `<span class="badge badge-${a.card === 'platinum' ? 'platinum' : 'gold'}">${CARDS[a.card] ? CARDS[a.card].short : ''}</span>` : '<span class="badge badge-blue">Both</span>'}
          </div>
        `).join('')}
      </div>
    `;
  }

  container.innerHTML = html;
}

// ── Rakuten View ──
function renderRakuten() {
  const rak = getRakutenData();
  const container = document.getElementById('rakutenContent');

  // Rules section
  const rulesHtml = `
    <div class="card" style="margin-bottom:20px;">
      <div class="card-header">
        <span class="card-title">Rakuten MR Rules</span>
      </div>
      <div class="rakuten-rules-grid">
        <div class="rakuten-rule">
          <div class="rakuten-rule-label">Conversion</div>
          <div class="rakuten-rule-value">${RAKUTEN_RULES.conversion}</div>
        </div>
        <div class="rakuten-rule">
          <div class="rakuten-rule-label">Minimum Transfer</div>
          <div class="rakuten-rule-value">${RAKUTEN_RULES.minimumTransfer}</div>
        </div>
        <div class="rakuten-rule">
          <div class="rakuten-rule-label">Carry-Over</div>
          <div class="rakuten-rule-value">${RAKUTEN_RULES.carryOver}</div>
        </div>
        <div class="rakuten-rule">
          <div class="rakuten-rule-label">First Transfer</div>
          <div class="rakuten-rule-value">${RAKUTEN_RULES.firstTransfer}</div>
        </div>
        <div class="rakuten-rule">
          <div class="rakuten-rule-label">Link Requirement</div>
          <div class="rakuten-rule-value">${RAKUTEN_RULES.linkRequirement}</div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom:20px;">
      <div class="card-header">
        <span class="card-title">Quarterly Payment Dates</span>
      </div>
      <div class="rakuten-dates">
        ${RAKUTEN_RULES.paymentDates.map(p => `
          <div class="rakuten-date-row">
            <span class="rakuten-date">${p.date}</span>
            <span class="rakuten-quarter">${p.quarter}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="card" style="margin-bottom:20px;">
      <div class="card-header">
        <span class="card-title">Confirmation Windows</span>
      </div>
      <div class="rakuten-dates">
        ${RAKUTEN_RULES.confirmationWindows.map(c => `
          <div class="rakuten-date-row">
            <span class="rakuten-date">${c.type}</span>
            <span class="rakuten-quarter">${c.window}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="card" style="margin-bottom:20px;">
      <div class="card-header">
        <span class="card-title">Stacking Notes</span>
      </div>
      <ul class="rakuten-notes-list">
        ${RAKUTEN_RULES.stackingNotes.map(n => `<li>${n}</li>`).join('')}
      </ul>
    </div>
  `;

  // Manual tracker section
  const trackerHtml = `
    <div class="card">
      <div class="card-header">
        <span class="card-title">Your Rakuten Tracker</span>
      </div>
      <div class="rakuten-tracker-form">
        <div class="form-row">
          <label>
            <input type="checkbox" ${rak.linked ? 'checked' : ''} onchange="updateRakutenField('linked', this.checked)">
            MR account linked in Rakuten
          </label>
        </div>
        <div class="form-row">
          <label>Pending Cash Back ($)</label>
          <input type="number" step="0.01" value="${rak.pendingCashback || 0}" onchange="updateRakutenField('pendingCashback', parseFloat(this.value) || 0)" placeholder="0.00">
        </div>
        <div class="form-row">
          <label>Confirmed Points</label>
          <input type="number" value="${rak.confirmedPoints || 0}" onchange="updateRakutenField('confirmedPoints', parseInt(this.value) || 0)" placeholder="0">
        </div>
        <div class="form-row">
          <label>Lifetime MR Transferred</label>
          <input type="number" value="${rak.lifetimeMRTransferred || 0}" onchange="updateRakutenField('lifetimeMRTransferred', parseInt(this.value) || 0)" placeholder="0">
        </div>
        <div class="form-row">
          <label>Notes</label>
          <textarea class="vault-textarea" onchange="updateRakutenField('notes', this.value)" placeholder="Optional notes...">${rak.notes || ''}</textarea>
        </div>
      </div>
      ${rak.confirmedPoints > 500 ? '<div class="rakuten-transfer-badge"><span class="badge badge-green">501+ confirmed — eligible for next payout</span></div>' : '<div class="rakuten-transfer-badge"><span class="badge badge-orange">Under 501 confirmed — will carry over</span></div>'}
    </div>
  `;

  container.innerHTML = rulesHtml + trackerHtml;
}

function updateRakutenField(field, value) {
  const rak = getRakutenData();
  rak[field] = value;
  StorageAdapter.set('amexos_rakuten', rak);
  renderRakuten();
}

// ── Portfolio View ──
function renderPortfolio() {
  const portfolio = getPortfolio();
  const m = calcPortfolioMath();
  const container = document.getElementById('portfolioContent');

  container.innerHTML = `
    <div class="stats-grid" style="margin-bottom:24px;">
      <div class="stat-card">
        <div class="stat-label">Total Fees Paid</div>
        <div class="stat-value">$${m.totalFees.toLocaleString()}</div>
        <div class="stat-sub">Platinum + Gold</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Credits Captured</div>
        <div class="stat-value">$${m.capturedValue.toLocaleString()}</div>
        <div class="stat-sub">from vault entries</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Effective Fee</div>
        <div class="stat-value" style="${m.effectiveFee <= 0 ? 'color:var(--green)' : ''}">${m.effectiveFee <= 0 ? '-' : ''}$${Math.abs(m.effectiveFee).toLocaleString()}</div>
        <div class="stat-sub">fees minus captured</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Points Value</div>
        <div class="stat-value">$${m.totalPointValue.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
        <div class="stat-sub">${m.totalPoints.toLocaleString()} pts</div>
      </div>
    </div>

    <div class="widgets-grid">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Platinum Card</span>
          <span class="badge badge-platinum">Platinum</span>
        </div>
        <div class="portfolio-form">
          <div class="form-row">
            <label>Annual Fee Paid ($)</label>
            <input type="number" value="${portfolio.platinum.annualFeePaid}" onchange="updatePortfolioField('platinum', 'annualFeePaid', parseFloat(this.value) || 0)">
          </div>
          <div class="form-row">
            <label>Points Balance</label>
            <input type="number" value="${portfolio.platinum.pointsBalance}" onchange="updatePortfolioField('platinum', 'pointsBalance', parseInt(this.value) || 0)">
          </div>
          <div class="form-row">
            <label>¢ per Point Valuation</label>
            <input type="number" step="0.1" value="${portfolio.platinum.cppValuation}" onchange="updatePortfolioField('platinum', 'cppValuation', parseFloat(this.value) || 2.0)">
          </div>
          <div class="form-row">
            <label>Notes</label>
            <textarea class="vault-textarea" onchange="updatePortfolioField('platinum', 'notes', this.value)">${portfolio.platinum.notes || ''}</textarea>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Gold Card</span>
          <span class="badge badge-gold">Gold</span>
        </div>
        <div class="portfolio-form">
          <div class="form-row">
            <label>Annual Fee Paid ($)</label>
            <input type="number" value="${portfolio.gold.annualFeePaid}" onchange="updatePortfolioField('gold', 'annualFeePaid', parseFloat(this.value) || 0)">
          </div>
          <div class="form-row">
            <label>Points Balance</label>
            <input type="number" value="${portfolio.gold.pointsBalance}" onchange="updatePortfolioField('gold', 'pointsBalance', parseInt(this.value) || 0)">
          </div>
          <div class="form-row">
            <label>¢ per Point Valuation</label>
            <input type="number" step="0.1" value="${portfolio.gold.cppValuation}" onchange="updatePortfolioField('gold', 'cppValuation', parseFloat(this.value) || 2.0)">
          </div>
          <div class="form-row">
            <label>Notes</label>
            <textarea class="vault-textarea" onchange="updatePortfolioField('gold', 'notes', this.value)">${portfolio.gold.notes || ''}</textarea>
          </div>
        </div>
      </div>

      <div class="card widget-full">
        <div class="card-header">
          <span class="card-title">Rakuten Summary</span>
          <span class="badge badge-blue">Rakuten</span>
        </div>
        <div class="portfolio-rakuten-summary">
          <div class="vault-field">
            <span class="vault-field-label">Pending $</span>
            <span class="vault-field-value">$${m.rakPendingValue.toFixed(2)}</span>
          </div>
          <div class="vault-field">
            <span class="vault-field-label">Confirmed Pts</span>
            <span class="vault-field-value">${m.rakConfirmedPts.toLocaleString()}</span>
          </div>
          <div class="vault-field">
            <span class="vault-field-label">Lifetime MR</span>
            <span class="vault-field-value">${m.rakLifetimeMR.toLocaleString()}</span>
          </div>
          <button class="btn btn-sm" style="margin-top:10px;" onclick="navigate('rakuten')">Edit Rakuten Details →</button>
        </div>
      </div>
    </div>
  `;
}

function updatePortfolioField(card, field, value) {
  const portfolio = getPortfolio();
  portfolio[card][field] = value;
  StorageAdapter.set('amexos_portfolio', portfolio);
  renderPortfolio();
}

// ── Onboarding View ──
function renderOnboarding() {
  const ob = StorageAdapter.get('amexos_onboarding') || {};
  const container = document.getElementById('onboardingContent');

  const done = ONBOARDING_STEPS.filter(s => ob[s.id]).length;
  const total = ONBOARDING_STEPS.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  container.innerHTML = `
    <div class="card" style="margin-bottom:20px;">
      <div class="card-header">
        <span class="card-title">Onboarding Progress</span>
        <span class="checklist-count">${done} / ${total}</span>
      </div>
      <div class="progress-bar-track">
        <div class="progress-bar-fill platinum" style="width:${pct}%"></div>
      </div>
    </div>

    ${ONBOARDING_STEPS.map(step => {
      const isDone = ob[step.id];
      return `
        <div class="checklist-item ${isDone ? 'completed' : ''}">
          <div class="priority-dot ${step.priority}"></div>
          <div class="checklist-checkbox ${isDone ? 'checked' : ''}" onclick="toggleOnboarding('${step.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg>
          </div>
          <div class="checklist-text">
            <div class="checklist-title">${step.title}</div>
            <div class="checklist-desc">${step.desc}</div>
          </div>
        </div>
      `;
    }).join('')}
  `;
}

function toggleOnboarding(id) {
  const ob = StorageAdapter.get('amexos_onboarding') || {};
  ob[id] = !ob[id];
  StorageAdapter.set('amexos_onboarding', ob);
  renderOnboarding();
}

// ── Global Search ──
function openSearch() {
  document.getElementById('searchOverlay').classList.add('active');
  document.getElementById('globalSearchInput').value = '';
  document.getElementById('globalSearchInput').focus();
  document.getElementById('searchResults').innerHTML = '<div class="search-hint">Type to search across all benefits, tips, and tools…</div>';
}

function closeSearch(e) {
  if (e && e.target !== document.getElementById('searchOverlay')) return;
  document.getElementById('searchOverlay').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('searchOverlay')) {
      document.getElementById('searchOverlay').classList.remove('active');
    }
  });
});

function globalSearch(query) {
  const q = query.toLowerCase().trim();
  const results = [];

  if (q.length < 2) {
    document.getElementById('searchResults').innerHTML = '<div class="search-hint">Type to search across all benefits, tips, and tools…</div>';
    return;
  }

  // Search benefits
  BENEFITS.forEach(b => {
    if (b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)) {
      results.push({ title: b.name, sub: `${CARDS[b.card].short} — ${b.category}`, view: 'benefits', badge: b.card });
    }
  });

  // Search tips
  TIPS.forEach(t => {
    if (t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) {
      results.push({ title: t.title, sub: `Tip — ${EVIDENCE_LEVELS[t.evidence].label}`, view: 'tips', badge: t.card === 'both' ? null : t.card });
    }
  });

  // Search tools
  TRAVEL_TOOLS.forEach(t => {
    if (t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) {
      results.push({ title: t.name, sub: `Tool — ${t.category}`, view: 'travel', badge: null });
    }
  });

  // Search setup tasks
  SETUP_TASKS.forEach(t => {
    if (t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) {
      results.push({ title: t.title, sub: `Setup — ${CARDS[t.card].short}`, view: 'checklist', badge: t.card });
    }
  });

  // Search best-card decisions
  BEST_CARD_DECISIONS.forEach(d => {
    if (d.category.toLowerCase().includes(q) || d.why.toLowerCase().includes(q)) {
      results.push({ title: d.category, sub: 'Best Card Decision', view: 'bestcard', badge: d.recommended !== 'varies' ? d.recommended : null });
    }
  });

  const container = document.getElementById('searchResults');
  if (results.length === 0) {
    container.innerHTML = '<div class="search-hint">No results found.</div>';
    return;
  }

  container.innerHTML = results.slice(0, 12).map(r => `
    <div class="search-result-item" onclick="navigate('${r.view}'); document.getElementById('searchOverlay').classList.remove('active');">
      <div class="search-result-text">
        <div class="search-result-title">${r.title}</div>
        <div class="search-result-sub">${r.sub}</div>
      </div>
      ${r.badge ? `<span class="search-result-badge badge badge-${r.badge === 'platinum' ? 'platinum' : 'gold'}">${CARDS[r.badge].short}</span>` : ''}
    </div>
  `).join('');
}

// ── Export / Import ──
function exportAllData() {
  const json = StorageAdapter.exportJSON();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `amex-os-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData() {
  document.getElementById('importFileInput').click();
}

function handleImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const success = StorageAdapter.importJSON(e.target.result);
    if (success) {
      alert('Data imported successfully!');
      navigate(currentView);
    } else {
      alert('Import failed. Please check the file format.');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

// ── Utility ──
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// ── Boot ──
document.addEventListener('DOMContentLoaded', init);
