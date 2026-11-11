# Pumpkin Night — Family Halloween Night Planner

A one-page web app that helps a family plan Halloween night: a trick-or-treat
route, costume ideas that fit the whole family, a photo album of past
Halloweens, and a packing checklist with a countdown to October 31.

Built for **Kiroween 2026** (category: Costume Contest). Entrant: Na Sojung
(solo). This is a new project, created during the submission period.

## Features

- **Trick-or-treat route** — add stops with a name, minutes, a note, and a
  safety note. Reorder stops with up/down buttons, remove them, and see the
  total route time.
- **Costume matcher** — add family members (name, age group, one interest).
  The app ranks seven family themes by how many members they match and
  suggests a costume for each person.
- **Photo memory album** — upload photos from your device. Each photo is
  shrunk to a small thumbnail before it is saved, with a caption and a year.
  Up to 24 photos.
- **Night-of checklist + countdown** — ten pre-filled packing items, check
  them off as you pack, add your own items, and a live countdown to the next
  October 31 at 6:00 PM.
- **Spooky look** — dark theme, orange and purple, pumpkin and ghost marks
  drawn in the page (no external images). Works on phones and desktops.

## How to run locally

No build step, no install, no server code. Either:

```sh
# Option 1: open the file directly
open index.html

# Option 2: serve the folder (needed for full localStorage behaviour in
# some browsers when opening from file://)
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Tech

- Plain HTML, CSS, and JavaScript. No frameworks, no libraries.
- No network requests: no fonts, no images, no scripts from other sites.
- All data is stored in the browser only, under one localStorage key
  (`pumpkinNight.v1`). No account, no server, no tracking.
- Photos are downscaled in the browser (canvas, max 320 px, JPEG 0.72)
  before saving, so they fit in localStorage.

## How Kiro specs were used

The repo root contains a `.kiro` directory, as the hackathon rules require:

- `.kiro/steering/` — product, tech, and structure notes for the app.
- `.kiro/specs/pumpkin-night/` — `requirements.md` (user stories with
  acceptance criteria), `design.md` (architecture and data model), and
  `tasks.md` (the build checklist, all done).
- `.kiro/hooks/hooks.json` — a hook that runs a syntax check on `app.js`
  when app files are saved.

The app was built to match the spec: every requirement has acceptance
criteria, and each one was checked in a headless browser before this README
was written.

## Status

Working local app. Tested in headless Chromium: every control works, data
persists across reload, no console errors, and the layout holds at mobile
and desktop widths. Not yet deployed, and not yet submitted to Devpost.
