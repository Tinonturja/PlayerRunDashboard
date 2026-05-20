import { useUIStore } from '../store/uiStore';
import { OP_TYPES, colorOf } from '../lib/colors';
import ExpandedDetail from './ExpandedDetail';

function rankStyle(rank) {
  if (rank === 1) {
    return {
      badge: 'bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 text-yellow-950 ring-2 ring-amber-400/50 shadow-[0_4px_18px_-2px_rgba(245,158,11,0.55)]',
      rowTint: 'bg-amber-400/[0.04] dark:bg-amber-400/[0.025]',
    };
  }
  if (rank === 2) {
    return {
      badge: 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-900 ring-1 ring-slate-300/40',
      rowTint: 'bg-slate-300/[0.05] dark:bg-slate-300/[0.02]',
    };
  }
  if (rank === 3) {
    return {
      badge: 'bg-gradient-to-br from-amber-700 via-amber-800 to-stone-800 text-amber-50 ring-1 ring-amber-700/40',
      rowTint: 'bg-amber-700/[0.04] dark:bg-amber-700/[0.025]',
    };
  }
  return {
    badge: 'bg-slate-100 text-slate-700 dark:bg-white/[0.04] dark:text-slate-300 ring-1 ring-slate-200 dark:ring-white/10',
    rowTint: '',
  };
}

export default function OfficerRow({ officer, rank, maxKm, enabledOps }) {
  const expanded = useUIStore((s) => s.expanded.has(officer.ser));
  const toggleExpanded = useUIStore((s) => s.toggleExpanded);

  const totalKm = officer.total_km || 0;
  const widthPct = maxKm > 0 ? (totalKm / maxKm) * 100 : 0;
  const active = totalKm > 0;
  const style = rankStyle(rank);

  const segments = OP_TYPES
    .filter((op) => enabledOps.has(op))
    .map((op) => ({ op, km: officer.ops?.[op]?.km || 0, color: colorOf(op) }))
    .filter((s) => s.km > 0);
  const segmentTotal = segments.reduce((s, x) => s + x.km, 0) || 1;

  return (
    <>
      <tr
        className={`border-b border-slate-100 dark:border-white/[0.04] hover:bg-slate-50/70 dark:hover:bg-white/[0.03] transition-colors cursor-pointer relative ${style.rowTint}`}
        onClick={() => toggleExpanded(officer.ser)}
      >
        {/* Left edge glow accent for rank 1-3 */}
        {rank <= 3 && (
          <td className="absolute left-0 top-0 bottom-0 w-0.5 p-0" style={{
            background: rank === 1 ? '#F59E0B' : rank === 2 ? '#CBD5E1' : '#B45309',
            boxShadow: `0 0 12px ${rank === 1 ? '#F59E0B' : rank === 2 ? '#CBD5E1' : '#B45309'}80`,
          }} />
        )}

        <td className="px-3 py-3.5 w-12">
          <span className={`inline-flex items-center justify-center h-8 w-8 rounded-lg text-xs font-bold font-mono ${style.badge}`}>
            {rank}
          </span>
        </td>
        <td className="px-2 py-3.5 w-3">
          <span className={`inline-block h-2 w-2 rounded-full ${active ? 'bg-emerald-400 shadow-[0_0_0_3px_rgba(16,185,129,0.18),0_0_10px_rgba(16,185,129,0.7)]' : 'bg-slate-300 dark:bg-slate-700'}`} />
        </td>
        <td className="px-3 py-3.5">
          <p className="text-sm font-medium leading-tight truncate">{officer.name}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 font-mono tracking-wider mt-0.5">SER · {officer.ser}</p>
        </td>
        <td className="px-3 py-3.5 min-w-[260px]">
          <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-white/[0.04] overflow-hidden ring-1 ring-inset ring-slate-200/60 dark:ring-white/[0.04]">
            <div
              className={`h-full flex animate-grow-x origin-left ${rank === 1 ? 'bar-shimmer' : ''}`}
              style={{ width: `${widthPct}%` }}
            >
              {segments.map((s) => (
                <div
                  key={s.op}
                  title={`${s.op}: ${s.km.toLocaleString()} km`}
                  style={{
                    width: `${(s.km / segmentTotal) * 100}%`,
                    background: s.color,
                    boxShadow: rank === 1 ? `inset 0 0 0 1px ${s.color}80` : undefined,
                  }}
                />
              ))}
              {segments.length === 0 && active && (
                <div className="h-full w-full bg-slate-300 dark:bg-slate-700" />
              )}
            </div>
          </div>
        </td>
        <td className="px-3 py-3.5 text-right tabular-nums font-mono text-sm whitespace-nowrap">
          <span className="font-semibold">{totalKm.toLocaleString()}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-500 ml-1 tracking-wider">KM</span>
        </td>
        <td className="px-3 py-3.5 text-right tabular-nums font-mono text-sm whitespace-nowrap">
          {officer.total_ops || 0}
        </td>
        <td className="px-3 py-3.5 w-10 text-right">
          <span
            className={`inline-flex items-center justify-center h-7 w-7 rounded-md border border-slate-200 dark:border-white/10 text-slate-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
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
