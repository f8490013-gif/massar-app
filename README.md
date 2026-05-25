# مسار — Massar

> تنقلك بكل أمان — A full-stack ride-hailing webapp with Passenger, Driver & Admin portals.

## Tech Stack
- **React 18** + **Vite** — fast dev & build
- **Tailwind CSS** — RTL-ready utility styling
- **React Router v6** — client-side routing
- **Recharts** — earnings & admin charts
- **Lucide React** — icons

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Build for production
npm run build
```

## Demo Logins

| Role      | Email                   | Password   |
|-----------|-------------------------|------------|
| Passenger | passenger@massar.app    | demo1234   |
| Driver    | driver@massar.app       | demo1234   |
| Admin     | admin@massar.app        | demo1234   |

## Deployment

### GitHub Pages
1. Push to `main` branch — GitHub Actions will build and deploy automatically.
2. Go to **Settings → Pages** and set source to **GitHub Actions**.
3. If deploying to `https://<user>.github.io/massar-app/`, update `vite.config.js`:
   ```js
   base: '/massar-app/'
   ```

### Vercel / Netlify (recommended — no base path change needed)
- Connect your GitHub repo and deploy — zero config required.

## Project Structure

```
src/
├── context/AppContext.jsx    # Auth + theme state
├── data/mockData.js          # Mock data (replace with API)
├── components/
│   ├── Layout.jsx            # Sidebar + topbar shell
│   └── common/
│       ├── StatsCard.jsx
│       └── MapView.jsx       # Animated SVG map placeholder
├── pages/
│   ├── Landing.jsx
│   ├── auth/Login.jsx
│   ├── auth/Register.jsx
│   ├── passenger/            # Dashboard, Request, Track, School, Payment
│   ├── driver/               # Dashboard, Earnings, Profile
│   └── admin/Dashboard.jsx
```

## Phases

- [x] **Phase 1** — Core UI, routing, all portals, mock data, dark mode, GitHub deploy
- [ ] **Phase 2** — Real maps (Leaflet / Google Maps), live location tracking
- [ ] **Phase 3** — Firebase backend (Auth, Firestore, real-time updates)
- [ ] **Phase 4** — Push notifications, payment gateway (Moyasar/HyperPay)
- [ ] **Phase 5** — Native mobile apps (React Native / Capacitor)
