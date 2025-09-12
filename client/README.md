# FleetManagerPro - Frontend (client) - Expanded

This is the expanded frontend scaffold for FleetManagerPro (React + Vite + TailwindCSS).

## Quick start

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file at project root with:
```
VITE_API_URL=http://localhost:5000/api
```

3. Run dev server:
```bash
npm run dev
```

## What I added in this expanded version

- Vehicle add/edit forms (pages and API calls)
- Maintenance calendar-like UI
- Geofencing mock UI (create zones)
- Panic button that POSTs to `/alerts/panic`
- Role-based route guard (`RequireRole`), uses `user.role`
- CSV and PDF export for vehicles (jsPDF)
- Dark mode toggle and responsive layout
- Thorough README and `.env.example`

## Assumed API endpoints (Option B - adjust if your backend differs)
- `POST /auth/login` -> { token, user }
- `POST /auth/register`
- `GET /vehicles`
- `POST /vehicles`
- `GET /vehicles/:id`
- `PUT /vehicles/:id`
- `DELETE /vehicles/:id`
- `GET /drivers`
- `GET /drivers/:id`
- `GET /maintenance`
- `POST /maintenance`
- `GET /trips`
- `POST /trips`
- `POST /alerts/panic`

If your server prefixes APIs with `/api`, set `VITE_API_URL` accordingly.

## Deploy
Build: `npm run build`. Deploy to Vercel/Netlify and set the env var `VITE_API_URL` in project settings.
