# Requirements — Pumpkin Night

## Introduction
Pumpkin Night is a static web app for one family planning Halloween night.
It has four features: a trick-or-treat route planner, a costume matcher, a
photo memory album, and a night-of checklist with a countdown to Halloween.
All data is stored in the browser (localStorage). There is no server.

## Glossary
- **Stop**: one house or place on the trick-or-treat route.
- **Member**: one family member going out on Halloween night.
- **Theme**: a coordinated set of costumes, one per age group.
- **Photo**: one saved Halloween photo with a caption and a year.

## Requirements

### Requirement 1: Trick-or-treat route planner

**User Story:** As a parent, I want to list the houses we will visit, so I can
see the order and how long the route takes.

#### Acceptance Criteria

1. WHEN the user submits a stop with a name and minutes, THEN the stop is
   added to the end of the route list and saved to localStorage.
2. WHEN a stop is added, THEN the total route time shown equals the sum of
   all stops' minutes.
3. WHEN the user clicks the up arrow on a stop that is not first, THEN that
   stop moves one place earlier and the order is saved.
4. WHEN the user clicks the down arrow on a stop that is not last, THEN that
   stop moves one place later and the order is saved.
5. WHEN the user clicks Remove on a stop, THEN the stop leaves the list, the
   total time updates, and the change is saved.
6. WHEN a stop has a note or a safety note, THEN both are shown under the
   stop name.
7. WHEN the page is reloaded, THEN the stops, their order, and the total time
   are the same as before the reload.

### Requirement 2: Costume matcher

**User Story:** As a parent, I want costume ideas that fit the people going
out, so the family can dress to one theme.

#### Acceptance Criteria

1. WHEN the user adds a member with a name, age group (child/teen/adult),
   and one interest tag (spooky/funny/hero/animal/classic/movie), THEN the
   member appears in the family list and is saved to localStorage.
2. WHEN at least one member exists, THEN at least six family themes are shown,
   each listing a costume for every age group present in the family.
3. WHEN members are added, THEN themes are ranked by how many members'
   interest tags they match, with the best-matching theme marked.
4. WHEN a member exists, THEN the app shows individual costume ideas for
   that member based on their age group and interest tag.
5. WHEN a member is removed, THEN the themes and individual ideas update to
   reflect the remaining members.
6. WHEN no members exist, THEN the theme area shows a message saying to add
   members first.

### Requirement 3: Photo memory album

**User Story:** As a parent, I want to save photos from past Halloweens with
a caption and year, so the family can look back at them.

#### Acceptance Criteria

1. WHEN the user picks an image file and submits it, THEN the photo is
   downscaled to at most 320 px on its long side, saved as a JPEG thumbnail,
   and shown in the gallery grid.
2. WHEN a photo is saved, THEN its caption and year are shown with it.
3. WHEN the user clicks Delete on a photo, THEN the photo leaves the album
   and the change is saved.
4. WHEN the album already holds 24 photos, THEN adding another shows a
   message that the album is full and the photo is not added.
5. WHEN the page is reloaded, THEN the saved photos, captions, and years are
   still shown.
6. WHEN browser storage is full, THEN the user sees a plain message instead
   of the photo disappearing silently.

### Requirement 4: Night-of checklist and countdown

**User Story:** As a parent, I want a packing checklist and a countdown, so
nothing is forgotten and the family knows how long until Halloween.

#### Acceptance Criteria

1. WHEN the page first loads, THEN the checklist shows ten pre-filled items
   (flashlight, candy bag, reflective tape, phone charged, water, first-aid,
   warm layer, house keys, cash, camera).
2. WHEN the user checks or unchecks an item, THEN the check is saved and the
   "X of Y packed" count updates.
3. WHEN the user adds a custom item, THEN it appears in the list and can be
   checked and removed.
4. WHEN the user clicks Reset checklist, THEN the list returns to the ten
   pre-filled items, all unchecked.
5. WHEN the page loads, THEN the countdown shows days, hours, minutes, and
   seconds until the next October 31 at 6:00 PM local time, and it ticks
   every second.
6. WHEN the current year's October 31 has already passed, THEN the countdown
   targets October 31 of the next year.

### Requirement 5: Look, layout, and access

**User Story:** As a user on a phone or a desktop, I want a Halloween look
that is easy to read and use.

#### Acceptance Criteria

1. WHEN the page loads, THEN it uses a dark theme with orange and purple,
   pumpkin and ghost motifs, and no external images.
2. WHEN the page is viewed on a narrow screen, THEN the sections stack in
   one column and all controls stay usable.
3. WHEN a control is used with a keyboard, THEN it has a visible focus
   outline.
4. WHEN a button shows only an icon, THEN it has an accessible label.
5. WHEN the page loads, THEN there are no console errors.

### Requirement 6: Storage and privacy

**User Story:** As a user, I want my family's data to stay in my own browser.

#### Acceptance Criteria

1. WHEN the app runs, THEN it makes no network requests and sends no data
   anywhere.
2. WHEN the app saves data, THEN it uses only localStorage under the key
   `pumpkinNight.v1`.
3. WHEN saved data is missing or damaged, THEN the app starts with empty
   lists and the default checklist instead of breaking.
