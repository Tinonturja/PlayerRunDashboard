import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { OP_TYPES, colorOf } from '../lib/colors';

function MiniBar({ pct, color }) {
  return (
    <div className="h-1.5 rounded-full bg-slate-200 dark:bg-white/[0.05] overflow-hidden">
      <div
        className="h-full origin-left animate-grow-x"
        style={{
          width: `${Math.max(0, Math.min(100, pct))}%`,
          background: `linear-gradient(90deg, ${color}99, ${color})`,
          boxShadow: `0 0 10px ${color}55`,
        }}
      />
    </div>
  );
}

export default function ExpandedDetail({ officer }) {
  const totalKm = officer.total_km || 0;
  const pieData = OP_TYPES
    .map((op) => ({ name: op, value: officer.ops?.[op]?.km || 0, color: colorOf(op) }))
    .filter((d) => d.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-5 bg-slate-50/40 dark:bg-black/30 border-t border-slate-200 dark:border-white/[0.04] animate-slide-down">
      <div className="lg:col-span-2">
        <div className="flex items-center gap-2 mb-3">
          <span className="h-px w-6 bg-gradient-to-r from-transparent to-emerald-500/50" />
          <h4 className="label">Operation breakdown</h4>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {OP_TYPES.map((op) => {
            const data = officer.ops?.[op] || { count: 0, km: 0 };
            const active = data.km > 0 || data.count > 0;
            const c = colorOf(op);
            const pct = totalKm > 0 ? (data.km / totalKm) * 100 : 0;
            return (
              <div
                key={op}
                className={`relative rounded-lg border p-3 transition-all ${active
                  ? 'border-slate-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.025]'
                  : 'border-slate-200/60 dark:border-white/[0.04] bg-white/40 dark:bg-white/[0.01] opacity-50'
                }`}
                style={active ? { boxShadow: `inset 2px 0 0 ${c}` } : undefined}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="h-2 w-2 rounded-sm shrink-0" style={{ background: c, boxShadow: active ? `0 0 8px ${c}88` : 'none' }} />
                    <span className="text-xs font-mono truncate">{op}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                    {pct.toFixed(0)}%
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-lg stat-num">{data.km.toLocaleString()}</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">km</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 font-mono uppercase tracking-wider">
                  {data.count} OP{data.count === 1 ? '' : 'S'}
                </p>
                <div className="mt-2"><MiniBar pct={pct} color={c} /></div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-px w-6 bg-gradient-to-r from-transparent to-cyan-500/50" />
          <h4 className="label">KM distribution</h4>
        </div>
        {pieData.length > 0 ? (
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={42}
                  outerRadius={72}
                  paddingAngle={1.5}
                  stroke="none"
                  isAnimationActive
                  animationBegin={0}
                  animationDuration={500}
                >
                  {pieData.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(5,8,15,0.95)',
                    border: '1px solid rgba(16,185,129,0.25)',
                    borderRadius: 8,
                    color: '#f1f5f9',
                    fontSize: 12,
                  }}
                  formatter={(v, n) => [`${v.toLocaleString()} km`, n]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-12">
            No kilometres recorded for this officer.
          </p>
        )}
        <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
          {pieData.map((d) => (
            <li key={d.name} className="flex items-center gap-1.5 truncate">
              <span className="h-2 w-2 rounded-sm" style={{ background: d.color }} />
              <span className="font-mono truncate">{d.name}</span>
              <span className="ml-auto tabular-nums text-slate-500">{d.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
