# Tech Steering — Pumpkin Night

## Stack
- Plain HTML, CSS, and JavaScript. No build step, no framework, no libraries.
- Runs by opening `index.html` or serving the folder with any static file server.
- No external requests: no fonts, no images, no scripts from other sites.
  All decoration is inline SVG or CSS.

## Storage
- One localStorage key: `pumpkinNight.v1`.
- Value is a single JSON object: `{ stops, members, photos, checklist }`.
- Photos are downscaled to at most 320 px on the long side and saved as JPEG
  data URLs (quality 0.72). Album is capped at 24 photos so storage stays usable.
- Every write is wrapped in try/catch; a full store shows a plain message
  instead of failing silently.

## Code rules
- User-supplied text is rendered with `textContent` only, never `innerHTML`
  with user data, so a name or note cannot inject markup.
- Each feature renders from state (`renderStops`, `renderMembers`,
  `renderPhotos`, `renderChecklist`) and saves state after every change.
- The countdown targets the next October 31 at 6:00 PM local time and ticks
  once per second.
