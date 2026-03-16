# Landstorm Contracting — Pipeline Dashboard

Internal lead, estimate, and bid tracking dashboard for Landstorm Contracting (Carp, Ontario).

## Features

- **Dashboard overview** — Total leads, pending bids, jobs won, pipeline value
- **Pipeline breakdown** — Visual stage bar with value by stage
- **Follow-up alerts** — Highlights upcoming (7-day) and overdue follow-ups
- **Full CRUD** — Add, edit, delete leads with all fields
- **Stage management** — One-click stage updates from the edit modal
- **Filter & search** — Filter by stage, search by company/project/notes
- **Sortable table** — Sort by company, value, or follow-up date
- **Persistent storage** — Data saved in browser localStorage

## Fields

Each record stores:
- Company Name
- Project Name
- Estimated Value
- Project Stage (Lead → Quoted → Bid Submitted → Won / Lost)
- Follow-Up Date
- Notes

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2: GitHub + Vercel Dashboard
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repo — Vercel auto-detects Next.js
4. Click Deploy

No environment variables required. Data is stored in the user's browser localStorage.

## Tech Stack

- **Next.js 15** (App Router)
- **Tailwind CSS v4**
- **React 19**
- **localStorage** for persistence (no backend required)

## Folder Structure

```
landstorm-dashboard/
├── app/
│   ├── globals.css       # Global styles, fonts, design tokens
│   ├── layout.js         # Root layout
│   └── page.js           # Main dashboard (client component)
├── components/
│   ├── StatCard.jsx      # Metric cards (total leads, pipeline, etc.)
│   ├── StageBadge.jsx    # Coloured stage pill
│   ├── PipelineBar.jsx   # Stage breakdown bar + legend
│   ├── AddLeadModal.jsx  # New lead form modal
│   └── EditLeadModal.jsx # Edit / update / delete modal
├── lib/
│   └── data.js           # Seed data, stage config, helpers
├── next.config.mjs
├── postcss.config.mjs
├── package.json
├── vercel.json
└── .gitignore
```
