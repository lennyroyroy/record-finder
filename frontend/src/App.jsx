import { useState } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background-color: #0e0e0e;
    color: #e8e0d0;
    font-family: 'IBM Plex Mono', monospace;
    min-height: 100vh;
  }

  .grain {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 100;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  .app {
    max-width: 760px;
    margin: 0 auto;
    padding: 60px 24px 120px;
  }

  .header {
    margin-bottom: 56px;
    border-bottom: 1px solid #2a2a2a;
    padding-bottom: 32px;
  }

  .header-eyebrow {
    font-size: 10px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #c8a96e;
    margin-bottom: 12px;
  }

  .header h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(32px, 6vw, 52px);
    font-weight: 400;
    line-height: 1.1;
    color: #f0e8d8;
    letter-spacing: -0.02em;
  }

  .header h1 em {
    font-style: italic;
    color: #c8a96e;
  }

  .header-sub {
    margin-top: 12px;
    font-size: 11px;
    color: #555;
    letter-spacing: 0.05em;
  }

  .search-form { margin-bottom: 48px; }

  .fields-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 16px;
  }

  .field { display: flex; flex-direction: column; gap: 6px; }

  .field label {
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #666;
  }

  .field input {
    background: #161616;
    border: 1px solid #2a2a2a;
    color: #e8e0d0;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    padding: 12px 14px;
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
  }

  .field input:focus { border-color: #c8a96e; }
  .field input::placeholder { color: #333; }

  .slider-row { margin-bottom: 20px; }

  .slider-label-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 8px;
  }

  .slider-label {
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #666;
  }

  .slider-value { font-size: 13px; color: #c8a96e; }

  input[type="range"] {
    width: 100%;
    appearance: none;
    background: #2a2a2a;
    height: 2px;
    outline: none;
    cursor: pointer;
  }

  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: 14px;
    height: 14px;
    background: #c8a96e;
    cursor: pointer;
  }

  .search-btn {
    width: 100%;
    padding: 14px;
    background: #c8a96e;
    color: #0e0e0e;
    border: none;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, opacity 0.2s;
  }

  .search-btn:hover:not(:disabled) { background: #d4b87e; }
  .search-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .error-msg {
    padding: 12px 16px;
    border: 1px solid #4a2a2a;
    background: #1a0e0e;
    color: #c87070;
    font-size: 11px;
    margin-bottom: 24px;
  }

  .results { animation: fadeUp 0.4s ease forwards; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .release-header {
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 20px;
    margin-bottom: 32px;
    padding-bottom: 32px;
    border-bottom: 1px solid #1e1e1e;
    align-items: start;
  }

  .release-cover {
    width: 100px;
    height: 100px;
    object-fit: cover;
    display: block;
    filter: sepia(10%);
  }

  .release-cover-placeholder {
    width: 100px;
    height: 100px;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333;
    font-size: 10px;
    letter-spacing: 0.1em;
  }

  .release-meta {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
  }

  .release-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 400;
    color: #f0e8d8;
    line-height: 1.2;
  }

  .release-year { font-size: 11px; color: #555; letter-spacing: 0.1em; }

  .release-link {
    font-size: 10px;
    color: #c8a96e;
    text-decoration: none;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 4px;
    display: inline-block;
  }

  .release-link:hover { text-decoration: underline; }

  .decision-card {
    padding: 24px;
    margin-bottom: 32px;
    border: 1px solid #2a2a2a;
    background: #111;
    position: relative;
    overflow: hidden;
  }

  .decision-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
  }

  .decision-card.vinyl::before { background: #c8a96e; }
  .decision-card.digital::before { background: #6e9ec8; }

  .decision-label {
    font-size: 9px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #555;
    margin-bottom: 10px;
  }

  .decision-verdict {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 400;
    margin-bottom: 8px;
  }

  .decision-card.vinyl .decision-verdict { color: #c8a96e; }
  .decision-card.digital .decision-verdict { color: #6e9ec8; }

  .decision-reason {
    font-size: 11px;
    color: #666;
    line-height: 1.6;
    margin-bottom: 16px;
  }

  .decision-best {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 12px 14px;
    background: #0e0e0e;
    border: 1px solid #1e1e1e;
  }

  .decision-best-source { font-size: 11px; color: #e8e0d0; }
  .decision-best-price { font-size: 18px; color: #c8a96e; }

  .decision-best a {
    font-size: 10px;
    color: #555;
    text-decoration: none;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .decision-best a:hover { color: #c8a96e; }

  .section-title {
    font-size: 9px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #555;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #1a1a1a;
  }

  .listings-section { margin-bottom: 28px; }

  .listing-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #161616;
    gap: 12px;
  }

  .listing-row:last-child { border-bottom: none; }
  .listing-country { font-size: 11px; color: #888; min-width: 40px; }
  .listing-format { font-size: 10px; color: #444; flex: 1; letter-spacing: 0.05em; }
  .listing-forsale { font-size: 10px; color: #444; }
  .listing-price { font-size: 14px; color: #e8e0d0; min-width: 60px; text-align: right; }

  .listing-link {
    font-size: 10px;
    color: #c8a96e;
    text-decoration: none;
    letter-spacing: 0.05em;
  }

  .listing-link:hover { text-decoration: underline; }

  .empty-state {
    font-size: 11px;
    color: #333;
    padding: 16px 0;
    font-style: italic;
  }

  .bandcamp-note {
    margin-top: 32px;
    padding: 16px;
    border: 1px dashed #2a2a2a;
    font-size: 11px;
    color: #444;
    line-height: 1.6;
    letter-spacing: 0.03em;
  }

  .bandcamp-note span { color: #c8a96e; }

  .loading-state {
    text-align: center;
    padding: 60px 0;
    font-size: 11px;
    color: #444;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .loading-dot {
    display: inline-block;
    animation: pulse 1.2s ease-in-out infinite;
  }
  .loading-dot:nth-child(2) { animation-delay: 0.2s; }
  .loading-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes pulse {
    0%, 80%, 100% { opacity: 0.2; }
    40% { opacity: 1; }
  }

  @media (max-width: 520px) {
    .fields-row { grid-template-columns: 1fr; }
    .release-header { grid-template-columns: 80px 1fr; }
    .release-cover { width: 80px; height: 80px; }
  }
    .bandcamp-section {
    margin-bottom: 28px;
  }

  .bandcamp-prices {
    display: flex;
    gap: 12px;
    margin-top: 4px;
  }

  .bandcamp-price-card {
    flex: 1;
    padding: 12px 14px;
    background: #111;
    border: 1px solid #2a2a2a;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .bandcamp-price-label {
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #555;
  }

  .bandcamp-price-value {
    font-size: 18px;
    color: #e8e0d0;
  }

  .bandcamp-price-note {
    font-size: 10px;
    color: #444;
  }

  .bandcamp-visit {
    display: inline-block;
    margin-top: 10px;
    font-size: 10px;
    color: #c8a96e;
    text-decoration: none;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .bandcamp-visit:hover { text-decoration: underline; }
  
  .shipping-input-row {
    margin-top: 12px;
    padding: 12px 14px;
    background: #0e0e0e;
    border: 1px solid #2a2a2a;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .shipping-input-label {
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #666;
    flex: 1;
  }

  .shipping-input-label span {
    display: block;
    font-size: 9px;
    color: #444;
    margin-top: 3px;
    text-transform: none;
    letter-spacing: 0;
  }

  .shipping-input-field {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .shipping-input-field input {
    background: #161616;
    border: 1px solid #2a2a2a;
    color: #e8e0d0;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    padding: 8px 10px;
    width: 80px;
    outline: none;
    text-align: right;
    transition: border-color 0.2s;
  }

  .shipping-input-field input:focus { border-color: #c8a96e; }

  .shipping-recalc-btn {
    padding: 8px 14px;
    background: transparent;
    border: 1px solid #c8a96e;
    color: #c8a96e;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }

  .shipping-recalc-btn:hover {
    background: #c8a96e;
    color: #0e0e0e;
  }

  .intl-shipping-note {
    font-size: 10px;
    color: #c87070;
    margin-top: 4px;
  }
  `;

export default function App() {
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [threshold, setThreshold] = useState(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [shippingCost, setShippingCost] = useState(20);
  const [shippingInput, setShippingInput] = useState(20);

  const handleSearch = async (overrideShipping = null) => {
    if (!artist.trim() || !album.trim()) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const shipping = overrideShipping !== null ? overrideShipping : shippingCost;
      const params = new URLSearchParams({ artist, album, threshold, shipping_cost: shipping });
      const res = await fetch("http://localhost:5001/search?" + params);
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const release = results ? results.release : null;
  const decision = results ? results.decision : null;
  const discogsUs = results ? results.discogs_us : [];
  const discogsIntl = results ? results.discogs_intl : [];
  const isVinyl = decision && decision.decision === "Buy Vinyl";

  return (
    <>
      <style>{STYLES}</style>
      <div className="grain" />
      <div className="app">

        <header className="header">
          <p className="header-eyebrow">Record Procurement Tool</p>
          <h1>Find the <em>best way</em><br />to buy this record</h1>
          <p className="header-sub">Discogs · Bandcamp · Retail — your rules, one answer</p>
        </header>

        <div className="search-form">
          <div className="fields-row">
            <div className="field">
              <label>Artist</label>
              <input
                type="text"
                placeholder="e.g. Burial"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="field">
              <label>Album</label>
              <input
                type="text"
                placeholder="e.g. Untrue"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <div className="slider-row">
            <div className="slider-label-row">
              <span className="slider-label">Vinyl Premium Threshold</span>
              <span className="slider-value">${threshold}</span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={1}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
            />
          </div>

          <button
            className="search-btn"
            onClick={handleSearch}
            disabled={loading || !artist.trim() || !album.trim()}
          >
            {loading ? "Searching..." : "Find Best Price"}
          </button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        {loading && (
          <div className="loading-state">
            Searching Discogs
            <span className="loading-dot"> .</span>
            <span className="loading-dot">.</span>
            <span className="loading-dot">.</span>
          </div>
        )}

        {results && !loading && (
          <div className="results">

            <div className="release-header">
              {release && release.cover ? (
                <img
                  className="release-cover"
                  src={release.cover}
                  alt={release.title}
                />
              ) : (
                <div className="release-cover-placeholder">No Art</div>
              )}
              <div className="release-meta">
                <div className="release-title">
                  {release && release.title ? release.title : artist + " — " + album}
                </div>
                {release && release.year && (
                  <div className="release-year">{release.year}</div>
                )}
                {release && release.discogs_url && (
                  <a className="release-link" href={release.discogs_url} target="_blank" rel="noreferrer">
                    View on Discogs ↗
                  </a>
                )}
              </div>
            </div>

            {decision && (
              <div className={isVinyl ? "decision-card vinyl" : "decision-card digital"}>
                <div className="decision-label">Recommendation</div>
                <div className="decision-verdict">{decision.decision}</div>
                <div className="decision-reason">{decision.reason}</div>
                {decision.best_option && (
                  <div className="decision-best">
                    <div>
                      <div className="decision-best-source">{decision.best_option.source}</div>
                      {decision.best_option.url && (
                        <a href={decision.best_option.url} target="_blank" rel="noreferrer">
                          Go to listing ↗
                        </a>
                      )}
                    </div>
                    <div className="decision-best-price">
                      ${decision.best_option.price ? decision.best_option.price.toFixed(2) : "—"}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="listings-section">
              <div className="section-title">Discogs — US Sellers</div>
              {discogsUs && discogsUs.length > 0 ? discogsUs.map((l, i) => (
                <div className="listing-row" key={i}>
                  <span className="listing-country">US</span>
                  <span className="listing-format">Vinyl</span>
                  <span className="listing-forsale">{l.num_for_sale} for sale</span>
                  <span className="listing-price">${l.price ? l.price.toFixed(2) : "—"}</span>
                  <a className="listing-link" href={l.url} target="_blank" rel="noreferrer">View ↗</a>
                </div>
              )) : (
                <div className="empty-state">No US listings found for this release.</div>
              )}
            </div>

            <div className="listings-section">
              <div className="section-title">Discogs — International Sellers</div>
              {discogsIntl && discogsIntl.length > 0 ? discogsIntl.map((l, i) => (
                <div className="listing-row" key={i}>
                  <span className="listing-country">{l.ships_from}</span>
                  <span className="listing-format">Vinyl</span>
                  <span className="listing-forsale">{l.num_for_sale} for sale</span>
                  <span className="listing-price">${l.price ? l.price.toFixed(2) : "—"}</span>
                  <a className="listing-link" href={l.url} target="_blank" rel="noreferrer">View ↗</a>
                </div>
              )) : (
                <div className="empty-state">No international listings found.</div>
              )}
            </div>

{results.bandcamp ? (
  <div className="bandcamp-section">
    <div className="section-title">Bandcamp</div>
    <div className="bandcamp-prices">
      <div className="bandcamp-price-card">
        <div className="bandcamp-price-label">Digital</div>
        <div className="bandcamp-price-value">
          {results.bandcamp.digital_price !== null
            ? (results.bandcamp.digital_price === 0
                ? "Free / NYP"
                : "$" + results.bandcamp.digital_price.toFixed(2))
            : "Not found"}
          {results.bandcamp.digital_currency !== "USD" && results.bandcamp.digital_price > 0 && (
            <span style={{fontSize: "11px", color: "#555", marginLeft: "6px"}}>
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
              <span style={{fontSize: "11px", color: "#555", marginLeft: "6px"}}>
                ({results.bandcamp.vinyl_price_original} {results.bandcamp.vinyl_currency})
              </span>
            )}
          </div>
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
                <span>Estimated $20 — enter actual cost to recalculate</span>
              </div>
              <div className="shipping-input-field">
                <input
                  type="number"
                  value={shippingInput}
                  onChange={(e) => setShippingInput(parseFloat(e.target.value) || 0)}
                  min={0}
                  step={1}
                />
              </div>
              <button className="shipping-recalc-btn" onClick={handleRecalculate}>
                Recalc
              </button>
            </div>
          )}
        </div>
      )}
    </div>
    <a className="bandcamp-visit" href={results.bandcamp.url} target="_blank" rel="noreferrer">
      View on Bandcamp ↗
    </a>
  </div>
) : (
  <div className="bandcamp-note">
    <span>Bandcamp not found</span> — search manually at bandcamp.com
  </div>
)}

          </div>
        )}

      </div>
    </>
  );
}