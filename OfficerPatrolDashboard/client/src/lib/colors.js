// Single source of truth for operation types and their colors.
// Mirrored in tailwind.config.js (under `colors.op`) for any utility classes.

export const OP_TYPES = [
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

export const OP_COLORS = {
  'TOB':       '#BA7517',
  'ELDP':      '#1D9E75',
  'ILDP':      '#378ADD',
  'Mil LDP':   '#7F77DD',
  'ISDP':      '#1AACBF',
  'Mil SDP':   '#D85A30',
  'LDAP':      '#639922',
  'IDAP':      '#D4537E',
  'FP UNISFA': '#E24B4A',
  'FP Other':  '#9F60C8',
  'CT Ptl':    '#1D7A6E',
};

export function colorOf(op) {
  return OP_COLORS[op] || '#64748b';
}

// Empty op shape used when an officer record is missing the field
export const EMPTY_OPS = OP_TYPES.reduce((acc, op) => {
  acc[op] = { count: 0, km: 0 };
  return acc;
}, {});
