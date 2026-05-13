import React from "react";
import ReactDOM from "react-dom/client";

function HomePage() {
  return (
    <>
      <header className="site-header">
        <a className="site-brand" href="/">DocuHQ</a>
        <nav>
          <a href="/" className="active">Home</a>
          <a href="/itinerary/">Itinerary</a>
          <a href="/received-mail/">Received Mail</a>
          <a href="/credit-report/">Credit Reports</a>
          <a href="/crypto-wallet/">Crypto Wallet</a>
          <a href="/ink-stamp/">Ink Stamp</a>
        </nav>
      </header>
      <main className="app">
        <section className="workspace">
          <aside className="panel input-panel">
            <div className="brand">
              <span className="brand-mark">FB</span>
              <div>
                <h1>DocuHQ Workspace</h1>
                <p>Choose a tool to continue</p>
              </div>
            </div>
            <div className="actions" style={{ gridTemplateColumns: "1fr" }}>
              <a href="/itinerary/"><button type="button">Open Itinerary Generator</button></a>
              <a href="/received-mail/"><button type="button" className="secondary">Open Received Mail</button></a>
              <a href="/credit-report/"><button type="button" className="secondary">Open Credit Reports</button></a>
              <a href="/crypto-wallet/"><button type="button" className="secondary">Open Crypto Wallet</button></a>
              <a href="/ink-stamp/"><button type="button" className="secondary">Open Ink Stamp Generator</button></a>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<HomePage />);
