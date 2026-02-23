import { useState, useEffect } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;1,9..144,400&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #e8e2d6;
    --surface: #f2ede3;
    --surface-raised: #f8f4ee;
    --border: #d4ccc0;
    --border-strong: #b8b0a4;
    --text: #1c1a17;
    --text-2: #6a6358;
    --text-3: #a89e90;
    --accent: #c8622e;
    --accent-dark: #a84e22;
    --teal: #3d7266;
    --teal-bg: #eaf2f0;
    --gold: #b8922a;
    --gold-bg: #faf3e0;
    --red-bg: #fdf0ee;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    min-height: 100vh;
    display: flex;
    justify-content: center;
  }

  .app {
    width: 100%;
    max-width: 720px;
    padding: 52px 28px 120px;
  }

  /* ── HEADER ── */
  .header {
    margin-bottom: 36px;
    padding-bottom: 28px;
    border-bottom: 2px solid var(--text);
  }

  .header-eyebrow {
    font-size: 10px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-bottom: 10px;
  }

  .header h1 {
    font-family: 'Fraunces', serif;
    font-size: clamp(30px, 5vw, 46px);
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.02em;
  }

  .header h1 em {
    font-style: italic;
    font-weight: 400;
    color: var(--accent);
  }

  .header-meta {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 14px;
    flex-wrap: wrap;
  }

  .header-sub {
    font-size: 11px;
    color: var(--text-3);
    letter-spacing: 0.05em;
  }

  .username-field {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .username-label {
    font-size: 10px;
    color: var(--text-3);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .username-input {
    background: var(--surface-raised);
    border: 1.5px solid var(--border);
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    padding: 6px 10px;
    outline: none;
    border-radius: 4px;
    width: 140px;
    transition: border-color 0.15s;
  }

  .username-input:focus { border-color: var(--accent); }

  /* ── TAB NAV ── */
  .tab-nav {
    display: flex;
    gap: 0;
    margin-bottom: 32px;
    border-bottom: 2px solid var(--text);
  }

  .tab-btn {
    background: none;
    border: none;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 11px 20px;
    cursor: pointer;
    color: var(--text-3);
    position: relative;
    transition: color 0.15s;
  }

  .tab-btn:hover { color: var(--text); }
  .tab-btn.active { color: var(--accent); }
  .tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: -2px; left: 0; right: 0;
    height: 2px;
    background: var(--accent);
  }

  .tab-badge {
    display: inline-block;
    background: var(--accent);
    color: #fff;
    font-size: 8px;
    padding: 1px 5px;
    border-radius: 10px;
    margin-left: 5px;
    vertical-align: middle;
  }

  .tab-badge.teal { background: var(--teal); }

  /* ── BUTTONS ── */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 10px 18px;
    border-radius: 4px;
    cursor: pointer;
    border: 1.5px solid transparent;
    transition: all 0.15s;
    white-space: nowrap;
  }

  .btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .btn-primary { background: var(--text); color: var(--surface); border-color: var(--text); }
  .btn-primary:hover:not(:disabled) { background: #333; border-color: #333; }

  .btn-accent { background: var(--accent); color: #fff; border-color: var(--accent); }
  .btn-accent:hover:not(:disabled) { background: var(--accent-dark); border-color: var(--accent-dark); }

  .btn-teal { background: var(--teal); color: #fff; border-color: var(--teal); }
  .btn-teal:hover:not(:disabled) { background: #2e5c52; border-color: #2e5c52; }

  .btn-ghost { background: transparent; color: var(--text-2); border-color: var(--border); }
  .btn-ghost:hover:not(:disabled) { border-color: var(--text-2); color: var(--text); }

  .btn-danger-ghost { background: transparent; color: var(--text-3); border-color: transparent; }
  .btn-danger-ghost:hover:not(:disabled) { color: #c0392b; }

  .btn-sm { padding: 7px 12px; font-size: 9px; }

  /* ── CHIPS ── */
  .chip {
    display: inline-block;
    font-size: 9px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 20px;
    font-weight: 500;
    white-space: nowrap;
  }

  .chip-pending { background: var(--surface); color: var(--text-3); border: 1px solid var(--border); }
  .chip-loading { background: var(--surface); color: var(--accent); border: 1px solid #f0d0c0; animation: chipPulse 1.1s ease-in-out infinite; }
  .chip-us { background: var(--text); color: #f0c060; }
  .chip-intl { background: #2c4a3e; color: #7ef0c0; }
  .chip-none { background: var(--surface); color: var(--text-3); border: 1px solid var(--border); }
  .chip-error { background: var(--red-bg); color: #c0392b; border: 1px solid #f0c0b8; }
  .chip-purchased { background: var(--teal); color: #fff; }
  .chip-free { background: var(--gold-bg); color: var(--gold); border: 1px solid #e8d090; }
  .chip-teal { background: var(--teal-bg); color: var(--teal); border: 1px solid #c0ddd8; }

  @keyframes chipPulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  /* ── CARDS (shared) ── */
  .card {
    background: var(--surface-raised);
    border: 1.5px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    transition: border-color 0.15s;
  }

  .card:hover { border-color: var(--border-strong); }

  .card-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 18px;
  }

  .thumb {
    width: 52px;
    height: 52px;
    border-radius: 4px;
    object-fit: cover;
    flex-shrink: 0;
    background: var(--border);
  }

  .thumb-placeholder {
    width: 52px;
    height: 52px;
    border-radius: 4px;
    background: var(--border);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px;
    color: var(--text-3);
    letter-spacing: 0.1em;
  }

  .card-info { flex: 1; min-width: 0; }

  .card-title {
    font-family: 'Fraunces', serif;
    font-size: 16px;
    font-weight: 700;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
  }

  .card-artist {
    font-size: 12px;
    color: var(--text-2);
    margin-top: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-price-inline {
    font-size: 13px;
    color: var(--text);
    font-weight: 500;
    margin-top: 5px;
  }

  .card-price-note {
    font-size: 11px;
    color: var(--text-3);
  }

  .card-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .card-body {
    padding: 0 18px 16px;
    border-top: 1px solid var(--border);
    animation: fadeUp 0.2s ease forwards;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ── WANTLIST ── */
  .wl-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    gap: 10px;
    flex-wrap: wrap;
  }

  .wl-toolbar-left { display: flex; align-items: center; gap: 10px; }
  .wl-toolbar-right { display: flex; gap: 8px; }

  .wl-count {
    font-size: 11px;
    color: var(--text-3);
    letter-spacing: 0.08em;
  }

  .wl-grid { display: flex; flex-direction: column; gap: 10px; }

  .progress-bar-wrap {
    margin-bottom: 20px;
    padding: 14px 18px;
    background: var(--surface-raised);
    border: 1.5px solid var(--border);
    border-radius: 6px;
  }

  .progress-bar-label {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: var(--text-3);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .progress-bar-track {
    height: 3px;
    background: var(--border);
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 2px;
    transition: width 0.4s ease;
  }

  .empty-state {
    text-align: center;
    padding: 64px 24px;
    border: 1.5px dashed var(--border-strong);
    border-radius: 8px;
  }

  .empty-icon {
    font-family: 'Fraunces', serif;
    font-size: 40px;
    color: var(--border-strong);
    margin-bottom: 14px;
  }

  .empty-title {
    font-family: 'Fraunces', serif;
    font-size: 20px;
    color: var(--text-3);
    margin-bottom: 8px;
  }

  .empty-sub {
    font-size: 11px;
    color: var(--text-3);
    line-height: 1.8;
    letter-spacing: 0.03em;
  }

  /* Wantlist manual add */
  .manual-add-form {
    margin-bottom: 24px;
    padding: 18px;
    background: var(--surface-raised);
    border: 1.5px solid var(--border);
    border-radius: 8px;
  }

  .form-section-label {
    font-size: 9px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-bottom: 12px;
  }

  .fields-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 10px;
  }

  .field { display: flex; flex-direction: column; gap: 5px; }

  .field label {
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-3);
  }

  .field input, .field textarea {
    background: var(--surface-raised);
    border: 1.5px solid var(--border);
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    padding: 10px 13px;
    outline: none;
    border-radius: 4px;
    transition: border-color 0.15s;
    width: 100%;
  }

  .field input:focus, .field textarea:focus { border-color: var(--accent); }
  .field input::placeholder, .field textarea::placeholder { color: var(--border-strong); }

  /* Price display in wantlist cards */
  .price-row {
    display: flex;
    gap: 16px;
    align-items: baseline;
    margin-top: 8px;
    flex-wrap: wrap;
  }

  .price-block { display: flex; flex-direction: column; gap: 2px; }
  .price-label { font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-3); }
  .price-value { font-size: 22px; font-weight: 500; color: var(--text); line-height: 1; }
  .price-value.us { color: var(--text); }
  .price-value.intl { color: #2c6e5c; }
  .price-sub { font-size: 10px; color: var(--text-3); margin-top: 2px; }

 .warning-intl {
    display: inline-block;
    font-size: 9px;
    color: var(--accent);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-top: 8px;
    background: #fdf0ee;
    border: 1px solid #f0c0b0;
    padding: 3px 8px;
    border-radius: 3px;
  }

  /* ── COMPARE TAB ── */
  .cmp-empty-note {
    font-size: 11px;
    color: var(--text-3);
    line-height: 1.8;
    margin-top: 6px;
  }

  .threshold-row {
    margin-bottom: 28px;
    padding: 16px 18px;
    background: var(--surface-raised);
    border: 1.5px solid var(--border);
    border-radius: 8px;
  }

  .slider-label-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 10px;
  }

  .slider-label { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-3); }
  .slider-value { font-size: 20px; color: var(--accent); font-weight: 500; }
  .slider-sub { font-size: 10px; color: var(--text-3); margin-top: 4px; }

  input[type="range"] {
    width: 100%;
    appearance: none;
    background: var(--border);
    height: 3px;
    outline: none;
    cursor: pointer;
    border-radius: 2px;
  }

  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    background: var(--accent);
    cursor: pointer;
    border-radius: 50%;
  }

  .cmp-grid { display: flex; flex-direction: column; gap: 16px; }

  .cmp-card { background: var(--surface-raised); border: 1.5px solid var(--border); border-radius: 8px; overflow: hidden; }

  .cmp-section {
    padding: 14px 18px;
    border-top: 1px solid var(--border);
  }

  .cmp-section-title {
    font-size: 9px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-bottom: 10px;
  }

  /* Budget indicator */
  .budget-indicator {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 5px 10px;
    border-radius: 4px;
    margin-top: 8px;
  }

  .budget-ok { background: var(--teal-bg); color: var(--teal); }
  .budget-maybe { background: var(--gold-bg); color: var(--gold); }
  .budget-over { background: var(--red-bg); color: #c0392b; }

  /* Retail links */
  .retail-links { display: flex; flex-direction: column; gap: 6px; }

  .retail-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 4px;
    text-decoration: none;
    transition: border-color 0.15s, background 0.15s;
  }

  .retail-link:hover { border-color: var(--accent); background: #fff9f6; }
  .retail-link-name { font-size: 13px; color: var(--text); font-weight: 500; }
  .retail-link-action { font-size: 10px; color: var(--accent); letter-spacing: 0.1em; text-transform: uppercase; }

  /* Bandcamp compare section */
  .bc-compare {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .bc-fields-row {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 10px;
  }

  .bc-result {
    padding: 12px 14px;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 4px;
  }

  .bc-result-label { font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-3); margin-bottom: 4px; }
  .bc-result-value { font-size: 16px; font-weight: 500; color: var(--text); }
  .bc-result-note { font-size: 10px; color: var(--text-3); margin-top: 2px; }

  /* Compare card actions */
  .cmp-actions {
    padding: 12px 18px;
    border-top: 1px solid var(--border);
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
  }

  .cmp-actions-spacer { flex: 1; }

  /* ── COLLECTION TAB ── */
  .coll-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    gap: 10px;
    flex-wrap: wrap;
  }

  .coll-grid { display: flex; flex-direction: column; gap: 10px; }

  .coll-card {
    background: var(--surface-raised);
    border: 1.5px solid var(--border);
    border-radius: 8px;
  }

  .coll-card-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 18px;
  }

  .coll-obtained {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 5px;
    flex-shrink: 0;
  }

  .coll-date {
    font-size: 10px;
    color: var(--text-3);
  }

  /* ── LOADING / ERROR ── */
  .loading-state {
    text-align: center;
    padding: 52px 0;
    font-size: 11px;
    color: var(--text-3);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .loading-dot { display: inline-block; animation: pulse 1.2s ease-in-out infinite; }
  .loading-dot:nth-child(2) { animation-delay: 0.2s; }
  .loading-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes pulse {
    0%, 80%, 100% { opacity: 0.2; }
    40% { opacity: 1; }
  }

  .error-msg {
    padding: 13px 16px;
    border: 1.5px solid #e8a090;
    background: var(--red-bg);
    color: #c0392b;
    font-size: 12px;
    border-radius: 6px;
    margin-bottom: 20px;
  }

  .divider {
    border: none;
    border-top: 1px solid var(--border);
    margin: 20px 0;
  }

  @media (max-width: 540px) {
    .app { padding: 32px 16px 80px; }
    .fields-row { grid-template-columns: 1fr; }
    .bc-fields-row { grid-template-columns: 1fr; }
    .wl-toolbar { flex-direction: column; align-items: flex-start; }
    .price-row { gap: 12px; }
  }
`;

// ── Storage ──────────────────────────────────────────────────────────────────

const KEYS = {
  wantlist: "rf_wantlist_v2",
  compare: "rf_compare_v2",
  collection: "rf_collection_v2",
  username: "rf_username",
};

function load(key) {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); }
  catch { return []; }
}
function loadStr(key, def = "") {
  return localStorage.getItem(key) || def;
}
function save(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}
function saveStr(key, val) {
  localStorage.setItem(key, val);
}
function genId() {
  return Math.random().toString(36).slice(2, 9);
}

// ── WantlistTab ───────────────────────────────────────────────────────────────

function WantlistCard({ item, onMoveToCompare, onRemove }) {
  const { artist, album, year, cover, status, result, error } = item;
  const bestUs = result?.best_us;
  const bestIntl = result?.best_intl;
  const usOnlyWarning = result?.us_only_warning;

  return (
    <div className="card">
      <div className="card-row">
        {cover
          ? <img className="thumb" src={cover} alt={album} />
          : <div className="thumb-placeholder">No Art</div>}
        <div className="card-info">
          <div className="card-title">{album}</div>
          <div className="card-artist">{artist}{year ? ` · ${year}` : ""}</div>
          {status === "done" && (
            <div className="price-row">
              {bestUs && (
                <div className="price-block">
                  <span className="price-label">Best US</span>
                  <span className="price-value us">${bestUs.price.toFixed(2)}</span>
                  <span className="price-sub">{bestUs.num_for_sale} for sale</span>
                </div>
              )}
              {bestIntl && (
                <div className="price-block">
                  <span className="price-label">Best Intl</span>
                  <span className="price-value intl">${bestIntl.total_low}–${bestIntl.total_high}</span>
                  <span className="price-sub">${bestIntl.price.toFixed(2)} record + est. ${bestIntl.shipping_low}–${bestIntl.shipping_high} shipping · {bestIntl.ships_from}</span>
                </div>
              )}
              {!bestUs && !bestIntl && (
                <div className="price-block">
                  <span className="price-sub" style={{fontStyle:"italic"}}>No Discogs listings found</span>
                </div>
              )}
            </div>
          )}
          {status === "done" && usOnlyWarning && (
            <div className="warning-intl">⚠ No US sellers — international only</div>
          )}
          {status === "error" && (
            <div style={{fontSize:"11px", color:"#c0392b", marginTop:"4px", fontStyle:"italic"}}>{error}</div>
          )}
        </div>
        <div className="card-controls">
          {status === "pending" && <span className="chip chip-pending">Pending</span>}
          {status === "loading" && <span className="chip chip-loading">Searching</span>}
          {status === "done" && (bestUs || bestIntl) && (
            <button className="btn btn-sm btn-accent" onClick={() => onMoveToCompare(item)}>
              Compare →
            </button>
          )}
          {status === "done" && !bestUs && !bestIntl && (
            <span className="chip chip-none">No Listings</span>
          )}
          {status === "error" && <span className="chip chip-error">Error</span>}
          <button className="btn btn-sm btn-danger-ghost" onClick={() => onRemove(item.id)} title="Remove">×</button>
        </div>
      </div>
    </div>
  );
}

function WantlistTab({ username, onCountChange }) {
  const [wantlist, setWantlist] = useState(() => load(KEYS.wantlist));
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [importLoading, setImportLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addArtist, setAddArtist] = useState("");
  const [addAlbum, setAddAlbum] = useState("");
  const [addBcUrl, setAddBcUrl] = useState("");
  const cancelRef = { current: false };

  useEffect(() => { onCountChange(wantlist.length); }, [wantlist.length]);

  const persist = (list) => {
    setWantlist(list);
    save(KEYS.wantlist, list);
  };

  const syncWantlist = async (isUpdate = false) => {
    if (!username.trim()) { setError("Enter your Discogs username in the header."); return; }
    setImportLoading(true);
    setError(null);
    try {
      const API = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API}/wantlist?username=${encodeURIComponent(username)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const existing = load(KEYS.wantlist);
      const compare = load(KEYS.compare);
      const collection = load(KEYS.collection);

      const existingIds = new Set(existing.map(i => i.discogs_release_id).filter(Boolean));
      const compareIds = new Set(compare.map(i => i.discogs_release_id).filter(Boolean));
      const collectionIds = new Set(collection.map(i => i.discogs_release_id).filter(Boolean));
      const newDiscogsIds = new Set(data.wants.map(w => w.discogs_release_id).filter(Boolean));

      // On update: move items removed from Discogs wantlist to collection
      if (isUpdate) {
        const removed = existing.filter(
          i => i.source === "discogs" && i.discogs_release_id && !newDiscogsIds.has(i.discogs_release_id)
        );
        if (removed.length > 0) {
          const updatedCollection = [...collection];
          removed.forEach(item => {
            if (!collectionIds.has(item.discogs_release_id)) {
              updatedCollection.push({
                id: item.id,
                artist: item.artist,
                album: item.album,
                year: item.year,
                cover: item.cover || null,
                discogs_release_id: item.discogs_release_id,
                discogs_url: item.discogs_url,
                source: "discogs_app",
                obtained_via: "purchased",
                addedAt: Date.now(),
              });
            }
          });
          save(KEYS.collection, updatedCollection);
        }
      }

      // Add new items not already in wantlist, compare, or collection
      const newItems = data.wants
        .filter(w => !existingIds.has(w.discogs_release_id)
          && !compareIds.has(w.discogs_release_id)
          && !collectionIds.has(w.discogs_release_id))
        .map(w => ({
          id: genId(),
          artist: w.artist,
          album: w.album,
          year: w.year,
          cover: w.cover || null,
          discogs_release_id: w.discogs_release_id,
          discogs_url: w.discogs_url,
          source: "discogs",
          bandcamp_url: null,
          status: "pending",
          result: null,
          error: null,
        }));

      const kept = isUpdate
        ? existing.filter(i => i.source !== "discogs" || newDiscogsIds.has(i.discogs_release_id))
        : existing.filter(i => i.source !== "discogs");

      persist([...kept, ...newItems]);
    } catch (err) {
      setError(err.message || "Failed to fetch wantlist");
    } finally {
      setImportLoading(false);
    }
  };

  const scanAll = async () => {
    const pending = wantlist.filter(i => i.status === "pending" || i.status === "error");
    if (pending.length === 0) return;
    setScanning(true);
    cancelRef.current = false;
    setScanProgress(0);

    setWantlist(prev => {
      const updated = prev.map(i =>
        pending.find(p => p.id === i.id) ? { ...i, status: "loading" } : i
      );
      save(KEYS.wantlist, updated);
      return updated;
    });

    const API = import.meta.env.VITE_API_URL;
    let completed = 0;

    for (const item of pending) {
      if (cancelRef.current) break;
      try {
        const params = new URLSearchParams({ artist: item.artist, album: item.album });
        let res, data;
        for (let attempt = 0; attempt < 3; attempt++) {
          res = await fetch(`${API}/search?${params}`);
          data = await res.json();
          if (res.status === 429) {
            console.log(`Rate limited, waiting ${8 + attempt * 4}s...`);
            await new Promise(r => setTimeout(r, (8 + attempt * 4) * 1000));
            continue;
          }
          break;
        }
        if (data.error) throw new Error(data.error);

        setWantlist(prev => {
          const updated = prev.map(i => i.id === item.id
            ? { ...i, status: "done", result: data, error: null } : i);
          save(KEYS.wantlist, updated);
          return updated;
        });
      } catch (err) {
        setWantlist(prev => {
          const updated = prev.map(i => i.id === item.id
            ? { ...i, status: "error", error: err.message || "Search failed" } : i);
          save(KEYS.wantlist, updated);
          return updated;
        });
      }
      completed++;
      setScanProgress(Math.round((completed / pending.length) * 100));
      if (completed < pending.length) await new Promise(r => setTimeout(r, 5000));
    }

    setScanning(false);
  };

  const cancelScan = () => { cancelRef.current = true; setScanning(false); };

  const removeItem = (id) => persist(wantlist.filter(i => i.id !== id));

  const addManual = () => {
    if (!addArtist.trim() || !addAlbum.trim()) return;
    const item = {
      id: genId(),
      artist: addArtist.trim(),
      album: addAlbum.trim(),
      year: "",
      cover: null,
      discogs_release_id: null,
      discogs_url: null,
      source: addBcUrl.trim() ? "bandcamp" : "manual",
      bandcamp_url: addBcUrl.trim() || null,
      status: "pending",
      result: null,
      error: null,
    };
    persist([...wantlist, item]);
    setAddArtist(""); setAddAlbum(""); setAddBcUrl("");
  };

  const moveToCompare = (item) => {
    const compare = load(KEYS.compare);
    if (compare.find(c => c.id === item.id)) return;
    save(KEYS.compare, [...compare, { ...item, bandcamp_price: null }]);
    persist(wantlist.filter(i => i.id !== item.id));
  };

  const pendingCount = wantlist.filter(i => i.status === "pending" || i.status === "error").length;
  const isFirstSync = wantlist.filter(i => i.source === "discogs").length === 0;

  return (
    <div>
      {error && <div className="error-msg">{error}</div>}

      <div className="manual-add-form">
        <div className="form-section-label">Add Manually</div>
        <div className="fields-row">
          <div className="field">
            <label>Artist</label>
            <input type="text" placeholder="Artist name" value={addArtist}
              onChange={e => setAddArtist(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addManual()} />
          </div>
          <div className="field">
            <label>Album</label>
            <input type="text" placeholder="Album title" value={addAlbum}
              onChange={e => setAddAlbum(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addManual()} />
          </div>
        </div>
        <div className="field" style={{marginBottom:"10px"}}>
          <label>Bandcamp URL (optional — for Bandcamp-only albums)</label>
          <input type="text" placeholder="https://artist.bandcamp.com/album/..."
            value={addBcUrl} onChange={e => setAddBcUrl(e.target.value)} />
        </div>
        <button className="btn btn-primary"
          onClick={addManual} disabled={!addArtist.trim() || !addAlbum.trim()}>
          + Add to Wantlist
        </button>
      </div>

      {wantlist.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◎</div>
          <div className="empty-title">Your wantlist is empty</div>
          <div className="empty-sub">
            Sync from Discogs to pull your wantlist,<br />
            or add albums manually above.
          </div>
          <div style={{marginTop:"20px", display:"flex", gap:"10px", justifyContent:"center"}}>
            <button className="btn btn-accent"
              onClick={() => syncWantlist(false)} disabled={importLoading}>
              {importLoading ? "Syncing…" : "Sync from Discogs"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="wl-toolbar">
            <div className="wl-toolbar-left">
              <span className="wl-count">
                {wantlist.length} album{wantlist.length !== 1 ? "s" : ""}
                {pendingCount > 0 ? ` · ${pendingCount} unsearched` : ""}
              </span>
            </div>
            <div className="wl-toolbar-right">
              {scanning
                ? <button className="btn btn-ghost btn-sm" onClick={cancelScan}>Cancel Scan</button>
                : <>
                    <button className="btn btn-ghost btn-sm"
                      onClick={() => syncWantlist(true)} disabled={importLoading}>
                      {importLoading ? "Updating…" : "↻ Update from Discogs"}
                    </button>
                    <button className="btn btn-accent btn-sm"
                      onClick={scanAll} disabled={pendingCount === 0}>
                      {`Scan Prices${pendingCount > 0 ? ` (${pendingCount})` : ""}`}
                    </button>
                  </>
              }
            </div>
          </div>

          {scanning && (
            <div className="progress-bar-wrap">
              <div className="progress-bar-label">
                <span>Scanning Discogs</span>
                <span>{scanProgress}%</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{width: scanProgress + "%"}} />
              </div>
            </div>
          )}

          <div className="wl-grid">
            {wantlist.map(item => (
              <WantlistCard key={item.id} item={item}
                onMoveToCompare={moveToCompare} onRemove={removeItem} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── CompareTab ────────────────────────────────────────────────────────────────

function CompareCard({ item, threshold, onMoveToCollection, onBackToWantlist }) {
  const [bcUrl, setBcUrl] = useState(item.bandcamp_url || "");
  const [bcPrice, setBcPrice] = useState(item.bandcamp_price != null ? String(item.bandcamp_price) : "");

  const bestUs = item.result?.best_us;
  const bestIntl = item.result?.best_intl;

  const bcPriceNum = parseFloat(bcPrice) || null;

  // Budget checks
  const usBudget = bestUs
    ? bestUs.price <= threshold ? "ok" : "over"
    : null;

  const intlBudget = bestIntl
    ? bestIntl.total_low <= threshold && bestIntl.total_high <= threshold ? "ok"
      : bestIntl.total_low <= threshold ? "maybe"
      : "over"
    : null;

  // Vinyl vs digital comparison
  let vinylVsDigital = null;
  if (bcPriceNum && bestUs) {
    const diff = bestUs.price - bcPriceNum;
    vinylVsDigital = { source: "US vinyl vs Bandcamp", diff, total: bestUs.price };
  }

  const q = encodeURIComponent(`${item.artist} ${item.album} vinyl`);
  const retailLinks = [
    { name: "Amazon", url: `https://www.amazon.com/s?k=${q}` },
    { name: "Target", url: `https://www.target.com/s?searchTerm=${q}` },
    { name: "Walmart", url: `https://www.walmart.com/search?q=${q}` },
    { name: "Discogs", url: item.discogs_url || `https://www.discogs.com/search/?q=${encodeURIComponent(item.artist + " " + item.album)}&type=release` },
  ];

  const saveBcData = () => {
    const compare = load(KEYS.compare);
    save(KEYS.compare, compare.map(c => c.id === item.id
      ? { ...c, bandcamp_url: bcUrl.trim() || null, bandcamp_price: bcPriceNum }
      : c));
  };

  return (
    <div className="cmp-card">
      <div className="card-row">
        {item.cover
          ? <img className="thumb" src={item.cover} alt={item.album} />
          : <div className="thumb-placeholder">No Art</div>}
        <div className="card-info">
          <div className="card-title">{item.album}</div>
          <div className="card-artist">{item.artist}{item.year ? ` · ${item.year}` : ""}</div>
        </div>
        {item.discogs_url && (
          <a href={item.discogs_url} target="_blank" rel="noreferrer"
            style={{fontSize:"10px", color:"var(--accent)", textDecoration:"none", letterSpacing:"0.08em", textTransform:"uppercase", flexShrink:0}}>
            Discogs ↗
          </a>
        )}
      </div>

      {/* Pricing */}
      <div className="cmp-section">
        <div className="cmp-section-title">Discogs Pricing</div>
        <div className="price-row">
          {bestUs && (
            <div className="price-block">
              <span className="price-label">Best US · {bestUs.num_for_sale} for sale</span>
              <span className="price-value us">${bestUs.price.toFixed(2)}</span>
              {usBudget && (
                <div className={`budget-indicator budget-${usBudget}`}>
                  {usBudget === "ok" ? "✓ Within budget" : "✗ Over budget"}
                </div>
              )}
            </div>
          )}
          {bestIntl && (
            <div className="price-block">
              <span className="price-label">Best Intl · {bestIntl.ships_from}</span>
              <span className="price-value intl">${bestIntl.price.toFixed(2)}</span>
              <span className="price-sub">+ est. ${bestIntl.shipping_low}–${bestIntl.shipping_high} shipping</span>
              <span className="price-sub">Total: ${bestIntl.total_low}–${bestIntl.total_high}</span>
              {intlBudget && (
                <div className={`budget-indicator budget-${intlBudget}`}>
                  {intlBudget === "ok" ? "✓ Within budget"
                    : intlBudget === "maybe" ? "~ Low estimate fits"
                    : "✗ Over budget"}
                </div>
              )}
            </div>
          )}
          {!bestUs && !bestIntl && (
            <span style={{fontSize:"12px", color:"var(--text-3)", fontStyle:"italic"}}>No Discogs listings found</span>
          )}
        </div>
      </div>

      {/* Retail + Bandcamp links */}
      <div className="cmp-section">
        <div className="cmp-section-title">Find It Elsewhere</div>
        <div className="retail-links">
          {retailLinks.map((link, i) => (
            <a key={i} className="retail-link" href={link.url} target="_blank" rel="noreferrer">
              <span className="retail-link-name">{link.name}</span>
              <span className="retail-link-action">Search ↗</span>
            </a>
          ))}
          {bcUrl.trim() && (
            <a className="retail-link" href={bcUrl.trim()} target="_blank" rel="noreferrer">
              <span className="retail-link-name">Bandcamp</span>
              <span className="retail-link-action">Open ↗</span>
            </a>
          )}
        </div>
      </div>

      {/* Bandcamp manual compare */}
      <div className="cmp-section">
        <div className="cmp-section-title">Compare with Bandcamp (manual)</div>
        <div className="bc-compare">
          <div className="bc-fields-row">
            <div className="field">
              <label>Bandcamp URL</label>
              <input type="text" placeholder="https://artist.bandcamp.com/album/..."
                value={bcUrl} onChange={e => setBcUrl(e.target.value)}
                onBlur={saveBcData} />
            </div>
            <div className="field">
              <label>Price you see ($)</label>
              <input type="number" placeholder="e.g. 7.00" min="0" step="0.01"
                value={bcPrice} onChange={e => setBcPrice(e.target.value)}
                onBlur={saveBcData} />
            </div>
          </div>

          {bcPriceNum && bestUs && (
            <div className="bc-result">
              <div className="bc-result-label">Vinyl vs Digital</div>
              <div className="bc-result-value">
                ${Math.abs(bestUs.price - bcPriceNum).toFixed(2)} {bestUs.price > bcPriceNum ? "more for vinyl" : "cheaper for vinyl"}
              </div>
              <div className="bc-result-note">
                US vinyl ${bestUs.price.toFixed(2)} vs Bandcamp ${bcPriceNum.toFixed(2)}
                {bestUs.price - bcPriceNum <= threshold
                  ? " — within your budget"
                  : " — over your budget"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="cmp-actions">
        <button className="btn btn-ghost btn-sm" onClick={() => onBackToWantlist(item)}>
          ← Back to Wantlist
        </button>
        <div className="cmp-actions-spacer" />
        <button className="btn btn-sm btn-ghost"
          style={{color:"var(--gold)", borderColor:"#e8d090"}}
          onClick={() => onMoveToCollection(item, "free")}>
          Obtained Free
        </button>
        <button className="btn btn-sm btn-ghost"
          style={{color:"var(--teal)", borderColor:"var(--teal)"}}
          onClick={() => onMoveToCollection(item, "digital")}>
          ✓ Bought Digital
        </button>
        <button className="btn btn-sm btn-teal"
          onClick={() => onMoveToCollection(item, "vinyl")}>
          ✓ Bought Vinyl
        </button>
      </div>
    </div>
  );
}

function CompareTab({ onCountChange }) {
  const [compare, setCompare] = useState(() => load(KEYS.compare));
  const [threshold, setThreshold] = useState(20);

  useEffect(() => { onCountChange(compare.length); }, [compare.length]);

  const persist = (list) => { setCompare(list); save(KEYS.compare, list); };

  const moveToCollection = (item, obtained_via) => {
    const collection = load(KEYS.collection);
    const alreadyThere = collection.find(c => c.id === item.id);
    if (!alreadyThere) {
      save(KEYS.collection, [...collection, {
        id: item.id,
        artist: item.artist,
        album: item.album,
        year: item.year,
        cover: item.cover || null,
        discogs_release_id: item.discogs_release_id || null,
        discogs_url: item.discogs_url || null,
        bandcamp_url: item.bandcamp_url || null,
        source: item.source,
        obtained_via,
        addedAt: Date.now(),
      }]);
    }
    persist(compare.filter(c => c.id !== item.id));
  };

  const backToWantlist = (item) => {
    const wantlist = load(KEYS.wantlist);
    save(KEYS.wantlist, [...wantlist, { ...item, status: item.result ? "done" : "pending" }]);
    persist(compare.filter(c => c.id !== item.id));
  };

  return (
    <div>
      <div className="threshold-row">
        <div className="slider-label-row">
          <span className="slider-label">All-in Budget</span>
          <span className="slider-value">${threshold}</span>
        </div>
        <input type="range" min={0} max={200} step={5} value={threshold}
          onChange={e => setThreshold(Number(e.target.value))} />
        <div className="slider-sub">
          Max you'll pay all-in, including estimated shipping
        </div>
      </div>

      {compare.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⊙</div>
          <div className="empty-title">Nothing to compare yet</div>
          <div className="empty-sub">
            Search prices in the Wantlist tab, then hit<br />
            <strong>Compare →</strong> on any album to bring it here.
          </div>
        </div>
      ) : (
        <div className="cmp-grid">
          {compare.map(item => (
            <CompareCard key={item.id} item={item} threshold={threshold}
              onMoveToCollection={moveToCollection}
              onBackToWantlist={backToWantlist} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── CollectionTab ─────────────────────────────────────────────────────────────

function CollectionTab({ username }) {
  const [appItems, setAppItems] = useState(() => load(KEYS.collection));
  const [discogsItems, setDiscogsItems] = useState(() => load("rf_discogs_collection"));
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [synced, setSynced] = useState(false);

  const syncCollection = async () => {
    if (!username.trim()) { setSyncError("Enter your Discogs username in the header."); return; }
    setSyncLoading(true);
    setSyncError(null);
    try {
      const API = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API}/collection?username=${encodeURIComponent(username)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const releases = data.releases || [];
      setDiscogsItems(releases);
      save("rf_discogs_collection", releases);
      setSynced(true);
    } catch (err) {
      setSyncError(err.message || "Failed to fetch collection");
    } finally {
      setSyncLoading(false);
    }
  };

  const removeAppItem = (id) => {
    const updated = appItems.filter(i => i.id !== id);
    setAppItems(updated);
    save(KEYS.collection, updated);
  };

  // Dedup: don't show Discogs sync items that are already in app collection
  const appIds = new Set(appItems.map(i => i.discogs_release_id).filter(Boolean));
  const filteredDiscogs = discogsItems.filter(i => !appIds.has(i.discogs_release_id));

  const obtainedLabel = (via) => {
    if (via === "vinyl") return { label: "Vinyl", className: "chip chip-purchased" };
    if (via === "digital") return { label: "Digital", className: "chip chip-teal" };
    if (via === "free") return { label: "Obtained Free", className: "chip chip-free" };
    if (via === "purchased") return { label: "Purchased", className: "chip chip-purchased" };
    return { label: "In Collection", className: "chip chip-pending" };
  };

  const formatDate = (str) => {
    if (!str) return "";
    try { return new Date(str).toLocaleDateString("en-US", { year: "numeric", month: "short" }); }
    catch { return ""; }
  };

  const totalCount = appItems.length + filteredDiscogs.length;

  return (
    <div>
      {syncError && <div className="error-msg">{syncError}</div>}

      <div className="coll-toolbar">
        <span className="wl-count">
          {totalCount} item{totalCount !== 1 ? "s" : ""}
          {synced ? ` · Discogs synced` : ""}
        </span>
        <button className="btn btn-ghost btn-sm"
          onClick={syncCollection} disabled={syncLoading}>
          {syncLoading ? "Syncing…" : "↻ Sync Discogs Collection"}
        </button>
      </div>

      {totalCount === 0 && (
        <div className="empty-state">
          <div className="empty-icon">◉</div>
          <div className="empty-title">Collection is empty</div>
          <div className="empty-sub">
            Mark albums as Purchased or Obtained Free in the Compare tab.<br />
            Sync your Discogs collection above.
          </div>
        </div>
      )}

      {appItems.length > 0 && (
        <>
          <div style={{fontSize:"9px", letterSpacing:"0.25em", textTransform:"uppercase", color:"var(--text-3)", marginBottom:"10px", paddingBottom:"8px", borderBottom:"1px solid var(--border)"}}>
            From This App
          </div>
          <div className="coll-grid" style={{marginBottom:"24px"}}>
            {appItems.map(item => {
              const ob = obtainedLabel(item.obtained_via);
              return (
                <div key={item.id} className="coll-card">
                  <div className="coll-card-row">
                    {item.cover
                      ? <img className="thumb" src={item.cover} alt={item.album} />
                      : <div className="thumb-placeholder">No Art</div>}
                    <div className="card-info">
                      <div className="card-title">{item.album}</div>
                      <div className="card-artist">{item.artist}{item.year ? ` · ${item.year}` : ""}</div>
                      {item.bandcamp_url && (
                        <a href={item.bandcamp_url} target="_blank" rel="noreferrer"
                          style={{fontSize:"10px", color:"var(--accent)", textDecoration:"none", letterSpacing:"0.08em", textTransform:"uppercase", display:"inline-block", marginTop:"4px"}}>
                          Bandcamp ↗
                        </a>
                      )}
                    </div>
                    <div className="coll-obtained">
                      <span className={ob.className}>{ob.label}</span>
                      <button className="btn btn-sm btn-danger-ghost"
                        onClick={() => removeAppItem(item.id)} title="Remove">×</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {filteredDiscogs.length > 0 && (
        <>
          <div style={{fontSize:"9px", letterSpacing:"0.25em", textTransform:"uppercase", color:"var(--text-3)", marginBottom:"10px", paddingBottom:"8px", borderBottom:"1px solid var(--border)"}}>
            Discogs Collection · {filteredDiscogs.length} records
          </div>
          <div className="coll-grid">
            {filteredDiscogs.map((item, i) => (
              <div key={i} className="coll-card">
                <div className="coll-card-row">
                  {item.cover
                    ? <img className="thumb" src={item.cover} alt={item.album} />
                    : <div className="thumb-placeholder">No Art</div>}
                  <div className="card-info">
                    <div className="card-title">{item.album}</div>
                    <div className="card-artist">{item.artist}{item.year ? ` · ${item.year}` : ""}</div>
                  </div>
                  <div className="coll-obtained">
                    <span className="chip chip-purchased">Purchased</span>
                    {item.date_added && (
                      <span className="coll-date">{formatDate(item.date_added)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!synced && totalCount === appItems.length && appItems.length > 0 && (
        <div style={{fontSize:"11px", color:"var(--text-3)", marginTop:"16px", textAlign:"center"}}>
          Sync your Discogs collection above to see your full record history.
        </div>
      )}
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("wantlist");
  const [username, setUsername] = useState(() => loadStr(KEYS.username, "glassmouse"));
  const [wantlistCount, setWantlistCount] = useState(() => load(KEYS.wantlist).length);
  const [compareCount, setCompareCount] = useState(() => load(KEYS.compare).length);

  const handleUsernameChange = (val) => {
    setUsername(val);
    saveStr(KEYS.username, val);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">

        <header className="header">
          <p className="header-eyebrow">Record Procurement Tool</p>
          <h1>Find the best <em>vinyl</em><br />before you buy.</h1>
          <div className="header-meta">
            <span className="header-sub">Discogs Wantlist → Compare → Collection</span>
            <div className="username-field">
              <span className="username-label">Discogs</span>
              <input className="username-input" type="text"
                placeholder="username" value={username}
                onChange={e => handleUsernameChange(e.target.value)} />
            </div>
          </div>
        </header>

        <nav className="tab-nav">
          <button className={`tab-btn${tab === "wantlist" ? " active" : ""}`}
            onClick={() => setTab("wantlist")}>
            Wantlist
            {wantlistCount > 0 && <span className="tab-badge">{wantlistCount}</span>}
          </button>
          <button className={`tab-btn${tab === "compare" ? " active" : ""}`}
            onClick={() => setTab("compare")}>
            Compare
            {compareCount > 0 && <span className="tab-badge">{compareCount}</span>}
          </button>
          <button className={`tab-btn${tab === "collection" ? " active" : ""}`}
            onClick={() => setTab("collection")}>
            Collection
          </button>
        </nav>

        {tab === "wantlist" && (
          <WantlistTab username={username} onCountChange={setWantlistCount} />
        )}
        {tab === "compare" && (
          <CompareTab onCountChange={setCompareCount} />
        )}
        {tab === "collection" && (
          <CollectionTab username={username} />
        )}

      </div>
    </>
  );
}