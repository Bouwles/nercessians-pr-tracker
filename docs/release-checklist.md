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
- `Nercessians-PR-Tracker-*-windows-portable.zip` as a no-install fallback containing the runnable app folder.

If Electron Builder fails while unpacking `winCodeSign` with a Windows symlink permission error, the app may still be available under `release/win-unpacked/`. Zip that folder and publish the zip as the portable release. Users can extract it and run `Nercessian's PR Tracker.exe`.

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
