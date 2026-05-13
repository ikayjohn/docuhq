# Codebase Concerns

**Analysis Date:** 2026-04-29

## Tech Debt

**No module system or build step:**
- Issue: The entire application is a single script file with no imports, exports, or bundling. All ~707 lines of logic live in `src/app.js` as global functions and variables. `package.json` has no build tool — only `npx http-server` as the dev/start script.
- Files: `src/app.js`, `package.json`
- Impact: No tree-shaking, no dead-code elimination, no TypeScript safety, no linting toolchain. The absence of a bundler also means the CDN `tesseract.js` script tag in `index.html` (line 7) is a hard runtime dependency on an external CDN.
- Fix approach: Introduce Vite (minimal config) with native ES modules. Move constants (`airports`, `carriers`, `airlineDomains`, `seededRoutes`) to a separate data file, and separate rendering, parsing, and OCR into distinct modules.

**Hardcoded data in source:**
- Issue: Airport list (15 entries), carrier list (12 entries), airline domains, and seeded route table are all hardcoded at the top of `src/app.js` lines 1-66. Adding airports or routes requires editing production JS.
- Files: `src/app.js` (lines 1-66)
- Impact: Route coverage is extremely narrow (15 airports, 16 routes). Any expansion requires code changes. The seeded routes table is unidirectional — no return-leg entries exist, so `buildTrip` always falls back to `generatedTrip` for the inbound leg on most routes.
- Fix approach: Extract to `src/data/airports.js` and `src/data/routes.js` modules. A simple JSON file that can be fetched or imported would allow non-code updates.

**`localAirlineLogo` is hardcoded to one airline:**
- Issue: `localAirlineLogo()` in `src/app.js` (lines 503-512) returns a CSS logo only when `cleanCode === "AF"` (Air France). All other airlines fall through to external image fetching or show only the IATA code text.
- Files: `src/app.js` (lines 503-512)
- Impact: Inconsistent logo display; a fragile special-case that silently does nothing for all other carriers.
- Fix approach: Either generalise the SVG/CSS logo approach for all carriers or remove this branch and rely solely on the external image pipeline.

**`findDate` has a hardcoded year:**
- Issue: Inside `findDate()` at `src/app.js` line 351, the named-date parser constructs a temporary Date object using `new Date(\`${named[1]} 1, 2026\`)` with a literal `2026`. Month-name date parsing will use the wrong year for any date other than 2026.
- Files: `src/app.js` (line 351)
- Impact: Dates like "Mar 15, 2027" extracted via OCR will still use 2026 internally when computing the month index. The month number returned is correct by coincidence, but the hardcoded year is a silent assumption that will confuse future maintainers.
- Fix approach: Replace `2026` with `new Date().getFullYear()`.

**`makeDocId` is not reliably unique:**
- Issue: `makeDocId()` at `src/app.js` line 651 builds a document ID from a character-code sum of passenger names + route + date, appended with only the last 3 digits of `Date.now()`. The sum is a weak accumulator with many collisions (any anagram of passenger names yields the same sum).
- Files: `src/app.js` (lines 650-652)
- Impact: Two documents generated within the same millisecond window with different passengers on the same route can share a doc ID. For a document intended for visa support purposes, duplicate IDs are a credibility risk.
- Fix approach: Use `crypto.randomUUID()` (available in all modern browsers) or at minimum a full `Date.now()` suffix with a random component.

---

## Known Bugs

**`calculateDuration` ignores multi-day flights:**
- Symptoms: Flight duration shown correctly only when arrival is on the same calendar day. The function adds 1440 minutes (one day) if the result is negative, but this fails for flights exceeding 24 hours.
- Files: `src/app.js` (lines 379-385)
- Trigger: Any generated leg with a duration exceeding 24 hours, or a manually entered arrival time that differs from departure by more than one calendar day.
- Workaround: Multi-day legs are uncommon in the current airport set, so the bug is rarely encountered in practice.

**`parseMultiCityRoutes` falls back to departure date for all undated segments:**
- Symptoms: When parsing multi-city routes (e.g., `LOS LHR 2026-06-12\nLHR JFK 2026-06-20`), if a line contains no parseable date, `findDate(line)` returns an empty string and the fallback is the departure date field value. All undated segments are assigned the outbound departure date, producing incorrect itineraries.
- Files: `src/app.js` (lines 123-138)
- Trigger: Any multi-city line entered without a date component.
- Workaround: Users must include a date on every segment line.

**`findTimes` captures only the first two time values:**
- Symptoms: When OCR text contains more than two time strings (departure, arrival, and a layover connection time), only the first two are used. Connecting flights extracted from OCR always receive the same two times regardless of leg count.
- Files: `src/app.js` (lines 322-325)
- Trigger: OCR text from connecting or multi-leg booking screenshots.
- Workaround: None — the user must manually edit the imported details textarea.

**`buildTrip` connecting logic uses a fixed 150-minute layover:**
- Symptoms: All connecting flights generated via hub lookup have exactly a 150-minute connection time, regardless of hub or actual minimum connection time.
- Files: `src/app.js` (lines 155-158)
- Trigger: Any non-direct route that resolves via a hub airport.
- Workaround: None — hardcoded on line 157.

---

## Security Considerations

**Third-party CDN script loaded without integrity check:**
- Risk: `index.html` line 7 loads `tesseract.js` from `cdn.jsdelivr.net` with no `integrity` attribute (Subresource Integrity / SRI). If the CDN is compromised or the version tag resolves to a tampered build, arbitrary JavaScript executes in the user's browser with full DOM access.
- Files: `index.html` (line 7)
- Current mitigation: None.
- Recommendations: Add `integrity="sha384-..."` and `crossorigin="anonymous"` to the script tag. Generate the hash from the known build via `openssl dgst -sha384 -binary tesseract.min.js | openssl base64 -A` or `https://www.srihash.org/`.

**External logo images fetched from clearbit.com and airhex.com at render time:**
- Risk: `airlineLogoSources()` in `src/app.js` (lines 493-500) constructs URLs to `logo.clearbit.com` and `content.airhex.com`. These requests leak the user's IP and browser fingerprint to two third-party services every time a document is generated. There is no privacy notice to the user.
- Files: `src/app.js` (lines 493-500)
- Current mitigation: None.
- Recommendations: Bundle airline logos locally as SVG assets, or document the privacy implication in the UI.

**Document rendering via direct property assignment with partially-escaped user input:**
- Risk: `renderDocument()` sets the document element's content directly using a template literal (line 110). The `escapeHtml()` helper is applied to most user-supplied strings (passenger names, agency note). However, `leg.carrier` and `leg.flight` values populated from OCR-parsed text go through `legFromRoute()` and are rendered in `renderLeg()` at lines 558-559 without sanitisation.
- Files: `src/app.js` (lines 550-574, lines 420-433)
- Current mitigation: `escapeHtml` covers the highest-risk inputs; since there is no server and the page is local-only, exploitation is limited to self-XSS. Still, the inconsistency is a code quality risk.
- Recommendations: Apply `escapeHtml()` consistently to `leg.carrier` and `leg.flight` inside `renderLeg()`.

---

## Performance Bottlenecks

**Full document re-render on every generation trigger:**
- Problem: `generate()` is called on every form submit event, and also immediately during `init()` and after `applyOcrText()`. Each call triggers a full re-render and DOM reparse.
- Files: `src/app.js` (lines 94-111, line 707)
- Cause: No diffing or partial update strategy.
- Improvement path: For the current document size this is negligible, but debouncing `generate()` on live input would prevent redundant renders if live-update is ever added.

**Tesseract.js is loaded eagerly and blocks HTML parsing:**
- Problem: `tesseract.min.js` (~1.5 MB minified) is loaded unconditionally via a render-blocking `<script>` tag in `<head>` on `index.html` line 7. OCR is an optional, deferred user action.
- Files: `index.html` (line 7)
- Cause: No `defer` or `async` attribute; no lazy-loading strategy.
- Improvement path: Add `defer` to the script tag as a minimal fix. Ideally, import Tesseract dynamically inside `runOcr()` only when the user actually selects a file.

---

## Fragile Areas

**`renderLeg` will throw if airport code is not in the airports object:**
- Files: `src/app.js` (lines 550-574)
- Why fragile: If OCR parsing extracts a three-letter code not in the hardcoded 15-entry `airports` object (e.g., a valid IATA code for JNB, CAI, BOM), `airports[leg.from]` is `undefined` and accessing `.city` on the next line throws a `TypeError`, crashing the entire render.
- Safe modification: Add a fallback — `const from = airports[leg.from] || { city: leg.from, country: "" }` — before accessing `.city`.
- Test coverage: None.

**`parseImportedDetails` fails silently on partial OCR extraction:**
- Files: `src/app.js` (lines 256-290)
- Why fragile: If `extractFlightFromText` finds fewer than two route codes, the function returns `null` and the UI silently falls back to form-based default trips with no user-facing error. Partial OCR success (one airport found, not two) is indistinguishable from "no import" to the user.
- Safe modification: Surface a warning to the `ocrStatus` element when partial extraction occurs.
- Test coverage: None.

**`seededNumber` hash produces collisions for anagram inputs:**
- Files: `src/app.js` (lines 646-648, 650-652)
- Why fragile: The hash is a plain character-code sum. Any permutation of the same characters yields an identical number. Both `makeDocId` and `pickCarrier` rely on it, meaning reversed passenger names or swapped route codes produce identical generated flight numbers and document IDs.
- Safe modification: Replace with a proper hash (e.g., FNV-1a) or use `crypto.randomUUID()` for document IDs.
- Test coverage: None.

---

## Scaling Limits

**Airport and route coverage is very narrow:**
- Current capacity: 15 airports, 16 seeded routes (all originating in West/East Africa or major hubs).
- Limit: Any route not in the seeded table and not resolvable through the 6 hub airports (`hubs` array, `src/app.js` line 68) falls back to `generatedTrip()`, which fabricates flight numbers and uses a distance-based duration estimate with no real schedule data. This limits the tool's usefulness to the Africa-Europe-US corridor.
- Scaling path: Migrate airport and route data to `src/data/airports.json` and `src/data/routes.json` so they can be extended without touching logic. Adding bidirectional route entries would fix the return-leg fallback issue.

---

## Dependencies at Risk

**`tesseract.js` CDN version tag is not pinned:**
- Risk: The CDN URL in `index.html` line 7 uses a floating major-version tag (`tesseract.js@5`). Any semver-compatible update (5.x.y) is served automatically, including potentially breaking patch changes.
- Impact: A minor Tesseract update that alters the `result.data.text` structure or the `logger` message format would silently break OCR output with no local code change.
- Migration plan: Pin to an exact version (e.g., `tesseract.js@5.1.1`) and add an SRI hash as noted in the security section.

---

## Missing Critical Features

**No input validation feedback on multi-city route textarea:**
- Problem: `parseMultiCityRoutes()` silently drops any line where fewer than two airport codes are found (line 134 filter). There is no user-facing error explaining which lines were rejected.
- Blocks: Users cannot diagnose why a segment is missing from their generated itinerary.

**No way to clear or reset the form:**
- Problem: There is no reset button. Once OCR text is applied and fields are populated, every field must be cleared manually. The `init()` function sets default values but is only called once on page load.
- Blocks: Generating multiple different itineraries in a single session requires tedious manual clearing.

**`findPrice` recognises USD only:**
- Problem: `findPrice()` in `src/app.js` (lines 363-366) matches only `USD` or `$` prefixed prices. Screenshots from non-USD booking sites (NGN, GBP, EUR) will not extract prices.
- Blocks: Fare display for non-USD bookings always shows the estimated fare rather than the actual price from the screenshot.

---

## Test Coverage Gaps

**No tests exist:**
- What's not tested: The entire codebase has zero test files. No test framework is installed (`package.json` has no `devDependencies` at all).
- Files: `src/app.js` (all ~707 lines)
- Risk: All parsing logic (`extractFlightFromText`, `parseImportedDetails`, `parseMultiCityRoutes`, `findDate`, `findTimes`, `normalizeTime`, `calculateDuration`) is completely untested. Regressions in OCR parsing or date handling would not be caught before reaching users.
- Priority: High — the parsing and date logic are the core value functions and the most likely to break on edge-case input.

---

*Concerns audit: 2026-04-29*
