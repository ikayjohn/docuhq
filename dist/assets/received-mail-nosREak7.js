var e=document.getElementById(`mailForm`),t=document.getElementById(`mailPreview`),n=document.getElementById(`printMail`),r=document.getElementById(`bodyTemplate`),i=Object.fromEntries(Object.entries({airPeaceReschedule:{airline:`Air Peace`,company:`Air Peace Limited`,fromEmail:`callcenter@flyairpeace.com`,flight:`P4 7420`,route:`Lagos - Abuja`,date:`19th December 2023`,time:`20:00`,phone:`+234 700 359 247 73223`,website:`flyairpeace.com`},unitedNigeriaReschedule:{airline:`United Nigeria`,company:`United Nigeria Airlines Company Ltd.`,fromEmail:`customerservice@flyunitednigeria.com`,flight:`U5 0553`,route:`Port Harcourt - Lagos`,date:`19th December 2023`,time:`20:00`,phone:`+234 9062547501`,website:`flyunitednigeria.com`},ibomAirReschedule:{airline:`Ibom Air`,company:`Ibom Airlines Limited`,fromEmail:`reservations@ibomair.com`,flight:`QI 0304`,route:`Uyo - Lagos`,date:`19th December 2023`,time:`18:40`,phone:`+234 8142721159`,website:`ibomair.com`},valueJetReschedule:{airline:`ValueJet`,company:`ValueJet`,fromEmail:`info@flyvaluejet.com`,flight:`VK 201`,route:`Lagos - Abuja`,date:`19th December 2023`,time:`17:30`,phone:`+234 1 631 5389`,website:`flyvaluejet.com`},greenAfricaReschedule:{airline:`Green Africa`,company:`Green Africa Airways Limited`,fromEmail:`gcare@greenafrica.com`,flight:`Q9 312`,route:`Lagos - Owerri`,date:`19th December 2023`,time:`16:45`,phone:`+234 700 47336 247`,website:`greenafrica.com`},ranoAirReschedule:{airline:`Rano Air`,company:`Rano Air Limited`,fromEmail:`info@ranoair.com`,flight:`R4 2201`,route:`Abuja - Kano`,date:`19th December 2023`,time:`15:20`,phone:`+234 201 280 2700`,website:`ranoair.com`},aeroReschedule:{airline:`Aero Contractors`,company:`Aero Contractors Company of Nigeria Limited`,fromEmail:`tickethelpdesk@acn.aero`,flight:`N2 126`,route:`Lagos - Port Harcourt`,date:`19th December 2023`,time:`14:10`,phone:`+234 1 628 4140`,website:`flyaero.com`},arikReschedule:{airline:`Arik Air`,company:`Arik Air Limited`,fromEmail:`callcentre@arikair.com`,flight:`W3 718`,route:`Lagos - Abuja`,date:`19th December 2023`,time:`19:15`,phone:`+234 1 279 9999`,website:`arikair.com`},maxAirReschedule:{airline:`Max Air`,company:`Max Air Limited`,fromEmail:`info@maxair.com.ng`,flight:`VM 1643`,route:`Abuja - Lagos`,date:`19th December 2023`,time:`21:00`,phone:`+234 908 760 8888`,website:`maxair.com.ng`},overlandReschedule:{airline:`Overland Airways`,company:`Overland Airways Limited`,fromEmail:`reservations@overlandairways.com`,flight:`OF 1188`,route:`Lagos - Ilorin`,date:`19th December 2023`,time:`13:55`,phone:`+234 803 535 5005`,website:`overlandairways.com`}}).map(([e,t])=>[e,a(t)]));function a(e){return{fromName:`Customer Service`,fromEmail:e.fromEmail,subject:`FLIGHT RESCHEDULING`,body:`Dear esteemed passenger,

Please be advised that your ${e.airline} flight ${e.flight}/${e.route} for ${e.date} will now operate at ${e.time} due to operational reasons. We regret any inconvenience caused.

For enquiries including rebooking, please contact our customer service team on ${e.phone} or email us at ${e.fromEmail}.

Thank you for making ${e.airline} your choice Airline.


CUSTOMER SERVICE
${e.company}
M: ${e.phone}
E: ${e.fromEmail}
W: ${e.website}


The contents of this e-mail including any attachment are confidential to ${e.company} and intended solely for the person(s) to whom they are addressed.

Any reader of this email who is not the intended recipient is notified that any dissemination, distribution or copying of this communication is strictly prohibited. If you have received this e-mail in error, please notify the sender immediately and delete all copies from your computer system. Subsequent alterations to this email after its transmission will be disregarded."`}}function o(){document.getElementById(`mailDate`).value=new Date().toISOString().slice(0,10),s()}function s(){let n=Object.fromEntries(new FormData(e).entries());t.className=`mail-preview ${n.provider||`gmail`}`,t.innerHTML=c(n)}function c(e){return e.provider===`outlook`?p(e):e.provider===`apple`?m(e):l(e)}function l(e){let t=h(e.mailDate,e.mailTime),n=g(e.fromName);return`
    <header class="gmail-topbar">
      <button class="gmail-icon-button hamburger" aria-label="Main menu">${d(`menu`)}</button>
      <div class="gmail-wordmark"><img src="/assets/logo_gmail_lockup_default_1x_r5.png" alt="Gmail" /></div>
      <div class="gmail-search">${d(`search`)}<span></span><div>${d(`x`)}${d(`sliders-horizontal`)}</div></div>
      <div class="gmail-top-icons">
        <button aria-label="Help">${d(`circle-help`)}</button>
        <button aria-label="Settings">${d(`settings`)}</button>
        <button aria-label="Gemini">${d(`sparkles`)}</button>
        <b>Upgrade</b>
        <button aria-label="Google apps">${d(`grip`)}</button>
        <span class="profile-dot"></span>
      </div>
    </header>
    <div class="gmail-layout">
      <nav class="gmail-sidebar">
        <button class="gmail-compose">${d(`pencil`)}<span>Compose</span></button>
        ${[[`Inbox`,`20,672`],[`Starred`,``],[`Snoozed`,``],[`Important`,``],[`Sent`,``],[`Drafts`,`34`],[`Purchases`,`423`],[`Social`,`358`],[`Updates`,`25,787`],[`Forums`,`1`],[`Promotions`,`7,182`]].map(([t,n])=>`
          <div class="gmail-folder ${t===(e.status||`Inbox`)?`active`:``}">
            <span><i>${f(t)}</i>${t}</span><em>${n}</em>
          </div>
        `).join(``)}
        <div class="gmail-label-title"><span>Labels</span><b>+</b></div>
        ${[`[Gmail]Trash`,`[Imap]/Sent`,`[Imap]/Trash`,`Notes`,`Personal`,`SMS`].map(e=>`
          <div class="gmail-folder gmail-label"><span><i>${d(`tag`)}</i>${e}</span><em></em></div>
        `).join(``)}
      </nav>
      <section class="gmail-reader">
        <div class="gmail-actions">
          <div class="gmail-action-left">
            <button aria-label="Back">${u(`back`)}</button>
            <button aria-label="Archive">${u(`archive`)}</button>
            <button aria-label="Report spam">${u(`report`)}</button>
            <button aria-label="Delete">${u(`delete`)}</button>
            <span class="gmail-divider"></span>
            <button aria-label="Mark unread">${u(`mail`)}</button>
            <button aria-label="Snooze">${u(`snooze`)}</button>
            <button aria-label="More">${u(`more`)}</button>
          </div>
          <div class="gmail-action-right"></div>
        </div>
        <div class="gmail-message">
          <div class="gmail-subject">
            <h2>${_(e.subject)}</h2>
            <span>${_(e.status||`Inbox`)} ×</span>
          </div>
          <div class="gmail-meta">
            <div class="avatar gmail-avatar">${_(n)}</div>
            <div>
              <strong>${_(e.fromName)}</strong> <span>&lt;${_(e.fromEmail)}&gt;</span>
              <p>to ${_(e.toEmail)}</p>
            </div>
            <time>${t}</time>
            <div class="gmail-message-icons">
              <button aria-label="Star">${d(`star`)}</button>
              <button aria-label="Add reaction">${d(`smile`)}</button>
              <button aria-label="Reply">${d(`reply`)}</button>
              <button aria-label="More">${d(`more-vertical`)}</button>
            </div>
          </div>
          <div class="body gmail-body">${_(e.body)}</div>
        </div>
      </section>
    </div>
  `}function u(e){return`<img src="/assets/icons/${{back:`arrow-left.svg`,archive:`archive.svg`,report:`octagon-alert.svg`,delete:`trash-2.svg`,mail:`mail.svg`,snooze:`clock-3.svg`,more:`more-vertical.svg`}[e]||`more-vertical.svg`}" alt="" aria-hidden="true" />`}function d(e){return`<img src="/assets/icons/${e}.svg" alt="" aria-hidden="true" />`}function f(e){return{Inbox:d(`mail`),Starred:d(`star`),Snoozed:d(`clock`),Important:d(`tag`),Sent:d(`send`),Drafts:d(`file`),Purchases:d(`shopping-bag`),Social:d(`users`),Updates:d(`info`),Forums:d(`messages-square`),Promotions:d(`tag`)}[e]||d(`mail`)}function p(e){let t=h(e.mailDate,e.mailTime),n=g(e.fromName);return`
    <header class="outlook-bar">
      <div class="outlook-app">Outlook</div>
      <div class="outlook-search">Search</div>
      <div class="outlook-actions">Meet now · Settings</div>
    </header>
    <div class="outlook-layout">
      <nav class="outlook-nav">
        ${[`Inbox`,`Junk Email`,`Drafts`,`Sent Items`,`Deleted Items`,`Archive`].map(t=>`
          <div class="outlook-folder ${t===(e.status||`Inbox`)?`active`:``}">${t}</div>
        `).join(``)}
      </nav>
      <section class="outlook-list">
        <div class="outlook-list-item active">
          <strong>${_(e.fromName)}</strong>
          <span>${_(e.subject)}</span>
          <em>${t}</em>
        </div>
      </section>
      <section class="outlook-message">
        <h2>${_(e.subject)}</h2>
        <div class="outlook-meta">
          <div class="avatar outlook-avatar">${_(n)}</div>
          <div>
            <strong>${_(e.fromName)}</strong>
            <span>&lt;${_(e.fromEmail)}&gt;</span>
            <span>To: ${_(e.toEmail)}</span>
          </div>
          <time>${t}</time>
        </div>
        <div class="body">${_(e.body)}</div>
      </section>
    </div>
  `}function m(e){let t=h(e.mailDate,e.mailTime),n=g(e.fromName);return`
    <header class="apple-toolbar">
      <div class="traffic"><span></span><span></span><span></span></div>
      <div class="apple-title">Inbox</div>
      <div class="apple-search">Search</div>
    </header>
    <div class="apple-layout">
      <aside class="apple-sidebar">
        ${[`Inbox`,`VIP`,`Sent`,`Drafts`,`Archive`,`Trash`].map(t=>`
          <div class="apple-folder ${t===(e.status||`Inbox`)?`active`:``}">${t}</div>
        `).join(``)}
      </aside>
      <section class="apple-list">
        <div class="apple-list-item active">
          <strong>${_(e.fromName)}</strong>
          <span>${_(e.subject)}</span>
          <em>${t}</em>
        </div>
      </section>
      <section class="apple-message">
        <h2>${_(e.subject)}</h2>
        <div class="apple-meta">
          <div class="avatar apple-avatar">${_(n)}</div>
          <div>
            <strong>${_(e.fromName)}</strong>
            <span>${_(e.fromEmail)}</span>
            <span>To: ${_(e.toEmail)}</span>
          </div>
          <time>${t}</time>
        </div>
        <div class="body">${_(e.body)}</div>
      </section>
    </div>
  `}function h(e,t){return e?new Date(`${e}T${t||`09:00`}:00`).toLocaleString(`en-US`,{month:`short`,day:`numeric`,year:`numeric`,hour:`numeric`,minute:`2-digit`}):``}function g(e){return String(e||`M`).split(/\s+/).filter(Boolean).slice(0,2).map(e=>e[0].toUpperCase()).join(``)}function _(e){return String(e||``).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#039;`})[e])}e.addEventListener(`submit`,e=>{e.preventDefault(),s()}),e.addEventListener(`input`,s),r.addEventListener(`change`,()=>{let e=i[r.value];e&&(Object.entries(e).forEach(([e,t])=>{let n=document.getElementById(e);n&&(n.value=t)}),s())}),n.addEventListener(`click`,()=>window.print()),o();