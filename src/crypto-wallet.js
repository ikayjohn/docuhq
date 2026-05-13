const walletForm = document.getElementById("walletForm");
const txForm = document.getElementById("txForm");
const txBody = document.getElementById("txBody");
const txCount = document.getElementById("txCount");
const incomingTotal = document.getElementById("incomingTotal");
const outgoingTotal = document.getElementById("outgoingTotal");
const txEditorBody = document.getElementById("txEditorBody");
const snapshotList = document.getElementById("snapshotList");

const displayWalletName = document.getElementById("displayWalletName");
const displayWalletAddress = document.getElementById("displayWalletAddress");
const displayNetwork = document.getElementById("displayNetwork");
const displayAssetBalance = document.getElementById("displayAssetBalance");
const displayFiatBalance = document.getElementById("displayFiatBalance");
const displayBtcEquivalent = document.getElementById("displayBtcEquivalent");
const displayUpdated = document.getElementById("displayUpdated");
const displayChangePct = document.getElementById("displayChangePct");
const displayChangeUsd = document.getElementById("displayChangeUsd");
const displayCoinUsdValue = document.getElementById("displayCoinUsdValue");

const saveSnapshotBtn = document.getElementById("saveSnapshot");
const clearTransactionsBtn = document.getElementById("clearTransactions");
const clearSnapshotsBtn = document.getElementById("clearSnapshots");
const txSubmitBtn = document.getElementById("txSubmitBtn");

const TX_STORAGE_KEY = "flighttix_crypto_wallet_transactions";
const SNAPSHOT_STORAGE_KEY = "flighttix_crypto_wallet_snapshots";

let transactions = loadJson(TX_STORAGE_KEY, []);
let snapshots = loadJson(SNAPSHOT_STORAGE_KEY, []);
let liveBtcUsdRate = null;
let liveRateUpdatedAt = null;
let liveRateSource = "";
let liveRateError = "";
let lastEditedBalanceField = "assetBalance";

function init() {
  document.getElementById("txDate").value = new Date().toISOString().slice(0, 10);
  fetchLiveBtcRate();
  setInterval(fetchLiveBtcRate, 30000);
  updateWalletDisplay();
  renderTransactions();
  renderEditableTransactions();
  renderSnapshots();
}

function updateWalletDisplay() {
  const formData = new FormData(walletForm);
  const walletName = String(formData.get("walletName") || "").trim();
  const walletAddress = String(formData.get("walletAddress") || "").trim();
  const network = String(formData.get("network") || "").trim();

  const assetBalance = Number(formData.get("assetBalance") || 0);
  const manualFiatBalance = Number(formData.get("fiatBalance") || 0);
  const manualRate = Number(formData.get("btcUsdRate") || 0);
  const activeRate = manualRate > 0 ? manualRate : liveBtcUsdRate;
  const fiatBalance = activeRate ? assetBalance * activeRate : manualFiatBalance;
  const changePct = Number(formData.get("changePct") || 0);
  const changeUsd = Number(formData.get("changeUsd") || 0);

  if (displayWalletName) displayWalletName.textContent = walletName || "Untitled Wallet";
  if (displayWalletAddress) displayWalletAddress.textContent = walletAddress || "No address provided";
  const trendArrow = changePct < 0 ? "▼" : "▲";
  if (displayNetwork) displayNetwork.textContent = `${trendArrow} ${Math.abs(changePct).toFixed(2)}%`;
  if (displayAssetBalance) displayAssetBalance.textContent = `${formatAsset(assetBalance)} BTC`;
  if (displayFiatBalance) displayFiatBalance.textContent = formatCurrency(fiatBalance, "USD");
  if (displayBtcEquivalent) displayBtcEquivalent.textContent = `${formatAsset(assetBalance)} BTC`;
  if (displayChangePct) {
    displayChangePct.textContent = `${changePct < 0 ? "▼" : "▲"} ${Math.abs(changePct).toFixed(2)}%`;
    displayChangePct.classList.toggle("negative", changePct < 0);
  }
  if (displayChangeUsd) {
    displayChangeUsd.textContent = `${changeUsd < 0 ? "▼" : "▲"} ${formatCurrency(Math.abs(changeUsd), "USD")}`;
    displayChangeUsd.classList.toggle("negative", changeUsd < 0);
  }
  if (displayCoinUsdValue) displayCoinUsdValue.textContent = formatCurrency(fiatBalance, "USD");
  if (displayUpdated) displayUpdated.textContent = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function renderTransactions() {
  txBody.innerHTML = transactions.length
    ? transactions
        .map(
          (tx, index) => `
      <article class="tx-item">
        <div class="tx-icon ${tx.type === "Incoming" ? "usdc" : "avantis"}">${tx.type === "Incoming" ? "↓" : "↑"}</div>
        <div class="tx-main">
          <b>${escapeHtml(tx.type)} ${escapeHtml(tx.asset)}</b>
          <span>${escapeHtml(tx.date)} · ${escapeHtml(tx.status)}</span>
        </div>
        <div class="tx-right">
          <b>${Number(tx.amount).toFixed(4)} BTC</b>
          <span>${formatCurrency(Number(tx.fiat), "USD")}</span>
        </div>
      </article>
    `
        )
        .join("")
    : `<article class="tx-item"><div class="tx-main"><b>No transactions yet</b><span>Add one from the left form.</span></div></article>`;

  const incoming = transactions
    .filter((tx) => tx.type === "Incoming")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
  const outgoing = transactions
    .filter((tx) => tx.type === "Outgoing")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  if (txCount) txCount.textContent = `${transactions.length} transaction${transactions.length === 1 ? "" : "s"}`;
  if (incomingTotal) incomingTotal.textContent = `Incoming: ${incoming.toFixed(4)} BTC`;
  if (outgoingTotal) outgoingTotal.textContent = `Outgoing: ${outgoing.toFixed(4)} BTC`;
}

function renderSnapshots() {
  snapshotList.innerHTML = snapshots
    .map(
      (snap, index) => `
      <li>
        <div>
          <strong>${escapeHtml(snap.walletName || "Wallet Snapshot")}</strong><br />
          <small>${escapeHtml(snap.network)} · ${formatCurrency(Number(snap.fiatBalance), "USD")} · ${escapeHtml(snap.savedAt)}</small>
        </div>
        <button type="button" data-restore="${index}" class="secondary">Restore</button>
      </li>
    `
    )
    .join("");
}

function addTransaction(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(txForm).entries());
  const nextTx = {
    date: data.txDate,
    type: data.txType,
    asset: data.txAsset,
    amount: Number(data.txAmount || 0),
    fiat: Number(data.txFiat || 0),
    status: data.txStatus,
    hash: data.txHash
  };
  transactions.unshift(nextTx);
  saveJson(TX_STORAGE_KEY, transactions);
  renderTransactions();
  renderEditableTransactions();
  resetTxForm();
}

function resetTxForm() {
  txForm.reset();
  document.getElementById("txDate").value = new Date().toISOString().slice(0, 10);
  document.getElementById("txType").value = "Incoming";
  document.getElementById("txAsset").value = "BTC";
  document.getElementById("txStatus").value = "Confirmed";
  if (txSubmitBtn) txSubmitBtn.textContent = "Add transaction";
}

function renderEditableTransactions() {
  if (!txEditorBody) return;
  txEditorBody.innerHTML = transactions.length
    ? transactions
        .map(
          (tx, index) => `
      <div class="tx-editor-row">
        <input data-index="${index}" data-field="date" type="date" value="${escapeHtml(tx.date || "")}" />
        <select data-index="${index}" data-field="type">
          <option value="Incoming" ${tx.type === "Incoming" ? "selected" : ""}>Incoming</option>
          <option value="Outgoing" ${tx.type === "Outgoing" ? "selected" : ""}>Outgoing</option>
        </select>
        <input data-index="${index}" data-field="amount" type="number" step="0.0001" value="${Number(tx.amount || 0)}" />
        <input data-index="${index}" data-field="fiat" type="number" step="0.01" value="${Number(tx.fiat || 0)}" />
        <select data-index="${index}" data-field="status">
          <option value="Confirmed" ${tx.status === "Confirmed" ? "selected" : ""}>Confirmed</option>
          <option value="Pending" ${tx.status === "Pending" ? "selected" : ""}>Pending</option>
          <option value="Failed" ${tx.status === "Failed" ? "selected" : ""}>Failed</option>
        </select>
        <input data-index="${index}" data-field="hash" value="${escapeHtml(tx.hash || "")}" />
        <button type="button" class="secondary danger" data-delete="${index}">Delete</button>
      </div>
    `
        )
        .join("")
    : '<div class="tx-editor-empty">No transactions yet.</div>';
}

function updateTransactionField(index, field, value) {
  const tx = transactions[index];
  if (!tx) return;
  if (field === "amount" || field === "fiat") {
    tx[field] = Number(value || 0);
  } else {
    tx[field] = value;
  }
  saveJson(TX_STORAGE_KEY, transactions);
  renderTransactions();
}

function deleteTransaction(index) {
  if (!transactions[index]) return;
  transactions.splice(index, 1);
  saveJson(TX_STORAGE_KEY, transactions);
  renderTransactions();
  renderEditableTransactions();
}

function saveSnapshot() {
  const data = Object.fromEntries(new FormData(walletForm).entries());
  snapshots.unshift({
    walletName: data.walletName,
    walletAddress: data.walletAddress,
    network: data.network,
    currency: "USD",
    assetBalance: Number(data.assetBalance || 0),
    fiatBalance: Number(data.fiatBalance || 0),
    btcUsdRate: Number(data.btcUsdRate || 0),
    changePct: Number(data.changePct || 0),
    changeUsd: Number(data.changeUsd || 0),
    savedAt: new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    })
  });
  snapshots = snapshots.slice(0, 20);
  saveJson(SNAPSHOT_STORAGE_KEY, snapshots);
  renderSnapshots();
}

function restoreSnapshot(index) {
  const snap = snapshots[index];
  if (!snap) return;
  document.getElementById("walletName").value = snap.walletName;
  document.getElementById("walletAddress").value = snap.walletAddress;
  document.getElementById("network").value = snap.network;
  document.getElementById("currency").value = "USD";
  document.getElementById("assetBalance").value = snap.assetBalance;
  document.getElementById("fiatBalance").value = snap.fiatBalance;
  if (snap.btcUsdRate !== undefined) {
    document.getElementById("btcUsdRate").value = snap.btcUsdRate;
  }
  if (snap.changePct !== undefined) {
    document.getElementById("changePct").value = snap.changePct;
  }
  if (snap.changeUsd !== undefined) {
    document.getElementById("changeUsd").value = snap.changeUsd;
  }
  updateWalletDisplay();
}

function formatAsset(value) {
  return Number(value || 0).toFixed(4);
}

function formatCurrency(value, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 2
  }).format(Number(value || 0));
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char];
  });
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function syncBalanceInputs(changedField) {
  const assetEl = document.getElementById("assetBalance");
  const fiatEl = document.getElementById("fiatBalance");
  const rateEl = document.getElementById("btcUsdRate");
  if (!(assetEl instanceof HTMLInputElement) || !(fiatEl instanceof HTMLInputElement) || !(rateEl instanceof HTMLInputElement)) return;

  const asset = Number(assetEl.value || 0);
  const fiat = Number(fiatEl.value || 0);
  const rate = Number(rateEl.value || 0);
  if (!Number.isFinite(rate) || rate <= 0) return;

  if (changedField === "assetBalance") {
    lastEditedBalanceField = "assetBalance";
    fiatEl.value = (asset * rate).toFixed(2);
  } else if (changedField === "fiatBalance") {
    lastEditedBalanceField = "fiatBalance";
    assetEl.value = (fiat / rate).toFixed(4);
  } else if (changedField === "btcUsdRate") {
    if (lastEditedBalanceField === "fiatBalance") {
      assetEl.value = (fiat / rate).toFixed(4);
    } else {
      fiatEl.value = (asset * rate).toFixed(2);
    }
  }
}

async function fetchLiveBtcRate() {
  try {
    const endpoints = ["/api/btc-usd", "http://localhost:5173/api/btc-usd"];
    let payload = null;
    let response = null;
    let lastError = "rate endpoint unavailable";

    for (const endpoint of endpoints) {
      try {
        response = await fetch(endpoint, {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store"
        });
        payload = await response.json();
        if (response.ok && payload?.ok) break;
        lastError = payload?.error || `server:${response.status}`;
      } catch (error) {
        lastError = error instanceof Error ? error.message : "fetch failed";
      }
    }

    if (!response || !payload || !response.ok || !payload?.ok) {
      throw new Error(lastError);
    }

    const rate = Number(payload.rate);
    if (!Number.isFinite(rate) || rate <= 0) throw new Error("invalid server rate");
    liveBtcUsdRate = rate;
    liveRateSource = payload.source || "server";
    liveRateUpdatedAt = Date.now();
    liveRateError = "";
  } catch (error) {
    liveBtcUsdRate = null;
    liveRateSource = "";
    liveRateUpdatedAt = null;
    liveRateError = error instanceof Error ? error.message : "live fetch failed";
  }
  updateWalletDisplay();
}

walletForm.addEventListener("submit", (event) => {
  event.preventDefault();
  updateWalletDisplay();
  renderTransactions();
});

walletForm.addEventListener("input", (event) => {
  const target = event.target;
  if (target instanceof HTMLInputElement) {
    syncBalanceInputs(target.name);
  }
  updateWalletDisplay();
});
txForm.addEventListener("submit", addTransaction);
if (txEditorBody) {
  txEditorBody.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;
    const index = Number(target.getAttribute("data-index"));
    const field = target.getAttribute("data-field");
    if (!Number.isFinite(index) || !field) return;
    updateTransactionField(index, field, target.value);
  });
  txEditorBody.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const index = target.getAttribute("data-delete");
    if (index === null) return;
    deleteTransaction(Number(index));
  });
}
if (saveSnapshotBtn) {
  saveSnapshotBtn.addEventListener("click", saveSnapshot);
}
if (clearTransactionsBtn) {
  clearTransactionsBtn.addEventListener("click", () => {
    transactions = [];
    saveJson(TX_STORAGE_KEY, transactions);
    renderTransactions();
  });
}
if (clearSnapshotsBtn) {
  clearSnapshotsBtn.addEventListener("click", () => {
    snapshots = [];
    saveJson(SNAPSHOT_STORAGE_KEY, snapshots);
    renderSnapshots();
  });
}
if (snapshotList) {
  snapshotList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const index = target.getAttribute("data-restore");
    if (index === null) return;
    restoreSnapshot(Number(index));
  });
}

init();
