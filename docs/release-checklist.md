# Release Checklist

Use this checklist before publishing a Windows build.

## Before Building

- Confirm `package.json` has the intended version.
- Run `npm install` so `package-lock.json` is current.
- Run `npm run webpack:build`.
- Open the app with `npm start` and smoke-test dashboard, exercises, profile, CSV export, and modals.

## Build

```bash
npm run build
```

Expected output in `release/`:

- `Nercessian's PR Tracker Setup *.exe` for the installer.
- `Nercessian's PR Tracker *.exe` for the portable app.

## Publish

- Upload the portable `.exe` first for users who do not want to install anything.
- Upload the installer `.exe` second for users who want Start Menu and desktop shortcuts.
- Include the version, headline changes, and known limitations in the release notes.

## Smoke Test The Artifact

- Launch the portable `.exe`.
- Add a test exercise.
- Log a PR.
- Export CSV.
- Close and reopen the app to confirm local persistence.
