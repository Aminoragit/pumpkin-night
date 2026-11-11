# Structure Steering — Pumpkin Night

```
pumpkin-night/
├── index.html          # page structure, all four sections
├── styles.css          # dark Halloween theme, responsive layout
├── app.js              # all behaviour: state, rendering, storage, countdown
├── README.md
├── LICENSE             # MIT
├── .gitignore          # does NOT ignore .kiro
└── .kiro/
    ├── steering/
    │   ├── product.md  # what the app is for
    │   ├── tech.md     # stack and storage rules
    │   └── structure.md
    ├── specs/pumpkin-night/
    │   ├── requirements.md
    │   ├── design.md
    │   └── tasks.md
    └── hooks/
        └── hooks.json  # save-time checks
```

## Conventions
- One feature per page section, in this order: route, costumes, album, checklist.
- Section ids: `route-section`, `costume-section`, `album-section`,
  `checklist-section`.
- Form ids match the feature: `stop-form`, `member-form`, `photo-form`,
  `check-item-form`.
- New files go in this folder. No build output is checked in.
