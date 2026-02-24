import { useState, useEffect, useRef } from "react";

// ─── GLOBAL STYLES ──────────────────────────────────────────────────────────

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,700;1,9..144,300;1,9..144,400&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #1c1814;
    --surface:   #242018;
    --surface2:  #2c2820;
    --border:    #3a3530;
    --text:      #f0e8d8;
    --text-muted: #9a8f80;
    --text-dim:  #6a6058;
    --accent:    #e07840;
    --accent-dim: #9a4e1e;
    --teal:      #4a9080;
    --teal-dim:  #2a5548;
    --danger:    #c0504a;
    --radius:    8px;
    --radius-lg: 14px;
    --sidebar-w: 220px;
  }

  html, body {
    width: 100%;
    min-height: 100vh;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Mono', monospace;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  /* ── LAYOUT ────────────────────────────────────────────────────────────── */

  .app-shell {
    display: flex;
    min-height: 100vh;
  }

  /* ── SIDEBAR ───────────────────────────────────────────────────────────── */

  .sidebar {
    width: var(--sidebar-w);
    flex-shrink: 0;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    z-index: 100;
    padding: 0 0 24px 0;
  }

  .sidebar-brand {
    padding: 28px 24px 24px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 12px;
  }

  .sidebar-logo {
    font-family: 'Fraunces', serif;
    font-size: 19px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.02em;
    line-height: 1.1;
    display: block;
    text-decoration: none;
  }

  .sidebar-logo em {
    font-style: italic;
    font-weight: 300;
    color: var(--accent);
  }

  .sidebar-tagline {
    font-size: 10px;
    color: var(--text-dim);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 5px;
  }

  .sidebar-nav {
    flex: 1;
    padding: 4px 12px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: var(--radius);
    background: none;
    border: none;
    color: var(--text-muted);
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: all 0.15s ease;
    text-align: left;
    width: 100%;
    position: relative;
  }

  .nav-item:hover {
    background: var(--surface2);
    color: var(--text);
  }

  .nav-item.active {
    background: var(--surface2);
    color: var(--accent);
  }

  .nav-item.active .nav-icon {
    color: var(--accent);
  }

  .nav-icon {
    font-size: 14px;
    width: 18px;
    text-align: center;
    flex-shrink: 0;
    color: var(--text-dim);
    transition: color 0.15s;
  }

  .nav-item.active .nav-icon {
    color: var(--accent);
  }

  .nav-badge {
    margin-left: auto;
    background: var(--accent);
    color: #fff;
    font-size: 9px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 999px;
    letter-spacing: 0.05em;
  }

  .nav-badge.teal {
    background: var(--teal);
  }

  .sidebar-footer {
    padding: 16px 24px 0;
    border-top: 1px solid var(--border);
    margin-top: 12px;
  }

  .sidebar-user-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .sidebar-username {
    font-size: 11px;
    font-weight: 500;
    color: var(--text);
    letter-spacing: 0.04em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sidebar-logout {
    background: none;
    border: 1px solid var(--border);
    color: var(--text-muted);
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 4px 8px;
    border-radius: var(--radius);
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.15s;
  }

  .sidebar-logout:hover {
    border-color: var(--danger);
    color: var(--danger);
  }

  .sidebar-status {
    margin-top: 8px;
    font-size: 10px;
    color: var(--teal);
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .sidebar-status::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--teal);
    flex-shrink: 0;
  }

  /* ── MAIN ──────────────────────────────────────────────────────────────── */

  .main {
    margin-left: var(--sidebar-w);
    flex: 1;
    min-height: 100vh;
    padding: 40px 40px 48px;
    max-width: 900px;
  }

  /* ── MOBILE TAB BAR ────────────────────────────────────────────────────── */

  .mobile-tab-bar {
    display: none;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: var(--surface);
    border-top: 1px solid var(--border);
    z-index: 200;
    padding: 8px 0 max(8px, env(safe-area-inset-bottom));
  }

  .mobile-tab-bar-inner {
    display: flex;
    justify-content: space-around;
  }

  .mobile-tab-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    background: none;
    border: none;
    color: var(--text-dim);
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    padding: 4px 20px;
    border-radius: var(--radius);
    transition: color 0.15s;
    position: relative;
  }

  .mobile-tab-btn.active { color: var(--accent); }

  .mobile-tab-btn-icon {
    font-size: 17px;
    line-height: 1;
  }

  .mobile-tab-badge {
    position: absolute;
    top: 0; right: 10px;
    background: var(--accent);
    color: #fff;
    font-size: 8px;
    font-weight: 700;
    padding: 1px 4px;
    border-radius: 999px;
    letter-spacing: 0;
  }

  .mobile-tab-badge.teal { background: var(--teal); }

  @media (max-width: 680px) {
    .sidebar { display: none; }
    .main {
      margin-left: 0;
      padding: 24px 16px 90px;
      max-width: 100%;
    }
    .mobile-tab-bar { display: block; }
  }

  /* ── LOGIN SCREEN ──────────────────────────────────────────────────────── */

  .login-screen {
    width: 100vw;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    padding: 24px;
    position: relative;
    overflow: hidden;
  }

  .login-screen::before {
    content: '';
    position: absolute;
    top: -200px; right: -200px;
    width: 600px; height: 600px;
    background: radial-gradient(circle at center, rgba(224,120,64,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .login-screen::after {
    content: '';
    position: absolute;
    bottom: -200px; left: -200px;
    width: 500px; height: 500px;
    background: radial-gradient(circle at center, rgba(74,144,128,0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  .login-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 48px 44px;
    width: 100%;
    max-width: 420px;
    position: relative;
    z-index: 1;
  }

  .login-eyebrow {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 16px;
  }

  .login-title {
    font-family: 'Fraunces', serif;
    font-size: 34px;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.1;
    color: var(--text);
    margin-bottom: 6px;
  }

  .login-title em {
    font-style: italic;
    font-weight: 300;
    color: var(--accent);
  }

  .login-sub {
    font-size: 11px;
    color: var(--text-muted);
    margin-bottom: 36px;
    line-height: 1.6;
  }

  .form-field {
    margin-bottom: 16px;
  }

  .form-label {
    display: block;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 7px;
  }

  .form-input {
    width: 100%;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    padding: 11px 14px;
    transition: border-color 0.15s;
    outline: none;
  }

  .form-input::placeholder { color: var(--text-dim); }

  .form-input:focus {
    border-color: var(--accent);
  }

  .form-hint {
    font-size: 10px;
    color: var(--text-dim);
    margin-top: 5px;
    line-height: 1.5;
  }

  .form-hint a {
    color: var(--teal);
    text-decoration: none;
  }

  .form-hint a:hover { text-decoration: underline; }

  .btn-primary {
    width: 100%;
    background: var(--accent);
    border: none;
    border-radius: var(--radius);
    color: #fff;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 13px;
    cursor: pointer;
    margin-top: 8px;
    transition: all 0.15s;
  }

  .btn-primary:hover:not(:disabled) {
    background: #f08850;
    transform: translateY(-1px);
  }

  .btn-primary:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .login-error {
    background: rgba(192, 80, 74, 0.12);
    border: 1px solid rgba(192, 80, 74, 0.3);
    border-radius: var(--radius);
    color: #e08080;
    font-size: 11px;
    padding: 10px 14px;
    margin-bottom: 16px;
    line-height: 1.5;
  }

  /* ── PAGE HEADER ───────────────────────────────────────────────────────── */

  .page-header {
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border);
  }

  .page-eyebrow {
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 8px;
  }

  .page-title {
    font-family: 'Fraunces', serif;
    font-size: clamp(26px, 4vw, 34px);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.1;
    color: var(--text);
  }

  .page-title em {
    font-style: italic;
    font-weight: 300;
    color: var(--accent);
  }

  .page-desc {
    margin-top: 8px;
    font-size: 11px;
    color: var(--text-muted);
    line-height: 1.6;
  }

  /* ── SEARCH BAR ────────────────────────────────────────────────────────── */

  .search-row {
    display: flex;
    gap: 8px;
    margin-bottom: 28px;
  }

  .search-input {
    flex: 1;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    padding: 11px 14px;
    outline: none;
    transition: border-color 0.15s;
  }

  .search-input::placeholder { color: var(--text-dim); }
  .search-input:focus { border-color: var(--accent); }

  .btn-search {
    background: var(--accent);
    border: none;
    border-radius: var(--radius);
    color: #fff;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    padding: 11px 20px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s;
  }

  .btn-search:hover:not(:disabled) { background: #f08850; }
  .btn-search:disabled { opacity: 0.45; cursor: not-allowed; }

  /* ── CARDS ─────────────────────────────────────────────────────────────── */

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 20px;
    margin-bottom: 12px;
    transition: border-color 0.15s;
  }

  .card:hover { border-color: #4a4540; }

  .card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }

  .card-title {
    font-family: 'Fraunces', serif;
    font-size: 16px;
    font-weight: 400;
    color: var(--text);
    line-height: 1.3;
  }

  .card-artist {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 3px;
  }

  .card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 14px;
  }

  .chip {
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 999px;
    border: 1px solid var(--border);
    color: var(--text-muted);
    background: var(--surface2);
  }

  .chip.accent {
    border-color: var(--accent-dim);
    color: var(--accent);
    background: rgba(224,120,64,0.08);
  }

  .chip.teal {
    border-color: var(--teal-dim);
    color: var(--teal);
    background: rgba(74,144,128,0.08);
  }

  /* ── PRICE SECTION ─────────────────────────────────────────────────────── */

  .price-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 10px;
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid var(--border);
  }

  .price-cell {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 12px 14px;
  }

  .price-label {
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 5px;
  }

  .price-value {
    font-family: 'Fraunces', serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.02em;
  }

  .price-value.best { color: var(--teal); }
  .price-value.high { color: var(--accent); }

  .price-sub {
    font-size: 10px;
    color: var(--text-dim);
    margin-top: 2px;
  }

  /* ── PROGRESS BAR ──────────────────────────────────────────────────────── */

  .progress-bar-wrap {
    margin: 14px 0 4px;
  }

  .progress-bar-label {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: var(--text-dim);
    margin-bottom: 6px;
  }

  .progress-bar-track {
    height: 4px;
    background: var(--border);
    border-radius: 999px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--teal), var(--accent));
    transition: width 0.4s ease;
  }

  /* ── ACTIONS ROW ───────────────────────────────────────────────────────── */

  .card-actions {
    display: flex;
    gap: 8px;
    margin-top: 14px;
    flex-wrap: wrap;
  }

  .btn-secondary {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text-muted);
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 7px 14px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn-secondary:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .btn-secondary.teal:hover {
    border-color: var(--teal);
    color: var(--teal);
  }

  .btn-secondary.danger:hover {
    border-color: var(--danger);
    color: var(--danger);
  }

  /* ── EMPTY STATE ───────────────────────────────────────────────────────── */

  .empty-state {
    text-align: center;
    padding: 64px 24px;
  }

  .empty-icon {
    font-size: 40px;
    margin-bottom: 16px;
    opacity: 0.3;
  }

  .empty-title {
    font-family: 'Fraunces', serif;
    font-size: 20px;
    font-weight: 400;
    color: var(--text-muted);
    margin-bottom: 8px;
  }

  .empty-sub {
    font-size: 11px;
    color: var(--text-dim);
    line-height: 1.6;
    max-width: 280px;
    margin: 0 auto;
  }

  /* ── LOADING ───────────────────────────────────────────────────────────── */

  .loading-state {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 28px 0;
    color: var(--text-dim);
    font-size: 12px;
  }

  .spinner {
    width: 18px; height: 18px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── SECTION LABEL ─────────────────────────────────────────────────────── */

  .section-label {
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* ── WISHLIST ITEM ─────────────────────────────────────────────────────── */

  .wishlist-input-row {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
  }

  .wishlist-item {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 10px 14px;
    margin-bottom: 6px;
  }

  .wishlist-item-name {
    flex: 1;
    font-size: 12px;
    color: var(--text);
  }

  .wishlist-item-status {
    font-size: 10px;
    color: var(--text-dim);
  }

  .wishlist-item-status.found { color: var(--teal); }
  .wishlist-item-status.searching { color: var(--accent); }

  .btn-icon {
    background: none;
    border: none;
    color: var(--text-dim);
    font-size: 14px;
    cursor: pointer;
    padding: 2px 4px;
    border-radius: 4px;
    transition: color 0.15s;
    line-height: 1;
  }

  .btn-icon:hover { color: var(--danger); }

  /* ── COMPARE TABLE ─────────────────────────────────────────────────────── */

  .compare-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
    margin-top: 8px;
  }

  .compare-table th {
    text-align: left;
    padding: 8px 12px;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-dim);
    border-bottom: 1px solid var(--border);
  }

  .compare-table td {
    padding: 12px 12px;
    border-bottom: 1px solid var(--border);
    color: var(--text-muted);
    vertical-align: middle;
  }

  .compare-table td:first-child { color: var(--text); }

  .compare-table tr:last-child td { border-bottom: none; }

  .compare-table tr:hover td { background: var(--surface2); }

  .price-tag {
    font-family: 'Fraunces', serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
  }

  .price-tag.best-deal { color: var(--teal); }

  /* ── COLLECTION GRID ───────────────────────────────────────────────────── */

  .collection-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 14px;
    margin-top: 4px;
  }

  .collection-thumb {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.15s, transform 0.15s;
  }

  .collection-thumb:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
  }

  .thumb-cover {
    aspect-ratio: 1;
    background: var(--surface2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: var(--text-dim);
    overflow: hidden;
  }

  .thumb-cover img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
  }

  .thumb-info {
    padding: 10px 12px;
  }

  .thumb-title {
    font-size: 11px;
    font-weight: 500;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .thumb-artist {
    font-size: 10px;
    color: var(--text-dim);
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── TOAST ─────────────────────────────────────────────────────────────── */

  .toast {
    position: fixed;
    bottom: 88px;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text);
    font-size: 12px;
    padding: 10px 18px;
    opacity: 0;
    transition: all 0.25s ease;
    z-index: 999;
    pointer-events: none;
    white-space: nowrap;
  }

  .toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  @media (min-width: 681px) {
    .toast { bottom: 28px; }
  }

  /* ── SYNC BUTTON ───────────────────────────────────────────────────────── */

  .btn-sync {
    background: none;
    border: 1px solid var(--teal-dim);
    color: var(--teal);
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 7px 14px;
    border-radius: var(--radius);
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn-sync:hover { background: rgba(74,144,128,0.08); }
  .btn-sync:disabled { opacity: 0.4; cursor: not-allowed; }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 14px;
    flex-wrap: wrap;
  }

  /* ── RESULT COUNT ──────────────────────────────────────────────────────── */

  .result-count {
    font-size: 10px;
    color: var(--text-dim);
    margin-bottom: 14px;
    letter-spacing: 0.06em;
  }
`;

// ─── HELPERS ────────────────────────────────────────────────────────────────

const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

async function fetchAPI(path, options = {}) {
  const token = localStorage.getItem("sos_token") || "";
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", "X-Auth-Token": token },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

function useToast() {
  const [toast, setToast] = useState({ msg: "", show: false });
  const timerRef = useRef();
  const showToast = (msg) => {
    clearTimeout(timerRef.current);
    setToast({ msg, show: true });
    timerRef.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2500);
  };
  return [toast, showToast];
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────

function LoginScreen({ error, loading }) {
  const [starting, setStarting] = useState(false);

  async function handleAuthorize() {
    setStarting(true);
    try {
      // Backend returns { auth_url: "https://discogs.com/oauth/authorize?oauth_token=..." }
      const data = await fetchAPI("/auth/start");
      window.location.href = data.auth_url;
    } catch (err) {
      setStarting(false);
      console.error("Failed to start OAuth:", err);
    }
  }

  const busy = loading || starting;

  return (
    <div className="login-screen">
      <div className="login-card">
        <p className="login-eyebrow">Discogs Price Tool</p>
        <h1 className="login-title">
          Spin or <em>Stream v1</em>
        </h1>
        <p className="login-sub">
          Compare wantlist prices and make smarter decisions about what's worth buying on wax versus just streaming it.
        </p>

        {error && <div className="login-error">{error}</div>}

        {busy ? (
          <div className="loading-state" style={{ justifyContent: "center", padding: "20px 0" }}>
            <div className="spinner" />
            {loading ? "Completing authorization…" : "Redirecting to Discogs…"}
          </div>
        ) : (
          <>
            <button className="btn-primary" onClick={handleAuthorize}>
              Authorize with Discogs
            </button>
            <p className="form-hint" style={{ marginTop: "14px", textAlign: "center" }}>
              You'll be taken to Discogs to sign in and approve access — then right back here.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── WANTLIST TAB ────────────────────────────────────────────────────────────

function WantlistTab({ username, onCountChange, onCompareAdd }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [searching, setSearching] = useState({});
  const [results, setResults] = useState({});
  const [toast, showToast] = useToast();

  useEffect(() => {
    loadWantlist();
  }, []);

  async function loadWantlist() {
    setLoading(true);
    try {
      const data = await fetchAPI(`/wantlist?username=${encodeURIComponent(username)}`);
      setItems(data.items || []);
      onCountChange?.(data.items?.length || 0);
    } catch (err) {
      showToast("Could not load wantlist: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function syncWantlist() {
    setSyncing(true);
    try {
      await loadWantlist();
      showToast("Wantlist synced ✓");
    } finally {
      setSyncing(false);
    }
  }

  async function searchPrices(item) {
    setSearching((s) => ({ ...s, [item.id]: true }));
    try {
      const data = await fetchAPI(
        `/search?artist=${encodeURIComponent(item.artist)}&album=${encodeURIComponent(item.title)}`
      );
      setResults((r) => ({ ...r, [item.id]: data }));
    } catch (err) {
      showToast("Search failed: " + err.message);
    } finally {
      setSearching((s) => ({ ...s, [item.id]: false }));
    }
  }

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <p className="page-eyebrow">Your list</p>
          <h2 className="page-title">Wantlist</h2>
        </div>
        <div className="loading-state">
          <div className="spinner" />
          Loading wantlist from Discogs…
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toast toast={toast} />
      <div className="page-header">
        <p className="page-eyebrow">Your list</p>
        <h2 className="page-title">
          Wantlist <em>{items.length > 0 ? `(${items.length})` : ""}</em>
        </h2>
        <p className="page-desc">Check marketplace prices on everything you're hunting for.</p>
        <div className="header-actions">
          <button className="btn-sync" onClick={syncWantlist} disabled={syncing}>
            {syncing ? "Syncing…" : "↻ Sync from Discogs"}
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◎</div>
          <p className="empty-title">Nothing on your wantlist yet</p>
          <p className="empty-sub">Head to Discogs and add some records — they'll show up here.</p>
        </div>
      ) : (
        items.map((item) => (
          <WantlistCard
            key={item.id}
            item={item}
            result={results[item.id]}
            searching={searching[item.id]}
            onSearch={() => searchPrices(item)}
            onCompareAdd={() => {
              onCompareAdd?.(item, results[item.id]);
              showToast(`Added "${item.title}" to Compare`);
            }}
          />
        ))
      )}
    </div>
  );
}

function WantlistCard({ item, result, searching, onSearch, onCompareAdd }) {
  const usListings = result?.discogs_us || [];
  const intlListings = result?.discogs_intl || [];
  const allListings = [...usListings, ...intlListings];
  const prices = allListings.map((l) => l.price).filter(Boolean);
  const minPrice = prices.length ? Math.min(...prices) : null;
  const avgPrice = prices.length ? prices.reduce((a, b) => a + b) / prices.length : null;
  const usPrices = usListings.map((l) => l.price).filter(Boolean);
  const minUS = usPrices.length ? Math.min(...usPrices) : null;

  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", flex: 1, minWidth: 0 }}>
          {item.cover_url && (
            <img
              src={item.cover_url}
              alt={item.title}
              style={{ width: "52px", height: "52px", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--border)", flexShrink: 0 }}
            />
          )}
          <div style={{ minWidth: 0 }}>
            <div className="card-title">{item.title}</div>
            <div className="card-artist">{item.artist}</div>
          </div>
        </div>
        {item.year && <div className="chip" style={{ flexShrink: 0 }}>{item.year}</div>}
      </div>

      <div className="card-meta">
        {item.format && <span className="chip">{item.format}</span>}
        {item.label && <span className="chip">{item.label}</span>}
        {result && (
          <span className="chip teal">{allListings.length} listings</span>
        )}
      </div>

      {searching && (
        <div className="loading-state" style={{ padding: "12px 0" }}>
          <div className="spinner" />
          Fetching marketplace prices…
        </div>
      )}

      {result && allListings.length > 0 && (
        <>
          <div className="price-grid">
            {minPrice != null && (
              <div className="price-cell">
                <div className="price-label">Lowest</div>
                <div className="price-value best">${minPrice.toFixed(2)}</div>
                <div className="price-sub">anywhere</div>
              </div>
            )}
            {minUS != null && (
              <div className="price-cell">
                <div className="price-label">Best US Ship</div>
                <div className="price-value">${minUS.toFixed(2)}</div>
                <div className="price-sub">ships from US</div>
              </div>
            )}
            {avgPrice != null && (
              <div className="price-cell">
                <div className="price-label">Avg</div>
                <div className="price-value high">${avgPrice.toFixed(2)}</div>
                <div className="price-sub">{allListings.length} listings</div>
              </div>
            )}
          </div>

          {minPrice != null && avgPrice != null && (
            <div className="progress-bar-wrap">
              <div className="progress-bar-label">
                <span>Low ${minPrice.toFixed(2)}</span>
                <span>Avg ${avgPrice.toFixed(2)}</span>
              </div>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${Math.min((minPrice / avgPrice) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </>
      )}

      {result && allListings.length === 0 && (
        <p style={{ fontSize: "11px", color: "var(--text-dim)", padding: "8px 0" }}>
          No listings found on the marketplace right now.
        </p>
      )}

      <div className="card-actions">
        {!result && (
          <button className="btn-search" onClick={onSearch} disabled={searching}>
            {searching ? "Searching…" : "Check Prices"}
          </button>
        )}
        {result && (
          <button className="btn-secondary" onClick={onSearch} disabled={searching}>
            Refresh
          </button>
        )}
        {result && allListings.length > 0 && (
          <button className="btn-secondary teal" onClick={onCompareAdd}>
            + Compare
          </button>
        )}
        {item.discogs_url && (
          <a
            href={item.discogs_url}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none" }}
          >
            <button className="btn-secondary">View on Discogs ↗</button>
          </a>
        )}
      </div>
    </div>
  );
}

// ─── COMPARE TAB ─────────────────────────────────────────────────────────────

function CompareTab({ compareItems, onRemove }) {
  const [toast, showToast] = useToast();

  function handleRemove(id) {
    onRemove(id);
    showToast("Removed from compare");
  }

  if (compareItems.length === 0) {
    return (
      <div>
        <Toast toast={toast} />
        <div className="page-header">
          <p className="page-eyebrow">Side by side</p>
          <h2 className="page-title">Compare</h2>
          <p className="page-desc">Add records from your Wantlist to compare prices head-to-head.</p>
        </div>
        <div className="empty-state">
          <div className="empty-icon">⊙</div>
          <p className="empty-title">Nothing to compare yet</p>
          <p className="empty-sub">
            Check prices on your wantlist items and hit "+ Compare" to add them here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toast toast={toast} />
      <div className="page-header">
        <p className="page-eyebrow">Side by side</p>
        <h2 className="page-title">
          Compare <em>({compareItems.length})</em>
        </h2>
        <p className="page-desc">All available prices and where else to find each record.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {compareItems.map((ci) => {
          const usListings = ci.result?.discogs_us || [];
          const intlListings = ci.result?.discogs_intl || [];
          const allListings = [...usListings, ...intlListings];
          const prices = allListings.map((l) => l.price).filter(Boolean);
          const minPrice = prices.length ? Math.min(...prices) : null;

          const bestDeal = compareItems.reduce((best, curr) => {
            const ps = [...(curr.result?.discogs_us || []), ...(curr.result?.discogs_intl || [])].map((l) => l.price).filter(Boolean);
            const m = ps.length ? Math.min(...ps) : Infinity;
            const bestPs = [...(best?.result?.discogs_us || []), ...(best?.result?.discogs_intl || [])].map((l) => l.price).filter(Boolean);
            const bm = bestPs.length ? Math.min(...bestPs) : Infinity;
            return m < bm ? curr : best;
          }, compareItems[0]);
          const isBest = bestDeal?.item?.id === ci.item.id && minPrice != null;

          const qVinyl = encodeURIComponent(`${ci.item.artist} ${ci.item.title} vinyl`);
          const qPlain = encodeURIComponent(`${ci.item.artist} ${ci.item.title}`);

          const listingRow = (l, i, isUS) => (
            <a key={`${isUS ? "us" : "intl"}-${i}`} href={l.url} target="_blank" rel="noreferrer"
              style={{ textDecoration: "none", display: "block" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 12px", background: "var(--bg)", border: "1px solid var(--border)",
                borderRadius: "var(--radius)", marginBottom: "4px" }}>
                <div>
                  <span style={{ fontSize: "11px", color: isUS ? "var(--teal)" : "var(--text-muted)", fontWeight: 500 }}>
                    {isUS ? "US" : l.ships_from}
                  </span>
                  {l.num_for_sale > 0 && (
                    <span style={{ fontSize: "10px", color: "var(--text-dim)", marginLeft: "8px" }}>
                      {l.num_for_sale} for sale
                    </span>
                  )}
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: "16px", fontWeight: 700, color: "var(--text)" }}>
                    ${l.price.toFixed(2)}
                  </span>
                  <span style={{ fontSize: "10px", color: "var(--text-dim)", marginLeft: "6px" }}>
                    {isUS
                      ? `+ $${l.shipping_low}–$${l.shipping_high} ship`
                      : `+ est. $${l.shipping_low}–$${l.shipping_high} ship`}
                  </span>
                </div>
              </div>
            </a>
          );

          return (
            <div key={ci.item.id} className="card">
              {/* Header */}
              <div className="card-header">
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", flex: 1, minWidth: 0 }}>
                  {ci.item.cover_url && (
                    <img src={ci.item.cover_url} alt={ci.item.title}
                      style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "6px",
                        border: "1px solid var(--border)", flexShrink: 0 }} />
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <div className="card-title">{ci.item.title}</div>
                      {isBest && <span className="chip teal">best deal</span>}
                    </div>
                    <div className="card-artist">{ci.item.artist}</div>
                    {ci.item.year && (
                      <span className="chip" style={{ marginTop: "5px", display: "inline-block" }}>{ci.item.year}</span>
                    )}
                  </div>
                </div>
                <button className="btn-icon" onClick={() => handleRemove(ci.item.id)} title="Remove">×</button>
              </div>

              {/* Discogs marketplace listings */}
              {allListings.length > 0 ? (
                <>
                  <p className="section-label" style={{ marginTop: "14px" }}>Discogs marketplace</p>
                  {usListings.map((l, i) => listingRow(l, i, true))}
                  {intlListings.map((l, i) => listingRow(l, i, false))}
                </>
              ) : (
                <p style={{ fontSize: "11px", color: "var(--text-dim)", padding: "10px 0 4px" }}>
                  No marketplace data — check prices from Wantlist first.
                </p>
              )}

              {/* Retail search links */}
              <p className="section-label" style={{ marginTop: "16px" }}>Find elsewhere</p>
              <div className="card-actions">
                <a href={`https://www.amazon.com/s?k=${qVinyl}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                  <button className="btn-secondary">Amazon ↗</button>
                </a>
                <a href={`https://bandcamp.com/search?q=${qPlain}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                  <button className="btn-secondary">Bandcamp ↗</button>
                </a>
                <a href={`https://www.target.com/s?searchTerm=${qVinyl}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                  <button className="btn-secondary">Target ↗</button>
                </a>
                <a href={`https://www.walmart.com/search?q=${qVinyl}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                  <button className="btn-secondary">Walmart ↗</button>
                </a>
                {ci.item.discogs_url && (
                  <a href={ci.item.discogs_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                    <button className="btn-secondary teal">Discogs ↗</button>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card-actions" style={{ marginTop: "16px" }}>
        <button
          className="btn-secondary danger"
          onClick={() => compareItems.forEach((ci) => onRemove(ci.item.id))}
        >
          Clear all
        </button>
      </div>
    </div>
  );
}

// ─── COLLECTION TAB ──────────────────────────────────────────────────────────

function CollectionTab({ username }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [toast, showToast] = useToast();

  useEffect(() => {
    loadCollection();
  }, []);

  async function loadCollection() {
    setLoading(true);
    try {
      const data = await fetchAPI(
        `/collection?username=${encodeURIComponent(username)}`
      );
      setItems(data.items || []);
    } catch (err) {
      showToast("Could not load collection: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = query.trim()
    ? items.filter(
        (it) =>
          it.title?.toLowerCase().includes(query.toLowerCase()) ||
          it.artist?.toLowerCase().includes(query.toLowerCase())
      )
    : items;

  return (
    <div>
      <Toast toast={toast} />
      <div className="page-header">
        <p className="page-eyebrow">What you own</p>
        <h2 className="page-title">
          Collection <em>{items.length > 0 ? `(${items.length})` : ""}</em>
        </h2>
        <p className="page-desc">Everything in your Discogs collection.</p>
      </div>

      <div className="search-row" style={{ marginBottom: "20px" }}>
        <input
          className="search-input"
          type="text"
          placeholder="Filter by title or artist…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          Loading collection…
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◉</div>
          <p className="empty-title">{query ? "No matches" : "Collection is empty"}</p>
          <p className="empty-sub">
            {query ? `Nothing matching "${query}"` : "Add records to your Discogs collection and sync."}
          </p>
        </div>
      ) : (
        <>
          <p className="result-count">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</p>
          <div className="collection-grid">
            {filtered.map((item) => (
              <a key={item.id} href={item.discogs_url} target="_blank" rel="noreferrer"
                style={{ textDecoration: "none" }}>
                <div className="collection-thumb">
                  <div className="thumb-cover">
                    {item.cover_url ? (
                      <img src={item.cover_url} alt={item.title} loading="lazy" />
                    ) : (
                      "◎"
                    )}
                  </div>
                  <div className="thumb-info">
                    <div className="thumb-title">{item.title}</div>
                    <div className="thumb-artist">{item.artist}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── TOAST ───────────────────────────────────────────────────────────────────

function Toast({ toast }) {
  return <div className={`toast ${toast.show ? "show" : ""}`}>{toast.msg}</div>;
}

// ─── APP ROOT ────────────────────────────────────────────────────────────────

export default function App() {
  const [authUsername, setAuthUsername] = useState(() => localStorage.getItem("sos_username") || "");
  const [authToken, setAuthToken] = useState(() => localStorage.getItem("sos_token") || "");
  const [tab, setTab] = useState("wantlist");
  const [wantlistCount, setWantlistCount] = useState(0);
  const [compareItems, setCompareItems] = useState([]);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [oauthError, setOauthError] = useState("");

  function handleLogout() {
    localStorage.removeItem("sos_username");
    localStorage.removeItem("sos_token");
    localStorage.removeItem("sos_secret");
    setAuthUsername("");
    setAuthToken("");
    setCompareItems([]);
  }

  // Handle OAuth callback: Discogs redirects back with ?auth=success&token=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authStatus = params.get("auth");
    const token = params.get("token");
    if (authStatus !== "success" || !token) return;

    window.history.replaceState({}, "", window.location.pathname);

    async function completeAuth() {
      setOauthLoading(true);
      try {
        const data = await fetchAPI("/oauth/me", { headers: { "X-Auth-Token": token } });
        localStorage.setItem("sos_username", data.username);
        localStorage.setItem("sos_token", token);
        setAuthUsername(data.username);
        setAuthToken(token);
      } catch (err) {
        setOauthError(err.message || "Authorization failed. Please try again.");
      } finally {
        setOauthLoading(false);
      }
    }
    completeAuth();
  }, []);

  // Validate stored session on mount
  useEffect(() => {
    if (!authUsername || !authToken) return;
    fetchAPI("/oauth/me")
      .then((data) => {
        if (!data.authenticated) {
          handleLogout();
        }
      })
      .catch(() => handleLogout());
  }, []);

  function handleCompareAdd(item, result) {
    setCompareItems((prev) => {
      if (prev.find((ci) => ci.item.id === item.id)) return prev;
      return [...prev, { item, result }];
    });
  }

  function handleCompareRemove(id) {
    setCompareItems((prev) => prev.filter((ci) => ci.item.id !== id));
  }


  if (!authUsername || !authToken) {
    return (
      <>
        <style>{STYLES}</style>
        <LoginScreen error={oauthError} loading={oauthLoading} />
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="app-shell">
        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sidebar-brand">
            <span className="sidebar-logo">
              Spin or <em>Stream</em>
            </span>
            <p className="sidebar-tagline">Vinyl price tool</p>
          </div>

          <nav className="sidebar-nav" role="tablist">
            <button
              className={`nav-item ${tab === "wantlist" ? "active" : ""}`}
              onClick={() => setTab("wantlist")}
              role="tab"
              aria-selected={tab === "wantlist"}
            >
              <span className="nav-icon">◎</span>
              Wantlist
              {wantlistCount > 0 && <span className="nav-badge">{wantlistCount}</span>}
            </button>

            <button
              className={`nav-item ${tab === "compare" ? "active" : ""}`}
              onClick={() => setTab("compare")}
              role="tab"
              aria-selected={tab === "compare"}
            >
              <span className="nav-icon">⊙</span>
              Compare
              {compareItems.length > 0 && <span className="nav-badge teal">{compareItems.length}</span>}
            </button>

            <button
              className={`nav-item ${tab === "collection" ? "active" : ""}`}
              onClick={() => setTab("collection")}
              role="tab"
              aria-selected={tab === "collection"}
            >
              <span className="nav-icon">◉</span>
              Collection
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-user-row">
              <span className="sidebar-username">{authUsername}</span>
              <button className="sidebar-logout" onClick={handleLogout}>Log out</button>
            </div>
            <p className="sidebar-status">Discogs connected</p>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="main">
          {tab === "wantlist" && (
            <WantlistTab
              username={authUsername}
              onCountChange={setWantlistCount}
              onCompareAdd={handleCompareAdd}
            />
          )}
          {tab === "compare" && (
            <CompareTab
              compareItems={compareItems}
              onRemove={handleCompareRemove}
            />
          )}
          {tab === "collection" && (
            <CollectionTab username={authUsername} />
          )}
        </main>

        {/* ── MOBILE TAB BAR ── */}
        <div className="mobile-tab-bar">
          <div className="mobile-tab-bar-inner" role="tablist">
            <button
              className={`mobile-tab-btn ${tab === "wantlist" ? "active" : ""}`}
              onClick={() => setTab("wantlist")}
            >
              <span className="mobile-tab-icon">◎</span>
              {wantlistCount > 0 && <span className="mobile-tab-badge">{wantlistCount}</span>}
              Wantlist
            </button>

            <button
              className={`mobile-tab-btn ${tab === "compare" ? "active" : ""}`}
              onClick={() => setTab("compare")}
            >
              <span className="mobile-tab-icon">⊙</span>
              {compareItems.length > 0 && <span className="mobile-tab-badge teal">{compareItems.length}</span>}
              Compare
            </button>

            <button
              className={`mobile-tab-btn ${tab === "collection" ? "active" : ""}`}
              onClick={() => setTab("collection")}
            >
              <span className="mobile-tab-icon">◉</span>
              Collection
            </button>
          </div>
        </div>
      </div>
    </>
  );
}