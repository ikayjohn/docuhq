import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";

function ItineraryPage() {
  useEffect(() => {
    const existing = document.querySelector('script[data-ocr="tesseract"]');
    if (window.Tesseract) {
      import("./app.js");
      return;
    }
    if (existing) {
      existing.addEventListener("load", () => {
        import("./app.js");
      }, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
    script.defer = true;
    script.dataset.ocr = "tesseract";
    script.addEventListener("load", () => {
      import("./app.js");
    }, { once: true });
    document.head.appendChild(script);
  }, []);

  return (
    <>
      <header className="site-header">
        <a className="site-brand" href="/">DocuHQ</a>
        <nav>
          <a href="/">Home</a>
          <a href="/itinerary/" className="active">Itinerary</a>
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
              <span className="brand-mark">FT</span>
              <div>
                <h1>DocuHQ</h1>
                <p>Flight itinerary documents</p>
              </div>
            </div>

            <section className="ocr-panel">
              <div>
                <h2>Flight screenshot</h2>
                <p>Upload the booking or flight search screenshot first. Review extracted details before generating.</p>
              </div>
              <label className="file-drop">
                <input id="screenshotInput" type="file" accept="image/*" multiple />
                <span>Choose screenshot(s)</span>
              </label>
              <div id="ocrStatus" className="ocr-status">OCR ready</div>
              <textarea id="ocrText" className="ocr-text" placeholder="Extracted screenshot text will appear here. You can paste or edit OCR text manually too." />
              <button type="button" id="parseOcrBtn" className="secondary">Apply extracted details</button>
            </section>

            <form id="itineraryForm" className="form secondary-inputs">
              <label>
                Passenger names
                <textarea id="passengerNames" name="passengerNames" placeholder="One passenger per line" required />
              </label>
              <div className="split">
                <label>
                  Booking reference
                  <input id="bookingRef" name="bookingRef" placeholder="PNR / booking reference" />
                </label>
                <label>
                  Ticket number
                  <input id="ticketNumber" name="ticketNumber" placeholder="Optional" />
                </label>
              </div>
              <div className="split">
                <label>
                  Origin
                  <select id="origin" name="origin" />
                </label>
                <label>
                  Destination
                  <select id="destination" name="destination" />
                </label>
              </div>
              <div className="split">
                <label>
                  Departure
                  <input id="departDate" name="departDate" type="date" required />
                </label>
                <label>
                  Return
                  <input id="returnDate" name="returnDate" type="date" />
                </label>
              </div>
              <label>
                Multi-city routing
                <textarea id="multiCityRoutes" name="multiCityRoutes" placeholder={"Optional. One segment per line, e.g.\nJFK LHR YYYY-MM-DD\nLHR CDG YYYY-MM-DD\nCDG JFK YYYY-MM-DD"} />
              </label>
              <label>
                Cabin
                <select id="cabin" name="cabin">
                  <option value="economy">Economy</option>
                  <option value="premium">Premium economy</option>
                  <option value="business">Business</option>
                </select>
              </label>
              <label>
                Baggage
                <input id="baggage" name="baggage" placeholder="e.g. 2 x 23 kg" />
              </label>
              <section className="segment-editor">
                <div className="segment-editor-heading">
                  <h2>Flight segments</h2>
                  <button type="button" id="addSegmentBtn" className="secondary">Add segment</button>
                </div>
                <div id="segmentRows" className="segment-rows" />
              </section>
              <label>
                Agency note
                <textarea id="agencyNote" name="agencyNote" defaultValue="This flight itinerary has been booked for the listed passenger(s). Please verify final ticketing status, baggage allowance, and check-in requirements with the airline before departure." />
              </label>
              <label>
                Imported flight details
                <textarea id="importedDetails" name="importedDetails" placeholder="OCR-extracted airline, flight number, timing, route, duration, price, or layover notes will appear here." />
              </label>
              <div id="validationPanel" className="validation-panel" />
              <div className="actions">
                <button type="submit">Generate itinerary</button>
                <button type="button" id="printBtn" className="secondary">Print / save PDF</button>
                <button type="button" id="resetBtn" className="secondary">Reset form</button>
              </div>
            </form>
            <div className="data-note">Flight itinerary documents for visa applications and travel planning. Not a ticket or reservation.</div>
          </aside>
          <section className="preview-shell">
            <div className="toolbar">
              <div>
                <strong id="routeTitle"></strong>
                <span id="confidenceTitle"></span>
              </div>
              <span id="docId"></span>
            </div>
            <article id="document" className="document"></article>
          </section>
        </section>
      </main>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ItineraryPage />);
