'use strict';

/**
 * SheetJS-based parser for the Officer Patrol Excel workbook.
 *
 * Each officer block in the sheet spans multiple rows:
 *   - A "header" row with a serial number in col A and the officer's name in col B
 *   - One or more detail rows
 *   - A "Total" row (col B === "Total") holding the aggregated values
 *
 * On the Total row, columns map to operation types in (count, km) pairs starting
 * at column C. The final two columns are grand-total ops and total km.
 */

const xlsx = require('xlsx');

const OP_TYPES = [
  'TOB',
  'ELDP',
  'ILDP',
  'Mil LDP',
  'ISDP',
  'Mil SDP',
  'LDAP',
  'IDAP',
  'FP UNISFA',
  'FP Other',
  'CT Ptl',
];

const FIRST_OP_COL = 2; // column C (zero-indexed)

function toNum(v) {
  if (v === null || v === undefined || v === '') return 0;
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  const n = Number(String(v).replace(/[, ]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function isTotalLabel(v) {
  return v != null && String(v).trim().toLowerCase() === 'total';
}

/**
 * Given a row at the "Total" position (and the most recent header info), build
 * the officer record.
 */
function buildOfficer(header, totalRow) {
  const ops = {};
  let summedCount = 0;
  let summedKm = 0;

  for (let i = 0; i < OP_TYPES.length; i++) {
    const countCol = FIRST_OP_COL + i * 2;
    const kmCol = countCol + 1;
    const count = toNum(totalRow[countCol]);
    const km = toNum(totalRow[kmCol]);
    ops[OP_TYPES[i]] = { count, km };
    summedCount += count;
    summedKm += km;
  }

  // Grand totals expected in the next two columns. Fall back to summed values
  // if the cells are blank or missing.
  const totalOpsIdx = FIRST_OP_COL + OP_TYPES.length * 2; // 24
  const totalKmIdx = totalOpsIdx + 1; // 25
  const totalOpsCell = totalRow[totalOpsIdx];
  const totalKmCell = totalRow[totalKmIdx];

  const total_ops =
    totalOpsCell === null || totalOpsCell === undefined || totalOpsCell === ''
      ? summedCount
      : toNum(totalOpsCell);
  const total_km =
    totalKmCell === null || totalKmCell === undefined || totalKmCell === ''
      ? summedKm
      : toNum(totalKmCell);

  return {
    ser: header.ser,
    name: header.name,
    total_ops,
    total_km,
    ops,
  };
}

/**
 * Parse the workbook at `filepath` and return the array of officers.
 * @param {string} filepath
 * @returns {Array<{ser:number,name:string,total_ops:number,total_km:number,ops:object}>}
 */
function parseExcel(filepath) {
  const wb = xlsx.readFile(filepath, { cellDates: false });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) return [];
  const sheet = wb.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: null, blankrows: false });

  const officers = [];
  let currentHeader = null;

  for (const row of rows) {
    if (!row || row.length === 0) continue;
    const colA = row[0];
    const colB = row[1];

    // Header row: numeric serial in col A, non-empty col B that is NOT "Total"
    const aIsSerial =
      typeof colA === 'number' ||
      (typeof colA === 'string' && /^\d+$/.test(colA.trim()));

    if (aIsSerial && colB && !isTotalLabel(colB)) {
      currentHeader = {
        ser: toNum(colA),
        name: String(colB).trim(),
      };
      continue;
    }

    // Total row
    if (currentHeader && isTotalLabel(colB)) {
      officers.push(buildOfficer(currentHeader, row));
      currentHeader = null;
      continue;
    }
  }

  return officers;
}

module.exports = { parseExcel, OP_TYPES };
