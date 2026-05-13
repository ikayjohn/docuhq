# Coding Conventions

**Analysis Date:** 2026-04-29

## Naming Patterns

**Files:**
- Lowercase with no separators: `app.js`, `styles.css`
- HTML entry point at root: `index.html`

**Functions:**
- camelCase for all functions: `buildDefaultTrips`, `parseMultiCityRoutes`, `extractFlightFromText`, `legFromRoute`
- Verb-first naming pattern: `find*`, `build*`, `render*`, `parse*`, `pick*`, `make*`, `format*`, `calculate*`, `normalize*`, `escape*`
  - Finders: `findSeeded`, `findDate`, `findAirline`, `findFlightNumber`, `findTimes`, `findLayover`, `findDuration`, `findPrice`, `findRoutePair`, `findAirportCodesInOrder`
  - Builders: `buildTrip`, `buildDefaultTrips`, `legFromRoute`, `generatedTrip`, `generatedDuration`
  - Renderers: `renderDocument`, `renderTrip`, `renderLeg`, `renderPassengerList`
  - Parsers: `parseMultiCityRoutes`, `parseImportedDetails`, `parsePrice`

**Variables:**
- camelCase throughout: `passengerNames`, `firstLeg`, `lastTrip`, `cabinMultiplier`, `ticketPrice`
- Destructured parameters use short, descriptive names: `[code, airport]`, `[from, to]`, `[, carrierName]`
- DOM references captured at module top-level as `const`: `form`, `documentEl`, `screenshotInput`, `ocrStatus`, `ocrText`, `parseOcrBtn`

**Constants / Data:**
- camelCase for object maps: `airports`, `carriers`, `airlineDomains`, `seededRoutes`
- Uppercase IATA codes used as object keys throughout: `LOS`, `LHR`, `QR`, `EK`

**CSS Classes:**
- kebab-case: `.input-panel`, `.ocr-status`, `.airline-brand`, `.fare-total`, `.local-logo-af`
- BEM-style modifiers with standalone class: `.secondary`, `.logo-loaded`
- Element role + descriptor pattern: `.doc-header`, `.doc-meta`, `.trip-heading`, `.leg-number`

**HTML IDs:**
- camelCase: `itineraryForm`, `ocrStatus`, `ocrText`, `parseOcrBtn`, `screenshotInput`, `routeTitle`, `confidenceTitle`, `docId`, `document`

## Code Style

**Formatting:**
- No formatter config file detected (no `.prettierrc`, `eslint.config.*`, or `biome.json`)
- Consistent 2-space indentation throughout `src/app.js`
- Single-quoted strings not used — double quotes used for HTML template literals; bare JS uses double quotes
- Semicolons used consistently

**Linting:**
- No ESLint or linting config present
- Style is self-consistent and manually enforced

## Import Organization

**No module system used.** The project is a plain HTML/JS/CSS application with no bundler.

- External scripts loaded via CDN `<script>` tag in `index.html`: Tesseract.js
- Application logic loaded as a single `<script src="src/app.js">` at bottom of `<body>`
- CSS loaded via `<link rel="stylesheet" href="src/styles.css">` in `<head>`
- No `import` / `require` statements anywhere — all code lives in a single global scope

## Error Handling

**Patterns:**

- Async OCR wrapped in `try/catch/finally` in `runOcr()` (`src/app.js` line 178):
  - `catch` sets a user-visible error message in `ocrStatus.textContent`
  - `finally` always re-enables the `parseOcrBtn`
- Parsing functions return sentinel values on failure — `null` or `""` (empty string) rather than throwing:
  - `parsePrice` returns `null` if value is absent or non-numeric
  - `durationToMinutes` returns `null` if regex fails
  - `findDate`, `findDuration`, `findPrice`, `findLayover` return `""` on no match
- Null-safe access using optional chaining: `ampm?.[1]`, `carriers[leg.carrier] || leg.carrier`
- Fallbacks via `||`: `Number(data.passengers || 1)`, `data.importedDetails || ""`, `carrier || "FT"`
- No explicit `throw` statements anywhere in the codebase
- Defensive HTML escaping via `escapeHtml()` applied to all user-supplied content in rendered output

## Logging

**No logging framework.** Status messages are written directly to DOM elements:
- `ocrStatus.textContent = "..."` used for all user-facing feedback during OCR lifecycle

## Comments

**No comments present** in `src/app.js` or `src/styles.css`. The codebase relies entirely on self-documenting function and variable names.

## Function Design

**Size:** Functions are small and single-purpose. Most are 3–15 lines. The largest is `renderDocument()` (~55 lines), which is a template function returning an HTML string.

**Parameters:** Functions accept primitive values or plain objects. No classes or constructor patterns used. Data is passed as plain objects (e.g., the `data` FormData result, leg objects, trip arrays).

**Return Values:**
- Parsing/finding functions return the found value or a falsy sentinel (`null`, `""`, `false`)
- Builder functions return plain object literals
- Render functions return HTML strings (template literals)
- Utility functions return transformed primitives

**Destructuring:** Used consistently in function bodies and `.map()` callbacks:
```js
const { data, trips, estimate, docId } = ...;
Object.entries(carriers).find(([, carrierName]) => ...)
```

## Module Design

**Single file, global scope.** All logic lives in `src/app.js` with no module boundaries.

- Data constants declared at top: `airports`, `carriers`, `airlineDomains`, `seededRoutes`, `hubs`
- DOM refs captured after constants, before function declarations
- Functions defined with `function` declarations (hoisted), not arrow functions at top level
- Arrow functions used exclusively inside callbacks and `.map()` / `.filter()` / `.find()` chains
- Event listeners registered at bottom of file after `init()` call

## CSS Conventions

**Custom Properties:** Defined on `:root` with `--` prefix: `--ink`, `--muted`, `--line`, `--surface`, `--panel`, `--accent`, `--accent-dark`

**Layout:** CSS Grid used as primary layout system. Flexbox used for alignment-only cases.

**Responsive:** Three breakpoints via `@media` — `max-width: 900px`, `max-width: 560px`, and `print`. No mobile-first approach; desktop is the base.

**Typography:** `font-size` expressed in `rem` units. Weights are numeric (`700`, `800`, `900`).

**No utility classes.** All styling is semantic and component-scoped by class name.

---

*Convention analysis: 2026-04-29*
