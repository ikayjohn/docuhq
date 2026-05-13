import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";

const TX_STORAGE_KEY = "flighttix_crypto_wallet_transactions";
const SNAPSHOT_STORAGE_KEY = "flighttix_crypto_wallet_snapshots";

const initialWallet = {
  walletName: "Primary Trading Wallet",
  walletAddress: "0xF4A5...9C2E",
  network: "Bitcoin",
  currency: "USD",
  assetBalance: 4.3891,
  fiatBalance: 12486.92,
  btcUsdRate: 80812.72,
  changePct: 1.32,
  changeUsd: 54.0
};

const initialTxForm = {
  txDate: new Date().toISOString().slice(0, 10),
  txType: "Incoming",
  txAsset: "BTC",
  txAmount: 0.125,
  txFiat: 356.52,
  txStatus: "Confirmed",
  txHash: "0x3bd1...f174"
};

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function formatCurrency(value, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(Number(value || 0));
}

function formatAsset(value) {
  return Number(value || 0).toFixed(4);
}

function App() {
  const [wallet, setWallet] = useState(initialWallet);
  const [lastEditedBalanceField, setLastEditedBalanceField] = useState("assetBalance");
  const [txForm, setTxForm] = useState(initialTxForm);
  const [transactions, setTransactions] = useState(() => loadJson(TX_STORAGE_KEY, []));
  const [snapshots, setSnapshots] = useState(() => loadJson(SNAPSHOT_STORAGE_KEY, []));

  useEffect(() => {
    localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(snapshots));
  }, [snapshots]);

  const fiatBalance = useMemo(() => {
    const rate = Number(wallet.btcUsdRate || 0);
    if (rate > 0) return Number(wallet.assetBalance || 0) * rate;
    return Number(wallet.fiatBalance || 0);
  }, [wallet.assetBalance, wallet.btcUsdRate, wallet.fiatBalance]);

  function updateWalletField(field, rawValue) {
    const numericFields = new Set(["assetBalance", "fiatBalance", "btcUsdRate", "changePct", "changeUsd"]);
    const value = numericFields.has(field) ? Number(rawValue || 0) : rawValue;

    setWallet((prev) => {
      const next = { ...prev, [field]: value };
      const rate = Number(next.btcUsdRate || 0);
      if (rate > 0) {
        if (field === "assetBalance") {
          next.fiatBalance = Number(next.assetBalance || 0) * rate;
          setLastEditedBalanceField("assetBalance");
        } else if (field === "fiatBalance") {
          next.assetBalance = Number(next.fiatBalance || 0) / rate;
          setLastEditedBalanceField("fiatBalance");
        } else if (field === "btcUsdRate") {
          if (lastEditedBalanceField === "fiatBalance") {
            next.assetBalance = Number(next.fiatBalance || 0) / rate;
          } else {
            next.fiatBalance = Number(next.assetBalance || 0) * rate;
          }
        }
      }
      return next;
    });
  }

  function addTransaction(event) {
    event.preventDefault();
    setTransactions((prev) => [
      {
        date: txForm.txDate,
        type: txForm.txType,
        asset: txForm.txAsset,
        amount: Number(txForm.txAmount || 0),
        fiat: Number(txForm.txFiat || 0),
        status: txForm.txStatus,
        hash: txForm.txHash
      },
      ...prev
    ]);
    setTxForm({ ...initialTxForm, txDate: new Date().toISOString().slice(0, 10) });
  }

  function updateTransactionField(index, field, rawValue) {
    setTransactions((prev) =>
      prev.map((tx, i) => {
        if (i !== index) return tx;
        if (field === "amount" || field === "fiat") {
          return { ...tx, [field]: Number(rawValue || 0) };
        }
        return { ...tx, [field]: rawValue };
      })
    );
  }

  function deleteTransaction(index) {
    setTransactions((prev) => prev.filter((_, i) => i !== index));
  }

  function saveSnapshot() {
    setSnapshots((prev) => [
      {
        walletName: wallet.walletName,
        walletAddress: wallet.walletAddress,
        network: wallet.network,
        currency: wallet.currency,
        assetBalance: Number(wallet.assetBalance || 0),
        fiatBalance: Number(wallet.fiatBalance || 0),
        btcUsdRate: Number(wallet.btcUsdRate || 0),
        changePct: Number(wallet.changePct || 0),
        changeUsd: Number(wallet.changeUsd || 0),
        savedAt: new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit"
        })
      },
      ...prev
    ].slice(0, 20));
  }

  function restoreSnapshot(index) {
    const snap = snapshots[index];
    if (!snap) return;
    setWallet((prev) => ({
      ...prev,
      walletName: snap.walletName || prev.walletName,
      walletAddress: snap.walletAddress || prev.walletAddress,
      network: snap.network || prev.network,
      currency: "USD",
      assetBalance: Number(snap.assetBalance || 0),
      fiatBalance: Number(snap.fiatBalance || 0),
      btcUsdRate: Number(snap.btcUsdRate || 0),
      changePct: Number(snap.changePct || 0),
      changeUsd: Number(snap.changeUsd || 0)
    }));
  }

  const changePctNegative = Number(wallet.changePct || 0) < 0;
  const changeUsdNegative = Number(wallet.changeUsd || 0) < 0;

  return (
    <main className="wallet-app">
      <aside className="wallet-sidebar">
        <div className="brand">
          <span>CW</span>
          <div>
            <h1>Crypto Wallet</h1>
            <p>Display and track wallet history</p>
          </div>
        </div>

        <form className="wallet-form" onSubmit={(e) => e.preventDefault()}>
          <label>
            Wallet name
            <input value={wallet.walletName} onChange={(e) => updateWalletField("walletName", e.target.value)} />
          </label>
          <label>
            Wallet address
            <input value={wallet.walletAddress} onChange={(e) => updateWalletField("walletAddress", e.target.value)} />
          </label>
          <div className="split">
            <label>
              Network
              <input value={wallet.network} readOnly />
            </label>
            <label>
              Currency
              <input value="USD" readOnly />
            </label>
          </div>
          <div className="split">
            <label>
              Balance (asset)
              <input type="number" step="0.0001" value={wallet.assetBalance} onChange={(e) => updateWalletField("assetBalance", e.target.value)} />
            </label>
            <label>
              Balance (fiat)
              <input type="number" step="0.01" value={wallet.fiatBalance} onChange={(e) => updateWalletField("fiatBalance", e.target.value)} />
            </label>
          </div>
          <label>
            BTC/USD rate
            <input type="number" step="0.01" value={wallet.btcUsdRate} onChange={(e) => updateWalletField("btcUsdRate", e.target.value)} />
          </label>
          <div className="split">
            <label>
              Day change %
              <input type="number" step="0.01" value={wallet.changePct} onChange={(e) => updateWalletField("changePct", e.target.value)} />
            </label>
            <label>
              Day change USD
              <input type="number" step="0.01" value={wallet.changeUsd} onChange={(e) => updateWalletField("changeUsd", e.target.value)} />
            </label>
          </div>
          <div className="actions">
            <button type="button" onClick={saveSnapshot}>Save snapshot</button>
          </div>
        </form>

        <section className="tx-form-wrap">
          <h2>Add transaction</h2>
          <form className="wallet-form" onSubmit={addTransaction}>
            <div className="split">
              <label>
                Date
                <input type="date" value={txForm.txDate} onChange={(e) => setTxForm((p) => ({ ...p, txDate: e.target.value }))} required />
              </label>
              <label>
                Type
                <select value={txForm.txType} onChange={(e) => setTxForm((p) => ({ ...p, txType: e.target.value }))}>
                  <option value="Incoming">Incoming</option>
                  <option value="Outgoing">Outgoing</option>
                </select>
              </label>
            </div>
            <div className="split">
              <label>
                Asset
                <input value="BTC" readOnly />
              </label>
              <label>
                Amount
                <input type="number" step="0.0001" value={txForm.txAmount} onChange={(e) => setTxForm((p) => ({ ...p, txAmount: e.target.value }))} required />
              </label>
            </div>
            <div className="split">
              <label>
                Value (fiat)
                <input type="number" step="0.01" value={txForm.txFiat} onChange={(e) => setTxForm((p) => ({ ...p, txFiat: e.target.value }))} required />
              </label>
              <label>
                Status
                <select value={txForm.txStatus} onChange={(e) => setTxForm((p) => ({ ...p, txStatus: e.target.value }))}>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
              </label>
            </div>
            <label>
              Tx hash / reference
              <input value={txForm.txHash} onChange={(e) => setTxForm((p) => ({ ...p, txHash: e.target.value }))} required />
            </label>
            <button type="submit">Add transaction</button>
          </form>
        </section>
      </aside>

      <section className="wallet-preview">
        <div className="phone-shell">
          <div className="phone-notch"></div>
          <article className="phone-screen">
            <div className="wallet-title-row">
              <div className="wallet-user">
                <span className="avatar-dot"></span>
                <strong>Melinda Gibson</strong>
              </div>
              <div className="wallet-icons">
                <img src="/assets/icons/clock-3.svg" alt="" />
                <img src="/assets/icons/grip.svg" alt="" />
              </div>
            </div>
            <div className="app-head">
              <div>
                <h2>{formatCurrency(fiatBalance, "USD")}</h2>
                <p className="btc-equivalent">{formatAsset(wallet.assetBalance)} BTC</p>
                <div className="gain-row">
                  <span className={`gain-pill${changePctNegative ? " negative" : ""}`}>{changePctNegative ? "▼" : "▲"} {Math.abs(Number(wallet.changePct || 0)).toFixed(2)}%</span>
                  <span className={`gain-pill${changeUsdNegative ? " negative" : ""}`}>{changeUsdNegative ? "▼" : "▲"} {formatCurrency(Math.abs(Number(wallet.changeUsd || 0)), "USD")}</span>
                </div>
              </div>
            </div>
            <div className="quick-actions">
              <button type="button"><img src="/assets/icons/dollar-sign.svg" alt="" /><span>Buy</span></button>
              <button type="button"><img src="/assets/icons/chevrons-up-down.svg" alt="" /><span>Trade</span></button>
              <button type="button"><img src="/assets/icons/send.svg" alt="" /><span>Send</span></button>
              <button type="button"><img src="/assets/icons/users.svg" alt="" /><span>Request</span></button>
            </div>
            <div className="segment-tabs">
              <span className="active">Coins</span>
              <span>Collectibles</span>
              <span>Positions</span>
              <img className="segment-search" src="/assets/icons/search.svg" alt="" />
            </div>
            <section className="history-card mobile-card">
              <div className="tx-list">
                {transactions.length ? transactions.map((tx, index) => (
                  <article className="tx-item" key={`${tx.hash}-${index}`}>
                    <div className={`tx-icon ${tx.type === "Incoming" ? "usdc" : "avantis"}`}>{tx.type === "Incoming" ? "↓" : "↑"}</div>
                    <div className="tx-main">
                      <b>{tx.type} {tx.asset}</b>
                      <span>{tx.date} · {tx.status}</span>
                    </div>
                    <div className="tx-right">
                      <b>{Number(tx.amount || 0).toFixed(4)} BTC</b>
                      <span>{formatCurrency(Number(tx.fiat || 0), "USD")}</span>
                    </div>
                  </article>
                )) : <article className="tx-item"><div className="tx-main"><b>No transactions yet</b><span>Add one from the left form.</span></div></article>}
              </div>
            </section>
            <div className="bottom-nav">
              <img className="active" src="/assets/icons/home.svg" alt="" />
              <img src="/assets/icons/search.svg" alt="" />
              <img src="/assets/icons/chevrons-up-down.svg" alt="" />
              <img src="/assets/icons/bell.svg" alt="" />
              <img src="/assets/icons/archive.svg" alt="" />
            </div>
          </article>
        </div>

        <article className="snapshot-card">
          <div className="history-head">
            <h3>Saved snapshots</h3>
            <button type="button" className="secondary danger" onClick={() => setSnapshots([])}>Clear snapshots</button>
          </div>
          <ul className="snapshot-list">
            {snapshots.map((snap, index) => (
              <li key={`${snap.savedAt}-${index}`}>
                <div>
                  <strong>{snap.walletName || "Wallet Snapshot"}</strong><br />
                  <small>{snap.network} · {formatCurrency(Number(snap.fiatBalance || 0), "USD")} · {snap.savedAt}</small>
                </div>
                <button type="button" className="secondary" onClick={() => restoreSnapshot(index)}>Restore</button>
              </li>
            ))}
          </ul>
        </article>

        <article className="snapshot-card">
          <div className="history-head">
            <h3>Edit transactions</h3>
          </div>
          <div className="tx-editor-list">
            {transactions.length ? transactions.map((tx, index) => (
              <div className="tx-editor-row" key={`editor-${tx.hash}-${index}`}>
                <input type="date" value={tx.date || ""} onChange={(e) => updateTransactionField(index, "date", e.target.value)} />
                <select value={tx.type || "Incoming"} onChange={(e) => updateTransactionField(index, "type", e.target.value)}>
                  <option value="Incoming">Incoming</option>
                  <option value="Outgoing">Outgoing</option>
                </select>
                <input type="number" step="0.0001" value={Number(tx.amount || 0)} onChange={(e) => updateTransactionField(index, "amount", e.target.value)} />
                <input type="number" step="0.01" value={Number(tx.fiat || 0)} onChange={(e) => updateTransactionField(index, "fiat", e.target.value)} />
                <select value={tx.status || "Confirmed"} onChange={(e) => updateTransactionField(index, "status", e.target.value)}>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
                <input value={tx.hash || ""} onChange={(e) => updateTransactionField(index, "hash", e.target.value)} />
                <button type="button" className="secondary danger" onClick={() => deleteTransaction(index)}>Delete</button>
              </div>
            )) : <div className="tx-editor-empty">No transactions yet.</div>}
          </div>
        </article>
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("walletRoot")).render(<App />);
