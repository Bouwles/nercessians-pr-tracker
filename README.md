# Nercessian's PR Tracker

A dark-themed desktop app for tracking gym personal records, built with **Electron + React**.
Log PRs, visualize progress over time, and track body weight changes. Fully offline, no account needed.

---

## Features

- **Exercise Library**: 70+ preloaded exercises across 8 categories. Add custom exercises too.
- **PR Logging**: Log weight, reps, date, and an optional note for any exercise.
- **Progress Charts**: Line graphs per exercise showing weight or estimated 1RM.
- **Dashboard**: Spotlight graphs for top lifts, recent activity, monthly PR count, and body stats.
- **Body Weight Tracking**: Log body weight over time with its own chart.
- **Profile Setup**: Name, height, and preferred units.
- **Search & Filter**: Search by name, filter by category, and sort the library.
- **CSV Export**: Export all PR data to a `.csv` file.
- **Fully Offline**: Local storage only. No account, no cloud.

---

## Tech Stack

| Layer | Tech |
| --- | --- |
| Desktop shell | Electron 28 |
| UI | React 18 |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Data persistence | electron-store |
| Bundler | Webpack 5 + Babel |
| Installer | electron-builder |

---

## Getting Started

```bash
npm install
npm start
```

## Build Windows Installer

```bash
npm run build
```

The `.exe` installer will be output to `release/`.

---

## Made by Paul Nercessian
