import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { OP_TYPES, colorOf } from '../lib/colors';

function MiniBar({ pct, color }) {
  return (
    <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700/70 overflow-hidden">
      <div
        className="h-full origin-left animate-grow-x"
        style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: color }}
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-5 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800 animate-slide-down">
      {/* Op breakdown cards */}
      <div className="lg:col-span-2">
        <h4 className="label mb-3">Operation breakdown</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {OP_TYPES.map((op) => {
            const data = officer.ops?.[op] || { count: 0, km: 0 };
            const active = data.km > 0 || data.count > 0;
            const c = colorOf(op);
            const pct = totalKm > 0 ? (data.km / totalKm) * 100 : 0;
            return (
              <div
                key={op}
                className={`rounded-lg border p-3 ${active
                  ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                  : 'border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="h-2 w-2 rounded-sm shrink-0" style={{ background: c }} />
                    <span className="text-xs font-mono truncate">{op}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                    {pct.toFixed(0)}%
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-lg stat-num">{data.km.toLocaleString()}</span>
                  <span className="text-[10px] font-mono text-slate-500">km</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {data.count} op{data.count === 1 ? '' : 's'}
                </p>
                <div className="mt-2">
                  <MiniBar pct={pct} color={c} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pie chart of km distribution */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-4">
        <h4 className="label mb-2">KM distribution</h4>
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
                    background: 'rgba(15,23,42,0.95)',
                    border: '1px solid #334155',
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
