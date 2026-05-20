import CountUp from './CountUp';

const ICONS = {
  users: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 014-4h0m4-6a4 4 0 11-8 0 4 4 0 018 0zm6 0a4 4 0 11-8 0 4 4 0 018 0z" />
  ),
  pulse: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4l3-9 4 18 3-9h4" />
  ),
  road: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 21l4-18M19 21l-4-18M9 9h6M9 14h6M9 19h6" />
  ),
  ops: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
};

function Sparkline({ color }) {
  // A subtle 1px gradient line under each card — gives a "tracker" feel.
  return (
    <div
      className="mt-4 h-px rounded-full opacity-60"
      style={{
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      }}
    />
  );
}

function Card({ icon, label, value, hint, accent, glowClass, delay = 0 }) {
  return (
    <div
      className={`panel-cinema p-5 sm:p-6 group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:${glowClass}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Accent corner gradient */}
      <span
        className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full opacity-20 blur-2xl"
        style={{ background: accent }}
      />
      <div className="relative flex items-start justify-between">
        <span className="label">{label}</span>
        <span
          className="h-9 w-9 rounded-lg grid place-items-center ring-1"
          style={{
            background: `${accent}1A`, // 10% alpha
            color: accent,
            borderColor: 'transparent',
            boxShadow: `inset 0 0 0 1px ${accent}33`,
          }}
        >
          <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 18, height: 18 }}>
            {icon}
          </svg>
        </span>
      </div>

      <p className="mt-4 text-4xl sm:text-5xl gradient-num font-mono font-bold tabular-nums leading-none tracking-tight">
        <CountUp value={value} duration={900} />
      </p>

      {hint && (
        <p className="mt-2.5 text-[11px] font-mono tracking-wider text-slate-500 dark:text-slate-400 uppercase">
          {hint}
        </p>
      )}

      <Sparkline color={accent} />
    </div>
  );
}

export default function StatCards({ officers = [] }) {
  const total = officers.length;
  const active = officers.filter((o) => (o.total_km || 0) > 0).length;
  const totalKm = officers.reduce((s, o) => s + (o.total_km || 0), 0);
  const totalOps = officers.reduce((s, o) => s + (o.total_ops || 0), 0);

  const activePct = total ? Math.round((active / total) * 100) : 0;
  const avgKm = active ? Math.round(totalKm / active) : 0;

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        icon={ICONS.users}
        label="Total Officers"
        value={total}
        hint="Across the roster"
        accent="#1D9E75"
        glowClass="shadow-glow-emerald"
      />
      <Card
        icon={ICONS.pulse}
        label="Active Officers"
        value={active}
        hint={total ? `${activePct}% of roster · live` : null}
        accent="#1AACBF"
        glowClass="shadow-glow-cyan"
      />
      <Card
        icon={ICONS.road}
        label="Total KM Covered"
        value={totalKm}
        hint={active ? `~${avgKm.toLocaleString()} km / active officer` : null}
        accent="#378ADD"
        glowClass="shadow-glow-cyan"
      />
      <Card
        icon={ICONS.ops}
        label="Total Operations"
        value={totalOps}
        hint={total ? `${(totalOps / Math.max(1, active)).toFixed(1)} avg per active` : null}
        accent="#D85A30"
        glowClass="shadow-glow-amber"
      />
    </section>
  );
}
