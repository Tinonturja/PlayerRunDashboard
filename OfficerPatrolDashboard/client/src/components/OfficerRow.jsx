import { useUIStore } from '../store/uiStore';
import { OP_TYPES, colorOf } from '../lib/colors';
import ExpandedDetail from './ExpandedDetail';

function rankBadge(rank) {
  if (rank === 1) return 'bg-yellow-400 text-yellow-950 ring-2 ring-yellow-300/60';
  if (rank === 2) return 'bg-slate-300 text-slate-900 ring-2 ring-slate-200/60 dark:bg-slate-300 dark:text-slate-900';
  if (rank === 3) return 'bg-amber-700 text-amber-50 ring-2 ring-amber-600/40';
  return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-700';
}

export default function OfficerRow({ officer, rank, maxKm, enabledOps }) {
  const expanded = useUIStore((s) => s.expanded.has(officer.ser));
  const toggleExpanded = useUIStore((s) => s.toggleExpanded);

  const totalKm = officer.total_km || 0;
  const widthPct = maxKm > 0 ? (totalKm / maxKm) * 100 : 0;
  const active = totalKm > 0;

  // Build stacked segments from the operation breakdown, scaled so the row
  // bar's total width is proportional to this officer's KM vs the leader.
  const segments = OP_TYPES
    .filter((op) => enabledOps.has(op))
    .map((op) => ({ op, km: officer.ops?.[op]?.km || 0, color: colorOf(op) }))
    .filter((s) => s.km > 0);
  const segmentTotal = segments.reduce((s, x) => s + x.km, 0) || 1;

  return (
    <>
      <tr
        className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
        onClick={() => toggleExpanded(officer.ser)}
      >
        <td className="px-3 py-3 w-12">
          <span className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold font-mono ${rankBadge(rank)}`}>
            {rank}
          </span>
        </td>
        <td className="px-2 py-3 w-3">
          <span className={`inline-block h-2 w-2 rounded-full ${active ? 'bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.18)]' : 'bg-slate-300 dark:bg-slate-700'}`} />
        </td>
        <td className="px-3 py-3">
          <p className="text-sm font-medium leading-tight truncate">{officer.name}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">SER {officer.ser}</p>
        </td>
        <td className="px-3 py-3 min-w-[260px]">
          <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full flex animate-grow-x origin-left"
              style={{ width: `${widthPct}%` }}
            >
              {segments.map((s) => (
                <div
                  key={s.op}
                  title={`${s.op}: ${s.km.toLocaleString()} km`}
                  style={{
                    width: `${(s.km / segmentTotal) * 100}%`,
                    background: s.color,
                  }}
                />
              ))}
              {segments.length === 0 && active && (
                <div className="h-full w-full bg-slate-300 dark:bg-slate-700" />
              )}
            </div>
          </div>
        </td>
        <td className="px-3 py-3 text-right tabular-nums font-mono text-sm whitespace-nowrap">
          <span className="font-semibold">{totalKm.toLocaleString()}</span>
          <span className="text-[11px] text-slate-500 ml-1">km</span>
        </td>
        <td className="px-3 py-3 text-right tabular-nums font-mono text-sm whitespace-nowrap">
          {officer.total_ops || 0}
        </td>
        <td className="px-3 py-3 w-10 text-right">
          <span
            className={`inline-flex items-center justify-center h-7 w-7 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-transparent">
          <td colSpan={7} className="p-0">
            <ExpandedDetail officer={officer} />
          </td>
        </tr>
      )}
    </>
  );
}
