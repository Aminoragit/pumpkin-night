# Tasks — Pumpkin Night

## Implementation tasks

- [x] 1. Set up the project
  - [x] 1.1 Create folder `pumpkin-night/` with `index.html`, `styles.css`, `app.js`
  - [x] 1.2 Add `README.md`, MIT `LICENSE` (Na Sojung, 2026), `.gitignore`
        that does not ignore `.kiro`
  - [x] 1.3 Add `.kiro/steering/` (product, tech, structure), `.kiro/specs/`,
        and `.kiro/hooks/hooks.json`

- [x] 2. Build the page shell and countdown
  - [x] 2.1 Header with pumpkin and ghost SVG, title, and tagline
  - [x] 2.2 Countdown to the next October 31, 6:00 PM local time, ticking
        every second (targets 2027 while 2026's Halloween has passed)
  - [x] 2.3 Dark orange/purple theme, responsive grid, focus outlines,
        accessible labels on icon buttons

- [x] 3. Trick-or-treat route planner
  - [x] 3.1 Add-stop form (name, minutes, note, safety note)
  - [x] 3.2 Ordered list with up/down reorder, remove, per-stop minutes
  - [x] 3.3 Total route time display
  - [x] 3.4 Persist stops and order in localStorage; restore on reload

- [x] 4. Costume matcher
  - [x] 4.1 Add-member form (name, age group child/teen/adult, interest tag)
  - [x] 4.2 Seven family themes, each with a costume per age group
  - [x] 4.3 Rank themes by how many members' tags they match; mark the best
  - [x] 4.4 Individual costume ideas per member (age group × interest tag)
  - [x] 4.5 Remove member; themes and ideas update

- [x] 5. Photo memory album
  - [x] 5.1 Upload with FileReader, downscale to max 320 px, save as JPEG
        data URL (quality 0.72)
  - [x] 5.2 Caption and year per photo; gallery grid view; delete photo
  - [x] 5.3 Cap at 24 photos; plain message when storage is full

- [x] 6. Night-of checklist
  - [x] 6.1 Ten pre-filled items, check/uncheck persisted, packed count
  - [x] 6.2 Add custom items, remove custom items, reset to defaults

- [x] 7. Test and review
  - [x] 7.1 Serve locally and drive every control in headless Chromium;
        confirm no console errors
  - [x] 7.2 Reload and confirm all four features persisted
  - [x] 7.3 Screenshot mobile (390 px) and desktop (1280 px) widths
  - [x] 7.4 Adversarial self-review of copy and correctness; fix defects
