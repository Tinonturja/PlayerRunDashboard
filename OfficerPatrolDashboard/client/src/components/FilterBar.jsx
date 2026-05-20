import { useUIStore } from '../store/uiStore';
import { OP_TYPES, colorOf } from '../lib/colors';

export default function FilterBar() {
  const search = useUIStore((s) => s.search);
  const setSearch = useUIStore((s) => s.setSearch);
  const enabledOps = useUIStore((s) => s.enabledOps);
  const toggleOp = useUIStore((s) => s.toggleOp);
  const resetOps = useUIStore((s) => s.resetOps);
  const showInactive = useUIStore((s) => s.showInactive);
  const setShowInactive = useUIStore((s) => s.setShowInactive);

  const allOn = enabledOps.size === OP_TYPES.length;

  return (
    <section className="panel-cinema p-4 sm:p-5 flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[220px] max-w-md">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <input
          type="search"
          placeholder="Search officer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {OP_TYPES.map((op) => {
          const on = enabledOps.has(op);
          const c = colorOf(op);
          return (
            <button
              key={op}
              onClick={() => toggleOp(op)}
              className="chip"
              style={{
                color: on ? '#fff' : c,
                backgroundColor: on ? c : 'transparent',
                borderColor: c,
                boxShadow: on ? `0 0 0 1px ${c}, 0 0 12px ${c}55` : 'none',
              }}
              aria-pressed={on}
              title={`${on ? 'Hide' : 'Show'} ${op}`}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: on ? '#fff' : c, boxShadow: on ? '0 0 6px #fff' : 'none' }}
              />
              <span className="font-mono">{op}</span>
            </button>
          );
        })}
        {!allOn && (
          <button onClick={resetOps} className="btn-ghost text-xs">All ops</button>
        )}
      </div>

      <label className="ml-auto inline-flex items-center gap-2 cursor-pointer select-none">
        <span className="label">Show inactive</span>
        <span className="relative">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="sr-only peer"
          />
          <span className="block h-5 w-9 rounded-full bg-slate-300 dark:bg-white/10 peer-checked:bg-emerald-500 peer-checked:shadow-[0_0_12px_rgba(16,185,129,0.55)] transition-all" />
          <span className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
        </span>
      </label>
    </section>
  );
}
