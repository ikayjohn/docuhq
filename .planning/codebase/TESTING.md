# Testing Patterns

**Analysis Date:** 2026-04-29

## Test Framework

**Runner:** None — no test framework is installed or configured.

**Config files present:** None. No `jest.config.*`, `vitest.config.*`, `mocha.*`, or equivalent detected.

**Test scripts in `package.json`:** None. The only scripts defined are:
```json
"start": "npx http-server . -p 5173",
"dev":   "npx http-server . -p 5173"
```

**Assertion Library:** None.

## Test File Organization

**No test files exist** in the project. No `*.test.js`, `*.spec.js`, or `__tests__/` directories are present.

## Current State

This is a zero-dependency, single-file vanilla JavaScript application (`src/app.js`) with no build tooling, no module system, and no test infrastructure of any kind.

All logic runs in a browser global scope, which makes unit testing non-trivial without a refactor — functions are not exported and rely on DOM globals (`document`, `window.Tesseract`) and module-level DOM references captured at load time (`form`, `documentEl`, `ocrStatus`, etc.).

## Testable Logic (Pure Functions)

The following functions in `src/app.js` are pure or near-pure and could be unit tested immediately if a test framework were added:

**Date and time utilities:**
- `normalizeTime(value)` — converts time strings to `HH:MM` format
- `findDate(text)` — extracts ISO date from text, handles multiple formats
- `findDuration(text)` — extracts `Xh Ym` from text
- `calculateDuration(start, end)` — returns minutes between two `HH:MM` strings
- `durationToMinutes(value)` — converts `Xh Ym` string to integer minutes
- `formatDuration(minutes)` — formats minutes to `Xh Ym` string
- `addDays(date, days)` — returns new Date N days ahead
- `addMinutes(date, minutes)` — returns new Date N minutes ahead
- `toInputDate(date)` — returns `YYYY-MM-DD` string
- `toTime(date)` — returns `HH:MM` string

**Text extraction:**
- `extractFlightFromText(text)` — main OCR parser, returns structured object
- `findAirportCodesInOrder(upper)` — extracts IATA codes from text
- `findRoutePair(upper, codes)` — identifies origin/destination pair
- `findAirline(text)` — matches airline name from known carriers
- `findFlightNumber(upper)` — extracts flight number
- `findTimes(text)` — extracts time strings
- `findPrice(text)` — extracts USD price string
- `findLayover(text)` — extracts layover description

**Fare and distance:**
- `distanceMiles(a, b)` — Haversine distance calculation
- `estimateFare(trips, cabin, passengers, ticketPrice)` — fare estimation
- `parsePrice(value)` — strips non-numeric chars, returns number or null

**Utilities:**
- `escapeHtml(value)` — HTML entity escaping
- `normalizeWhitespace(value)` — collapses whitespace
- `seededNumber(value)` — deterministic hash from string
- `makeDocId(data)` — document ID generation
- `money(value)` — USD currency formatting
- `label(value)` — capitalizes first character

## Recommended Test Setup (If Added)

**Suggested framework:** Vitest — works without a bundler via CLI, minimal config, compatible with plain JS.

**Install:**
```bash
npm install --save-dev vitest
```

**Suggested `package.json` script:**
```json
"test": "vitest run",
"test:watch": "vitest"
```

**Suggested structure (co-located):**
```
src/
  app.js
  app.test.js
```

**Prerequisite refactor:** To enable testing, pure utility functions should be exported. Since there is no module system, the recommended approach is to either:
1. Convert `src/app.js` to an ES module (`type: "module"` in `package.json`) and export pure functions
2. Extract pure functions into a separate `src/utils.js` module and import them in both `app.js` and test files

**Example test pattern for `normalizeTime`:**
```js
import { normalizeTime } from './app.js';

test('converts 12-hour AM time to 24-hour', () => {
  expect(normalizeTime('09:30 AM')).toBe('09:30');
});

test('converts PM time correctly', () => {
  expect(normalizeTime('01:45 PM')).toBe('13:45');
});

test('handles midnight', () => {
  expect(normalizeTime('12:00 AM')).toBe('00:00');
});
```

**Example test pattern for `extractFlightFromText`:**
```js
import { extractFlightFromText } from './app.js';

test('extracts IATA codes from route string', () => {
  const result = extractFlightFromText('LOS to LHR, BA75, 22:50');
  expect(result.routeCodes).toEqual(['LOS', 'LHR']);
  expect(result.flight).toBe('BA75');
});
```

## CI/CD

No CI pipeline configuration detected. No `.github/workflows/`, `.gitlab-ci.yml`, or equivalent files are present.

## Coverage

**Requirements:** None enforced.

**Current coverage:** 0% — no tests exist.

## Test Types

**Unit Tests:** Not present. Recommended starting point given the number of pure utility functions.

**Integration Tests:** Not applicable at current project scale.

**E2E Tests:** Not used. Manual browser testing is the current verification method.

---

*Testing analysis: 2026-04-29*
