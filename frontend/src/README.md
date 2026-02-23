# Record Finder

A personal vinyl procurement tool. Syncs with your Discogs wantlist to find
the best available prices, helps you deliberate on purchases, and keeps a
record of your collection.

## What it does

Three-stage pipeline: **Wantlist → Compare → Collection**

- **Wantlist** — syncs from your Discogs wantlist, scans Discogs marketplace
  for best US and international prices with shipping estimates
- **Compare** — deliberation room with budget indicator, retail links
  (Amazon, Target, Walmart), and manual price comparison against any listing
- **Collection** — tracks what you own, how you got it (vinyl/digital/free),
  and syncs from your Discogs collection

## Stack

- **Frontend:** React, Vite
- **Backend:** Python, Flask, flask-cors, requests, python-dotenv
- **APIs:** Discogs REST API (search, marketplace stats, wantlist, collection)
- **Hosting:** Netlify (frontend) + Render (backend), auto-deploy from GitHub

## Running locally

**Backend** (Terminal 1):
cd backend
source venv/bin/activate
python app.py

Backend runs at http://localhost:5001

**Frontend** (Terminal 2):
cd frontend
npm run dev

Frontend runs at http://localhost:5173

## Environment variables

**backend/.env**
DISCOGS_TOKEN=your_token_here

**frontend/.env.local**
VITE_API_URL=http://localhost:5001

## Repo structure

record-finder/
  backend/
    app.py
    requirements.txt
    .env
  frontend/
    src/
      App.jsx
    .env.local
    .env.production
  README.md
  render.yaml