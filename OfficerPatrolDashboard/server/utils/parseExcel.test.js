'use strict';

/**
 * Standalone sanity test: builds a synthetic xlsx file matching the spec
 * shape, parses it back via parseExcel, and asserts the structure.
 *
 *   node server/utils/parseExcel.test.js
 */

const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const { parseExcel, OP_TYPES } = require('./parseExcel');

function build() {
  // Layout (per spec):
  //   col A: serial (header row only)
  //   col B: officer name (header) or "Total" (total row)
  //   cols C..X: 11 (count, km) pairs in OP_TYPES order
  //   cols Y..Z: grand total ops, total km
  const aoa = [
    // Sheet title row (ignored by parser)
    ['Officers Patrol Summary', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    // --- Officer 1: Maj Alpha
    [1, 'Maj Alpha', 'TOB', null, 'ELDP', null, 'ILDP', null, 'Mil LDP', null, 'ISDP', null, 'Mil SDP', null, 'LDAP', null, 'IDAP', null, 'FP UNISFA', null, 'FP Other', null, 'CT Ptl', null, 'Ops', 'Km'],
    [null, 'Patrol 12 May', 0, 0, 1, 90, 0, 0, 0, 0, 2, 160, 0, 0, 0, 0, 0, 0, 1, 120, 1, 110, 0, 0, null, null],
    [null, 'Total',
      0, 0,    // TOB
      1, 90,   // ELDP
      0, 0,    // ILDP
      0, 0,    // Mil LDP
      2, 160,  // ISDP
      0, 0,    // Mil SDP
      0, 0,    // LDAP
      0, 0,    // IDAP
      1, 120,  // FP UNISFA
      1, 110,  // FP Other
      0, 0,    // CT Ptl
      5, 480,  // grand totals
    ],
    // --- Officer 2: Capt Bravo
    [2, 'Capt Bravo', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, 'Patrol 14 May', 1, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 40, null, null],
    [null, 'Total',
      1, 50,   // TOB
      0, 0,    // ELDP
      0, 0,    // ILDP
      0, 0,    // Mil LDP
      0, 0,    // ISDP
      0, 0,    // Mil SDP
      0, 0,    // LDAP
      0, 0,    // IDAP
      0, 0,    // FP UNISFA
      0, 0,    // FP Other
      1, 40,   // CT Ptl
      // intentionally leave grand totals blank to test fallback
      null, null,
    ],
    // --- Officer 3: Lt Charlie (all zeros, inactive)
    [3, 'Lt Charlie'],
    [null, 'Total',
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0,
    ],
  ];

  const ws = xlsx.utils.aoa_to_sheet(aoa);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
  const out = path.join(__dirname, '__fixture.xlsx');
  xlsx.writeFile(wb, out);
  return out;
}

function assert(cond, msg) {
  if (!cond) {
    console.error('  FAIL:', msg);
    process.exitCode = 1;
  } else {
    console.log('  OK:  ', msg);
  }
}

function approxEq(a, b) {
  return Math.abs(a - b) < 1e-6;
}

function run() {
  const fixture = build();
  console.log('Wrote fixture:', fixture);

  const officers = parseExcel(fixture);
  console.log('Parsed', officers.length, 'officer(s):');
  console.log(JSON.stringify(officers, null, 2));

  assert(officers.length === 3, 'parses 3 officers');

  const [a, b, c] = officers;

  assert(a.ser === 1 && a.name === 'Maj Alpha', 'officer 1 header');
  assert(a.total_ops === 5, 'officer 1 total_ops = 5');
  assert(a.total_km === 480, 'officer 1 total_km = 480');
  assert(a.ops.ELDP.count === 1 && a.ops.ELDP.km === 90, 'officer 1 ELDP pair');
  assert(a.ops.ISDP.count === 2 && a.ops.ISDP.km === 160, 'officer 1 ISDP pair');
  assert(a.ops['FP UNISFA'].km === 120, 'officer 1 FP UNISFA km');

  assert(b.ser === 2 && b.name === 'Capt Bravo', 'officer 2 header');
  // grand totals were blank — parser should fall back to summed values
  assert(b.total_ops === 2, 'officer 2 total_ops fallback = 2');
  assert(approxEq(b.total_km, 90), 'officer 2 total_km fallback = 90');

  assert(c.ser === 3 && c.name === 'Lt Charlie', 'officer 3 header');
  assert(c.total_km === 0 && c.total_ops === 0, 'officer 3 inactive');

  // op type completeness
  for (const op of OP_TYPES) {
    assert(a.ops[op] && typeof a.ops[op].count === 'number', `officer 1 has op ${op}`);
  }

  // cleanup
  fs.unlinkSync(fixture);

  if (process.exitCode) {
    console.log('\nSome assertions FAILED.');
  } else {
    console.log('\nAll parser assertions passed.');
  }
}

run();
