import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { useUIStore } from '../store/uiStore';
import { OP_TYPES, colorOf } from '../lib/colors';

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
        for (const op of ops) {
          const v = o.ops?.[op]?.[metric] || 0;
          row[op] = v;
        }
        return row;
      });
  }, [officers, ops, metric, showInactive]);

  return (
    <section className="panel p-5">
      <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-3 mb-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">Operations Comparison</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Grouped bars per operation type — compare who did the most of each.
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800">
          {['km', 'count'].map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${
                metric === m
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              by {m === 'km' ? 'KM' : 'count'}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400 py-12 text-center">
          No officer data to chart.
        </p>
      ) : (
        <div style={{ height: Math.max(280, data.length * 28 + 80) }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 6, right: 16, bottom: 6, left: 8 }}
              barCategoryGap="22%"
            >
              <CartesianGrid stroke="rgba(148,163,184,0.18)" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                tickLine={false}
                axisLine={false}
                width={140}
              />
              <Tooltip
                cursor={{ fill: 'rgba(148,163,184,0.08)' }}
                contentStyle={{
                  background: 'rgba(15,23,42,0.95)',
                  border: '1px solid #334155',
                  borderRadius: 8,
                  color: '#f1f5f9',
                  fontSize: 12,
                }}
                formatter={(v, n) => [`${v.toLocaleString()} ${metric === 'km' ? 'km' : 'ops'}`, n]}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
                iconType="square"
              />
              {ops.map((op) => (
                <Bar
                  key={op}
                  dataKey={op}
                  fill={colorOf(op)}
                  radius={[0, 3, 3, 0]}
                  isAnimationActive
                  animationDuration={600}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
