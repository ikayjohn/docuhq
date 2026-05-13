# External Integrations

**Analysis Date:** 2026-04-29

## APIs & External Services

**OCR Engine:**
- Tesseract.js v5 — client-side OCR for extracting flight details from uploaded screenshots
  - SDK/Client: CDN script tag in `index.html` line 7 (`https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js`)
  - Auth: None (public CDN, no API key)
  - Called in `src/app.js` `runOcr()` function via `Tesseract.recognize(file, "eng", { logger })`
  - Runs entirely in the browser via Web Workers; no server calls

**Airline Logo Services:**
- Clearbit Logo API — primary logo source for known airlines
  - Endpoint pattern: `https://logo.clearbit.com/{domain}` (e.g., `https://logo.clearbit.com/emiratres.com`)
  - Auth: None (public, unauthenticated)
  - Used in `src/app.js` `airlineLogoSources()` function
- AirHex — fallback airline logo source
  - Endpoint pattern: `https://content.airhex.com/content/logos/airlines_{CODE}_350_100_r.png`
  - Auth: None (public, unauthenticated)
  - Used as fallback when Clearbit fails, via `swapLogoSource()` in `src/app.js`

**jsDelivr CDN:**
- Hosts the Tesseract.js library
  - URL: `https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js`
  - Auth: None

## Data Storage

**Databases:**
- None — no database of any kind

**File Storage:**
- Browser memory only — uploaded screenshots are held in memory during OCR processing and not persisted
- No server-side storage

**Caching:**
- None

## Authentication & Identity

**Auth Provider:**
- None — no authentication, no user accounts, no sessions

## Monitoring & Observability

**Error Tracking:**
- None

**Logs:**
- No structured logging; OCR errors surface in the `#ocrStatus` DOM element in `index.html`

## CI/CD & Deployment

**Hosting:**
- Not configured — application is a static bundle deployable to any static host (Netlify, Vercel, GitHub Pages, S3, etc.)

**CI Pipeline:**
- None detected

## Environment Configuration

**Required env vars:**
- None — the application has zero environment variable dependencies

**Secrets location:**
- No secrets exist in this codebase

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None — the only outbound network requests are:
  1. CDN load of `tesseract.js` on page load (passive asset fetch)
  2. Airline logo image fetches from Clearbit and AirHex at document render time (passive image requests)

## Network Dependency Map

| Service | Purpose | Required | Graceful Degradation |
|---|---|---|---|
| jsDelivr CDN | Load Tesseract.js | No | App shows "OCR library unavailable. Paste screenshot text manually." |
| Clearbit Logo API | Primary airline logo | No | Falls back to AirHex via `swapLogoSource()` |
| AirHex | Fallback airline logo | No | Image element removed from DOM if both sources fail |

---

*Integration audit: 2026-04-29*
