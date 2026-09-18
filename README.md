# Cork — Real-Time Community Marketplace Board

A real-time bulletin board web app for posting and browsing item listings, rebuilt from vanilla JavaScript into a strictly typed, component-driven React architecture.

**Live demo:** https://zeqlous.github.io/Cork/

## Overview

Cork started as a vanilla JavaScript DOM-manipulation project and was migrated into a typed React application. The rewrite focuses on three things:

- **Type safety** — Firestore documents are modeled with strict TypeScript interfaces to eliminate a class of runtime errors.
- **Declarative UI** — imperative DOM creation (`document.createElement`) was replaced with reactive state and modular React components.
- **Automated deployment** — a GitHub Actions CI/CD pipeline builds the app with Vite and deploys to GitHub Pages on every push to `main`.

## Tech Stack

- **Frontend:** React 18, TypeScript
- **Styling:** Custom CSS (CSS Grid, Flexbox)
- **Build tool:** Vite
- **Database:** Firebase Firestore (NoSQL)
- **Deployment:** GitHub Pages via GitHub Actions

## Features

- **Real-time sync** — new listings appear for every connected client instantly via Firestore snapshot listeners.
- **Live search & filtering** — client-side filtering across title, description, and seller fields.
- **Flexible sorting** — Newest, Oldest, or alphabetical (A–Z).
- **Input validation** — standardized USD price formatting and sanitized text input to prevent XSS.
- **Responsive layout** — CSS Grid layout that adapts across desktop and mobile.

## Performance

| Metric | Value |
|---|---|
| Initial load time | < 1.2s (Vite production build) |
| Real-time update latency | ~100–300ms (Firestore `onSnapshot`) |
| Client-side search time | < 10ms |
| Gzipped bundle size | ~150 KB (React + Firebase SDK) |

## Local Setup

### Prerequisites
- Node.js v18.0.0+
- npm v9.0.0+
- A Firebase Firestore project ([setup docs](https://firebase.google.com/docs/firestore))

### Installation

```bash
git clone https://github.com/zeqlous/Cork.git
cd Cork
npm install
```

Create a `.env.local` file in the project root:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Run the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```
