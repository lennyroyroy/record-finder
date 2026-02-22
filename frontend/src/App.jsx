import { useState } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #f5f0e8;
    color: #1a1a1a;
    font-family: 'DM Mono', monospace;
    min-height: 100vh;
    display: flex;
    justify-content: center;
  }

  .app {
    width: 100%;
    max-width: 680px;
    padding: 48px 24px 120px;
  }

  .header {
    margin-bottom: 40px;
    padding-bottom: 28px;
    border-bottom: 2px solid #1a1a1a;
  }

  .header-eyebrow {
    font-size: 10px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #888;
    margin-bottom: 10px;
  }

  .header h1 {
    font-family: 'Fraunces', serif;
    font-size: clamp(28px, 5vw, 42px);
    font-weight: 700;
    line-height: 1.1;
    color: #1a1a1a;
    letter-spacing: -0.02em;
  }

  .header h1 em {
    font-style: italic;
    font-weight: 400;
    color: #c8622e;
  }

  .header-sub {
    margin-top: 8px;
    font-size: 11px;
    color: #999;
    letter-spacing: 0.05em;
  }

  .search-form { margin-bottom: 36px; }

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
    color: #888;
    font-weight: 500;
  }

  .field input {
    background: #fff;
    border: 1.5px solid #ddd;
    color: #1a1a1a;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    padding: 11px 13px;
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
    border-radius: 4px;
  }

  .field input:focus { border-color: #c8622e; }
  .field input::placeholder { color: #bbb; }

  .slider-row { margin: 12px 0; }

  .slider-label-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 8px;
  }

  .slider-label { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: #888; }
  .slider-value { font-size: 13px; color: #c8622e; font-weight: 500; }

  input[type="range"] {
    width: 100%;
    appearance: none;
    background: #ddd;
    height: 3px;
    outline: none;
    cursor: pointer;
    border-radius: 2px;
  }

  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: #c8622e;
    cursor: pointer;
    border-radius: 50%;
  }

  .search-btn {
    width: 100%;
    padding: 14px;
    background: #1a1a1a;
    color: #f5f0e8;
    border: none;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.15s;
    border-radius: 4px;
    margin-top: 4px;
  }

  .search-btn:hover:not(:disabled) { background: #333; }
  .search-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .error-msg {
    padding: 12px 16px;
    border: 1.5px solid #e8a090;
    background: #fff5f3;
    color: #c0392b;
    font-size: 11px;
    margin-bottom: 24px;
    border-radius: 4px;
  }

  .results { animation: fadeUp 0.35s ease forwards; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .release-header {
    display: grid;
    grid-template-columns: 90px 1fr;
    gap: 16px;
    margin-bottom: 24px;
    align-items: start;
  }

  .release-cover {
    width: 90px;
    height: 90px;
    object-fit: cover;
    display: block;
    border-radius: 3px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  }

  .release-cover-placeholder {
    width: 90px;
    height: 90px;
    background: #e8e3da;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #bbb;
    font-size: 10px;
  }

  .release-meta { display: flex; flex-direction: column; justify-content: center; gap: 5px; }

  .release-title {
    font-family: 'Fraunces', serif;
    font-size: 20px;
    font-weight: 700;
    color: #1a1a1a;
    line-height: 1.2;
  }

  .release-year { font-size: 11px; color: #999; letter-spacing: 0.1em; }

  .release-link {
    font-size: 10px;
    color: #c8622e;
    text-decoration: none;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    display: inline-block;
  }

  .release-link:hover { text-decoration: underline; }

  /* MODE 1 — Full Analysis Decision Card */
  .decision-card {
    border-radius: 6px;
    padding: 28px;
    margin-bottom: 32px;
    position: relative;
    overflow: hidden;
  }

  .decision-card.vinyl { background: #1a1a1a; color: #f5f0e8; }
  .decision-card.digital { background: #1e3a5f; color: #f0f4f8; }

  .decision-label {
    font-size: 9px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    opacity: 0.5;
    margin-bottom: 8px;
  }

  .decision-verdict {
    font-family: 'Fraunces', serif;
    font-size: clamp(32px, 6vw, 48px);
    font-weight: 700;
    line-height: 1;
    margin-bottom: 10px;
    letter-spacing: -0.02em;
  }

  .decision-card.vinyl .decision-verdict { color: #f0c060; }
  .decision-card.digital .decision-verdict { color: #7ec8f0; }

  .decision-reason {
    font-size: 12px;
    opacity: 0.7;
    line-height: 1.6;
    margin-bottom: 20px;
    max-width: 480px;
  }

  .decision-best {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    background: rgba(255,255,255,0.08);
    border-radius: 4px;
    gap: 12px;
  }

  .decision-best-source { font-size: 12px; opacity: 0.8; }
  .decision-best-price { font-size: 22px; font-weight: 500; }
  .decision-card.vinyl .decision-best-price { color: #f0c060; }
  .decision-card.digital .decision-best-price { color: #7ec8f0; }

  .decision-best a {
    font-size: 10px;
    color: rgba(255,255,255,0.4);
    text-decoration: none;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .decision-best a:hover { color: rgba(255,255,255,0.8); }

  /* MODE 2 — Price Scout Card */
  .scout-card {
    border-radius: 6px;
    padding: 28px;
    margin-bottom: 32px;
    background: #fff;
    border: 1.5px solid #e0dbd2;
  }

  .scout-label {
    font-size: 9px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #aaa;
    margin-bottom: 8px;
  }

  .scout-title {
    font-family: 'Fraunces', serif;
    font-size: 22px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 6px;
  }

  .scout-subtitle {
    font-size: 11px;
    color: #999;
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .scout-best {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    background: #f5f0e8;
    border-radius: 4px;
    gap: 12px;
    margin-bottom: 8px;
  }

  .scout-best-label { font-size: 11px; color: #666; }
  .scout-best-price { font-size: 28px; font-weight: 700; color: #1a1a1a; }
  .scout-best-source { font-size: 10px; color: #aaa; margin-top: 2px; }

  .scout-best a {
    font-size: 10px;
    color: #c8622e;
    text-decoration: none;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .scout-best a:hover { text-decoration: underline; }

  .scout-note {
    font-size: 10px;
    color: #bbb;
    line-height: 1.6;
    margin-top: 10px;
  }

  /* Shared section styles */
  .section-title {
    font-size: 9px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #999;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e0dbd2;
  }

  .listings-section { margin-bottom: 28px; }

  .listing-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #ece8e0;
    gap: 10px;
  }

  .listing-row:last-child { border-bottom: none; }
  .listing-country { font-size: 11px; color: #666; min-width: 60px; }
  .listing-format { font-size: 10px; color: #aaa; flex: 1; letter-spacing: 0.05em; }
  .listing-forsale { font-size: 10px; color: #bbb; white-space: nowrap; }
  .listing-price { font-size: 15px; color: #1a1a1a; font-weight: 500; min-width: 60px; text-align: right; }

  .listing-link {
    font-size: 10px;
    color: #c8622e;
    text-decoration: none;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }

  .listing-link:hover { text-decoration: underline; }

  .empty-state {
    font-size: 11px;
    color: #bbb;
    padding: 14px 0;
    font-style: italic;
  }

  /* Check These Next — always visible */
  .check-next-section { margin-bottom: 28px; }

  .check-next-links { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }

  .check-next-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 14px;
    background: #fff;
    border: 1.5px solid #e0dbd2;
    text-decoration: none;
    border-radius: 4px;
    transition: border-color 0.15s, background 0.15s;
  }

  .check-next-row:hover { border-color: #c8622e; background: #fff9f6; }
  .check-next-name { font-size: 12px; color: #1a1a1a; font-weight: 500; }
  .check-next-action { font-size: 10px; color: #c8622e; letter-spacing: 0.1em; text-transform: uppercase; }
  .check-next-note { font-size: 10px; color: #aaa; margin-top: 8px; line-height: 1.6; }

  /* Bandcamp section — Mode 1 only */
  .bandcamp-section { margin-bottom: 28px; }
  .bandcamp-prices { display: flex; gap: 10px; margin-top: 4px; }

  .bandcamp-price-card {
    flex: 1;
    padding: 14px;
    background: #fff;
    border: 1.5px solid #e0dbd2;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .bandcamp-price-label { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: #aaa; }
  .bandcamp-price-value { font-size: 20px; color: #1a1a1a; font-weight: 500; }
  .bandcamp-price-note { font-size: 10px; color: #aaa; }

  .bandcamp-visit {
    display: inline-block;
    margin-top: 10px;
    font-size: 10px;
    color: #c8622e;
    text-decoration: none;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .bandcamp-visit:hover { text-decoration: underline; }

  .shipping-input-row {
    margin-top: 12px;
    padding: 12px;
    background: #f5f0e8;
    border: 1.5px solid #e0dbd2;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .shipping-input-label { font-size: 10px; color: #888; flex: 1; line-height: 1.5; }
  .shipping-input-label span { display: block; font-size: 9px; color: #bbb; margin-top: 2px; }
  .shipping-input-field { display: flex; align-items: center; gap: 6px; }

  .shipping-input-field input {
    background: #fff;
    border: 1.5px solid #ddd;
    color: #1a1a1a;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    padding: 7px 10px;
    width: 75px;
    outline: none;
    text-align: right;
    border-radius: 4px;
    transition: border-color 0.15s;
  }

  .shipping-input-field input:focus { border-color: #c8622e; }

  .shipping-recalc-btn {
    padding: 8px 14px;
    background: #1a1a1a;
    border: none;
    color: #f5f0e8;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.15s;
  }

  .shipping-recalc-btn:hover { background: #333; }
  .intl-shipping-note { font-size: 10px; color: #e05030; margin-top: 4px; font-weight: 500; }

  .loading-state {
    text-align: center;
    padding: 48px 0;
    font-size: 11px;
    color: #aaa;
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

  @media (max-width: 520px) {
    .app { padding: 32px 16px 80px; }
    .fields-row { grid-template-columns: 1fr; }
    .release-header { grid-template-columns: 72px 1fr; }
    .release-cover { width: 72px; height: 72px; }
    .bandcamp-prices { flex-direction: column; }
    .decision-card { padding: 20px; }
    .scout-card { padding: 20px; }
    .shipping-input-row { flex-direction: column; align-items: flex-start; }
  }
`;

export default function App() {
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [bandcampUrl, setBandcampUrl] = useState("");
  const [threshold, setThreshold] = useState(15);
  const [shippingCost, setShippingCost] = useState(20);
  const [shippingInput, setShippingInput] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const handleSearch = async (overrideShipping = null) => {
    if (!artist.trim() || !album.trim()) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const shipping = overrideShipping !== null ? overrideShipping : shippingCost;
      const params = new URLSearchParams({
        artist, album, threshold,
        shipping_cost: shipping,
        bandcamp_url: bandcampUrl
      });
      // const API = "http://localhost:5001"; // local
      const API = "https://record-finder-backend.onrender.com"; // production
      const res = await fetch(API + "/search?" + params);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculate = () => {
    const cost = parseFloat(shippingInput) || 0;
    setShippingCost(cost);
    handleSearch(cost);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };

  const release = results ? results.release : null;
  const decision = results ? results.decision : null;
  const discogsUs = results ? (results.discogs_us || []) : [];
  const discogsIntl = results ? (results.discogs_intl || []) : [];
  const hasBandcamp = results && results.bandcamp && results.bandcamp.digital_price !== null;
  const isRecentRelease = release && release.year && parseInt(release.year) >= new Date().getFullYear() - 2;

  // Best Discogs price across US and intl for scout mode
  const allDiscogs = [...discogsUs, ...discogsIntl];
  const bestDiscogs = allDiscogs.length > 0
    ? allDiscogs.reduce((a, b) => a.price < b.price ? a : b)
    : null;

  const isVinyl = decision && decision.decision === "Buy Vinyl";
  const decisionClass = isVinyl ? "decision-card vinyl" : "decision-card digital";

  // Build "Check These Next" links — always shown
  const bcSearchUrl = "https://bandcamp.com/search?q=" + encodeURIComponent(artist + " " + album) + "&item_type=a";

  const checkNextLinks = [];

  // Bandcamp always first — unless we already have scraped data
  if (!hasBandcamp) {
    checkNextLinks.push({ name: "Bandcamp", url: bcSearchUrl });
  }

  if (isRecentRelease) {
    const q = encodeURIComponent(artist + " " + album + " vinyl");
    checkNextLinks.push(
      { name: "Amazon", url: "https://www.amazon.com/s?k=" + q },
      { name: "Walmart", url: "https://www.walmart.com/search?q=" + q },
      { name: "Target", url: "https://www.target.com/s?searchTerm=" + q }
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">

        <header className="header">
          <p className="header-eyebrow">Record Procurement Tool</p>
          <h1>Should I buy the <em>vinyl</em><br />or go digital?</h1>
          <p className="header-sub">Discogs · Bandcamp · Retail — your rules, one answer</p>
        </header>

        <div className="search-form">
          <div className="fields-row">
            <div className="field">
              <label>Artist</label>
              <input type="text" placeholder="e.g. Burial" value={artist}
                onChange={(e) => setArtist(e.target.value)} onKeyDown={handleKeyDown} />
            </div>
            <div className="field">
              <label>Album</label>
              <input type="text" placeholder="e.g. Untrue" value={album}
                onChange={(e) => setAlbum(e.target.value)} onKeyDown={handleKeyDown} />
            </div>
          </div>

          <div className="field" style={{marginBottom: "12px"}}>
            <label>Bandcamp URL (local only — optional)</label>
            <input type="text"
              placeholder="Paste Bandcamp album URL — only works when running locally"
              value={bandcampUrl}
              onChange={(e) => setBandcampUrl(e.target.value)}
              onKeyDown={handleKeyDown} />
          </div>

          <div className="slider-row">
            <div className="slider-label-row">
              <span className="slider-label">Vinyl Premium Threshold</span>
              <span className="slider-value">${threshold}</span>
            </div>
            <input type="range" min={0} max={50} step={1} value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))} />
          </div>

          <button className="search-btn" onClick={() => handleSearch()}
            disabled={loading || !artist.trim() || !album.trim()}>
            {loading ? "Searching..." : "Find Best Price"}
          </button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        {loading && (
          <div className="loading-state">
            Searching
            <span className="loading-dot"> .</span>
            <span className="loading-dot">.</span>
            <span className="loading-dot">.</span>
          </div>
        )}

        {results && !loading && (
          <div className="results">

            <div className="release-header">
              {release && release.cover
                ? <img className="release-cover" src={release.cover} alt={release.title} />
                : <div className="release-cover-placeholder">No Art</div>}
              <div className="release-meta">
                <div className="release-title">
                  {release && release.title ? release.title : artist + " — " + album}
                </div>
                {release && release.year && <div className="release-year">{release.year}</div>}
                {release && release.discogs_url && (
                  <a className="release-link" href={release.discogs_url} target="_blank" rel="noreferrer">
                    View on Discogs ↗
                  </a>
                )}
              </div>
            </div>

            {/* MODE 1 — Full Analysis */}
            {hasBandcamp && decision && decision.decision !== "No Results" && (
              <div className={decisionClass}>
                <div className="decision-label">Recommendation</div>
                <div className="decision-verdict">{decision.decision}</div>
                <div className="decision-reason">{decision.reason}</div>
                {decision.best_option && (
                  <div className="decision-best">
                    <div>
                      <div className="decision-best-source">{decision.best_option.source}</div>
                      {decision.best_option.url && (
                        <a href={decision.best_option.url} target="_blank" rel="noreferrer">Go to listing ↗</a>
                      )}
                    </div>
                    <div className="decision-best-price">
                      ${decision.best_option.price ? decision.best_option.price.toFixed(2) : "—"}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MODE 2 — Price Scout */}
            {!hasBandcamp && (
              <div className="scout-card">
                <div className="scout-label">Price Scout</div>
                <div className="scout-title">
                  {bestDiscogs ? "Best vinyl price found" : "No Discogs listings found"}
                </div>
                <div className="scout-subtitle">
                  {bestDiscogs
                    ? "Add a Bandcamp URL locally for a full buy vs digital recommendation."
                    : "No vinyl listings on Discogs yet. Check Bandcamp and retail below."}
                </div>
                {bestDiscogs && (
                  <div className="scout-best">
                    <div>
                      <div className="scout-best-label">Lowest price</div>
                      <div className="scout-best-source">
                        {bestDiscogs.ships_from} · {bestDiscogs.num_for_sale} for sale
                      </div>
                      {bestDiscogs.url && (
                        <a href={bestDiscogs.url} target="_blank" rel="noreferrer">View on Discogs ↗</a>
                      )}
                    </div>
                    <div className="scout-best-price">${bestDiscogs.price.toFixed(2)}</div>
                  </div>
                )}
                <div className="scout-note">
                  Running locally? Paste a Bandcamp URL above to unlock the full vinyl vs digital analysis.
                </div>
              </div>
            )}

            <div className="listings-section">
              <div className="section-title">Discogs — US Sellers</div>
              {discogsUs.length > 0 ? discogsUs.map((l, i) => (
                <div className="listing-row" key={i}>
                  <span className="listing-country">US</span>
                  <span className="listing-format">Vinyl</span>
                  <span className="listing-forsale">{l.num_for_sale} for sale</span>
                  <span className="listing-price">${l.price.toFixed(2)}</span>
                  <a className="listing-link" href={l.url} target="_blank" rel="noreferrer">View ↗</a>
                </div>
              )) : <div className="empty-state">No US listings found.</div>}
            </div>

            <div className="listings-section">
              <div className="section-title">Discogs — International Sellers</div>
              {discogsIntl.length > 0 ? discogsIntl.map((l, i) => (
                <div className="listing-row" key={i}>
                  <span className="listing-country">{l.ships_from}</span>
                  <span className="listing-format">Vinyl</span>
                  <span className="listing-forsale">{l.num_for_sale} for sale</span>
                  <span className="listing-price">${l.price.toFixed(2)}</span>
                  <a className="listing-link" href={l.url} target="_blank" rel="noreferrer">View ↗</a>
                </div>
              )) : <div className="empty-state">No international listings found.</div>}
            </div>

            {checkNextLinks.length > 0 && (
              <div className="check-next-section">
                <div className="section-title">Check These Next</div>
                <div className="check-next-links">
                  {checkNextLinks.map(function(link, i) {
                    return (
                      <a key={i} className="check-next-row" href={link.url} target="_blank" rel="noreferrer">
                        <span className="check-next-name">{link.name}</span>
                        <span className="check-next-action">Search ↗</span>
                      </a>
                    );
                  })}
                </div>
                {isRecentRelease && (
                  <div className="check-next-note">Recent release — retail may have new copies cheaper than Discogs.</div>
                )}
              </div>
            )}

            {hasBandcamp && (
              <div className="bandcamp-section">
                <div className="section-title">Bandcamp</div>
                <div className="bandcamp-prices">
                  <div className="bandcamp-price-card">
                    <div className="bandcamp-price-label">Digital</div>
                    <div className="bandcamp-price-value">
                      {results.bandcamp.digital_price === 0
                        ? "Free / NYP"
                        : "$" + results.bandcamp.digital_price.toFixed(2)}
                      {results.bandcamp.digital_currency !== "USD" && results.bandcamp.digital_price > 0 && (
                        <span style={{fontSize: "11px", color: "#aaa", marginLeft: "6px"}}>
                          ({results.bandcamp.digital_price_original} {results.bandcamp.digital_currency})
                        </span>
                      )}
                    </div>
                  </div>

                  {results.bandcamp.vinyl_price && (
                    <div className="bandcamp-price-card">
                      <div className="bandcamp-price-label">Vinyl</div>
                      <div className="bandcamp-price-value">
                        ${results.bandcamp.vinyl_price.toFixed(2)}
                        {results.bandcamp.vinyl_currency !== "USD" && (
                          <span style={{fontSize: "11px", color: "#aaa", marginLeft: "6px"}}>
                            ({results.bandcamp.vinyl_price_original} {results.bandcamp.vinyl_currency})
                          </span>
                        )}
                      </div>
                      {results.bandcamp.vinyl_is_intl && !results.bandcamp.vinyl_sold_out && (
                        <div className="bandcamp-price-note" style={{marginTop: "4px"}}>
                          + ${shippingCost.toFixed(2)} shipping = <strong style={{color: "#1a1a1a"}}>${(results.bandcamp.vinyl_price + shippingCost).toFixed(2)} total</strong>
                        </div>
                      )}
                      <div className="bandcamp-price-note">
                        {results.bandcamp.vinyl_ships_from
                          ? "Ships from " + results.bandcamp.vinyl_ships_from
                          : results.bandcamp.vinyl_is_intl ? "International" : "Ships from US"}
                      </div>
                      {results.bandcamp.vinyl_sold_out && (
                        <div className="intl-shipping-note">Sold out on Bandcamp</div>
                      )}
                      {results.bandcamp.vinyl_is_intl && !results.bandcamp.vinyl_sold_out && (
                        <div className="shipping-input-row">
                          <div className="shipping-input-label">
                            Intl Shipping Cost
                            <span>Estimated $20 — enter actual to recalculate</span>
                          </div>
                          <div className="shipping-input-field">
                            <input type="number" value={shippingInput}
                              onChange={(e) => setShippingInput(parseFloat(e.target.value) || 0)}
                              min={0} step={1} />
                          </div>
                          <button className="shipping-recalc-btn" onClick={handleRecalculate}>Recalc</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <a className="bandcamp-visit" href={results.bandcamp.url} target="_blank" rel="noreferrer">
                  View on Bandcamp ↗
                </a>
              </div>
            )}

          </div>
        )}

      </div>
    </>
  );
}
