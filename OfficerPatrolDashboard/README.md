# Officer Patrol Dashboard

A self-hosted full-stack dashboard for visualizing officer patrol summaries. An admin uploads an updated `.xlsx` file and the dashboard instantly reflects the new data — no database, just the latest Excel file on disk.

## Stack

- **Backend:** Node.js + Express + Multer + SheetJS (`xlsx`)
- **Frontend:** React + Vite + Tailwind CSS
- **State / data:** TanStack React Query (server state) + Zustand (UI state)
- **Charts:** Recharts
- **Hosting:** runs on localhost or any VPS — no cloud dependency

## Project structure

```
.
├── server/
│   ├── index.js              # Express server entrypoint
│   ├── routes/
│   │   ├── upload.js         # POST /api/upload (Multer)
│   │   └── data.js           # GET  /api/data
│   ├── utils/parseExcel.js   # SheetJS parsing logic
│   └── uploads/              # Stores latest.xlsx + meta.json
├── client/
│   ├── index.html
│   ├── vite.config.mjs
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── lib/             # api client + colors / op types
│       ├── hooks/           # usePatrolData (React Query)
│       ├── store/           # Zustand UI store
│       └── components/      # UploadPanel, StatCards, FilterBar,
│                            # OfficerTable, OfficerRow, ExpandedDetail,
│                            # TopPerformers, OperationChart, ...
└── package.json
```

## Excel format expected

Each officer block spans multiple rows:

- A header row with the officer's serial number in column **A** and name in column **B**
- One or more detail rows
- A **Total** row (column B = `"Total"`) holding the aggregated values

On the Total row the columns map in `(count, km)` pairs:

| Cols  | Operation     |
|-------|---------------|
| C-D   | TOB           |
| E-F   | ELDP          |
| G-H   | ILDP          |
| I-J   | Mil LDP       |
| K-L   | ISDP          |
| M-N   | Mil SDP       |
| O-P   | LDAP          |
| Q-R   | IDAP          |
| S-T   | FP UNISFA     |
| U-V   | FP Other      |
| W-X   | CT Ptl        |
| Y-Z   | grand total ops, total km |

If the grand-total cells are empty the parser falls back to summing the per-op pairs.

## API

### `POST /api/upload`
Multipart form upload with field name `file`. Saves to `server/uploads/latest.xlsx` (always overwriting), parses immediately, and responds with:

```json
{
  "success": true,
  "officers": [...],
  "uploadedAt": "2025-05-20T10:30:00.000Z",
  "originalName": "patrol-may.xlsx",
  "size": 12345
}
```

### `GET /api/data`
Reads the current `latest.xlsx`, parses, and returns:

```json
{
  "officers": [
    {
      "ser": 1,
      "name": "Officer Name",
      "total_ops": 5,
      "total_km": 480,
      "ops": {
        "TOB":      { "count": 0, "km": 0 },
        "ELDP":     { "count": 1, "km": 90 },
        "ILDP":     { "count": 0, "km": 0 },
        "Mil LDP":  { "count": 0, "km": 0 },
        "ISDP":     { "count": 2, "km": 160 },
        "Mil SDP":  { "count": 0, "km": 0 },
        "LDAP":     { "count": 0, "km": 0 },
        "IDAP":     { "count": 0, "km": 0 },
        "FP UNISFA":{ "count": 1, "km": 120 },
        "FP Other": { "count": 1, "km": 110 },
        "CT Ptl":   { "count": 0, "km": 0 }
      }
    }
  ],
  "uploadedAt": "2025-05-20T10:30:00.000Z",
  "originalName": "patrol-may.xlsx",
  "size": 12345
}
```

If no file has been uploaded yet, returns `404 { "error": "No data uploaded yet" }`.

## Running locally

```bash
npm install
npm run dev          # starts Express (3001) + Vite (5173) concurrently
```

Then open http://localhost:5173. Vite proxies `/api/*` to the Express server.

### Production build
```bash
npm run build        # builds client/dist
npm start            # Express serves API + the built client on :3001
```

## Scripts
| Script | Description |
|---|---|
| `npm run dev` | run server + client together (dev mode) |
| `npm run server` | run Express with nodemon |
| `npm run client` | run Vite dev server |
| `npm run build` | build the React client into `client/dist` |
| `npm start` | run Express in production (serves built client) |
| `npm run test:parser` | parse a generated fixture and print the result (sanity check) |

## Operation color map (kept in sync across UI + charts)

| Op       | Hex      |
|----------|----------|
| TOB      | `#BA7517`|
| ELDP     | `#1D9E75`|
| ILDP     | `#378ADD`|
| Mil LDP  | `#7F77DD`|
| ISDP     | `#1AACBF`|
| Mil SDP  | `#D85A30`|
| LDAP     | `#639922`|
| IDAP     | `#D4537E`|
| FP UNISFA| `#E24B4A`|
| FP Other | `#9F60C8`|
| CT Ptl   | `#1D7A6E`|
