import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";

function ReceivedMailPage() {
  useEffect(() => {
    import("./received-mail.js");
  }, []);

  return (
    <>
      <header className="site-header">
        <a className="site-brand" href="/">DocuHQ</a>
        <nav>
          <a href="/">Home</a>
          <a href="/itinerary/">Itinerary</a>
          <a href="/received-mail/" className="active">Received Mail</a>
          <a href="/credit-report/">Credit Reports</a>
          <a href="/crypto-wallet/">Crypto Wallet</a>
          <a href="/ink-stamp/">Ink Stamp</a>
        </nav>
      </header>
      <main className="mail-app">
        <aside className="mail-sidebar">
          <div className="brand">
            <span>FB</span>
            <div>
              <h1>DocuHQ</h1>
              <p>Received Mail</p>
            </div>
          </div>

          <form id="mailForm" className="mail-form">
            <label>
              Body template
              <select id="bodyTemplate" name="bodyTemplate">
                <option value="blank">Blank / custom</option>
                <option value="airPeaceReschedule">Air Peace - flight rescheduling</option>
                <option value="unitedNigeriaReschedule">United Nigeria - flight rescheduling</option>
                <option value="ibomAirReschedule">Ibom Air - flight rescheduling</option>
                <option value="valueJetReschedule">ValueJet - flight rescheduling</option>
                <option value="greenAfricaReschedule">Green Africa - flight rescheduling</option>
                <option value="ranoAirReschedule">Rano Air - flight rescheduling</option>
                <option value="aeroReschedule">Aero Contractors - flight rescheduling</option>
                <option value="arikReschedule">Arik Air - flight rescheduling</option>
                <option value="maxAirReschedule">Max Air - flight rescheduling</option>
                <option value="overlandReschedule">Overland Airways - flight rescheduling</option>
              </select>
            </label>
            <label>
              Mail provider
              <select id="provider" name="provider">
                <option value="gmail">Gmail</option>
                <option value="outlook">Outlook</option>
                <option value="apple">Apple Mail</option>
              </select>
            </label>
            <label>
              From name
              <input id="fromName" name="fromName" defaultValue="British Airways" />
            </label>
            <label>
              From email
              <input id="fromEmail" name="fromEmail" defaultValue="noreply@ba.com" />
            </label>
            <label>
              To
              <input id="toEmail" name="toEmail" defaultValue="passenger@example.com" />
            </label>
            <label>
              Subject
              <input id="subject" name="subject" defaultValue="Your flight itinerary confirmation" />
            </label>
            <div className="split">
              <label>
                Date
                <input id="mailDate" name="mailDate" type="date" />
              </label>
              <label>
                Time
                <input id="mailTime" name="mailTime" type="time" defaultValue="09:42" />
              </label>
            </div>
            <label>
              Status
              <select id="status" name="status">
                <option value="Inbox">Inbox</option>
                <option value="Important">Important</option>
                <option value="Starred">Starred</option>
              </select>
            </label>
            <label>
              Message body
              <textarea id="body" name="body" defaultValue={`Dear Passenger,\n\nYour flight itinerary has been confirmed. Please find your travel details below and ensure all passenger information matches your travel document.\n\nBooking reference: ABC123\nRoute: New York (JFK) to London (LHR)\nStatus: Paid and confirmed\n\nThank you for choosing British Airways.`} />
            </label>
            <div className="actions">
              <button type="submit">Update mail</button>
              <button type="button" id="printMail" className="secondary">Print / save</button>
            </div>
          </form>
        </aside>
        <section className="mail-preview-wrap">
          <article id="mailPreview" className="mail-preview gmail"></article>
        </section>
      </main>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ReceivedMailPage />);
