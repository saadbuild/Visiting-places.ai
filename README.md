# Visiting Places

An AI-powered travel platform — discover destinations, plan trips, calculate budgets and fuel costs, check live weather, find what's actually nearby, and subscribe to a paid plan for more AI credits, anywhere on earth.

Built as a two-part project:

- **`frontend/`** — React + Vite + Tailwind. All the pages, the design system, and the free/no-key live data (weather, geocoding, maps, nearby places).
- **`backend/`** — Express API for accounts, saved trips, favorites, subscriptions, and payment verification. Stores data in a local JSON file (no database server to install). Sends email notifications for sign-ups, logins, and payment events.

---

## What's real vs. mock data

To keep this runnable with zero paid API keys:

| Feature | Data source |
|---|---|
| Weather & forecasts | **Live** — [Open-Meteo](https://open-meteo.com) (free, no key) |
| Geocoding (city search) | **Live** — Open-Meteo Geocoding API (free, no key) |
| Maps & nearby places (hotels, hospitals, fuel stations, etc.) | **Live** — OpenStreetMap tiles + Overpass API (free, no key) |
| Your device location | **Live** — browser Geolocation API |
| Destinations, hotels, restaurants, foods, attractions | **Mock/demo data** in `frontend/src/data/` — swap for a real content API or CMS when you're ready |
| Flights | **Mock generator** in `frontend/src/data/flights.js` — swap for a real GDS (Amadeus, Duffel, Skyscanner) |
| AI trip planner | Rule-based itinerary builder using the mock catalog — deterministic, no LLM call |
| AI travel assistant | Rule-based responses (keyword matching) — no LLM call. Wire in a real model via the Claude API if you want open-ended answers |
| Currency conversion | Fixed demo exchange rates in `frontend/src/lib/format.js` — swap for a live FX API |
| Subscription plans & AI credits | **Real logic, demo storage** — plans/pricing live in `backend/src/plans.js`, balances tracked per-account in `db.json` |
| Payments (JazzCash/EasyPaisa/NayaPay) | **Real account numbers, manual verification** — this is a manual-transfer flow (submit a transaction ID, a human verifies it), not a live payment-gateway integration. See "Subscriptions & payments" below |
| Email notifications | **Real**, once you add SMTP/Gmail credentials to `backend/.env` — see "Email notifications" below |

Everything above is written so the mock/demo pieces are drop-in replaceable — each data file is a single module with a clear shape.

---

## Quick start (one project, one command)

This is a single project with a root `package.json` that runs the backend API and the frontend app together — you don't need two terminals.

```bash
# from the project root
npm run install:all   # installs root, backend, and frontend dependencies
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
npm run dev            # starts the API (port 4000) and the web app (port 5173) together
```

Open the URL Vite prints — usually `http://localhost:5173`. Create an account (email or phone + password), explore destinations, plan a trip, and it'll save to your dashboard.

Backend and frontend logs are labeled `[API]` and `[WEB]` in the same terminal, in different colors, so you can see both at once. Stop both with `Ctrl+C`.

By default, sign-up/login/payment notifications just print to the `[API]` log instead of sending real email — add SMTP or Gmail credentials to `backend/.env` to actually deliver them (see "Email notifications" below).

### Running them separately (optional)

If you'd rather run the two independently (e.g. deploying them to different hosts):

```bash
cd backend && npm install && cp .env.example .env && npm run dev
```
```bash
cd frontend && npm install && cp .env.example .env && npm run dev
```

### Production build

```bash
npm run build           # builds the frontend to frontend/dist
npm start                # runs the backend with `node` (no auto-reload) + serves the frontend preview build
```

For real deployment, put a real `JWT_SECRET` in `backend/.env`, and serve `frontend/dist` from a static host or CDN instead of `vite preview`.

---

## Project structure

```
visiting-places/
├── package.json                Root — runs backend + frontend together (npm run dev)
├── backend/
│   ├── server.js              Express app, security middleware, route mounting
│   ├── src/
│   │   ├── db.js              Tiny JSON-file datastore (swap for Postgres/Mongo later)
│   │   ├── mailer.js          Sends owner notifications (sign-up, login, payment events)
│   │   ├── plans.js           Basic/Basic+/Standard/Pro plan catalog + payment account numbers
│   │   ├── middleware/auth.js JWT verification
│   │   └── routes/            auth.js, trips.js, favorites.js, subscriptions.js
│   └── data/db.json           Local data file (users, trips, favorites, subscriptions, payments)
│
└── frontend/
    ├── src/
    │   ├── data/               Mock destinations, hotels, restaurants, foods, attractions, flights
    │   ├── lib/                api.js, weather.js, places.js, format.js, assistant.js
    │   ├── context/             AuthContext, AppContext (prefs + toasts), TripsContext, SubscriptionContext
    │   ├── components/          Navbar, Footer, MapView, TicketCard, StampBadge, InitialsAvatar, etc.
    │   └── pages/                ~27 pages — see below
    └── tailwind.config.js       Design tokens (see "Design" below)
```

### Pages

Home · Explore · Destination detail · Hotels (+ detail) · Restaurants · Local foods · Attractions ·
Flights · Transportation · Weather · Budget planner · Fuel calculator · AI trip planner · AI assistant ·
Live map explorer · Dashboard · Profile & settings · Favorites · Sign in / Sign up · Pricing · Payment ·
Help · FAQ · About · Contact · Privacy · Terms · Admin overview

A few items from a typical feature wishlist (a separate Settings page, a separate Saved Trips page, a Notifications page) were **merged** into Profile and Dashboard respectively, since splitting them out added navigation without adding function. The Admin page is now role-gated — see "Owner/admin account" below.

---

## Subscriptions & payments

Three plans, defined in `backend/src/plans.js`:

| Plan | Price | AI credits |
|---|---|---|
| Basic | Free | 20 credits, one-time |
| Basic+ | Rs. 999/mo (≈ US$3.59) | 60 credits/mo — tops up Basic without moving to Standard |
| Standard | Rs. 1999/mo (≈ US$7.19) | 150 credits/mo |
| Pro | Rs. 3499/mo (≈ US$12.59) | Unlimited |

AI credits gate the AI Trip Planner and AI Assistant for **signed-in users only** (guests can still use both without limits, so public browsing isn't broken by this feature). USD figures use an approximate PKR/USD rate baked into `plans.js` — update it periodically or wire in a live FX API.

Paid plans are **manual transfers**, not a live payment-gateway integration:

1. User picks a plan on `/pricing` → redirected to `/payment`.
2. The Payment page shows the JazzCash/EasyPaisa number and NayaPay IBAN to send to.
3. User pays from their own banking app, then submits the transaction ID on the same page.
4. The backend emails the owner inbox (`ADMIN_EMAIL` in `.env`) with the details.
5. Someone on the Techtig side confirms the funds arrived, then hits **"Mark verified"** on `/admin` (or calls `POST /api/subscriptions/payments/:id/verify` directly).
6. The plan activates immediately and a second email confirms verification.

This mirrors how JazzCash/EasyPaisa/NayaPay are actually used by small Pakistani businesses without a merchant API agreement. If you get merchant API access later, replace step 3–5 with a real webhook and auto-verify instead.

**Admin access:** `/admin` and the payment-verification endpoints require `role: "admin"` on the account — see below for how that account is created.

---

## Owner/admin account

The backend automatically creates one admin account the first time it starts (in `seedAdmin()`, `backend/src/db.js`), so the Techtig team can use every feature for free, with no subscription or payment step:

| | Default (change before going live) |
|---|---|
| Email | `techtig9@gmail.com` |
| Password | `Techtig@Admin123` |

Configure your own values in `backend/.env` before the first run:

```
ADMIN_ACCOUNT_EMAIL=techtig9@gmail.com
ADMIN_ACCOUNT_PASSWORD=choose-a-real-password-here
ADMIN_ACCOUNT_NAME="Saad Ali"
```

Sign in on `/sign-in` with those credentials. That account:

- Always has the **Owner** plan — unlimited AI credits, every feature, no billing — regardless of what's stored on its subscription record.
- Never sees the JazzCash/EasyPaisa/NayaPay payment flow; trying to submit a payment from that account is blocked with a friendly message.
- Gets an **Admin** link in the account menu (desktop dropdown and mobile menu) that everyone else doesn't see.
- Is the only account that can open `/admin` or call the payment-verification endpoints — anyone else is redirected with a toast explaining why.

To change the password later, update `ADMIN_ACCOUNT_PASSWORD` in `.env` and restart the server — the seeder only *creates* the account once, so edit it there rather than trying to re-run signup. To promote a different existing account to admin instead, edit its `"role"` field to `"admin"` directly in `backend/data/db.json` and restart.

---

## Email notifications

`backend/src/mailer.js` sends an email to `ADMIN_EMAIL` (`techtig9@gmail.com` by default) on:

- New sign-up
- Every login
- New payment submitted (pending verification)
- Payment verified (plan activated)

Configure it in `backend/.env` (copied from `.env.example`):

- **Quickest for a Gmail inbox:** turn on 2-Step Verification on the Gmail account, create an [App Password](https://myaccount.google.com/apppasswords), then set `GMAIL_USER` and `GMAIL_APP_PASSWORD`.
- **Any other provider:** set `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`, `MAIL_FROM`.

Leave everything blank and the app still runs fine — notifications are just printed to the `[API]` console log instead of delivered.

---

## Design

The visual language is a "travel journal meets boarding pass" aesthetic, not a generic template:

- **Palette** — deep ink teal background, brass/gold accent, a coral "flash" for highlights, warm paper cream for light mode.
- **Type** — Fraunces (display serif) + Plus Jakarta Sans (body) + IBM Plex Mono (data/prices).
- **Signature motif** — cards styled like ticket stubs (`.ticket`, with optional punch-hole notches), passport-stamp badges, and dashed "flight route" connector lines in itineraries and maps.

---

## Notes on the auth system

- Passwords are hashed with bcrypt; sessions use JWTs (7-day expiry by default).
- You can register with **either an email or a phone number** — the form lets you pick, and the backend normalizes phone formatting (spaces/dashes/parens) before storing and matching.
- Rate limiting is applied to auth routes to blunt brute-force attempts.
- This is a demo-grade auth system (JSON file storage, no email/SMS verification, no password reset flow). Swap `backend/src/db.js` for a real database and add verification before shipping this to real users.

---

## Extending this

- **Real hotel/restaurant data**: replace the arrays in `frontend/src/data/` with calls to a provider (Google Places, Booking.com affiliate API, etc.) behind the same function signatures (`hotelsFor(destId)`, etc.).
- **Real flight search**: replace `searchFlights()` in `frontend/src/data/flights.js` with a call to Amadeus, Duffel, or similar.
- **A real AI assistant**: `frontend/src/lib/assistant.js` exports a single `respond(message)` function — point it at the Claude API (or any LLM) instead of the keyword rules.
- **Automated payment verification**: the JazzCash/EasyPaisa/NayaPay flow is manual by design (see "Subscriptions & payments" above). If you get a merchant API agreement with one of these providers, replace the manual "Mark verified" step in `backend/src/routes/subscriptions.js` with a real webhook handler.
- **Booking**: hotel and flight "Check availability" / "Search flights" actions are intentionally inert in this demo — wire them to a real booking backend when you have one.
