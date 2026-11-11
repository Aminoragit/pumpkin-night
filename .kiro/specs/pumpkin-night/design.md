# Design — Pumpkin Night

## Overview
A single static page (`index.html` + `styles.css` + `app.js`). No build step,
no framework, no backend. The page loads, reads one localStorage key, renders
four sections from that state, and writes the key back after every change.

## Architecture

```
index.html  — structure and labels; loads styles.css and app.js
styles.css  — theme, layout, responsive rules, animations
app.js      — state, rendering, storage, countdown, matching logic
```

`app.js` is organised by feature, in the same order as the page:

- **State** — `load()` / `save()` / `defaultState()` around the key
  `pumpkinNight.v1`. `save()` catches quota errors and tells the user.
- **Countdown** — `nextHalloween()` picks October 31 at 6:00 PM local time
  for this year, or next year if it has passed; `updateCountdown()` ticks
  once per second.
- **Route** — `renderStops()`, `moveStop()`, `removeStop()`. Stops are an
  ordered array; reorder swaps two array entries.
- **Costumes** — `THEMES` (7 themes) and `IDEAS` (age group × interest tag).
  `renderThemes()` scores each theme by how many members' tags it matches
  and sorts best first. `renderMemberIdeas()` looks up two ideas per member.
- **Album** — `downscaleImage()` reads the file with FileReader, draws it to
  a canvas at most 320 px on the long side, and returns a JPEG data URL
  (quality 0.72). `renderPhotos()` builds the grid.
- **Checklist** — `renderChecklist()` draws checkboxes from state; custom
  items can be added and removed; reset restores the ten defaults.

Rendering uses `document.createElement` and `textContent` only, so text typed
by the user is never treated as HTML.

## Data model

Stored as one JSON object under `pumpkinNight.v1`:

```json
{
  "stops": [
    { "id": "string", "name": "string", "minutes": 10,
      "note": "string", "safety": "string" }
  ],
  "members": [
    { "id": "string", "name": "string",
      "age": "child | teen | adult",
      "tag": "spooky | funny | hero | animal | classic | movie" }
  ],
  "photos": [
    { "id": "string", "src": "data:image/jpeg;base64,...",
      "caption": "string", "year": 2026 }
  ],
  "checklist": [
    { "id": "string", "label": "string", "done": false,
      "custom": false }
  ]
}
```

IDs are time-based random strings (`uid()`). `load()` fills in any missing
part with defaults, so older or damaged saved data does not break the page.

## Costume matching

- Each theme has `tags` (the interest tags it fits) and `costumes` (one per
  age group).
- Score = count of members whose tag is in the theme's tags. Themes are
  sorted by score, highest first; the top score is marked as the best match.
- Individual ideas come from a fixed table: 3 age groups × 6 tags, two
  concrete costumes each.

## UI

- Dark theme: near-black purple background, orange headings and buttons,
  lilac accents. Pumpkin and ghost marks are inline SVG in the header; the
  ghost floats with a CSS animation (disabled under
  `prefers-reduced-motion`).
- Layout: one column on narrow screens; two columns at 860 px and wider.
  Forms use a two-column grid at 560 px and wider.
- Focus outlines on every control; icon-only buttons carry `aria-label`.

## Testing
- Served locally with `python3 -m http.server` and driven in headless
  Chromium (puppeteer-core): add/move/remove a stop, add/remove members,
  check theme ranking changes, upload a photo, check/uncheck checklist
  items, reload and confirm everything persisted, confirm zero console
  errors, and screenshot mobile (390 px) and desktop (1280 px) widths.
