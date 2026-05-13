import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";

function CreditReportPage() {
  useEffect(() => {
    import("./credit-report.js");
  }, []);

  return (
    <>
      <header className="site-header">
        <a className="site-brand" href="/">DocuHQ</a>
        <nav>
          <a href="/">Home</a>
          <a href="/itinerary/">Itinerary</a>
          <a href="/received-mail/">Received Mail</a>
          <a href="/credit-report/" className="active">Credit Reports</a>
          <a href="/crypto-wallet/">Crypto Wallet</a>
          <a href="/ink-stamp/">Ink Stamp</a>
        </nav>
      </header>
      <main className="credit-app">
        <aside className="input-panel">
          <div className="brand">
            <img src="/assets/credit-logo.png" alt="Credit Reports" className="credit-logo" />
            <div>
              <h1>Credit Report Viewer</h1>
              <p>Paste JSON and render a report preview.</p>
            </div>
          </div>
          <label htmlFor="reportInput">
            Credit report JSON
            <textarea id="reportInput" aria-describedby="statusText" spellCheck="false"></textarea>
          </label>
          <details className="control-group" open>
            <summary>Data</summary>
            <div className="storage-panel">
              <label htmlFor="reportNameInput">Report name<input id="reportNameInput" type="text" placeholder="e.g. Melinda - May 2026" /></label>
              <label htmlFor="savedReportsSelect">Saved reports<select id="savedReportsSelect"></select></label>
              <div className="storage-actions">
                <button id="saveReportBtn" type="button" title="Save current input to local storage">Save Report</button>
                <button id="deleteReportBtn" type="button" title="Delete selected saved report">Delete Report</button>
              </div>
              <div className="storage-actions">
                <button id="renameReportBtn" type="button" title="Rename selected report">Rename Report</button>
                <button id="duplicateReportBtn" type="button" title="Duplicate selected report">Duplicate Report</button>
              </div>
              <label htmlFor="versionSelect">Saved versions<select id="versionSelect"></select></label>
              <button id="restoreVersionBtn" type="button" title="Restore selected version">Restore Version</button>
              <div className="storage-actions">
                <button id="exportJsonBtn" type="button" title="Download current report JSON">Export JSON</button>
                <button id="importJsonBtn" type="button" title="Import report JSON file">Import JSON</button>
                <input id="importJsonInput" type="file" accept="application/json,.json" hidden />
              </div>
            </div>
          </details>
          <details className="control-group" open>
            <summary>Export</summary>
            <div className="storage-panel">
              <label className="check"><input id="deterministicRefToggle" type="checkbox" /> Deterministic report reference</label>
              <label className="check"><input id="includeInquiriesToggle" type="checkbox" defaultChecked /> Include inquiries sections</label>
              <label className="check"><input id="includeCollectionsToggle" type="checkbox" defaultChecked /> Include collection accounts</label>
              <label className="check"><input id="includeFooterToggle" type="checkbox" defaultChecked /> Include rights footer</label>
              <label className="check"><input id="includeWatermarkToggle" type="checkbox" defaultChecked /> Include watermark</label>
              <label className="check"><input id="lockConsumerToggle" type="checkbox" /> Lock consumer section</label>
              <label className="check"><input id="lockScoresToggle" type="checkbox" /> Lock scores section</label>
              <label className="check"><input id="lockSummaryToggle" type="checkbox" /> Lock summary section</label>
              <label htmlFor="densitySelect">
                PDF density
                <select id="densitySelect">
                  <option value="standard">Standard</option>
                  <option value="compact">Compact</option>
                </select>
              </label>
              <button id="preflightBtn" type="button" title="Run print preflight checks">Run Print QA</button>
            </div>
          </details>
          <div className="actions">
            <button id="loadDefaultBtn" type="button" title="Reload default report data">Load Default</button>
            <button id="renderBtn" type="button" title="Render report from input">Render Report</button>
            <button id="exportPdfBtn" type="button" title="Export report as PDF">Export PDF</button>
          </div>
          <p id="statusText" className="status" aria-live="polite"></p>
          <div id="validationPanel" className="validation-panel"></div>
        </aside>
        <section className="preview-shell">
          <article id="creditReport" className="credit-report"></article>
        </section>
      </main>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<CreditReportPage />);
