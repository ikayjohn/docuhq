const form = document.getElementById("mailForm");
const preview = document.getElementById("mailPreview");
const printButton = document.getElementById("printMail");
const bodyTemplate = document.getElementById("bodyTemplate");

const airlineTemplateData = {
  airPeaceReschedule: {
    airline: "Air Peace",
    company: "Air Peace Limited",
    fromEmail: "callcenter@flyairpeace.com",
    flight: "P4 7420",
    route: "Lagos - Abuja",
    date: "19th December 2023",
    time: "20:00",
    phone: "+234 700 359 247 73223",
    website: "flyairpeace.com"
  },
  unitedNigeriaReschedule: {
    airline: "United Nigeria",
    company: "United Nigeria Airlines Company Ltd.",
    fromEmail: "customerservice@flyunitednigeria.com",
    flight: "U5 0553",
    route: "Port Harcourt - Lagos",
    date: "19th December 2023",
    time: "20:00",
    phone: "+234 9062547501",
    website: "flyunitednigeria.com"
  },
  ibomAirReschedule: {
    airline: "Ibom Air",
    company: "Ibom Airlines Limited",
    fromEmail: "reservations@ibomair.com",
    flight: "QI 0304",
    route: "Uyo - Lagos",
    date: "19th December 2023",
    time: "18:40",
    phone: "+234 8142721159",
    website: "ibomair.com"
  },
  valueJetReschedule: {
    airline: "ValueJet",
    company: "ValueJet",
    fromEmail: "info@flyvaluejet.com",
    flight: "VK 201",
    route: "Lagos - Abuja",
    date: "19th December 2023",
    time: "17:30",
    phone: "+234 1 631 5389",
    website: "flyvaluejet.com"
  },
  greenAfricaReschedule: {
    airline: "Green Africa",
    company: "Green Africa Airways Limited",
    fromEmail: "gcare@greenafrica.com",
    flight: "Q9 312",
    route: "Lagos - Owerri",
    date: "19th December 2023",
    time: "16:45",
    phone: "+234 700 47336 247",
    website: "greenafrica.com"
  },
  ranoAirReschedule: {
    airline: "Rano Air",
    company: "Rano Air Limited",
    fromEmail: "info@ranoair.com",
    flight: "R4 2201",
    route: "Abuja - Kano",
    date: "19th December 2023",
    time: "15:20",
    phone: "+234 201 280 2700",
    website: "ranoair.com"
  },
  aeroReschedule: {
    airline: "Aero Contractors",
    company: "Aero Contractors Company of Nigeria Limited",
    fromEmail: "tickethelpdesk@acn.aero",
    flight: "N2 126",
    route: "Lagos - Port Harcourt",
    date: "19th December 2023",
    time: "14:10",
    phone: "+234 1 628 4140",
    website: "flyaero.com"
  },
  arikReschedule: {
    airline: "Arik Air",
    company: "Arik Air Limited",
    fromEmail: "callcentre@arikair.com",
    flight: "W3 718",
    route: "Lagos - Abuja",
    date: "19th December 2023",
    time: "19:15",
    phone: "+234 1 279 9999",
    website: "arikair.com"
  },
  maxAirReschedule: {
    airline: "Max Air",
    company: "Max Air Limited",
    fromEmail: "info@maxair.com.ng",
    flight: "VM 1643",
    route: "Abuja - Lagos",
    date: "19th December 2023",
    time: "21:00",
    phone: "+234 908 760 8888",
    website: "maxair.com.ng"
  },
  overlandReschedule: {
    airline: "Overland Airways",
    company: "Overland Airways Limited",
    fromEmail: "reservations@overlandairways.com",
    flight: "OF 1188",
    route: "Lagos - Ilorin",
    date: "19th December 2023",
    time: "13:55",
    phone: "+234 803 535 5005",
    website: "overlandairways.com"
  }
};

const mailTemplates = Object.fromEntries(
  Object.entries(airlineTemplateData).map(([key, airline]) => [key, buildRescheduleTemplate(airline)])
);

function buildRescheduleTemplate(airline) {
  return {
    fromName: "Customer Service",
    fromEmail: airline.fromEmail,
    subject: "FLIGHT RESCHEDULING",
    body: `Dear esteemed passenger,

Please be advised that your ${airline.airline} flight ${airline.flight}/${airline.route} for ${airline.date} will now operate at ${airline.time} due to operational reasons. We regret any inconvenience caused.

For enquiries including rebooking, please contact our customer service team on ${airline.phone} or email us at ${airline.fromEmail}.

Thank you for making ${airline.airline} your choice Airline.


CUSTOMER SERVICE
${airline.company}
M: ${airline.phone}
E: ${airline.fromEmail}
W: ${airline.website}


The contents of this e-mail including any attachment are confidential to ${airline.company} and intended solely for the person(s) to whom they are addressed.

Any reader of this email who is not the intended recipient is notified that any dissemination, distribution or copying of this communication is strictly prohibited. If you have received this e-mail in error, please notify the sender immediately and delete all copies from your computer system. Subsequent alterations to this email after its transmission will be disregarded."`
  };
}

function init() {
  document.getElementById("mailDate").value = new Date().toISOString().slice(0, 10);
  render();
}

function render() {
  const data = Object.fromEntries(new FormData(form).entries());
  const provider = data.provider || "gmail";
  preview.className = `mail-preview ${provider}`;
  preview.innerHTML = buildMail(data);
}

function buildMail(data) {
  if (data.provider === "outlook") return buildOutlookMail(data);
  if (data.provider === "apple") return buildAppleMail(data);
  return buildGmailMail(data);
}

function buildGmailMail(data) {
  const date = formatDateTime(data.mailDate, data.mailTime);
  const initials = getInitials(data.fromName);

  return `
    <header class="gmail-topbar">
      <button class="gmail-icon-button hamburger" aria-label="Main menu">${localIcon("menu")}</button>
      <div class="gmail-wordmark"><img src="/assets/logo_gmail_lockup_default_1x_r5.png" alt="Gmail" /></div>
      <div class="gmail-search">${localIcon("search")}<span></span><div>${localIcon("x")}${localIcon("sliders-horizontal")}</div></div>
      <div class="gmail-top-icons">
        <button aria-label="Help">${localIcon("circle-help")}</button>
        <button aria-label="Settings">${localIcon("settings")}</button>
        <button aria-label="Gemini">${localIcon("sparkles")}</button>
        <b>Upgrade</b>
        <button aria-label="Google apps">${localIcon("grip")}</button>
        <span class="profile-dot"></span>
      </div>
    </header>
    <div class="gmail-layout">
      <nav class="gmail-sidebar">
        <button class="gmail-compose">${localIcon("pencil")}<span>Compose</span></button>
        ${[
          ["Inbox", "20,672"],
          ["Starred", ""],
          ["Snoozed", ""],
          ["Important", ""],
          ["Sent", ""],
          ["Drafts", "34"],
          ["Purchases", "423"],
          ["Social", "358"],
          ["Updates", "25,787"],
          ["Forums", "1"],
          ["Promotions", "7,182"]
        ].map(([folder, count]) => `
          <div class="gmail-folder ${folder === (data.status || "Inbox") ? "active" : ""}">
            <span><i>${folderIcon(folder)}</i>${folder}</span><em>${count}</em>
          </div>
        `).join("")}
        <div class="gmail-label-title"><span>Labels</span><b>+</b></div>
        ${["[Gmail]Trash", "[Imap]/Sent", "[Imap]/Trash", "Notes", "Personal", "SMS"].map((label) => `
          <div class="gmail-folder gmail-label"><span><i>${localIcon("tag")}</i>${label}</span><em></em></div>
        `).join("")}
      </nav>
      <section class="gmail-reader">
        <div class="gmail-actions">
          <div class="gmail-action-left">
            <button aria-label="Back">${iconSvg("back")}</button>
            <button aria-label="Archive">${iconSvg("archive")}</button>
            <button aria-label="Report spam">${iconSvg("report")}</button>
            <button aria-label="Delete">${iconSvg("delete")}</button>
            <span class="gmail-divider"></span>
            <button aria-label="Mark unread">${iconSvg("mail")}</button>
            <button aria-label="Snooze">${iconSvg("snooze")}</button>
            <button aria-label="More">${iconSvg("more")}</button>
          </div>
          <div class="gmail-action-right"></div>
        </div>
        <div class="gmail-message">
          <div class="gmail-subject">
            <h2>${escapeHtml(data.subject)}</h2>
            <span>${escapeHtml(data.status || "Inbox")} ×</span>
          </div>
          <div class="gmail-meta">
            <div class="avatar gmail-avatar">${escapeHtml(initials)}</div>
            <div>
              <strong>${escapeHtml(data.fromName)}</strong> <span>&lt;${escapeHtml(data.fromEmail)}&gt;</span>
              <p>to ${escapeHtml(data.toEmail)}</p>
            </div>
            <time>${date}</time>
            <div class="gmail-message-icons">
              <button aria-label="Star">${localIcon("star")}</button>
              <button aria-label="Add reaction">${localIcon("smile")}</button>
              <button aria-label="Reply">${localIcon("reply")}</button>
              <button aria-label="More">${localIcon("more-vertical")}</button>
            </div>
          </div>
          <div class="body gmail-body">${escapeHtml(data.body)}</div>
        </div>
      </section>
    </div>
  `;
}

function iconSvg(name) {
  const icons = {
    back: "arrow-left.svg",
    archive: "archive.svg",
    report: "octagon-alert.svg",
    delete: "trash-2.svg",
    mail: "mail.svg",
    snooze: "clock-3.svg",
    more: "more-vertical.svg"
  };
  return `<img src="/assets/icons/${icons[name] || "more-vertical.svg"}" alt="" aria-hidden="true" />`;
}

function localIcon(name) {
  return `<img src="/assets/icons/${name}.svg" alt="" aria-hidden="true" />`;
}

function folderIcon(folder) {
  return {
    Inbox: localIcon("mail"),
    Starred: localIcon("star"),
    Snoozed: localIcon("clock"),
    Important: localIcon("tag"),
    Sent: localIcon("send"),
    Drafts: localIcon("file"),
    Purchases: localIcon("shopping-bag"),
    Social: localIcon("users"),
    Updates: localIcon("info"),
    Forums: localIcon("messages-square"),
    Promotions: localIcon("tag")
  }[folder] || localIcon("mail");
}

function buildOutlookMail(data) {
  const date = formatDateTime(data.mailDate, data.mailTime);
  const initials = getInitials(data.fromName);
  return `
    <header class="outlook-bar">
      <div class="outlook-app">Outlook</div>
      <div class="outlook-search">Search</div>
      <div class="outlook-actions">Meet now · Settings</div>
    </header>
    <div class="outlook-layout">
      <nav class="outlook-nav">
        ${["Inbox", "Junk Email", "Drafts", "Sent Items", "Deleted Items", "Archive"].map((folder) => `
          <div class="outlook-folder ${folder === (data.status || "Inbox") ? "active" : ""}">${folder}</div>
        `).join("")}
      </nav>
      <section class="outlook-list">
        <div class="outlook-list-item active">
          <strong>${escapeHtml(data.fromName)}</strong>
          <span>${escapeHtml(data.subject)}</span>
          <em>${date}</em>
        </div>
      </section>
      <section class="outlook-message">
        <h2>${escapeHtml(data.subject)}</h2>
        <div class="outlook-meta">
          <div class="avatar outlook-avatar">${escapeHtml(initials)}</div>
          <div>
            <strong>${escapeHtml(data.fromName)}</strong>
            <span>&lt;${escapeHtml(data.fromEmail)}&gt;</span>
            <span>To: ${escapeHtml(data.toEmail)}</span>
          </div>
          <time>${date}</time>
        </div>
        <div class="body">${escapeHtml(data.body)}</div>
      </section>
    </div>
  `;
}

function buildAppleMail(data) {
  const date = formatDateTime(data.mailDate, data.mailTime);
  const initials = getInitials(data.fromName);
  return `
    <header class="apple-toolbar">
      <div class="traffic"><span></span><span></span><span></span></div>
      <div class="apple-title">Inbox</div>
      <div class="apple-search">Search</div>
    </header>
    <div class="apple-layout">
      <aside class="apple-sidebar">
        ${["Inbox", "VIP", "Sent", "Drafts", "Archive", "Trash"].map((folder) => `
          <div class="apple-folder ${folder === (data.status || "Inbox") ? "active" : ""}">${folder}</div>
        `).join("")}
      </aside>
      <section class="apple-list">
        <div class="apple-list-item active">
          <strong>${escapeHtml(data.fromName)}</strong>
          <span>${escapeHtml(data.subject)}</span>
          <em>${date}</em>
        </div>
      </section>
      <section class="apple-message">
        <h2>${escapeHtml(data.subject)}</h2>
        <div class="apple-meta">
          <div class="avatar apple-avatar">${escapeHtml(initials)}</div>
          <div>
            <strong>${escapeHtml(data.fromName)}</strong>
            <span>${escapeHtml(data.fromEmail)}</span>
            <span>To: ${escapeHtml(data.toEmail)}</span>
          </div>
          <time>${date}</time>
        </div>
        <div class="body">${escapeHtml(data.body)}</div>
      </section>
    </div>
  `;
}

function formatDateTime(dateValue, timeValue) {
  if (!dateValue) return "";
  const date = new Date(`${dateValue}T${timeValue || "09:00"}:00`);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function getInitials(value) {
  return String(value || "M")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  render();
});

form.addEventListener("input", render);
bodyTemplate.addEventListener("change", () => {
  const template = mailTemplates[bodyTemplate.value];
  if (!template) return;
  Object.entries(template).forEach(([id, value]) => {
    const field = document.getElementById(id);
    if (field) field.value = value;
  });
  render();
});
printButton.addEventListener("click", () => window.print());

init();
