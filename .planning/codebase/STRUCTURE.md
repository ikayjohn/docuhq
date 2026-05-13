# Codebase Structure

**Analysis Date:** 2026-04-29

## Directory Layout

```
flighttix/
├── index.html          # Single HTML entry point; declares full UI structure
├── package.json        # Project metadata and dev-server script only
├── src/
│   ├── app.js          # All application logic (707 lines, no modules)
│   └── styles.css      # All styles including print and responsive breakpoints
└── .planning/
    └── codebase/       # GSD analysis documents
```

## Directory Purposes

**`src/`:**
- Purpose: All runtime source files
- Contains: One JS file (all logic) and one CSS file (all styles)
- Key files: `src/app.js`, `src/styles.css`

**`.planning/codebase/`:**
- Purpose: GSD codebase analysis documents
- Contains: Markdown docs written by map-codebase
- Generated: Yes (by GSD tooling)
- Committed: Yes

## Key File Locations

**Entry Points:**
- `index.html`: Shell HTML; loaded directly in browser; references both `src/styles.css` and `src/app.js`
- `src/app.js` line 707: `init()` call — bootstraps the application on page load

**Configuration:**
- `package.json`: No build config; only defines `start`/`dev` scripts that run `npx http-server . -p 5173`

**Core Logic (all in `src/app.js`):**

| Lines     | Concern                          |
|-----------|----------------------------------|
| 1–17      | `airports` static data table     |
| 19–32     | `carriers` static data table     |
| 34–47     | `airlineDomains` static table    |
| 49–66     | `seededRoutes` array             |
| 68–74     | DOM element references           |
| 76–92     | `init()` — page bootstrap        |
| 94–111    | `generate()` — main orchestrator |
| 113–165   | Trip building functions          |
| 168–226   | OCR pipeline functions           |
| 228–393   | Text extraction helpers          |
| 395–433   | Route/leg assembly               |
| 435–574   | Document rendering (HTML strings)|
| 576–621   | Fare estimation                  |
| 623–696   | Pure utility functions           |
| 698–707   | Event listeners + `init()` call  |

**Styles:**
- `src/styles.css`: All styles in one file; includes desktop layout, responsive breakpoints at 900 px and 560 px, and a `@media print` block

**Testing:**
- None present

## Naming Conventions

**Files:**
- Lowercase, no prefix: `app.js`, `styles.css`
- One file per concern (currently one JS file, one CSS file)

**Functions:**
- camelCase verbs: `buildTrip`, `renderLeg`, `estimateFare`, `findFlightNumber`, `parseImportedDetails`
- `render*` prefix for functions that return HTML strings
- `find*` prefix for regex/search helpers that return a scalar value or empty string
- `parse*` prefix for functions that interpret multi-field text into structured objects
- `build*` prefix for functions that construct trip/leg objects

**Variables:**
- camelCase: `firstLeg`, `passengerNames`, `ticketPrice`
- DOM references declared at module scope with `const` and `document.getElementById()`

**CSS Classes:**
- kebab-case: `.input-panel`, `.ocr-status`, `.trip-heading`, `.doc-header`, `.fare-box`
- Semantic, layout-oriented names (not BEM)

**Data Objects:**
- Static lookup tables: plain object literals with IATA code keys (e.g., `airports.LOS`, `carriers.QR`)

## Where to Add New Code

**New feature — data or lookup table:**
- Add to the static data section at the top of `src/app.js` (lines 1–68)

**New form field:**
- Add the `<label>` + input element to `index.html` inside `<form id="itineraryForm">`
- Read the value via `FormData` inside `generate()` in `src/app.js`
- Add corresponding CSS to `src/styles.css`

**New route or carrier:**
- Carriers: add to `carriers` and `airlineDomains` objects in `src/app.js` lines 19–47
- Routes: add an entry to `seededRoutes` in `src/app.js` lines 49–66
- Airports: add to `airports` object in `src/app.js` lines 1–17

**New document section:**
- Add a `render*` function in `src/app.js` (follow the pattern of `renderTrip()` or `renderPassengerList()`)
- Call it inside the `renderDocument()` template string

**New text extraction pattern:**
- Add a `find*` helper function in `src/app.js` alongside the existing `findAirline`, `findTimes`, etc.
- Call it inside `extractFlightFromText()` and include the result in the returned object

**New utility:**
- Add a pure function at the bottom of `src/app.js` before the event listener block (lines 623–696)

**Styles:**
- All styles go in `src/styles.css`; add responsive rules inside the existing `@media` blocks at the bottom
- Print-specific rules go inside the `@media print` block

## Special Directories

**`node_modules/`:**
- Purpose: Not present — no installed packages; only `npx http-server` used at runtime via `npm start`
- Generated: On demand
- Committed: No

**`.claude/`:**
- Purpose: Claude/GSD project configuration
- Generated: By GSD tooling
- Committed: Yes

---

*Structure analysis: 2026-04-29*
