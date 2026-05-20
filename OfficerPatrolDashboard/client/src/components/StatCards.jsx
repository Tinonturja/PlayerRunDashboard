import CountUp from './CountUp';

function Card({ label, value, hint, accent }) {
  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between">
        <span className="label">{label}</span>
        {accent && <span className="h-2 w-2 rounded-full" style={{ background: accent }} />}
      </div>
      <p className="mt-2 text-3xl stat-num leading-none">
        <CountUp value={value} />
      </p>
      {hint && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  );
}

export default function StatCards({ officers = [] }) {
  const total = officers.length;
  const active = officers.filter((o) => (o.total_km || 0) > 0).length;
  const totalKm = officers.reduce((s, o) => s + (o.total_km || 0), 0);
  const totalOps = officers.reduce((s, o) => s + (o.total_ops || 0), 0);

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card label="Total Officers" value={total} accent="#1D9E75" />
      <Card label="Active Officers" value={active} hint={total ? `${Math.round((active / total) * 100)}% of roster active` : null} accent="#1AACBF" />
      <Card label="Total KM Covered" value={totalKm} accent="#378ADD" />
      <Card label="Total Operations" value={totalOps} accent="#D85A30" />
    </section>
  );
}
