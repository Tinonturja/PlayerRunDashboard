/* Player Run Dashboard — vanilla JS */
(() => {
  const STORAGE_KEY = 'prd.players.v1';

  /** @type {Array<Player>} */
  let players = load();
  let sortKey = 'runs';
  let sortDir = 'desc';
  let searchQuery = '';
  const charts = {};

  // ---------- Storage ----------
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }
  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(players)); }

  // ---------- Helpers ----------
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const uid = () => Math.random().toString(36).slice(2, 10);

  function num(v, fallback = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }

  function computeDerived(p) {
    const dismissals = Math.max(0, num(p.innings) - num(p.notOuts));
    const average = dismissals > 0 ? num(p.runs) / dismissals : num(p.runs);
    const strikeRate = num(p.balls) > 0 ? (num(p.runs) / num(p.balls)) * 100 : 0;
    return {
      ...p,
      average: Number(average.toFixed(2)),
      strikeRate: Number(strikeRate.toFixed(2)),
    };
  }

  function showToast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => el.classList.remove('show'), 1800);
  }

  // ---------- Form ----------
  const form = $('#playerForm');
  const formTitle = $('#formTitle');
  const submitBtn = $('#submitBtn');

  function readForm() {
    return {
      id: $('#playerId').value || uid(),
      name: $('#name').value.trim(),
      team: $('#team').value.trim(),
      matches: num($('#matches').value),
      innings: num($('#innings').value),
      notOuts: num($('#notOuts').value),
      runs: num($('#runs').value),
      balls: num($('#balls').value),
      highest: num($('#highest').value),
      fours: num($('#fours').value),
      sixes: num($('#sixes').value),
    };
  }

  function fillForm(p) {
    $('#playerId').value = p.id;
    $('#name').value = p.name;
    $('#team').value = p.team || '';
    $('#matches').value = p.matches;
    $('#innings').value = p.innings;
    $('#notOuts').value = p.notOuts;
    $('#runs').value = p.runs;
    $('#balls').value = p.balls;
    $('#highest').value = p.highest;
    $('#fours').value = p.fours;
    $('#sixes').value = p.sixes;
    formTitle.textContent = 'Edit Player';
    submitBtn.textContent = 'Save Changes';
  }

  function resetForm() {
    form.reset();
    $('#playerId').value = '';
    formTitle.textContent = 'Add Player';
    submitBtn.textContent = 'Add Player';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = readForm();
    if (!data.name) { showToast('Name is required'); return; }
    if (data.innings < data.notOuts) {
      showToast('Not Outs cannot exceed Innings');
      return;
    }
    if (data.highest > data.runs && data.runs > 0) {
      // soft warning only
    }
    const idx = players.findIndex(p => p.id === data.id);
    if (idx >= 0) {
      players[idx] = data;
      showToast('Player updated');
    } else {
      players.push(data);
      showToast('Player added');
    }
    save();
    resetForm();
    render();
  });

  $('#resetBtn').addEventListener('click', resetForm);

  // ---------- Table ----------
  const tbody = $('#playersTbody');

  function filteredSorted() {
    const q = searchQuery.toLowerCase();
    const list = players
      .map(computeDerived)
      .filter(p =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.team || '').toLowerCase().includes(q)
      );
    list.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === 'string' && typeof vb === 'string') {
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return sortDir === 'asc' ? (va - vb) : (vb - va);
    });
    return list;
  }

  function renderTable() {
    const rows = filteredSorted();
    tbody.innerHTML = rows.map(p => `
      <tr data-id="${p.id}">
        <td>${escape(p.name)}</td>
        <td>${escape(p.team || '—')}</td>
        <td class="num">${p.matches}</td>
        <td class="num">${p.innings}</td>
        <td class="num">${p.runs}</td>
        <td class="num">${p.highest}</td>
        <td class="num">${p.average.toFixed(2)}</td>
        <td class="num">${p.strikeRate.toFixed(2)}</td>
        <td class="num">${p.fours}</td>
        <td class="num">${p.sixes}</td>
        <td>
          <div class="row-actions">
            <button class="icon-btn" data-action="edit">Edit</button>
            <button class="icon-btn danger" data-action="delete">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');

    $('#emptyState').style.display = rows.length ? 'none' : 'block';

    $$('th[data-sort]').forEach(th => {
      th.classList.remove('sorted-asc', 'sorted-desc');
      if (th.dataset.sort === sortKey) {
        th.classList.add(sortDir === 'asc' ? 'sorted-asc' : 'sorted-desc');
      }
    });
  }

  function escape(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const tr = e.target.closest('tr');
    const id = tr.dataset.id;
    const player = players.find(p => p.id === id);
    if (!player) return;
    if (btn.dataset.action === 'edit') {
      fillForm(player);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (btn.dataset.action === 'delete') {
      if (confirm(`Delete ${player.name}?`)) {
        players = players.filter(p => p.id !== id);
        save();
        render();
        showToast('Player deleted');
      }
    }
  });

  $$('th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (sortKey === key) {
        sortDir = sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        sortKey = key;
        sortDir = (key === 'name' || key === 'team') ? 'asc' : 'desc';
      }
      renderTable();
    });
  });

  $('#searchInput').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderTable();
  });

  // ---------- KPIs ----------
  function renderKpis() {
    const list = players.map(computeDerived);
    const totalRuns = list.reduce((s, p) => s + p.runs, 0);
    const totalMatches = list.reduce((s, p) => s + p.matches, 0);
    const avgSr = list.length ? list.reduce((s, p) => s + p.strikeRate, 0) / list.length : 0;
    const top = list.slice().sort((a, b) => b.runs - a.runs)[0];

    $('#kpiPlayers').textContent = list.length;
    $('#kpiRuns').textContent = totalRuns.toLocaleString();
    $('#kpiMatches').textContent = totalMatches.toLocaleString();
    $('#kpiSR').textContent = avgSr.toFixed(2);
    $('#kpiTop').textContent = top ? `${top.name} (${top.runs})` : '—';
  }

  // ---------- Charts ----------
  Chart.defaults.color = '#9aa3c7';
  Chart.defaults.borderColor = 'rgba(154, 163, 199, 0.15)';
  Chart.defaults.font.family = "'Inter', sans-serif";

  const palette = ['#6c8cff', '#36d399', '#fbbf24', '#ff6b81', '#a78bfa', '#22d3ee', '#f472b6', '#34d399', '#facc15', '#60a5fa'];

  function destroy(name) {
    if (charts[name]) { charts[name].destroy(); charts[name] = null; }
  }

  function renderCharts() {
    const list = players.map(computeDerived);

    // Runs by player (top 10)
    const byRuns = list.slice().sort((a, b) => b.runs - a.runs).slice(0, 10);
    destroy('runs');
    charts.runs = new Chart($('#runsChart'), {
      type: 'bar',
      data: {
        labels: byRuns.map(p => p.name),
        datasets: [{
          label: 'Runs',
          data: byRuns.map(p => p.runs),
          backgroundColor: byRuns.map((_, i) => palette[i % palette.length]),
          borderRadius: 6,
        }],
      },
      options: chartOpts(),
    });

    // Average (top 10)
    const byAvg = list.slice().sort((a, b) => b.average - a.average).slice(0, 10);
    destroy('avg');
    charts.avg = new Chart($('#avgChart'), {
      type: 'bar',
      data: {
        labels: byAvg.map(p => p.name),
        datasets: [{
          label: 'Average',
          data: byAvg.map(p => p.average),
          backgroundColor: '#36d399',
          borderRadius: 6,
        }],
      },
      options: chartOpts(),
    });

    // Boundaries doughnut
    const totalFours = list.reduce((s, p) => s + p.fours, 0);
    const totalSixes = list.reduce((s, p) => s + p.sixes, 0);
    destroy('boundaries');
    charts.boundaries = new Chart($('#boundariesChart'), {
      type: 'doughnut',
      data: {
        labels: ['Fours', 'Sixes'],
        datasets: [{
          data: [totalFours, totalSixes],
          backgroundColor: ['#6c8cff', '#fbbf24'],
          borderColor: 'transparent',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
        },
      },
    });

    // Scatter Runs vs SR
    destroy('scatter');
    charts.scatter = new Chart($('#scatterChart'), {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Players',
          data: list.map(p => ({ x: p.runs, y: p.strikeRate, name: p.name })),
          backgroundColor: '#8aa6ff',
          pointRadius: 6,
          pointHoverRadius: 8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.raw.name}: ${ctx.raw.x} runs, SR ${ctx.raw.y}`,
            },
          },
        },
        scales: {
          x: { title: { display: true, text: 'Runs' }, grid: { color: 'rgba(154,163,199,0.08)' } },
          y: { title: { display: true, text: 'Strike Rate' }, grid: { color: 'rgba(154,163,199,0.08)' } },
        },
      },
    });
  }

  function chartOpts() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: '#1b2348', borderColor: '#243063', borderWidth: 1 },
      },
      scales: {
        x: { grid: { color: 'rgba(154,163,199,0.08)' }, ticks: { autoSkip: false, maxRotation: 30 } },
        y: { grid: { color: 'rgba(154,163,199,0.08)' }, beginAtZero: true },
      },
    };
  }

  // ---------- CSV ----------
  const CSV_HEADERS = ['name', 'team', 'matches', 'innings', 'notOuts', 'runs', 'balls', 'highest', 'fours', 'sixes'];

  function exportCsv() {
    if (!players.length) { showToast('No data to export'); return; }
    const rows = [CSV_HEADERS.join(',')];
    for (const p of players) {
      rows.push(CSV_HEADERS.map(h => csvCell(p[h])).join(','));
    }
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `players_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported');
  }

  function csvCell(v) {
    if (v == null) return '';
    const s = String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  }

  function importCsv(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || '');
        const rows = parseCsv(text);
        if (!rows.length) throw new Error('Empty file');
        const header = rows[0].map(h => h.trim());
        const idx = (k) => header.indexOf(k);
        let imported = 0;
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (!r || !r.length || !r[idx('name')]) continue;
          players.push({
            id: uid(),
            name: r[idx('name')] || '',
            team: r[idx('team')] || '',
            matches: num(r[idx('matches')]),
            innings: num(r[idx('innings')]),
            notOuts: num(r[idx('notOuts')]),
            runs: num(r[idx('runs')]),
            balls: num(r[idx('balls')]),
            highest: num(r[idx('highest')]),
            fours: num(r[idx('fours')]),
            sixes: num(r[idx('sixes')]),
          });
          imported++;
        }
        save();
        render();
        showToast(`Imported ${imported} player(s)`);
      } catch (e) {
        showToast('Failed to parse CSV');
        console.error(e);
      }
    };
    reader.readAsText(file);
  }

  function parseCsv(text) {
    const rows = [];
    let cur = [];
    let val = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"' && text[i + 1] === '"') { val += '"'; i++; }
        else if (c === '"') { inQuotes = false; }
        else { val += c; }
      } else {
        if (c === '"') inQuotes = true;
        else if (c === ',') { cur.push(val); val = ''; }
        else if (c === '\n') { cur.push(val); rows.push(cur); cur = []; val = ''; }
        else if (c === '\r') { /* skip */ }
        else { val += c; }
      }
    }
    if (val.length || cur.length) { cur.push(val); rows.push(cur); }
    return rows;
  }

  $('#exportCsvBtn').addEventListener('click', exportCsv);
  $('#importCsvInput').addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) importCsv(file);
    e.target.value = '';
  });

  // ---------- Sample data & clear ----------
  const sample = [
    { name: 'Virat Kohli',     team: 'India',    matches: 275, innings: 265, notOuts: 39, runs: 13848, balls: 14702, highest: 183, fours: 1295, sixes: 153 },
    { name: 'Rohit Sharma',    team: 'India',    matches: 265, innings: 258, notOuts: 36, runs: 10866, balls: 12126, highest: 264, fours: 996,  sixes: 331 },
    { name: 'Babar Azam',      team: 'Pakistan', matches: 117, innings: 115, notOuts: 12, runs: 5729,  balls: 6310,  highest: 158, fours: 524,  sixes: 51  },
    { name: 'Joe Root',        team: 'England',  matches: 171, innings: 161, notOuts: 26, runs: 6522,  balls: 7727,  highest: 133, fours: 562,  sixes: 39  },
    { name: 'Steve Smith',     team: 'Australia',matches: 158, innings: 142, notOuts: 17, runs: 4939,  balls: 6058,  highest: 164, fours: 425,  sixes: 38  },
    { name: 'Kane Williamson', team: 'NewZealand',matches:165, innings: 159, notOuts: 17, runs: 6555,  balls: 7917,  highest: 148, fours: 588,  sixes: 56  },
    { name: 'David Warner',    team: 'Australia',matches: 161, innings: 159, notOuts: 6,  runs: 6932,  balls: 7173,  highest: 179, fours: 706,  sixes: 130 },
    { name: 'Shubman Gill',    team: 'India',    matches: 47,  innings: 47,  notOuts: 5,  runs: 2271,  balls: 2415,  highest: 208, fours: 226,  sixes: 39  },
  ];

  $('#loadSampleBtn').addEventListener('click', () => {
    if (players.length && !confirm('Replace existing data with sample players?')) return;
    players = sample.map(p => ({ id: uid(), ...p }));
    save();
    render();
    showToast('Sample data loaded');
  });

  $('#clearAllBtn').addEventListener('click', () => {
    if (!players.length) return;
    if (!confirm('Delete all players? This cannot be undone.')) return;
    players = [];
    save();
    render();
    showToast('All players cleared');
  });

  // ---------- Render ----------
  function render() {
    renderKpis();
    renderTable();
    renderCharts();
  }

  render();
})();
