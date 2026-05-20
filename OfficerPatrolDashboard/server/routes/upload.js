'use strict';

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { parseExcel } = require('../utils/parseExcel');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const LATEST_PATH = path.join(UPLOADS_DIR, 'latest.xlsx');
const META_PATH = path.join(UPLOADS_DIR, 'meta.json');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  // Always overwrite — we only ever care about the latest upload
  filename: (_req, _file, cb) => cb(null, 'latest.xlsx'),
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
  fileFilter: (_req, file, cb) => {
    if (!/\.xlsx$/i.test(file.originalname)) {
      return cb(new Error('Only .xlsx files are allowed'));
    }
    cb(null, true);
  },
});

const router = express.Router();

router.post('/upload', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    try {
      const officers = parseExcel(LATEST_PATH);
      const uploadedAt = new Date().toISOString();
      const meta = {
        uploadedAt,
        originalName: req.file.originalname,
        size: req.file.size,
      };
      fs.writeFileSync(META_PATH, JSON.stringify(meta, null, 2));
      res.json({ success: true, officers, ...meta });
    } catch (e) {
      res.status(500).json({ success: false, error: `Parse error: ${e.message}` });
    }
  });
});

module.exports = router;
