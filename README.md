# Amex OS — Benefits Portal

Personal command center for maximizing American Express Platinum and Gold card benefits.

## Features

- **Dashboard** — KPI overview, setup progress, upcoming resets, quick actions
- **Setup Checklist** — Card-by-card onboarding with priority levels and portal links
- **Benefits Database** — Searchable/filterable database of all Platinum & Gold benefits
- **Calendar & Resets** — Timeline view of all benefit reset dates with ICS export
- **My Vault** — Local-only tracking for claimed benefits, credentials, and notes (masked fields, JSON export/import)
- **Travel & Points Tools** — Curated link hub for FHR, point.me, Resy, CLEAR, and more
- **Tips & Data Points** — Evidence-labeled strategies (Official, Editor-Tested, Community, Dead/Unreliable)
- **Sources** — Full source library with official Amex docs, editorial guides, and community references

## Tech Stack

- Pure HTML, CSS, JavaScript (no build step)
- localStorage with graceful in-memory fallback
- Mobile-first responsive design
- Hash-based routing

## Run Locally

Any static file server works:

```bash
# Python
cd amex-portal
python3 -m http.server 8000

# Node.js (npx)
npx serve .

# VS Code Live Server extension also works
```

Then open http://localhost:8000

## Deploy to Vercel

1. Push this folder to a GitHub repository
2. Import the repo in Vercel
3. Set:
   - **Framework Preset**: Other
   - **Output Directory**: `.` (root)
   - **Build Command**: (leave empty)
4. Deploy

Alternatively, install the Vercel CLI:

```bash
npm i -g vercel
cd amex-portal
vercel
```

## Deploy to Any Static Host

This is a pure static site. Upload the entire folder (index.html, css/, js/) to any static host:
- Netlify (drag and drop)
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront

## Data Storage

All user data (checklist progress, vault entries) is stored in `localStorage`. If localStorage is unavailable (e.g., some embedded/private contexts), the app falls back to in-memory storage with a visible warning.

Use **Export JSON** to back up your data and **Import JSON** to restore it on another device or browser.

## File Structure

```
amex-portal/
├── index.html          # Main app entry point
├── css/
│   └── style.css       # All styles (mobile-first)
├── js/
│   ├── data.js         # Structured benefits, tips, sources, tools data
│   ├── storage.js      # localStorage adapter with fallback
│   └── app.js          # App logic, routing, rendering
└── README.md           # This file
```

## Content Sources

All benefit data is sourced from official Amex documentation and reputable third-party sources. See the Sources section in the app for the full list with URLs. Tips and strategies are clearly labeled with evidence levels:

- **Official** — Confirmed by Amex terms
- **Editor-Tested** — Verified by trusted editorial sources
- **Community Reported** — User-reported, not guaranteed
- **Dead / Unreliable** — Previously worked but no longer reliable
