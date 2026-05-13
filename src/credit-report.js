const reportInput = document.getElementById("reportInput");
const renderBtn = document.getElementById("renderBtn");
const loadDefaultBtn = document.getElementById("loadDefaultBtn");
const exportPdfBtn = document.getElementById("exportPdfBtn");
const statusText = document.getElementById("statusText");
const validationPanel = document.getElementById("validationPanel");
const reportNameInput = document.getElementById("reportNameInput");
const savedReportsSelect = document.getElementById("savedReportsSelect");
const saveReportBtn = document.getElementById("saveReportBtn");
const deleteReportBtn = document.getElementById("deleteReportBtn");
const renameReportBtn = document.getElementById("renameReportBtn");
const duplicateReportBtn = document.getElementById("duplicateReportBtn");
const versionSelect = document.getElementById("versionSelect");
const restoreVersionBtn = document.getElementById("restoreVersionBtn");
const exportJsonBtn = document.getElementById("exportJsonBtn");
const importJsonBtn = document.getElementById("importJsonBtn");
const importJsonInput = document.getElementById("importJsonInput");
const deterministicRefToggle = document.getElementById("deterministicRefToggle");
const includeInquiriesToggle = document.getElementById("includeInquiriesToggle");
const includeCollectionsToggle = document.getElementById("includeCollectionsToggle");
const includeFooterToggle = document.getElementById("includeFooterToggle");
const includeWatermarkToggle = document.getElementById("includeWatermarkToggle");
const lockConsumerToggle = document.getElementById("lockConsumerToggle");
const lockScoresToggle = document.getElementById("lockScoresToggle");
const lockSummaryToggle = document.getElementById("lockSummaryToggle");
const densitySelect = document.getElementById("densitySelect");
const preflightBtn = document.getElementById("preflightBtn");
const defaultUrl = "/assets/default-credit-report.json";
const storageKey = "creditReportsStoreV1";
const selectedKey = "creditReportsSelectedV1";
const settingsKey = "creditReportSettingsV1";
let lastLoadedText = "";

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function currency(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

function labelize(key) {
  if (key === "ssn_last_four") return "SSN";
  return key.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

function maskedSsn(value) {
  if (value === null || value === undefined || value === "") return "***-**-****";
  const raw = String(value).replace(/\D/g, "");
  if (raw.length !== 4) return "***-**-****";
  return `***-**-${raw}`;
}

function formatValue(value, key = "") {
  if (value === null || value === undefined || value === "") return "N/A";
  if (typeof value === "number" && /(balance|limit|payment|credit|debt|amount|score|utilization|paydown)/i.test(key)) {
    if (/percent|utilization/i.test(key)) return `${value}%`;
    if (/score/.test(key) && !/score_change/.test(key)) return String(value);
    return currency(value);
  }
  if (Array.isArray(value)) {
    if (!value.length) return "None";
    if (value.every((item) => typeof item !== "object")) return value.join(", ");
    return value.map((item) => {
      if (item && typeof item === "object") {
        return Object.entries(item).map(([k, v]) => `${labelize(k)}: ${formatValue(v, k)}`).join(" | ");
      }
      return String(item);
    }).join(" || ");
  }
  if (typeof value === "object") {
    return Object.entries(value).map(([k, v]) => `${labelize(k)}: ${formatValue(v, k)}`).join(" | ");
  }
  return String(value);
}

function renderBadge(value) {
  const text = String(value || "");
  const tone = /good|positive|current|paid/i.test(text)
    ? "good"
    : /high risk|negative|charged off|delinquent|late|unpaid|poor|weak/i.test(text)
      ? "bad"
      : /needs attention|fair|medium|low to medium|needs improvement/i.test(text)
        ? "warn"
        : "neutral";
  return `<span class="badge ${tone}">${escapeHtml(text)}</span>`;
}

function renderMetricStrip(scores, summary) {
  return `
    <section class="metric-strip">
      <div><span>Primary Score</span><strong>${escapeHtml(formatValue(scores.primary_score, "score"))}</strong></div>
      <div><span>Utilization</span><strong>${escapeHtml(formatValue(summary.overall_utilization_percent, "utilization_percent"))}</strong></div>
      <div><span>Total Debt</span><strong>${escapeHtml(formatValue(summary.total_debt, "total_debt"))}</strong></div>
      <div><span>Collections</span><strong>${escapeHtml(formatValue(summary.collection_accounts, "collection_accounts"))}</strong></div>
    </section>
  `;
}

function renderGrid(data) {
  const entries = Object.entries(data || {});
  if (!entries.length) return "<p class=\"empty\">No records.</p>";
  return `<div class="grid">${entries.map(([key, value]) => `
    <div class="item">
      <span>${labelize(key)}</span>
      <strong>${/(status|health|rating|impact|priority|readiness|label|final_status|payment_status)/i.test(key)
        ? renderBadge(formatValue(value, key))
        : escapeHtml(formatValue(value, key))}</strong>
    </div>`).join("")}</div>`;
}

function renderMetadataGrid(data) {
  const entries = Object.entries(data || {});
  if (!entries.length) return "<p class=\"empty\">No records.</p>";
  return `<div class="grid metadata-grid">${entries.map(([key, value]) => `
    <div class="item">
      <span>${labelize(key)}</span>
      <strong>${escapeHtml(formatValue(value, key))}</strong>
    </div>`).join("")}</div>`;
}

function renderNamedGrid(data, className = "") {
  const entries = Object.entries(data || {});
  if (!entries.length) return "<p class=\"empty\">No records.</p>";
  return `<div class="grid ${className}">${entries.map(([key, value]) => `
    <div class="item">
      <span>${labelize(key)}</span>
      <strong>${/(status|health|rating|impact|priority|readiness|label|final_status|payment_status)/i.test(key)
        ? renderBadge(formatValue(value, key))
        : escapeHtml(formatValue(value, key))}</strong>
    </div>`).join("")}</div>`;
}

function unionHeaders(rows) {
  const headers = [];
  (rows || []).forEach((row) => {
    Object.keys(row || {}).forEach((key) => {
      if (!headers.includes(key)) headers.push(key);
    });
  });
  return headers;
}

function headerPriority(header) {
  const normalized = String(header || "").toLowerCase();
  if (/creditor|company|collection_agency|original_creditor/.test(normalized)) return 1;
  if (/account_type|status|payment_status|account_health|rating|impact_level|priority_level/.test(normalized)) return 2;
  if (/balance|credit_limit|current_balance|monthly_payment|total_debt|utilization|score/.test(normalized)) return 3;
  if (/date|opened|reported|closed/.test(normalized)) return 4;
  return 5;
}

function compactColumns(rows, headers) {
  const maxColumns = 8;
  if (headers.length <= maxColumns) return { headers, rows };

  const sorted = [...headers].sort((a, b) => {
    const pr = headerPriority(a) - headerPriority(b);
    if (pr !== 0) return pr;
    return a.localeCompare(b);
  });

  const kept = sorted.slice(0, maxColumns - 1);
  const omitted = sorted.slice(maxColumns - 1);
  const compactedRows = rows.map((row) => {
    const details = omitted
      .map((key) => `${labelize(key)}: ${formatValue(row?.[key], key)}`)
      .filter((line) => !line.endsWith("N/A"))
      .join(" | ");
    return {
      ...row,
      __details: details || "N/A"
    };
  });

  return {
    headers: [...kept, "__details"],
    rows: compactedRows
  };
}

function renderTable(rows) {
  if (!rows || !rows.length) return "<p class=\"empty\">No records.</p>";
  const allHeaders = unionHeaders(rows);
  const compacted = compactColumns(rows, allHeaders);
  const headers = compacted.headers;
  const renderRows = compacted.rows;
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>${headers.map((header) => `<th>${labelize(header)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${renderRows.map((row) => `
            <tr>${headers.map((header) => {
              const rendered = formatValue(row?.[header], header);
              if (/(status|health|rating|impact|priority|readiness|label|final_status|payment_status)/i.test(header)) {
                return `<td>${renderBadge(rendered)}</td>`;
              }
              const className = header === "__details" ? "details-cell" : "";
              return `<td class="${className}">${escapeHtml(rendered)}</td>`;
            }).join("")}</tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function validateReportShape(report) {
  const missing = [];
  if (!report || typeof report !== "object") missing.push("root object");
  if (!report.consumer) missing.push("consumer");
  if (!report.scores) missing.push("scores");
  if (!report.credit_summary && !report.summary) missing.push("credit_summary");
  return missing;
}

function renderValidation(messages) {
  if (!validationPanel) return;
  if (!messages.length) {
    validationPanel.innerHTML = "<span class=\"ok\">Validation passed.</span>";
    return;
  }
  validationPanel.innerHTML = messages.map((msg) => `<span>${escapeHtml(msg)}</span>`).join("");
}

function fnv1a(value) {
  let hash = 0x811c9dc5;
  for (const char of String(value)) {
    hash ^= char.charCodeAt(0);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash.toString(36).toUpperCase();
}

function generateReportReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let token = "";
  for (let i = 0; i < 8; i += 1) {
    token += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `CR-${token}`;
}

function deterministicReference(report) {
  const seed = [
    report?.consumer?.full_name || "",
    report?.consumer?.date_of_birth || "",
    report?.report_metadata?.report_date || "",
    report?.scores?.primary_score || ""
  ].join("|");
  return `CR-${fnv1a(seed).padStart(8, "0").slice(0, 8)}`;
}

function renderRightsFooter() {
  return `
    <footer class="report-footer">
      <h3>Your rights to your free annual credit reports</h3>
      <p>
        Federal law requires each of the three nationwide consumer credit reporting companies - Equifax, Experian and
        TransUnion - to give you a free credit report every 12 months if you ask for it. They also make it easy to
        accomplish many credit-related tasks right from your computer. The Federal Trade Commission and the Consumer
        Financial Protection Bureau sites contain extensive information about credit reports, your rights, and the laws
        that guarantee these rights. You can learn more about your free reports at the Federal Trade Commission’s
        website and the Consumer Financial Protection Bureau’s website.
      </p>
    </footer>
  `;
}

function renderVerificationBlock(reportDate = "") {
  const today = reportDate || new Date().toISOString().slice(0, 10);
  return `
    <section class="verification-block">
      <div class="verify-row"><span>Prepared for</span><strong>Authorized Recipient</strong></div>
      <div class="verify-row"><span>Report date</span><strong>${escapeHtml(today)}</strong></div>
      <div class="verify-row"><span>Authorized by</span><strong>Credit Profile Office</strong></div>
      <div class="verify-signature">
        <span>Verification signature</span>
        <img src="/assets/signature.png" alt="Authorized signature" class="signature-image" />
      </div>
    </section>
  `;
}

function displayCreditReport(report) {
  const root = document.getElementById("creditReport");
  if (!root) return;

  const metadata = { ...(report.report_metadata || {}) };
  delete metadata.generated_by;
  metadata.report_reference = deterministicRefToggle.checked ? deterministicReference(report) : generateReportReference();
  const consumer = report.consumer || {};
  const consumerAddress = consumer.current_address || {};
  const employer = consumer.employer || {};
  const scores = report.scores || {};
  const summary = report.credit_summary || report.summary || {};
  const hardInquiries = report.inquiries?.hard_inquiries || report.inquiries || [];
  const softInquiries = report.inquiries?.soft_inquiries || [];
  const includeInquiries = includeInquiriesToggle.checked;
  const includeCollections = includeCollectionsToggle.checked;
  const includeFooter = includeFooterToggle.checked;
  const includeWatermark = includeWatermarkToggle.checked;

  root.innerHTML = `
    <div class="print-page-header" aria-hidden="true">
      <div class="print-header-left">
        <img src="/assets/credit-logo.png" alt="" />
        <span>Credit Profile Report</span>
      </div>
      <div class="print-header-right">
        <span>Report ID: ${escapeHtml(metadata.report_reference || "")}</span>
        <span>Report Date: ${escapeHtml(metadata.report_date || "")}</span>
        <span>Confidential</span>
      </div>
    </div>
    ${includeWatermark ? "<div class=\"page-watermark\" aria-hidden=\"true\">CREDIT PROFILE REPORT</div>" : ""}
    <header class="report-header">
      <div class="report-brand">
        <img src="/assets/credit-logo.png" alt="Credit Reports Logo" class="report-logo" />
        <div>
          <div class="report-meta-line">
            <span>Report ID: ${escapeHtml(metadata.report_reference || "")}</span>
            <span>Report Date: ${escapeHtml(metadata.report_date || "")}</span>
            <span class="confidential-pill">Confidential</span>
          </div>
          <h2>Consumer Credit Report</h2>
          <p>${escapeHtml(consumer.full_name || "Unknown Consumer")} • Rating: ${escapeHtml(scores.rating || "N/A")}</p>
        </div>
      </div>
    </header>
    ${renderMetricStrip(scores, summary)}

    <section class="section">
      <h3>Report Metadata</h3>
      ${renderMetadataGrid(metadata)}
    </section>

    <section class="section">
      <h3>Consumer</h3>
      ${renderNamedGrid({
        full_name: consumer.full_name || "",
        date_of_birth: consumer.date_of_birth || "",
        ssn_last_four: maskedSsn(consumer.ssn_last_four),
        current_address: [consumerAddress.street, consumerAddress.city, consumerAddress.state, consumerAddress.zip_code, consumerAddress.country].filter(Boolean).join(", "),
        previous_addresses: (consumer.previous_addresses || []).map((addr) => [addr.street, addr.city, addr.state, addr.zip_code, addr.country].filter(Boolean).join(", ")).join(" ; "),
        employer: employer.name || "",
        employer_position: employer.position || ""
      }, "consumer-grid")}
    </section>

    <section class="section">
      <h3>Scores</h3>
      ${renderNamedGrid({
        primary_score: scores.primary_score ?? "",
        rating: scores.rating ?? "",
        average_score: scores.average_score ?? "",
        experian: scores.bureau_scores?.experian ?? "",
        equifax: scores.bureau_scores?.equifax ?? "",
        transunion: scores.bureau_scores?.transunion ?? "",
        score_trend: scores.score_trend ?? "",
        previous_score: scores.previous_score ?? "",
        score_change: scores.score_change ?? "",
        last_updated: scores.last_updated ?? ""
      }, "scores-grid")}
    </section>

    <section class="section">
      <h3>Summary</h3>
      ${renderNamedGrid(summary, "summary-grid")}
    </section>

    <section class="section">
      <h3>Revolving Accounts</h3>
      ${renderTable(report.revolving_accounts || [])}
    </section>

    <section class="section">
      <h3>Installment Accounts</h3>
      ${renderTable(report.installment_accounts || [])}
    </section>

    <section class="section">
      <h3>Closed Accounts</h3>
      ${renderTable(report.closed_accounts || [])}
    </section>

    ${includeCollections ? `
      <section class="section">
        <h3>Collection Accounts</h3>
        ${renderTable(report.collection_accounts || report.collections || [])}
      </section>
    ` : ""}

    ${includeInquiries ? `
      <section class="section">
        <h3>Hard Inquiries</h3>
        ${renderTable(hardInquiries)}
      </section>

      <section class="section">
        <h3>Soft Inquiries</h3>
        ${renderTable(softInquiries)}
      </section>
    ` : ""}

    <section class="section">
      <h3>Presentation Summary</h3>
      ${renderNamedGrid(report.presentation_summary || {}, "presentation-summary-grid")}
    </section>

    ${renderVerificationBlock(metadata.report_date || "")}
    ${includeFooter ? renderRightsFooter() : ""}
  `;
}

function getSectionLocks() {
  return {
    consumer: lockConsumerToggle.checked,
    scores: lockScoresToggle.checked,
    summary: lockSummaryToggle.checked
  };
}

function mergeLockedSections(candidate) {
  const locks = getSectionLocks();
  if (!locks.consumer && !locks.scores && !locks.summary) return candidate;
  try {
    const existing = JSON.parse(lastLoadedText || "{}");
    if (locks.consumer) candidate.consumer = existing.consumer || candidate.consumer;
    if (locks.scores) candidate.scores = existing.scores || candidate.scores;
    if (locks.summary) {
      candidate.credit_summary = existing.credit_summary || candidate.credit_summary;
      if (!candidate.credit_summary) candidate.summary = existing.summary || candidate.summary;
    }
  } catch (error) {
    return candidate;
  }
  return candidate;
}

function renderFromInput() {
  try {
    const parsed = JSON.parse(reportInput.value);
    const data = mergeLockedSections(parsed);
    if (data !== parsed) reportInput.value = JSON.stringify(data, null, 2);
    const missing = validateReportShape(data);
    displayCreditReport(data);
    statusText.textContent = missing.length ? `Rendered with warnings: missing ${missing.join(", ")}.` : "";
    renderValidation(missing.map((field) => `Missing required section: ${field}`));
  } catch (error) {
    statusText.textContent = "Invalid JSON. Check the format and try again.";
    renderValidation(["Invalid JSON format."]);
  }
}

window.displayCreditReport = displayCreditReport;

function readStore() {
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    return {};
  }
}

function writeStore(store) {
  localStorage.setItem(storageKey, JSON.stringify(store));
}

function refreshSavedReportsList(preferred = "") {
  const store = readStore();
  const names = Object.keys(store).sort((a, b) => a.localeCompare(b));
  savedReportsSelect.innerHTML = names.length
    ? names.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("")
    : "<option value=\"\">No saved reports</option>";

  const next = preferred && names.includes(preferred)
    ? preferred
    : (localStorage.getItem(selectedKey) && names.includes(localStorage.getItem(selectedKey)))
      ? localStorage.getItem(selectedKey)
      : names[0] || "";
  if (next) {
    savedReportsSelect.value = next;
    localStorage.setItem(selectedKey, next);
  }
}

function loadSavedReport(name) {
  if (!name) return;
  const store = readStore();
  const payload = store[name];
  const reportEntry = typeof payload === "string" ? { current: payload, versions: [] } : payload;
  if (!reportEntry?.current) return;
  reportInput.value = reportEntry.current;
  reportNameInput.value = name;
  lastLoadedText = reportEntry.current;
  localStorage.setItem(selectedKey, name);
  refreshVersionList(name);
  renderFromInput();
}

function refreshVersionList(name) {
  const store = readStore();
  const payload = store[name];
  const reportEntry = typeof payload === "string" ? { current: payload, versions: [] } : payload;
  const versions = reportEntry?.versions || [];
  versionSelect.innerHTML = versions.length
    ? versions.map((v, idx) => `<option value="${idx}">${escapeHtml(v.ts)}</option>`).join("")
    : "<option value=\"\">No versions</option>";
}

async function loadDefaultReport() {
  const url = `${defaultUrl}?v=${Date.now()}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to load default report");
  const text = await response.text();
  reportInput.value = text;
  lastLoadedText = text;
  renderFromInput();
}

function hasUnsavedInputChanges() {
  return reportInput.value.trim() !== (lastLoadedText || "").trim();
}

function getClientNameFromInput() {
  try {
    const parsed = JSON.parse(reportInput.value || "{}");
    const name = parsed?.consumer?.full_name;
    return String(name || "").trim() || "credit-report";
  } catch (error) {
    return "credit-report";
  }
}

async function init() {
  try {
    await loadDefaultReport();
    applySettings();
    refreshSavedReportsList();
    const selected = localStorage.getItem(selectedKey);
    if (selected) loadSavedReport(selected);
    else renderFromInput();
  } catch (error) {
    statusText.textContent = "Could not load default report file.";
  }
}

function readSettings() {
  try {
    const raw = localStorage.getItem(settingsKey);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

function writeSettings() {
  const data = {
    deterministicRef: deterministicRefToggle.checked,
    includeInquiries: includeInquiriesToggle.checked,
    includeCollections: includeCollectionsToggle.checked,
    includeFooter: includeFooterToggle.checked,
    includeWatermark: includeWatermarkToggle.checked,
    lockConsumer: lockConsumerToggle.checked,
    lockScores: lockScoresToggle.checked,
    lockSummary: lockSummaryToggle.checked,
    density: densitySelect.value
  };
  localStorage.setItem(settingsKey, JSON.stringify(data));
}

function applySettings() {
  const s = readSettings();
  deterministicRefToggle.checked = Boolean(s.deterministicRef);
  includeInquiriesToggle.checked = s.includeInquiries !== false;
  includeCollectionsToggle.checked = s.includeCollections !== false;
  includeFooterToggle.checked = s.includeFooter !== false;
  includeWatermarkToggle.checked = s.includeWatermark !== false;
  lockConsumerToggle.checked = Boolean(s.lockConsumer);
  lockScoresToggle.checked = Boolean(s.lockScores);
  lockSummaryToggle.checked = Boolean(s.lockSummary);
  densitySelect.value = s.density === "compact" ? "compact" : "standard";
  document.body.classList.toggle("print-compact", densitySelect.value === "compact");
}

function runPreflightChecks() {
  const findings = [];
  let report;
  try {
    report = JSON.parse(reportInput.value || "{}");
  } catch (error) {
    findings.push("Invalid JSON: fix input before export.");
    renderValidation(findings);
    return;
  }
  const longValues = JSON.stringify(report).length;
  if (longValues > 120000) findings.push("Large report payload may cause dense PDF pages.");
  if ((report.revolving_accounts || []).length > 8) findings.push("Many revolving accounts: expect multi-page tables.");
  if ((report.closed_accounts || []).length > 8) findings.push("Many closed accounts: verify readability in export.");
  if (!report.consumer?.full_name) findings.push("Missing consumer full name (filename and report identity).");
  if (!findings.length) findings.push("Print QA passed: no major layout risks detected.");
  renderValidation(findings);
}

renderBtn.addEventListener("click", renderFromInput);
loadDefaultBtn.addEventListener("click", async () => {
  if (hasUnsavedInputChanges()) {
    const proceed = window.confirm("This will replace your current input with the default report. Continue?");
    if (!proceed) return;
  }
  try {
    await loadDefaultReport();
    statusText.textContent = "";
  } catch (error) {
    statusText.textContent = "Could not reload default report file.";
  }
});

exportPdfBtn.addEventListener("click", () => {
  const originalTitle = document.title;
  const clientName = getClientNameFromInput().replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim();
  document.title = clientName || "credit-report";
  window.print();
  setTimeout(() => {
    document.title = originalTitle;
  }, 300);
});

saveReportBtn.addEventListener("click", () => {
  const name = reportNameInput.value.trim();
  if (!name) {
    statusText.textContent = "Enter a report name before saving.";
    return;
  }
  try {
    JSON.parse(reportInput.value);
  } catch (error) {
    statusText.textContent = "Cannot save invalid JSON.";
    return;
  }
  const store = readStore();
  const existing = store[name];
  const currentEntry = typeof existing === "string" ? { current: existing, versions: [] } : (existing || { current: "", versions: [] });
  const versions = Array.isArray(currentEntry.versions) ? currentEntry.versions : [];
  versions.unshift({ ts: new Date().toISOString(), data: reportInput.value });
  store[name] = { current: reportInput.value, versions: versions.slice(0, 25) };
  writeStore(store);
  refreshSavedReportsList(name);
  refreshVersionList(name);
  localStorage.setItem(selectedKey, name);
  statusText.textContent = `Saved report: ${name}`;
});

deleteReportBtn.addEventListener("click", () => {
  const selected = savedReportsSelect.value;
  if (!selected || selected === "No saved reports") return;
  const store = readStore();
  if (!store[selected]) return;
  delete store[selected];
  writeStore(store);
  const remaining = Object.keys(store).sort((a, b) => a.localeCompare(b));
  const next = remaining[0] || "";
  refreshSavedReportsList(next);
  if (next) {
    loadSavedReport(next);
    statusText.textContent = `Deleted ${selected}. Loaded ${next}.`;
  } else {
    localStorage.removeItem(selectedKey);
    statusText.textContent = `Deleted ${selected}.`;
  }
});

renameReportBtn.addEventListener("click", () => {
  const selected = savedReportsSelect.value;
  if (!selected || selected === "No saved reports") return;
  const nextName = window.prompt("New report name:", selected);
  if (!nextName) return;
  const clean = nextName.trim();
  if (!clean || clean === selected) return;
  const store = readStore();
  if (store[clean]) {
    statusText.textContent = "A report with that name already exists.";
    return;
  }
  store[clean] = store[selected];
  delete store[selected];
  writeStore(store);
  reportNameInput.value = clean;
  refreshSavedReportsList(clean);
  refreshVersionList(clean);
  localStorage.setItem(selectedKey, clean);
  statusText.textContent = `Renamed ${selected} to ${clean}.`;
});

duplicateReportBtn.addEventListener("click", () => {
  const selected = savedReportsSelect.value;
  if (!selected || selected === "No saved reports") return;
  const store = readStore();
  const cloneName = `${selected} Copy`;
  let name = cloneName;
  let count = 2;
  while (store[name]) {
    name = `${cloneName} ${count}`;
    count += 1;
  }
  store[name] = JSON.parse(JSON.stringify(store[selected]));
  writeStore(store);
  refreshSavedReportsList(name);
  loadSavedReport(name);
  statusText.textContent = `Duplicated report to ${name}.`;
});

savedReportsSelect.addEventListener("change", () => {
  const selected = savedReportsSelect.value;
  if (!selected || selected === "No saved reports") return;
  loadSavedReport(selected);
});

exportJsonBtn.addEventListener("click", () => {
  let data;
  try {
    data = JSON.parse(reportInput.value || "{}");
  } catch (error) {
    statusText.textContent = "Cannot export invalid JSON.";
    return;
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const clientName = (data?.consumer?.full_name || "credit-report").replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, "-").toLowerCase();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${clientName}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
});

importJsonBtn.addEventListener("click", () => importJsonInput.click());
importJsonInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    JSON.parse(text);
    reportInput.value = text;
    lastLoadedText = text;
    renderFromInput();
    statusText.textContent = `Imported ${file.name}.`;
  } catch (error) {
    statusText.textContent = "Invalid JSON file.";
  } finally {
    importJsonInput.value = "";
  }
});

restoreVersionBtn.addEventListener("click", () => {
  const name = savedReportsSelect.value;
  if (!name || name === "No saved reports") return;
  const idx = Number(versionSelect.value);
  const store = readStore();
  const payload = store[name];
  const entry = typeof payload === "string" ? { current: payload, versions: [] } : payload;
  const version = entry?.versions?.[idx];
  if (!version?.data) return;
  reportInput.value = version.data;
  lastLoadedText = version.data;
  renderFromInput();
  statusText.textContent = `Restored version ${version.ts}`;
});

[deterministicRefToggle, includeInquiriesToggle, includeCollectionsToggle, includeFooterToggle, includeWatermarkToggle, lockConsumerToggle, lockScoresToggle, lockSummaryToggle, densitySelect]
  .forEach((control) => control.addEventListener("change", () => {
    if (control === densitySelect) {
      document.body.classList.toggle("print-compact", densitySelect.value === "compact");
    }
    writeSettings();
    renderFromInput();
  }));

preflightBtn.addEventListener("click", runPreflightChecks);

init();
