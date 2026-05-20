'use strict';

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const uploadRoute = require('./routes/upload');
const dataRoute = require('./routes/data');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// API
app.use('/api', uploadRoute);
app.use('/api', dataRoute);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'officer-patrol-dashboard', time: new Date().toISOString() });
});

// In production, serve the built React app
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Generic error handler — last
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[server error]', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Officer Patrol Dashboard server running on http://localhost:${PORT}`);
});
