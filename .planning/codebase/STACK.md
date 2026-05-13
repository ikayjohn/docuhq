# Technology Stack

**Analysis Date:** 2026-04-29

## Languages

**Primary:**
- HTML5 - Application shell and document structure (`index.html`)
- JavaScript (ES2020+) - All application logic (`src/app.js`)
  - Uses async/await, optional chaining (`?.`), nullish coalescing, destructuring, template literals, `Intl.NumberFormat`
- CSS3 - Styling and layout (`src/styles.css`)
  - Uses CSS custom properties (variables), CSS Grid, Flexbox

**Secondary:**
- None

## Runtime

**Environment:**
- Browser (client-side only — no server-side runtime)
- No Node.js runtime used at execution time; `npx http-server` is used only for local development serving

**Package Manager:**
- npm (implicit via `npx` usage)
- Lockfile: Not present (`package-lock.json` absent)

## Frameworks

**Core:**
- None — vanilla HTML/CSS/JS, no frontend framework (no React, Vue, Svelte, etc.)

**Testing:**
- None detected

**Build/Dev:**
- `http-server` (via `npx`) — static file server for local development
  - Configured in `package.json` scripts, serves on port 5173

## Key Dependencies

**Critical:**
- `tesseract.js` v5 — OCR engine for reading flight details from uploaded screenshots
  - Loaded via CDN: `https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js`
  - Referenced in `index.html` line 7 and used in `src/app.js` `runOcr()` function
  - No npm install — CDN-only delivery

**Infrastructure:**
- None (no build tools, bundlers, or transpilers)

## Configuration

**Environment:**
- No environment variables used
- No `.env` files present
- No runtime configuration files

**Build:**
- `package.json` — defines project name, version, description, and dev scripts only
  - No `dependencies` or `devDependencies` fields
  - Scripts: `start` and `dev` both run `npx http-server . -p 5173`

## Platform Requirements

**Development:**
- Node.js (any recent version) with `npx` available — only needed to run the local dev server
- Any modern browser for execution

**Production:**
- Any static file host (no server-side runtime required)
- Browser must support: CSS Grid, Flexbox, CSS custom properties, ES2020+, `Intl.NumberFormat`, `async/await`, `FormData`
- `window.Tesseract` must be reachable from CDN for OCR functionality; app degrades gracefully if unavailable

---

*Stack analysis: 2026-04-29*
