import { OP_TYPES, colorOf } from '../lib/colors';

function topOpFor(officer) {
  let best = null;
  let bestKm = -1;
  for (const op of OP_TYPES) {
    const km = officer.ops?.[op]?.km || 0;
    if (km > bestKm) { bestKm = km; best = op; }
  }
  return bestKm > 0 ? best : null;
}

const podiumStyle = {
  1: { rank: '1', label: 'GOLD',   ring: 'ring-yellow-400/70',  badge: 'bg-yellow-400 text-yellow-950',  height: 'lg:order-2 lg:scale-105' },
  2: { rank: '2', label: 'SILVER', ring: 'ring-slate-300/70',   badge: 'bg-slate-300 text-slate-900',    height: 'lg:order-1' },
  3: { rank: '3', label: 'BRONZE', ring: 'ring-amber-700/60',   badge: 'bg-amber-700 text-amber-50',     height: 'lg:order-3' },
};

export default function TopPerformers({ officers = [] }) {
  const top = officers
    .filter((o) => (o.total_km || 0) > 0)
    .slice()
    .sort((a, b) => (b.total_km || 0) - (a.total_km || 0))
    .slice(0, 3);

  if (top.length === 0) {
    return null;
  }

  return (
    <section className="panel p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold tracking-tight">Top Performers</h2>
        <span className="label">By total KM</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {top.map((o, i) => {
          const place = i + 1;
          const cfg = podiumStyle[place];
          const op = topOpFor(o);
          return (
            <div
              key={o.ser}
              className={`relative rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 p-5 ring-2 ${cfg.ring} ${cfg.height} transition-transform`}
            >
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center justify-center h-9 w-9 rounded-full font-bold ${cfg.badge}`}>
                  {cfg.rank}
                </span>
                <span className="label">{cfg.label}</span>
              </div>
              <h3 className="mt-3 text-base font-semibold leading-tight">{o.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl stat-num">{(o.total_km || 0).toLocaleString()}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">km</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {o.total_ops || 0} operation{(o.total_ops || 0) === 1 ? '' : 's'}
              </p>
              {op && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: colorOf(op) }} />
                  <span className="text-xs">
                    Most active: <span className="font-mono font-medium">{op}</span>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
