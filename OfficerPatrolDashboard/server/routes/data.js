'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const { parseExcel } = require('../utils/parseExcel');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const LATEST_PATH = path.join(UPLOADS_DIR, 'latest.xlsx');
const META_PATH = path.join(UPLOADS_DIR, 'meta.json');

const router = express.Router();

router.get('/data', (_req, res) => {
  if (!fs.existsSync(LATEST_PATH)) {
    return res.status(404).json({ error: 'No data uploaded yet' });
  }
  try {
    const officers = parseExcel(LATEST_PATH);
    let meta = {};
    if (fs.existsSync(META_PATH)) {
      try {
        meta = JSON.parse(fs.readFileSync(META_PATH, 'utf8'));
      } catch {
        meta = {};
      }
    }
    res.json({ officers, ...meta });
  } catch (e) {
    res.status(500).json({ error: `Parse error: ${e.message}` });
  }
});

module.exports = router;
