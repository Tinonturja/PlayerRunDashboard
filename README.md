# Player Run Dashboard

An interactive, self-contained dashboard for tracking and visualizing player run statistics. No build step, no server, no dependencies to install — just open `index.html` in any modern browser.

## Features

- **Add / edit / delete players** with a clean form
- **Auto-calculated stats**: batting average and strike rate
- **KPI cards**: total players, total runs, total matches, average strike rate, top scorer
- **Charts** (powered by Chart.js):
  - Top 10 run scorers (bar)
  - Top 10 by batting average (bar)
  - Boundaries mix: 4s vs 6s (doughnut)
  - Runs vs Strike Rate (scatter)
- **Sortable & searchable table** of all players
- **CSV import / export** so you can back up or bring your own data
- **Sample data** button to instantly populate the dashboard
- **Persistent storage** — your data is saved in `localStorage`

## How to run

### Option 1 — Just open the file
```bash
# from the project root
open index.html         # macOS
xdg-open index.html     # Linux
start index.html        # Windows
```

### Option 2 — Serve locally (recommended)
```bash
# Python 3
python3 -m http.server 8000

# or with Node
npx serve .
```
Then visit http://localhost:8000.

## CSV format

The importer expects a header row with the following columns (order doesn't matter, extras are ignored):

```
name,team,matches,innings,notOuts,runs,balls,highest,fours,sixes
```

Use **Export CSV** at any time to download all your current data in this format.

## File structure

```
.
├── index.html   # Markup and layout
├── style.css    # Modern dark theme styles
├── script.js    # State, charts, CSV, persistence
└── README.md
```

## Tech

- Vanilla HTML / CSS / JavaScript (no framework)
- [Chart.js](https://www.chartjs.org/) loaded from a CDN
- `localStorage` for persistence

## Customizing

The data model lives in `script.js` — search for `readForm` and `CSV_HEADERS` to add new fields. Add a matching `<input>` in `index.html` and a column in the table, then update `renderTable` and (optionally) the charts.
