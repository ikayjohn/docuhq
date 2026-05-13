var e=document.getElementById(`reportInput`),t=document.getElementById(`renderBtn`),n=document.getElementById(`loadDefaultBtn`),r=document.getElementById(`exportPdfBtn`),i=document.getElementById(`statusText`),a=document.getElementById(`validationPanel`),o=document.getElementById(`reportNameInput`),s=document.getElementById(`savedReportsSelect`),c=document.getElementById(`saveReportBtn`),l=document.getElementById(`deleteReportBtn`),u=document.getElementById(`renameReportBtn`),d=document.getElementById(`duplicateReportBtn`),f=document.getElementById(`versionSelect`),p=document.getElementById(`restoreVersionBtn`),ee=document.getElementById(`exportJsonBtn`),te=document.getElementById(`importJsonBtn`),m=document.getElementById(`importJsonInput`),h=document.getElementById(`deterministicRefToggle`),g=document.getElementById(`includeInquiriesToggle`),_=document.getElementById(`includeCollectionsToggle`),v=document.getElementById(`includeFooterToggle`),y=document.getElementById(`includeWatermarkToggle`),b=document.getElementById(`lockConsumerToggle`),x=document.getElementById(`lockScoresToggle`),S=document.getElementById(`lockSummaryToggle`),C=document.getElementById(`densitySelect`),w=document.getElementById(`preflightBtn`),ne=`/assets/default-credit-report.json`,T=`creditReportsStoreV1`,E=`creditReportsSelectedV1`,D=`creditReportSettingsV1`,O=``;function k(e){return String(e??``).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#039;`})[e])}function re(e){let t=Number(e||0);return new Intl.NumberFormat(`en-US`,{style:`currency`,currency:`USD`,maximumFractionDigits:0}).format(t)}function A(e){return e===`ssn_last_four`?`SSN`:e.replace(/_/g,` `).replace(/\b\w/g,e=>e.toUpperCase())}function j(e){if(e==null||e===``)return`***-**-****`;let t=String(e).replace(/\D/g,``);return t.length===4?`***-**-${t}`:`***-**-****`}function M(e,t=``){return e==null||e===``?`N/A`:typeof e==`number`&&/(balance|limit|payment|credit|debt|amount|score|utilization|paydown)/i.test(t)?/percent|utilization/i.test(t)?`${e}%`:/score/.test(t)&&!/score_change/.test(t)?String(e):re(e):Array.isArray(e)?e.length?e.every(e=>typeof e!=`object`)?e.join(`, `):e.map(e=>e&&typeof e==`object`?Object.entries(e).map(([e,t])=>`${A(e)}: ${M(t,e)}`).join(` | `):String(e)).join(` || `):`None`:typeof e==`object`?Object.entries(e).map(([e,t])=>`${A(e)}: ${M(t,e)}`).join(` | `):String(e)}function N(e){let t=String(e||``);return`<span class="badge ${/good|positive|current|paid/i.test(t)?`good`:/high risk|negative|charged off|delinquent|late|unpaid|poor|weak/i.test(t)?`bad`:/needs attention|fair|medium|low to medium|needs improvement/i.test(t)?`warn`:`neutral`}">${k(t)}</span>`}function ie(e,t){return`
    <section class="metric-strip">
      <div><span>Primary Score</span><strong>${k(M(e.primary_score,`score`))}</strong></div>
      <div><span>Utilization</span><strong>${k(M(t.overall_utilization_percent,`utilization_percent`))}</strong></div>
      <div><span>Total Debt</span><strong>${k(M(t.total_debt,`total_debt`))}</strong></div>
      <div><span>Collections</span><strong>${k(M(t.collection_accounts,`collection_accounts`))}</strong></div>
    </section>
  `}function P(e){let t=Object.entries(e||{});return t.length?`<div class="grid metadata-grid">${t.map(([e,t])=>`
    <div class="item">
      <span>${A(e)}</span>
      <strong>${k(M(t,e))}</strong>
    </div>`).join(``)}</div>`:`<p class="empty">No records.</p>`}function F(e,t=``){let n=Object.entries(e||{});return n.length?`<div class="grid ${t}">${n.map(([e,t])=>`
    <div class="item">
      <span>${A(e)}</span>
      <strong>${/(status|health|rating|impact|priority|readiness|label|final_status|payment_status)/i.test(e)?N(M(t,e)):k(M(t,e))}</strong>
    </div>`).join(``)}</div>`:`<p class="empty">No records.</p>`}function ae(e){let t=[];return(e||[]).forEach(e=>{Object.keys(e||{}).forEach(e=>{t.includes(e)||t.push(e)})}),t}function I(e){let t=String(e||``).toLowerCase();return/creditor|company|collection_agency|original_creditor/.test(t)?1:/account_type|status|payment_status|account_health|rating|impact_level|priority_level/.test(t)?2:/balance|credit_limit|current_balance|monthly_payment|total_debt|utilization|score/.test(t)?3:/date|opened|reported|closed/.test(t)?4:5}function oe(e,t){if(t.length<=8)return{headers:t,rows:e};let n=[...t].sort((e,t)=>{let n=I(e)-I(t);return n===0?e.localeCompare(t):n}),r=n.slice(0,7),i=n.slice(7),a=e.map(e=>{let t=i.map(t=>`${A(t)}: ${M(e?.[t],t)}`).filter(e=>!e.endsWith(`N/A`)).join(` | `);return{...e,__details:t||`N/A`}});return{headers:[...r,`__details`],rows:a}}function L(e){if(!e||!e.length)return`<p class="empty">No records.</p>`;let t=oe(e,ae(e)),n=t.headers,r=t.rows;return`
    <div class="table-wrap">
      <table>
        <thead>
          <tr>${n.map(e=>`<th>${A(e)}</th>`).join(``)}</tr>
        </thead>
        <tbody>
          ${r.map(e=>`
            <tr>${n.map(t=>{let n=M(e?.[t],t);return/(status|health|rating|impact|priority|readiness|label|final_status|payment_status)/i.test(t)?`<td>${N(n)}</td>`:`<td class="${t===`__details`?`details-cell`:``}">${k(n)}</td>`}).join(``)}</tr>
          `).join(``)}
        </tbody>
      </table>
    </div>
  `}function se(e){let t=[];return(!e||typeof e!=`object`)&&t.push(`root object`),e.consumer||t.push(`consumer`),e.scores||t.push(`scores`),!e.credit_summary&&!e.summary&&t.push(`credit_summary`),t}function R(e){if(a){if(!e.length){a.innerHTML=`<span class="ok">Validation passed.</span>`;return}a.innerHTML=e.map(e=>`<span>${k(e)}</span>`).join(``)}}function z(e){let t=2166136261;for(let n of String(e))t^=n.charCodeAt(0),t=t*16777619>>>0;return t.toString(36).toUpperCase()}function B(){let e=``;for(let t=0;t<8;t+=1)e+=`ABCDEFGHJKLMNPQRSTUVWXYZ23456789`[Math.floor(Math.random()*32)];return`CR-${e}`}function V(e){return`CR-${z([e?.consumer?.full_name||``,e?.consumer?.date_of_birth||``,e?.report_metadata?.report_date||``,e?.scores?.primary_score||``].join(`|`)).padStart(8,`0`).slice(0,8)}`}function H(){return`
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
  `}function U(e=``){return`
    <section class="verification-block">
      <div class="verify-row"><span>Prepared for</span><strong>Authorized Recipient</strong></div>
      <div class="verify-row"><span>Report date</span><strong>${k(e||new Date().toISOString().slice(0,10))}</strong></div>
      <div class="verify-row"><span>Authorized by</span><strong>Credit Profile Office</strong></div>
      <div class="verify-signature">
        <span>Verification signature</span>
        <img src="/assets/signature.png" alt="Authorized signature" class="signature-image" />
      </div>
    </section>
  `}function W(e){let t=document.getElementById(`creditReport`);if(!t)return;let n={...e.report_metadata||{}};delete n.generated_by,n.report_reference=h.checked?V(e):B();let r=e.consumer||{},i=r.current_address||{},a=r.employer||{},o=e.scores||{},s=e.credit_summary||e.summary||{},c=e.inquiries?.hard_inquiries||e.inquiries||[],l=e.inquiries?.soft_inquiries||[],u=g.checked,d=_.checked,f=v.checked,p=y.checked;t.innerHTML=`
    <div class="print-page-header" aria-hidden="true">
      <div class="print-header-left">
        <img src="/assets/credit-logo.png" alt="" />
        <span>Credit Profile Report</span>
      </div>
      <div class="print-header-right">
        <span>Report ID: ${k(n.report_reference||``)}</span>
        <span>Report Date: ${k(n.report_date||``)}</span>
        <span>Confidential</span>
      </div>
    </div>
    ${p?`<div class="page-watermark" aria-hidden="true">CREDIT PROFILE REPORT</div>`:``}
    <header class="report-header">
      <div class="report-brand">
        <img src="/assets/credit-logo.png" alt="Credit Reports Logo" class="report-logo" />
        <div>
          <div class="report-meta-line">
            <span>Report ID: ${k(n.report_reference||``)}</span>
            <span>Report Date: ${k(n.report_date||``)}</span>
            <span class="confidential-pill">Confidential</span>
          </div>
          <h2>Consumer Credit Report</h2>
          <p>${k(r.full_name||`Unknown Consumer`)} • Rating: ${k(o.rating||`N/A`)}</p>
        </div>
      </div>
    </header>
    ${ie(o,s)}

    <section class="section">
      <h3>Report Metadata</h3>
      ${P(n)}
    </section>

    <section class="section">
      <h3>Consumer</h3>
      ${F({full_name:r.full_name||``,date_of_birth:r.date_of_birth||``,ssn_last_four:j(r.ssn_last_four),current_address:[i.street,i.city,i.state,i.zip_code,i.country].filter(Boolean).join(`, `),previous_addresses:(r.previous_addresses||[]).map(e=>[e.street,e.city,e.state,e.zip_code,e.country].filter(Boolean).join(`, `)).join(` ; `),employer:a.name||``,employer_position:a.position||``},`consumer-grid`)}
    </section>

    <section class="section">
      <h3>Scores</h3>
      ${F({primary_score:o.primary_score??``,rating:o.rating??``,average_score:o.average_score??``,experian:o.bureau_scores?.experian??``,equifax:o.bureau_scores?.equifax??``,transunion:o.bureau_scores?.transunion??``,score_trend:o.score_trend??``,previous_score:o.previous_score??``,score_change:o.score_change??``,last_updated:o.last_updated??``},`scores-grid`)}
    </section>

    <section class="section">
      <h3>Summary</h3>
      ${F(s,`summary-grid`)}
    </section>

    <section class="section">
      <h3>Revolving Accounts</h3>
      ${L(e.revolving_accounts||[])}
    </section>

    <section class="section">
      <h3>Installment Accounts</h3>
      ${L(e.installment_accounts||[])}
    </section>

    <section class="section">
      <h3>Closed Accounts</h3>
      ${L(e.closed_accounts||[])}
    </section>

    ${d?`
      <section class="section">
        <h3>Collection Accounts</h3>
        ${L(e.collection_accounts||e.collections||[])}
      </section>
    `:``}

    ${u?`
      <section class="section">
        <h3>Hard Inquiries</h3>
        ${L(c)}
      </section>

      <section class="section">
        <h3>Soft Inquiries</h3>
        ${L(l)}
      </section>
    `:``}

    <section class="section">
      <h3>Presentation Summary</h3>
      ${F(e.presentation_summary||{},`presentation-summary-grid`)}
    </section>

    ${U(n.report_date||``)}
    ${f?H():``}
  `}function G(){return{consumer:b.checked,scores:x.checked,summary:S.checked}}function ce(e){let t=G();if(!t.consumer&&!t.scores&&!t.summary)return e;try{let n=JSON.parse(O||`{}`);t.consumer&&(e.consumer=n.consumer||e.consumer),t.scores&&(e.scores=n.scores||e.scores),t.summary&&(e.credit_summary=n.credit_summary||e.credit_summary,e.credit_summary||(e.summary=n.summary||e.summary))}catch{return e}return e}function K(){try{let t=JSON.parse(e.value),n=ce(t);n!==t&&(e.value=JSON.stringify(n,null,2));let r=se(n);W(n),i.textContent=r.length?`Rendered with warnings: missing ${r.join(`, `)}.`:``,R(r.map(e=>`Missing required section: ${e}`))}catch{i.textContent=`Invalid JSON. Check the format and try again.`,R([`Invalid JSON format.`])}}window.displayCreditReport=W;function q(){try{let e=localStorage.getItem(T),t=e?JSON.parse(e):{};return t&&typeof t==`object`?t:{}}catch{return{}}}function J(e){localStorage.setItem(T,JSON.stringify(e))}function Y(e=``){let t=q(),n=Object.keys(t).sort((e,t)=>e.localeCompare(t));s.innerHTML=n.length?n.map(e=>`<option value="${k(e)}">${k(e)}</option>`).join(``):`<option value="">No saved reports</option>`;let r=e&&n.includes(e)?e:localStorage.getItem(E)&&n.includes(localStorage.getItem(E))?localStorage.getItem(E):n[0]||``;r&&(s.value=r,localStorage.setItem(E,r))}function X(t){if(!t)return;let n=q()[t],r=typeof n==`string`?{current:n,versions:[]}:n;r?.current&&(e.value=r.current,o.value=t,O=r.current,localStorage.setItem(E,t),Z(t),K())}function Z(e){let t=q()[e],n=(typeof t==`string`?{current:t,versions:[]}:t)?.versions||[];f.innerHTML=n.length?n.map((e,t)=>`<option value="${t}">${k(e.ts)}</option>`).join(``):`<option value="">No versions</option>`}async function Q(){let t=`${ne}?v=${Date.now()}`,n=await fetch(t,{cache:`no-store`});if(!n.ok)throw Error(`Failed to load default report`);let r=await n.text();e.value=r,O=r,K()}function $(){return e.value.trim()!==(O||``).trim()}function le(){try{let t=JSON.parse(e.value||`{}`)?.consumer?.full_name;return String(t||``).trim()||`credit-report`}catch{return`credit-report`}}async function ue(){try{await Q(),pe(),Y();let e=localStorage.getItem(E);e?X(e):K()}catch{i.textContent=`Could not load default report file.`}}function de(){try{let e=localStorage.getItem(D);return e?JSON.parse(e):{}}catch{return{}}}function fe(){let e={deterministicRef:h.checked,includeInquiries:g.checked,includeCollections:_.checked,includeFooter:v.checked,includeWatermark:y.checked,lockConsumer:b.checked,lockScores:x.checked,lockSummary:S.checked,density:C.value};localStorage.setItem(D,JSON.stringify(e))}function pe(){let e=de();h.checked=!!e.deterministicRef,g.checked=e.includeInquiries!==!1,_.checked=e.includeCollections!==!1,v.checked=e.includeFooter!==!1,y.checked=e.includeWatermark!==!1,b.checked=!!e.lockConsumer,x.checked=!!e.lockScores,S.checked=!!e.lockSummary,C.value=e.density===`compact`?`compact`:`standard`,document.body.classList.toggle(`print-compact`,C.value===`compact`)}function me(){let t=[],n;try{n=JSON.parse(e.value||`{}`)}catch{t.push(`Invalid JSON: fix input before export.`),R(t);return}JSON.stringify(n).length>12e4&&t.push(`Large report payload may cause dense PDF pages.`),(n.revolving_accounts||[]).length>8&&t.push(`Many revolving accounts: expect multi-page tables.`),(n.closed_accounts||[]).length>8&&t.push(`Many closed accounts: verify readability in export.`),n.consumer?.full_name||t.push(`Missing consumer full name (filename and report identity).`),t.length||t.push(`Print QA passed: no major layout risks detected.`),R(t)}t.addEventListener(`click`,K),n.addEventListener(`click`,async()=>{if(!($()&&!window.confirm(`This will replace your current input with the default report. Continue?`)))try{await Q(),i.textContent=``}catch{i.textContent=`Could not reload default report file.`}}),r.addEventListener(`click`,()=>{let e=document.title,t=le().replace(/[\\/:*?"<>|]+/g,` `).replace(/\s+/g,` `).trim();document.title=t||`credit-report`,window.print(),setTimeout(()=>{document.title=e},300)}),c.addEventListener(`click`,()=>{let t=o.value.trim();if(!t){i.textContent=`Enter a report name before saving.`;return}try{JSON.parse(e.value)}catch{i.textContent=`Cannot save invalid JSON.`;return}let n=q(),r=n[t],a=typeof r==`string`?{current:r,versions:[]}:r||{current:``,versions:[]},s=Array.isArray(a.versions)?a.versions:[];s.unshift({ts:new Date().toISOString(),data:e.value}),n[t]={current:e.value,versions:s.slice(0,25)},J(n),Y(t),Z(t),localStorage.setItem(E,t),i.textContent=`Saved report: ${t}`}),l.addEventListener(`click`,()=>{let e=s.value;if(!e||e===`No saved reports`)return;let t=q();if(!t[e])return;delete t[e],J(t);let n=Object.keys(t).sort((e,t)=>e.localeCompare(t))[0]||``;Y(n),n?(X(n),i.textContent=`Deleted ${e}. Loaded ${n}.`):(localStorage.removeItem(E),i.textContent=`Deleted ${e}.`)}),u.addEventListener(`click`,()=>{let e=s.value;if(!e||e===`No saved reports`)return;let t=window.prompt(`New report name:`,e);if(!t)return;let n=t.trim();if(!n||n===e)return;let r=q();if(r[n]){i.textContent=`A report with that name already exists.`;return}r[n]=r[e],delete r[e],J(r),o.value=n,Y(n),Z(n),localStorage.setItem(E,n),i.textContent=`Renamed ${e} to ${n}.`}),d.addEventListener(`click`,()=>{let e=s.value;if(!e||e===`No saved reports`)return;let t=q(),n=`${e} Copy`,r=n,a=2;for(;t[r];)r=`${n} ${a}`,a+=1;t[r]=JSON.parse(JSON.stringify(t[e])),J(t),Y(r),X(r),i.textContent=`Duplicated report to ${r}.`}),s.addEventListener(`change`,()=>{let e=s.value;!e||e===`No saved reports`||X(e)}),ee.addEventListener(`click`,()=>{let t;try{t=JSON.parse(e.value||`{}`)}catch{i.textContent=`Cannot export invalid JSON.`;return}let n=new Blob([JSON.stringify(t,null,2)],{type:`application/json`}),r=(t?.consumer?.full_name||`credit-report`).replace(/[\\/:*?"<>|]+/g,` `).replace(/\s+/g,`-`).toLowerCase(),a=document.createElement(`a`);a.href=URL.createObjectURL(n),a.download=`${r}.json`,document.body.appendChild(a),a.click(),a.remove(),URL.revokeObjectURL(a.href)}),te.addEventListener(`click`,()=>m.click()),m.addEventListener(`change`,async t=>{let n=t.target.files?.[0];if(n)try{let t=await n.text();JSON.parse(t),e.value=t,O=t,K(),i.textContent=`Imported ${n.name}.`}catch{i.textContent=`Invalid JSON file.`}finally{m.value=``}}),p.addEventListener(`click`,()=>{let t=s.value;if(!t||t===`No saved reports`)return;let n=Number(f.value),r=q()[t],a=(typeof r==`string`?{current:r,versions:[]}:r)?.versions?.[n];a?.data&&(e.value=a.data,O=a.data,K(),i.textContent=`Restored version ${a.ts}`)}),[h,g,_,v,y,b,x,S,C].forEach(e=>e.addEventListener(`change`,()=>{e===C&&document.body.classList.toggle(`print-compact`,C.value===`compact`),fe(),K()})),w.addEventListener(`click`,me),ue();