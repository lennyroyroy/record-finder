import { useState, useEffect, useRef } from "react";

const APP_VERSION = "v0.07";

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

  .sidebar-version {
    font-size: 10px;
    color: var(--text-dim);
    margin-top: 4px;
    opacity: 0.6;
  }

  .sidebar-attrib {
    padding: 12px 24px 0;
    font-size: 9px;
    color: var(--text-dim);
    opacity: 0.5;
    line-height: 1.5;
  }

  .sidebar-attrib a {
    color: var(--text-dim);
    text-decoration: underline;
    text-underline-offset: 2px;
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
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
    margin-top: 4px;
  }

  @media (max-width: 540px) {
    .collection-grid {
      grid-template-columns: repeat(auto-fill, minmax(105px, 1fr));
      gap: 8px;
    }
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

  /* ── GUEST BANNER ──────────────────────────────────────────────────────── */

  .guest-banner {
    margin: -40px -40px 28px -40px;
    padding: 10px 40px;
    background: rgba(224,120,64,0.08);
    border-bottom: 1px solid var(--accent-dim);
    font-size: 11px;
    color: var(--accent);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    letter-spacing: 0.04em;
  }

  .guest-banner-btn {
    background: none;
    border: none;
    color: var(--accent);
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
    white-space: nowrap;
    flex-shrink: 0;
  }

  @media (max-width: 680px) {
    .guest-banner {
      margin: -24px -16px 20px -16px;
      padding: 10px 16px;
    }
  }

  /* ── LOGIN – mobile centering ───────────────────────────────────────────── */
  @media (max-width: 540px) {
    .login-screen { align-items: flex-start; padding-top: 40px; }
    .login-card   { padding: 36px 24px; }
  }

  /* ── VINYL DISC BACKDROP ────────────────────────────────────────────────── */
  .login-disc {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    background: radial-gradient(circle,
      var(--surface2) 0%,   var(--surface2) 27%,
      var(--border)   28%,  var(--border)   30%,
      var(--bg)       31%,  var(--bg)       44%,
      var(--border)   45%,  var(--border)   47%,
      var(--bg)       48%,  var(--bg)       61%,
      var(--border)   62%,  var(--border)   64%,
      transparent     65%
    );
  }

  /* ── VINYL FACTS BOX ────────────────────────────────────────────────────── */
  .vinyl-facts-wrap   { margin-top: 18px; }
  .vinyl-facts-label  { font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-dim); text-align: center; margin-bottom: 7px; }
  .vinyl-facts-box    { background: rgba(74,144,128,0.07); border: 1px solid var(--teal-dim); border-radius: var(--radius); padding: 12px 16px; font-size: 11px; color: var(--teal); line-height: 1.7; text-align: center; min-height: 58px; display: flex; align-items: center; justify-content: center; }

  /* ── GUEST BUTTON ───────────────────────────────────────────────────────── */
  .btn-guest {
    width: 100%; background: none; border: 1px solid var(--teal-dim);
    border-radius: var(--radius); color: var(--teal);
    font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase; padding: 12px;
    cursor: pointer; margin-top: 10px; transition: all 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-guest:hover { background: rgba(74,144,128,0.1); border-color: var(--teal); }

  /* ── MOBILE USER BAR ────────────────────────────────────────────────────── */
  .mobile-user-bar {
    display: none; background: var(--surface); border-bottom: 1px solid var(--border);
    padding: 9px 16px; align-items: center; justify-content: space-between; gap: 8px;
    margin: -24px -16px 20px -16px;
  }
  @media (max-width: 680px) { .mobile-user-bar { display: flex; } }
  .mobile-user-name { font-size: 11px; color: var(--text-muted); letter-spacing: 0.04em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* ── SORT BAR ───────────────────────────────────────────────────────────── */
  .sort-bar       { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
  .sort-bar-label { font-size: 10px; color: var(--text-dim); letter-spacing: 0.08em; text-transform: uppercase; flex-shrink: 0; }
  .sort-btn {
    background: var(--surface2); border: 1px solid var(--border); border-radius: 999px;
    color: var(--text-muted); font-family: 'DM Mono', monospace; font-size: 10px;
    font-weight: 500; letter-spacing: 0.05em; padding: 4px 10px; cursor: pointer; transition: all 0.15s;
  }
  .sort-btn:hover  { border-color: var(--accent); color: var(--accent); }
  .sort-btn.active { background: rgba(224,120,64,0.1); border-color: var(--accent-dim); color: var(--accent); }

  /* ── VINYL PLACEHOLDER ──────────────────────────────────────────────────── */
  .vinyl-ph {
    border-radius: 50%; background: var(--surface2); border: 1px solid var(--border);
    flex-shrink: 0; position: relative; overflow: hidden;
  }
  .vinyl-ph::before { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 38%; height: 38%; border-radius: 50%; border: 1px solid var(--border); }
  .vinyl-ph::after  { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 13%; height: 13%; border-radius: 50%; background: var(--accent-dim); }

  /* ── FIND ELSEWHERE BRAND BUTTONS ───────────────────────────────────────── */
  .find-elsewhere-row { display: flex; gap: 5px; flex-wrap: wrap; }
  .btn-brand {
    flex: 1; min-width: 58px; background: none; border: 1px solid;
    border-radius: var(--radius); font-family: 'DM Mono', monospace;
    font-size: 9px; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase;
    padding: 7px 4px; cursor: pointer; transition: opacity 0.15s; text-align: center; line-height: 1.2;
  }
  .btn-brand:hover { opacity: 0.7; }
  .btn-brand-discogs  { color: #ef6216; border-color: rgba(239,98,22,0.45);  background: rgba(239,98,22,0.07);  }
  .btn-brand-amazon   { color: #e47911; border-color: rgba(228,121,17,0.45); background: rgba(228,121,17,0.07); }
  .btn-brand-target   { color: #cc0000; border-color: rgba(204,0,0,0.45);    background: rgba(204,0,0,0.07);    }
  .btn-brand-walmart  { color: #0071dc; border-color: rgba(0,113,220,0.45);  background: rgba(0,113,220,0.07);  }
  .btn-brand-ytmusic  { color: #ff4e45; border-color: rgba(255,78,69,0.45);  background: rgba(255,78,69,0.07);  }
  .btn-brand-bandcamp { color: #1da0c3; border-color: rgba(29,160,195,0.45); background: rgba(29,160,195,0.07); }
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

// ─── VINYL FACTS ─────────────────────────────────────────────────────────────

const VINYL_FACTS = [
  "A standard 12\" LP spins at 33⅓ RPM and holds about 22 minutes per side.",
  "The grooves on a vinyl record are a single continuous spiral — one groove per side.",
  "Peak vinyl sales were in 1978, when 341 million LPs were sold in the US alone.",
  "Vinyl outsold CDs for the first time since the 1980s in 2020.",
  "The 45 RPM single format was introduced by RCA Victor in 1949.",
  "A new LP pressed today typically weighs 180g — heavier than vintage pressings for better audio.",
  "The first gold record was awarded to Glenn Miller in 1942 for \"Chattanooga Choo Choo.\"",
  "Vinyl records are made from PVC — polyvinyl chloride — the same material in pipes.",
  "Audiophiles call the snap, crackle, and pop of vinyl \"surface noise\" — many consider it part of the charm.",
  "The diamond stylus on a turntable needle can last 500–1,000 hours of playtime.",
  "First pressings typically command higher prices because the master lacquer is freshest.",
  "A record's label color, matrix number, and deadwax etchings can identify the pressing era.",
];

// ─── VINYL PLACEHOLDER ───────────────────────────────────────────────────────

function VinylPh({ size }) {
  return <div className="vinyl-ph" style={{ width: size, height: size }} />;
}

// ─── GUEST FIXTURE DATA ──────────────────────────────────────────────────────

const _dUrl = (q) => `https://www.discogs.com/search/?q=${encodeURIComponent(q)}&type=release&format=Vinyl`;

const GUEST_DATA = {
  wantlist: [
    { id: "g1", artist: "Kendrick Lamar", title: "To Pimp a Butterfly", year: "2015", cover_url: "", discogs_url: _dUrl("Kendrick Lamar To Pimp a Butterfly") },
    { id: "g2", artist: "Radiohead",      title: "OK Computer",          year: "1997", cover_url: "", discogs_url: _dUrl("Radiohead OK Computer") },
    { id: "g3", artist: "Amy Winehouse",  title: "Back to Black",        year: "2006", cover_url: "", discogs_url: _dUrl("Amy Winehouse Back to Black") },
    { id: "g4", artist: "D'Angelo",       title: "Voodoo",               year: "2000", cover_url: "", discogs_url: _dUrl("D'Angelo Voodoo") },
  ],
  results: {
    "g1": {
      release: { title: "To Pimp a Butterfly", year: "2015", cover_url: "", discogs_url: _dUrl("Kendrick Lamar To Pimp a Butterfly") },
      discogs_us: [
        { price: 34.99, ships_from: "US", num_for_sale: 14, url: _dUrl("Kendrick Lamar To Pimp a Butterfly"), shipping_low: 4, shipping_high: 8, total_low: 38.99, total_high: 42.99 },
        { price: 42.00, ships_from: "US", num_for_sale:  6, url: _dUrl("Kendrick Lamar To Pimp a Butterfly"), shipping_low: 4, shipping_high: 8, total_low: 46.00, total_high: 50.00 },
      ],
      discogs_intl: [
        { price: 27.00, ships_from: "Germany", num_for_sale: 4, url: _dUrl("Kendrick Lamar To Pimp a Butterfly"), shipping_low: 10, shipping_high: 22, total_low: 37.00, total_high: 49.00 },
        { price: 31.50, ships_from: "UK",      num_for_sale: 7, url: _dUrl("Kendrick Lamar To Pimp a Butterfly"), shipping_low: 12, shipping_high: 22, total_low: 43.50, total_high: 53.50 },
      ],
      best_us:   { price: 34.99, ships_from: "US",      num_for_sale: 14, url: _dUrl("Kendrick Lamar To Pimp a Butterfly"), shipping_low: 4,  shipping_high: 8,  total_low: 38.99, total_high: 42.99 },
      best_intl: { price: 27.00, ships_from: "Germany", num_for_sale:  4, url: _dUrl("Kendrick Lamar To Pimp a Butterfly"), shipping_low: 10, shipping_high: 22, total_low: 37.00, total_high: 49.00 },
      us_only_warning: false, us_shipping_estimate: "$4–$8",
    },
    "g2": {
      release: { title: "OK Computer", year: "1997", cover_url: "", discogs_url: _dUrl("Radiohead OK Computer") },
      discogs_us: [
        { price: 22.50, ships_from: "US", num_for_sale: 21, url: _dUrl("Radiohead OK Computer"), shipping_low: 4, shipping_high: 8, total_low: 26.50, total_high: 30.50 },
        { price: 28.00, ships_from: "US", num_for_sale:  9, url: _dUrl("Radiohead OK Computer"), shipping_low: 4, shipping_high: 8, total_low: 32.00, total_high: 36.00 },
      ],
      discogs_intl: [
        { price: 18.00, ships_from: "Netherlands", num_for_sale: 11, url: _dUrl("Radiohead OK Computer"), shipping_low: 10, shipping_high: 20, total_low: 28.00, total_high: 38.00 },
        { price: 20.00, ships_from: "France",      num_for_sale:  8, url: _dUrl("Radiohead OK Computer"), shipping_low: 10, shipping_high: 22, total_low: 30.00, total_high: 42.00 },
      ],
      best_us:   { price: 22.50, ships_from: "US",          num_for_sale: 21, url: _dUrl("Radiohead OK Computer"), shipping_low: 4,  shipping_high: 8,  total_low: 26.50, total_high: 30.50 },
      best_intl: { price: 18.00, ships_from: "Netherlands", num_for_sale: 11, url: _dUrl("Radiohead OK Computer"), shipping_low: 10, shipping_high: 20, total_low: 28.00, total_high: 38.00 },
      us_only_warning: false, us_shipping_estimate: "$4–$8",
    },
    "g3": {
      release: { title: "Back to Black", year: "2006", cover_url: "", discogs_url: _dUrl("Amy Winehouse Back to Black") },
      discogs_us: [
        { price: 19.99, ships_from: "US", num_for_sale: 18, url: _dUrl("Amy Winehouse Back to Black"), shipping_low: 4, shipping_high: 8, total_low: 23.99, total_high: 27.99 },
      ],
      discogs_intl: [
        { price: 14.00, ships_from: "UK",      num_for_sale: 22, url: _dUrl("Amy Winehouse Back to Black"), shipping_low: 12, shipping_high: 22, total_low: 26.00, total_high: 36.00 },
        { price: 16.00, ships_from: "Belgium", num_for_sale:  5, url: _dUrl("Amy Winehouse Back to Black"), shipping_low: 10, shipping_high: 20, total_low: 26.00, total_high: 36.00 },
      ],
      best_us:   { price: 19.99, ships_from: "US", num_for_sale: 18, url: _dUrl("Amy Winehouse Back to Black"), shipping_low: 4,  shipping_high: 8,  total_low: 23.99, total_high: 27.99 },
      best_intl: { price: 14.00, ships_from: "UK", num_for_sale: 22, url: _dUrl("Amy Winehouse Back to Black"), shipping_low: 12, shipping_high: 22, total_low: 26.00, total_high: 36.00 },
      us_only_warning: false, us_shipping_estimate: "$4–$8",
    },
    "g4": {
      release: { title: "Voodoo", year: "2000", cover_url: "", discogs_url: _dUrl("D'Angelo Voodoo") },
      discogs_us: [
        { price: 74.99, ships_from: "US", num_for_sale: 5, url: _dUrl("D'Angelo Voodoo"), shipping_low: 4, shipping_high: 8, total_low: 78.99, total_high: 82.99 },
      ],
      discogs_intl: [
        { price: 60.00, ships_from: "Japan", num_for_sale: 3, url: _dUrl("D'Angelo Voodoo"), shipping_low: 18, shipping_high: 35, total_low: 78.00, total_high: 95.00 },
      ],
      best_us:   { price: 74.99, ships_from: "US",    num_for_sale: 5, url: _dUrl("D'Angelo Voodoo"), shipping_low: 4,  shipping_high: 8,  total_low: 78.99, total_high: 82.99 },
      best_intl: { price: 60.00, ships_from: "Japan", num_for_sale: 3, url: _dUrl("D'Angelo Voodoo"), shipping_low: 18, shipping_high: 35, total_low: 78.00, total_high: 95.00 },
      us_only_warning: false, us_shipping_estimate: "$4–$8",
    },
  },
  collection: [
    { id: "gc1", artist: "Pink Floyd",    title: "The Wall",                   year: "1979", cover_url: "", discogs_url: _dUrl("Pink Floyd The Wall"),                   date_added: "2024-01-15" },
    { id: "gc2", artist: "The Beatles",   title: "Abbey Road",                 year: "1969", cover_url: "", discogs_url: _dUrl("Beatles Abbey Road"),                    date_added: "2024-02-20" },
    { id: "gc3", artist: "Fleetwood Mac", title: "Rumours",                    year: "1977", cover_url: "", discogs_url: _dUrl("Fleetwood Mac Rumours"),                  date_added: "2024-03-10" },
    { id: "gc4", artist: "Stevie Wonder", title: "Songs in the Key of Life",   year: "1976", cover_url: "", discogs_url: _dUrl("Stevie Wonder Songs in the Key of Life"), date_added: "2024-04-05" },
    { id: "gc5", artist: "Miles Davis",   title: "Kind of Blue",               year: "1959", cover_url: "", discogs_url: _dUrl("Miles Davis Kind of Blue"),               date_added: "2024-05-12" },
    { id: "gc6", artist: "Joni Mitchell", title: "Blue",                       year: "1971", cover_url: "", discogs_url: _dUrl("Joni Mitchell Blue"),                     date_added: "2024-06-01" },
  ],
};

// ─── LOGIN ───────────────────────────────────────────────────────────────────

// Vinyl disc positions for login backdrop
const DISCS = [
  { size: 320, top: "-90px",  right: "-100px", opacity: 0.28 },
  { size: 220, top: "30px",   left: "-110px",  opacity: 0.22 },
  { size: 400, bottom:"-140px", right: "-60px", opacity: 0.18 },
  { size: 170, bottom: "80px", left: "-70px",  opacity: 0.24 },
  { size: 130, top: "220px",  right: "20px",   opacity: 0.15 },
  { size: 260, top: "50%",    left: "15%",     opacity: 0.10 },
];

function LoginScreen({ error, loading, onGuestMode }) {
  const [starting, setStarting] = useState(false);
  const [factIdx, setFactIdx] = useState(() => Math.floor(Math.random() * VINYL_FACTS.length));

  useEffect(() => {
    if (!starting && !loading) return;
    const id = setInterval(() => {
      setFactIdx((i) => (i + 1) % VINYL_FACTS.length);
    }, 3500);
    return () => clearInterval(id);
  }, [starting, loading]);

  async function handleAuthorize() {
    setStarting(true);
    try {
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
      {/* Vinyl disc backdrop */}
      {DISCS.map((d, i) => (
        <div key={i} className="login-disc" style={{ width: d.size, height: d.size, top: d.top, bottom: d.bottom, left: d.left, right: d.right, opacity: d.opacity }} />
      ))}

      <div className="login-card">
        <p className="login-eyebrow">Discogs Price Tool</p>
        <h1 className="login-title">Spin or <em>Stream</em></h1>
        <p className="login-sub">
          Compare wantlist prices and make smarter decisions about what's worth buying on wax versus just streaming it.
        </p>

        {error && <div className="login-error">{error}</div>}

        {busy ? (
          <>
            <div className="loading-state" style={{ justifyContent: "center", padding: "16px 0 8px" }}>
              <div className="spinner" />
              {loading ? "Completing authorization…" : "Redirecting to Discogs…"}
            </div>
            <div className="vinyl-facts-wrap">
              <p className="vinyl-facts-label">While you wait — did you know?</p>
              <div className="vinyl-facts-box">{VINYL_FACTS[factIdx]}</div>
            </div>
          </>
        ) : (
          <>
            <button className="btn-primary" onClick={handleAuthorize}>
              Authorize with Discogs
            </button>
            <p className="form-hint" style={{ marginTop: "12px", textAlign: "center" }}>
              You'll be taken to Discogs to sign in — then right back here.
            </p>
            <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
              <button className="btn-guest" onClick={onGuestMode}>
                ◎ Try a demo without logging in
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── WANTLIST TAB ────────────────────────────────────────────────────────────

function WantlistTab({ username, onCountChange, onCompareAdd, isGuest }) {
  const [items, setItems] = useState(() => isGuest ? GUEST_DATA.wantlist : []);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [searching, setSearching] = useState({});
  const [results, setResults] = useState(() => isGuest ? GUEST_DATA.results : {});
  const [sortBy, setSortBy] = useState("none");
  const [sortDir, setSortDir] = useState("asc");
  const [toast, showToast] = useToast();

  function toggleSort(field) {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  }

  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === "none") return 0;
    const av = sortBy === "year" ? (a.year || "0") : (a.artist || "");
    const bv = sortBy === "year" ? (b.year || "0") : (b.artist || "");
    return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  useEffect(() => {
    if (isGuest) {
      onCountChange?.(GUEST_DATA.wantlist.length);
    } else {
      loadWantlist();
    }
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
    if (isGuest) return;
    setSyncing(true);
    try {
      await loadWantlist();
      showToast("Wantlist synced ✓");
    } finally {
      setSyncing(false);
    }
  }

  async function searchPrices(item) {
    if (isGuest) return; // Guest prices are pre-loaded fixture data
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
        {!isGuest && (
          <div className="header-actions">
            <button className="btn-sync" onClick={syncWantlist} disabled={syncing}>
              {syncing ? "Syncing…" : "↻ Sync from Discogs"}
            </button>
          </div>
        )}
      </div>

      {items.length > 1 && (
        <div className="sort-bar">
          <span className="sort-bar-label">Sort:</span>
          <button className={`sort-btn ${sortBy === "artist" ? "active" : ""}`} onClick={() => toggleSort("artist")}>
            Artist {sortBy === "artist" ? (sortDir === "asc" ? "↑" : "↓") : ""}
          </button>
          <button className={`sort-btn ${sortBy === "year" ? "active" : ""}`} onClick={() => toggleSort("year")}>
            Year {sortBy === "year" ? (sortDir === "asc" ? "↑" : "↓") : ""}
          </button>
          {sortBy !== "none" && (
            <button className="sort-btn" onClick={() => setSortBy("none")}>✕ Clear</button>
          )}
        </div>
      )}

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◎</div>
          <p className="empty-title">Nothing on your wantlist yet</p>
          <p className="empty-sub">Head to Discogs and add some records — they'll show up here.</p>
        </div>
      ) : (
        sortedItems.map((item) => (
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
  // Best total-with-shipping across all listings
  const bestUS = result?.best_us;
  const bestIntl = result?.best_intl;
  const bestTotalUS = bestUS ? bestUS.total_low : null;
  const bestTotalIntl = bestIntl ? bestIntl.total_low : null;

  const ytQuery = encodeURIComponent(`${item.artist} ${item.title}`);

  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", flex: 1, minWidth: 0 }}>
          {item.cover_url
            ? <img src={item.cover_url} alt={item.title} style={{ width: "52px", height: "52px", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--border)", flexShrink: 0 }} />
            : <VinylPh size={52} />
          }
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
        {result && <span className="chip teal">{allListings.length} listings</span>}
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
                <div className="price-sub">record only</div>
              </div>
            )}
            {minUS != null && (
              <div className="price-cell">
                <div className="price-label">Best US</div>
                <div className="price-value">${minUS.toFixed(2)}</div>
                <div className="price-sub">ships from US</div>
              </div>
            )}
            {bestTotalUS != null && (
              <div className="price-cell">
                <div className="price-label">Total US *</div>
                <div className="price-value best">${bestTotalUS.toFixed(2)}</div>
                <div className="price-sub">inc. est. shipping</div>
              </div>
            )}
            {bestTotalIntl != null && !bestTotalUS && (
              <div className="price-cell">
                <div className="price-label">Best Intl Total *</div>
                <div className="price-value">${bestTotalIntl.toFixed(2)}</div>
                <div className="price-sub">inc. est. shipping</div>
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
                <div className="progress-bar-fill" style={{ width: `${Math.min((minPrice / avgPrice) * 100, 100)}%` }} />
              </div>
            </div>
          )}
          <p style={{ fontSize: "9px", color: "var(--text-dim)", marginTop: "6px", letterSpacing: "0.06em" }}>
            * shipping is estimated
          </p>
        </>
      )}

      {result && allListings.length === 0 && (
        <p style={{ fontSize: "11px", color: "var(--text-dim)", padding: "8px 0" }}>
          No listings found on the marketplace right now.
        </p>
      )}

      <div className="card-actions" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          {!result && (
            <button className="btn-search" onClick={onSearch} disabled={searching}>
              {searching ? "Searching…" : "Check Prices"}
            </button>
          )}
          {result && (
            <button className="btn-secondary" onClick={onSearch} disabled={searching}>Refresh</button>
          )}
          <a href={`https://music.youtube.com/search?q=${ytQuery}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            <button className="btn-secondary">▶ YT Music</button>
          </a>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {item.discogs_url && (
            <a href={item.discogs_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <button className="btn-secondary">Discogs ↗</button>
            </a>
          )}
          {result && allListings.length > 0 && (
            <button className="btn-secondary" style={{ borderColor: "var(--teal-dim)", color: "var(--teal)" }} onClick={onCompareAdd}>
              + Compare
            </button>
          )}
        </div>
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
          const avgPrice = prices.length ? prices.reduce((a, b) => a + b) / prices.length : null;

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
                    + ${l.shipping_low}–${l.shipping_high} ship *
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
                  {ci.item.cover_url
                    ? <img src={ci.item.cover_url} alt={ci.item.title} style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--border)", flexShrink: 0 }} />
                    : <VinylPh size={56} />
                  }
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
                  {minPrice != null && avgPrice != null && (
                    <div className="progress-bar-wrap" style={{ marginTop: "10px" }}>
                      <div className="progress-bar-label">
                        <span>Low ${minPrice.toFixed(2)}</span>
                        <span>Avg ${avgPrice.toFixed(2)}</span>
                      </div>
                      <div className="progress-bar-track">
                        <div className="progress-bar-fill" style={{ width: `${Math.min((minPrice / avgPrice) * 100, 100)}%` }} />
                      </div>
                    </div>
                  )}
                  <p style={{ fontSize: "9px", color: "var(--text-dim)", marginTop: "6px", letterSpacing: "0.06em" }}>* shipping is estimated</p>
                </>
              ) : (
                <p style={{ fontSize: "11px", color: "var(--text-dim)", padding: "10px 0 4px" }}>
                  No marketplace data — check prices from Wantlist first.
                </p>
              )}

              {/* Find elsewhere */}
              <p className="section-label" style={{ marginTop: "16px" }}>Find elsewhere</p>
              <div className="find-elsewhere-row">
                {ci.item.discogs_url && (
                  <a href={ci.item.discogs_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", flex: 1, minWidth: "58px" }}>
                    <button className="btn-brand btn-brand-discogs" style={{ width: "100%" }}>Discogs</button>
                  </a>
                )}
                <a href={`https://www.amazon.com/s?k=${qVinyl}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none", flex: 1, minWidth: "58px" }}>
                  <button className="btn-brand btn-brand-amazon" style={{ width: "100%" }}>Amazon</button>
                </a>
                <a href={`https://www.target.com/s?searchTerm=${qVinyl}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none", flex: 1, minWidth: "58px" }}>
                  <button className="btn-brand btn-brand-target" style={{ width: "100%" }}>Target</button>
                </a>
                <a href={`https://www.walmart.com/search?q=${qVinyl}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none", flex: 1, minWidth: "58px" }}>
                  <button className="btn-brand btn-brand-walmart" style={{ width: "100%" }}>Walmart</button>
                </a>
                <a href={`https://music.youtube.com/search?q=${qPlain}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none", flex: 1, minWidth: "58px" }}>
                  <button className="btn-brand btn-brand-ytmusic" style={{ width: "100%" }}>YT Music</button>
                </a>
                <a href={`https://bandcamp.com/search?q=${qPlain}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none", flex: 1, minWidth: "58px" }}>
                  <button className="btn-brand btn-brand-bandcamp" style={{ width: "100%" }}>Bandcamp</button>
                </a>
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

function CollectionTab({ username, isGuest }) {
  const [items, setItems] = useState(() => isGuest ? GUEST_DATA.collection : []);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [toast, showToast] = useToast();

  useEffect(() => {
    if (!isGuest) loadCollection();
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
  const [isGuest, setIsGuest] = useState(false);

  function handleGuestMode() {
    setIsGuest(true);
    setWantlistCount(GUEST_DATA.wantlist.length);
    setCompareItems([
      { item: GUEST_DATA.wantlist[0], result: GUEST_DATA.results["g1"] },
      { item: GUEST_DATA.wantlist[1], result: GUEST_DATA.results["g2"] },
    ]);
  }

  function handleExitGuest() {
    setIsGuest(false);
    setCompareItems([]);
    setWantlistCount(0);
  }

  function handleLogout() {
    localStorage.removeItem("sos_username");
    localStorage.removeItem("sos_token");
    localStorage.removeItem("sos_secret");
    setAuthUsername("");
    setAuthToken("");
    setCompareItems([]);
    setIsGuest(false);
    setWantlistCount(0);
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


  if (!authUsername && !isGuest) {
    return (
      <>
        <style>{STYLES}</style>
        <LoginScreen error={oauthError} loading={oauthLoading} onGuestMode={handleGuestMode} />
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
            <p className="sidebar-version">{APP_VERSION}</p>
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
            {isGuest ? (
              <>
                <div className="sidebar-user-row">
                  <span className="sidebar-username" style={{ color: "var(--accent)" }}>Guest</span>
                  <button className="sidebar-logout" onClick={handleExitGuest}>Log in</button>
                </div>
                <p className="sidebar-status" style={{ color: "var(--accent)" }}>Demo mode</p>
              </>
            ) : (
              <>
                <div className="sidebar-user-row">
                  <span className="sidebar-username">{authUsername}</span>
                  <button className="sidebar-logout" onClick={handleLogout}>Log out</button>
                </div>
                <p className="sidebar-status">Discogs connected</p>
              </>
            )}
          </div>
          <div className="sidebar-attrib">
            Data by <a href="https://www.discogs.com" target="_blank" rel="noreferrer">Discogs</a>.
            Cover art © respective rights holders.
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="main">
          {/* Mobile-only user/logout bar (sidebar is hidden on mobile) */}
          <div className="mobile-user-bar">
            {isGuest ? (
              <>
                <span className="mobile-user-name" style={{ color: "var(--accent)" }}>◎ Demo mode</span>
                <button className="sidebar-logout" onClick={handleExitGuest}>Log in</button>
              </>
            ) : (
              <>
                <span className="mobile-user-name">{authUsername}</span>
                <button className="sidebar-logout" onClick={handleLogout}>Log out</button>
              </>
            )}
          </div>

          {isGuest && (
            <div className="guest-banner">
              <span>Demo mode · Browsing sample data, no Discogs account needed.</span>
              <button className="guest-banner-btn" onClick={handleExitGuest}>
                Log in with Discogs →
              </button>
            </div>
          )}
          {tab === "wantlist" && (
            <WantlistTab
              username={authUsername}
              onCountChange={setWantlistCount}
              onCompareAdd={handleCompareAdd}
              isGuest={isGuest}
            />
          )}
          {tab === "compare" && (
            <CompareTab
              compareItems={compareItems}
              onRemove={handleCompareRemove}
            />
          )}
          {tab === "collection" && (
            <CollectionTab username={authUsername} isGuest={isGuest} />
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