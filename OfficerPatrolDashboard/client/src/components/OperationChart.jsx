import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { useUIStore } from '../store/uiStore';
import { OP_TYPES, colorOf } from '../lib/colors';

function CustomTooltip({ active, payload, label, metric }) {
  if (!active || !payload?.length) return null;
  const sorted = [...payload].sort((a, b) => (b.value || 0) - (a.value || 0)).filter(p => p.value > 0);
  return (
    <div className="rounded-xl border border-emerald-500/25 bg-ink-950/95 backdrop-blur-md px-3 py-2.5 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)] min-w-[200px]">
      <p className="text-xs font-semibold text-slate-100 mb-1.5">{label}</p>
      <div className="space-y-1">
        {sorted.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2 text-[11px] font-mono">
            <span className="h-2 w-2 rounded-sm" style={{ background: p.color }} />
            <span className="text-slate-300">{p.dataKey}</span>
            <span className="ml-auto tabular-nums text-slate-100">
              {Number(p.value).toLocaleString()} {metric === 'km' ? 'km' : 'ops'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OperationChart({ officers = [] }) {
  const enabledOps = useUIStore((s) => s.enabledOps);
  const metric = useUIStore((s) => s.opChartMetric);
  const setMetric = useUIStore((s) => s.setOpChartMetric);
  const showInactive = useUIStore((s) => s.showInactive);

  const ops = useMemo(
    () => OP_TYPES.filter((op) => enabledOps.size === 0 || enabledOps.has(op)),
    [enabledOps]
  );

  const data = useMemo(() => {
    return officers
      .filter((o) => showInactive || (o.total_km || 0) > 0)
      .slice()
      .sort((a, b) => (b.total_km || 0) - (a.total_km || 0))
      .map((o) => {
        const row = { name: o.name };
        for (const op of ops) row[op] = o.ops?.[op]?.[metric] || 0;
        return row;
      });
  }, [officers, ops, metric, showInactive]);

  return (
    <section className="panel-cinema p-5 sm:p-6">
      <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-3 mb-5">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-emerald-500/40" />
          <div>
            <h2 className="text-sm font-semibold tracking-[0.22em] font-mono text-slate-700 dark:text-slate-200">
              OPERATIONS COMPARISON
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Grouped bars per operation — compare who did the most of each type.
            </p>
          </div>
        </div>
        <div className="inline-flex rounded-lg border border-slate-200 dark:border-white/[0.08] p-0.5 bg-slate-100 dark:bg-white/[0.04]">
          {['km', 'count'].map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-3 py-1 text-xs font-mono tracking-wider rounded-md transition-all ${
                metric === m
                  ? 'bg-white dark:bg-emerald-500/15 text-slate-900 dark:text-emerald-300 shadow-sm dark:shadow-[0_0_0_1px_rgba(16,185,129,0.3)_inset]'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              BY {m === 'km' ? 'KM' : 'COUNT'}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400 py-12 text-center">
          No officer data to chart.
        </p>
      ) : (
        <div style={{ height: Math.max(280, data.length * 30 + 80) }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 6, right: 16, bottom: 6, left: 8 }}
              barCategoryGap="22%"
            >
              <defs>
                {ops.map((op) => {
                  const c = colorOf(op);
                  return (
                    <linearGradient id={`grad-${op.replace(/\s+/g, '-')}`} key={op} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={c} stopOpacity={0.65} />
                      <stop offset="100%" stopColor={c} stopOpacity={1} />
                    </linearGradient>
                  );
                })}
              </defs>
              <CartesianGrid stroke="rgba(148,163,184,0.10)" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={false}
                width={140}
              />
              <Tooltip
                cursor={{ fill: 'rgba(16,185,129,0.06)' }}
                content={<CustomTooltip metric={metric} />}
              />
              <Legend
                wrapperStyle={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em', textTransform: 'uppercase', paddingTop: 8 }}
                iconType="square"
              />
              {ops.map((op) => (
                <Bar
                  key={op}
                  dataKey={op}
                  fill={`url(#grad-${op.replace(/\s+/g, '-')})`}
                  radius={[0, 4, 4, 0]}
                  isAnimationActive
                  animationDuration={700}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
