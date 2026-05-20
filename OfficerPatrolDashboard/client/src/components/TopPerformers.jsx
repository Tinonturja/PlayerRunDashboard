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

const PODIUM = {
  1: {
    rank: '01',
    label: 'GOLD',
    order: 'lg:order-2 lg:-translate-y-3',
    badge: 'bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 text-yellow-950 shadow-[0_8px_24px_-6px_rgba(245,158,11,0.7)]',
    ring: 'ring-2 ring-amber-400/40',
    glow: 'before:bg-amber-400/30',
    accent: '#F59E0B',
    elev: 'shadow-[0_30px_60px_-20px_rgba(245,158,11,0.45)]',
  },
  2: {
    rank: '02',
    label: 'SILVER',
    order: 'lg:order-1',
    badge: 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-900 shadow-[0_8px_24px_-6px_rgba(148,163,184,0.6)]',
    ring: 'ring-1 ring-slate-300/40',
    glow: 'before:bg-slate-300/20',
    accent: '#CBD5E1',
    elev: '',
  },
  3: {
    rank: '03',
    label: 'BRONZE',
    order: 'lg:order-3',
    badge: 'bg-gradient-to-br from-amber-700 via-amber-800 to-stone-800 text-amber-50 shadow-[0_8px_20px_-6px_rgba(180,83,9,0.5)]',
    ring: 'ring-1 ring-amber-700/40',
    glow: 'before:bg-amber-700/20',
    accent: '#B45309',
    elev: '',
  },
};

function TrophyIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4zM5 5H3a3 3 0 003 3M19 5h2a3 3 0 01-3 3" />
    </svg>
  );
}

function Card({ officer, place, isFirst }) {
  const cfg = PODIUM[place];
  const op = topOpFor(officer);
  const opColor = op ? colorOf(op) : '#64748b';

  return (
    <div
      className={`relative panel-cinema p-6 transition-transform duration-500 ${cfg.order} ${cfg.elev} ${cfg.ring} before:content-[''] before:absolute before:-top-6 before:left-1/2 before:-translate-x-1/2 before:h-24 before:w-24 before:rounded-full before:blur-3xl before:opacity-60 ${cfg.glow}`}
    >
      {/* Top edge accent override */}
      <span
        className="absolute left-[15%] right-[15%] top-0 h-px rounded-full pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${cfg.accent}, transparent)`, opacity: isFirst ? 0.95 : 0.5 }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className={`relative inline-flex items-center justify-center h-14 w-14 rounded-xl font-mono font-bold text-xl ${cfg.badge} ${isFirst ? 'animate-glow-breath' : ''}`}>
          {cfg.rank}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="label" style={{ color: cfg.accent }}>{cfg.label}</span>
          <TrophyIcon className={`h-4 w-4 ${isFirst ? 'text-amber-400' : 'text-slate-400 dark:text-slate-500'}`} />
        </div>
      </div>

      <h3 className="mt-5 text-lg sm:text-xl font-semibold leading-tight tracking-tight truncate">
        {officer.name}
      </h3>
      <p className="text-[11px] font-mono text-slate-500 dark:text-slate-500 tracking-wider mt-0.5">
        SER · {officer.ser}
      </p>

      <div className="mt-4 flex items-baseline gap-2">
        <span className={`text-3xl sm:text-4xl font-mono font-bold tabular-nums leading-none tracking-tight ${isFirst ? 'gradient-num' : 'text-slate-900 dark:text-slate-50'}`}>
          {(officer.total_km || 0).toLocaleString()}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest">km</span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-mono tracking-wider">
        {officer.total_ops || 0} OPERATION{(officer.total_ops || 0) === 1 ? '' : 'S'}
      </p>

      {op && (
        <div className="mt-5 flex items-center gap-2.5 rounded-lg px-3 py-2 border border-white/[0.06] dark:bg-white/[0.03] bg-slate-50/80">
          <span
            className="h-2.5 w-2.5 rounded-sm shrink-0"
            style={{ background: opColor, boxShadow: `0 0 10px ${opColor}88` }}
          />
          <div className="min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Most active
            </p>
            <p className="text-sm font-mono font-semibold truncate" style={{ color: opColor }}>
              {op}
            </p>
          </div>
          <span className="ml-auto text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
            {(officer.ops?.[op]?.km || 0).toLocaleString()} km
          </span>
        </div>
      )}
    </div>
  );
}

export default function TopPerformers({ officers = [] }) {
  const top = officers
    .filter((o) => (o.total_km || 0) > 0)
    .slice()
    .sort((a, b) => (b.total_km || 0) - (a.total_km || 0))
    .slice(0, 3);

  if (top.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400/50" />
          <h2 className="text-sm font-semibold tracking-[0.22em] font-mono text-slate-700 dark:text-slate-200">
            TOP PERFORMERS
          </h2>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400/50" />
        </div>
        <span className="label">By total KM</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:items-end">
        {top.map((o, i) => (
          <Card key={o.ser} officer={o} place={i + 1} isFirst={i === 0} />
        ))}
      </div>
    </section>
  );
}
