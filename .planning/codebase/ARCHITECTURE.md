# Architecture

**Analysis Date:** 2026-04-29

## Pattern Overview

**Overall:** Single-page vanilla JavaScript application (no framework, no build step)

**Key Characteristics:**
- All logic lives in one flat module: `src/app.js`
- HTML declares the UI structure; JavaScript wires interactivity at runtime
- No routing, no state management library, no component framework
- Document preview is rendered by injecting an HTML string into a single `<article>` element
- No backend; all data is static (hardcoded airport/carrier tables and seeded routes)

## Layers

**Static Data:**
- Purpose: Lookup tables for airports, carriers, airline domains, and seeded real-world routes
- Location: `src/app.js` (lines 1–66)
- Contains: `airports` object, `carriers` object, `airlineDomains` object, `seededRoutes` array, `hubs` array
- Depends on: Nothing
- Used by: Route lookup, fare estimation, OCR parsing, document rendering

**Input / OCR Layer:**
- Purpose: Accept a flight screenshot, run Tesseract.js OCR, and populate form fields with extracted data
- Location: `src/app.js` — `runOcr()`, `applyOcrText()`, `extractFlightFromText()`, and all `find*` helpers (lines 168–393)
- Contains: Async OCR invocation, text normalization, regex-based field extraction (airline, flight number, times, dates, duration, price, layover, airport codes)
- Depends on: `window.Tesseract` (CDN), static data tables
- Used by: Form fields, the `generate()` orchestrator

**Trip Building Layer:**
- Purpose: Resolve origin/destination into structured trip objects with legs, times, and durations
- Location: `src/app.js` — `buildDefaultTrips()`, `buildTrip()`, `parseMultiCityRoutes()`, `parseImportedDetails()`, `generatedTrip()`, `legFromRoute()` (lines 113–433)
- Contains: Direct-route lookup, hub-connection lookup, distance-based fallback generation
- Depends on: Static data tables, date/time utilities
- Used by: `generate()`

**Fare Estimation:**
- Purpose: Produce a USD fare total either from an OCR-extracted price or a distance/cabin formula
- Location: `src/app.js` — `estimateFare()`, `getTicketPrice()`, `parsePrice()` (lines 576–621)
- Contains: Haversine distance calc, cabin multiplier table, per-passenger scaling
- Depends on: Static airport coordinates, trip legs
- Used by: `generate()`, `renderDocument()`

**Document Rendering Layer:**
- Purpose: Convert resolved trip data into an HTML string inserted into `<article id="document">`
- Location: `src/app.js` — `renderDocument()`, `renderPassengerList()`, `renderTrip()`, `renderLeg()`, `airlineLogoSources()`, `localAirlineLogo()`, `swapLogoSource()` (lines 435–574)
- Contains: Template string HTML generation, airline logo loading with CDN fallback (Clearbit → AirHex)
- Depends on: Trip data, fare estimate, static carrier tables
- Used by: `generate()`

**UI Utilities:**
- Purpose: Shared pure helpers for date/time formatting, math, HTML escaping, and currency
- Location: `src/app.js` (lines 623–696)
- Contains: `distanceMiles()`, `pickCarrier()`, `pickDeparture()`, `seededNumber()`, `makeDocId()`, `addDays()`, `addMinutes()`, `toInputDate()`, `toDisplayDate()`, `toTime()`, `formatDuration()`, `label()`, `money()`, `escapeHtml()`
- Depends on: Nothing
- Used by: All layers above

## Data Flow

**OCR Path (screenshot upload):**

1. User selects an image via `<input id="screenshotInput">`
2. `runOcr()` calls `Tesseract.recognize()` (CDN loaded at page start via `index.html` line 7)
3. Recognized text is written to `<textarea id="ocrText">`
4. User clicks "Apply extracted details" — `applyOcrText()` fires
5. `extractFlightFromText()` runs regex extraction on the OCR text
6. Matched values are written back into form fields (origin, destination, departDate, importedDetails)
7. `generate()` is called, consuming the now-populated form

**Manual Entry Path:**

1. User fills form fields directly (or edits pre-populated defaults from `init()`)
2. Form `submit` event calls `generate()`
3. `generate()` reads all fields via `FormData`
4. `parseImportedDetails()` is tried first; falls back to `parseMultiCityRoutes()`, then `buildDefaultTrips()`
5. Resolved trips pass to `estimateFare()` and `renderDocument()`
6. `renderDocument()` returns an HTML string injected into `<article id="document">`

**Route Resolution Hierarchy (inside `buildTrip()`):**

1. Look up exact origin→destination pair in `seededRoutes`
2. Try all `hubs` as a connecting airport (origin→hub + hub→destination)
3. Fall through to `generatedTrip()` which derives times and a pseudorandom carrier from coordinates

**State Management:**
- No explicit state object. The HTML form is the single source of truth. All state lives in DOM input values. Re-rendering is a full replacement of `documentEl.innerHTML`.

## Key Abstractions

**Trip:**
- Purpose: Represents one directional journey (outbound or return); has a `title`, `type`, `confidence`, and array of `legs`
- Examples: returned by `buildTrip()`, `generatedTrip()`, `parseImportedDetails()`
- Pattern: Plain JS object `{ title, type, confidence, legs: [...] }`

**Leg:**
- Purpose: Represents a single non-stop flight segment with departure/arrival ISO timestamps
- Examples: returned by `legFromRoute()` at `src/app.js` line 420
- Pattern: Spread of a seeded-route entry plus computed `departureIso`, `arrivalIso`, `arrivalDate`, `arrivalTime`, `durationText`

**SeededRoute:**
- Purpose: Hardcoded real-world flight data used as primary lookup; guarantees plausible schedules for common routes
- Examples: `src/app.js` lines 49–66
- Pattern: `{ from, to, carrier, flight, depart, duration, confidence }`

## Entry Points

**Page Load:**
- Location: `index.html` line 128, deferred by `<script src="src/app.js">` at bottom of `<body>`
- Triggers: `init()` at `src/app.js` line 707 (last line)
- Responsibilities: Populate airport selects, set default dates (+35/+49 days from today), call `generate()` to render a default document

**Form Submit:**
- Location: `src/app.js` line 698
- Triggers: `form.addEventListener("submit", ...)` → `generate()`
- Responsibilities: Re-render the document preview from current form values

**Print Button:**
- Location: `src/app.js` line 703
- Triggers: `window.print()`
- Responsibilities: Browser print dialog; print CSS in `src/styles.css` hides the input panel

**Screenshot Upload:**
- Location: `src/app.js` line 704
- Triggers: `screenshotInput.addEventListener("change", ...)` → `runOcr()`

**Apply OCR Button:**
- Location: `src/app.js` line 705
- Triggers: `parseOcrBtn.addEventListener("click", applyOcrText)`

## Error Handling

**Strategy:** Silent degradation — every path that might fail has a fallback, not an error throw.

**Patterns:**
- OCR failure: `ocrStatus` text is updated with a user-facing message; `parseOcrBtn` is re-enabled
- Missing airport codes: `parseMultiCityRoutes` filters out invalid lines with `.filter(Boolean)`
- No seeded route: `buildTrip()` silently falls through to `generatedTrip()`
- Airline logo load failure: `swapLogoSource()` tries a fallback CDN URL, then removes the `<img>` element
- `window.Tesseract` absent (offline): guarded at `runOcr()` line 170 with a message to the user

## Cross-Cutting Concerns

**Logging:** None — no console logging in production code paths.
**Validation:** HTML5 `required` on form fields; no JS validation layer.
**Authentication:** Not applicable — fully client-side, no user accounts.
**Security:** `escapeHtml()` used throughout `renderDocument()` to prevent XSS from OCR text.
**CDN dependencies:** Tesseract.js loaded from `cdn.jsdelivr.net`; airline logos fetched from `logo.clearbit.com` and `content.airhex.com` at render time.

---

*Architecture analysis: 2026-04-29*
