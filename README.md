# Nercessian's PR Tracker

A desktop app for tracking gym personal records — built with **Electron + React**.
Log PRs, visualize progress over time, and track body weight changes. Fully offline, no account needed.

---

## Features

- **Exercise Library** — 70+ preloaded exercises across 8 categories (Chest, Back, Shoulders, Arms, Legs, Core, Olympic/Powerlifting, Cardio). Add your own custom exercises too.
- **PR Logging** — Log weight, reps, date, and an optional note for any exercise. Full history stored, not just the latest.
- **Progress Charts** — Line graphs per exercise showing weight or estimated 1RM over time (Epley formula).
- **Dashboard** — Spotlight graphs for top lifts, recent activity feed, monthly PR count, and body stats at a glance.
- **Body Weight Tracking** — Log body weight over time with its own history chart.
- **Profile Setup** — Name, height, and preferred units (kg/lbs, cm/ft).
- **Search & Filter** — Search by name, filter by category, sort alphabetically or by most recently updated.
- **CSV Export** — Export all PR data to a `.csv` file with one click.
- **Fully Offline** — All data stored locally. No internet, no account, no cloud.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Desktop shell | Electron 28 |
| UI | React 18 |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Data persistence | electron-store (local JSON) |
| Bundler | Webpack 5 + Babel |
| Installer | electron-builder (NSIS) |

---

## Getting Started

### Prerequisites

- [Node.js LTS](https://nodejs.org) (v18 or later)

### Install & Run

```bash
git clone https://github.com/YOUR_USERNAME/nercessians-pr-tracker.git
cd nercessians-pr-tracker
npm install
npm start
```

### Build Windows Installer

```bash
npm run build
```

The `.exe` installer will be output to `release/`.

---

## Scripts

| Command | Description |
|---|---|
| `npm start` | Run in development mode |
| `npm run build` | Build Windows `.exe` installer |
| `npm run pack` | Build unpacked app (faster, no installer) |

---

## Data Storage

All data is stored locally at:

```
%APPDATA%\pr-tracker-data\config.json
```

No data ever leaves your device.
