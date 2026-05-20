import { useMemo } from 'react';
import { useUIStore } from '../store/uiStore';
import { OP_TYPES } from '../lib/colors';
import OfficerRow from './OfficerRow';

export default function OfficerTable({ officers = [] }) {
  const search = useUIStore((s) => s.search);
  const enabledOps = useUIStore((s) => s.enabledOps);
  const showInactive = useUIStore((s) => s.showInactive);
  const collapseAll = useUIStore((s) => s.collapseAll);
  const expandedCount = useUIStore((s) => s.expanded.size);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return officers
      .filter((o) => showInactive || (o.total_km || 0) > 0)
      .filter((o) => !q || o.name.toLowerCase().includes(q))
      .slice()
      .sort((a, b) => (b.total_km || 0) - (a.total_km || 0));
  }, [officers, search, showInactive]);

  const maxKm = filtered.reduce((m, o) => Math.max(m, o.total_km || 0), 0);

  return (
    <section className="panel overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">Officer Rankings</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sorted by total KM. Click any row to inspect their breakdown.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="label tabular-nums">{filtered.length} of {officers.length}</span>
          {expandedCount > 0 && (
            <button onClick={collapseAll} className="btn-ghost text-xs">
              Collapse all
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/60 dark:bg-slate-900/40 text-left">
            <tr className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="px-3 py-2 w-12">#</th>
              <th className="px-2 py-2 w-3"></th>
              <th className="px-3 py-2">Officer</th>
              <th className="px-3 py-2">Operations breakdown</th>
              <th className="px-3 py-2 text-right">Total KM</th>
              <th className="px-3 py-2 text-right">Ops</th>
              <th className="px-3 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                  No officers match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map((officer, i) => (
                <OfficerRow
                  key={officer.ser ?? i}
                  officer={officer}
                  rank={i + 1}
                  maxKm={maxKm}
                  enabledOps={enabledOps.size === 0 ? new Set(OP_TYPES) : enabledOps}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
