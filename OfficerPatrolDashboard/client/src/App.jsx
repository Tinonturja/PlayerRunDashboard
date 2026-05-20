import { useEffect, useState } from 'react';
import { useUIStore } from './store/uiStore';
import { usePatrolData } from './hooks/usePatrolData';

import UploadPanel from './components/UploadPanel';
import StatCards from './components/StatCards';
import TopPerformers from './components/TopPerformers';
import FilterBar from './components/FilterBar';
import OfficerTable from './components/OfficerTable';
import OperationChart from './components/OperationChart';
import Toasts from './components/Toasts';

function ThemeToggle() {
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  return (
    <button onClick={toggleTheme} className="btn" aria-label="Toggle theme">
      <svg className="h-4 w-4 hidden dark:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.36-6.36l-.7.7M6.34 17.66l-.7.7m12.72 0l-.7-.7M6.34 6.34l-.7-.7M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <svg className="h-4 w-4 dark:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
      </svg>
    </button>
  );
}

function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const utc = now.toISOString().slice(11, 19);
  const date = now.toISOString().slice(0, 10);
  return (
    <div className="hidden md:flex items-center gap-3 text-[11px] font-mono">
      <div className="flex flex-col items-end leading-tight">
        <span className="text-slate-400 dark:text-slate-500 tracking-[0.2em]">UTC</span>
        <span className="text-emerald-300 tabular-nums">{utc}</span>
      </div>
      <div className="h-7 w-px bg-white/[0.08]" />
      <div className="flex flex-col items-end leading-tight">
        <span className="text-slate-400 dark:text-slate-500 tracking-[0.2em]">DATE</span>
        <span className="text-slate-200 tabular-nums">{date}</span>
      </div>
    </div>
  );
}

function HeroLogo() {
  return (
    <div className="relative h-12 w-12 shrink-0">
      {/* Soft outer glow */}
      <span className="absolute inset-0 rounded-xl blur-xl bg-emerald-500/40 dark:bg-emerald-500/30" />
      {/* Rotating gradient ring */}
      <span
        className="absolute -inset-[2px] rounded-[14px] opacity-70 animate-spin-slow"
        style={{
          background:
            'conic-gradient(from 0deg, rgba(16,185,129,0.6), rgba(6,182,212,0.6), rgba(132,204,22,0.6), rgba(16,185,129,0.6))',
        }}
      />
      {/* Solid badge */}
      <span className="relative h-12 w-12 rounded-xl grid place-items-center bg-gradient-to-br from-emerald-500 to-emerald-700 ring-1 ring-emerald-300/30 shadow-[0_8px_24px_-6px_rgba(16,185,129,0.6)]">
        <span className="font-mono font-bold text-white text-lg tracking-tight">OP</span>
      </span>
    </div>
  );
}

function Header({ hasData, officerCount }) {
  return (
    <header className="relative border-b border-slate-200 dark:border-white/[0.06] bg-white/70 dark:bg-ink-950/70 backdrop-blur-md sticky top-0 z-30">
      {/* Animated scan line */}
      <div className="scan-line hidden dark:block" aria-hidden />
      <div className="relative max-w-7xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <HeroLogo />
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-semibold tracking-tight truncate">
              Officers Patrol Summary
              <span className="hidden sm:inline text-slate-400 dark:text-slate-500 font-normal"> Dashboard</span>
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
              <span className="font-mono tracking-wider">BANBATT-9</span>
              <span aria-hidden className="opacity-50">·</span>
              <span className="font-mono">UNMISS</span>
              {hasData && (
                <>
                  <span aria-hidden className="opacity-50">·</span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 dark:text-emerald-300">
                    <span className="live-dot" />
                    <span className="font-mono tracking-[0.2em] text-[10px]">LIVE · {officerCount} OFFICERS</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LiveClock />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function EmptyState() {
  return (
    <div className="panel-cinema p-12 text-center animate-rise">
      <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 grid place-items-center ring-1 ring-emerald-500/20">
        <svg className="h-8 w-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6h13M9 5h13M3 5h.01M3 11h.01M3 17h.01" />
        </svg>
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">Awaiting first transmission</h3>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
        Drop a patrol .xlsx workbook above to bring this dashboard online. Data parses live; no database required.
      </p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="panel-cinema p-6 border-rose-300 dark:border-rose-900 animate-fade-in">
      <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">Couldn't load data</p>
      <p className="text-xs mt-1 text-rose-600/90 dark:text-rose-300/80">{message}</p>
    </div>
  );
}

function Loading() {
  return (
    <div className="panel-cinema p-12 text-center text-sm text-slate-500 dark:text-slate-400">
      <div className="inline-flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-soft" />
        <span className="font-mono tracking-[0.2em] text-[11px] text-emerald-300">SYNCING</span>
      </div>
      <p className="mt-3">Reading the latest patrol workbook…</p>
    </div>
  );
}

export default function App() {
  // Re-apply persisted theme on mount in case it was changed in another tab
  const setTheme = useUIStore((s) => s.setTheme);
  const theme = useUIStore((s) => s.theme);
  useEffect(() => { setTheme(theme); }, []); // eslint-disable-line

  const { data, isLoading, isError, error } = usePatrolData();

  const officers = data?.officers ?? [];
  const meta = data ? { uploadedAt: data.uploadedAt, originalName: data.originalName, size: data.size } : null;
  const hasData = officers.length > 0;

  return (
    <div className="cinematic-bg min-h-screen">
      <Header hasData={hasData} officerCount={officers.length} />

      <main className="relative max-w-7xl mx-auto px-5 py-8 flex flex-col gap-6 z-10">
        <UploadPanel meta={meta} />

        {isLoading && <Loading />}
        {isError && !data && <ErrorState message={error?.message || 'Unable to fetch /api/data'} />}
        {!isLoading && !hasData && !isError && <EmptyState />}

        {hasData && (
          <div className="flex flex-col gap-6 stagger">
            <StatCards officers={officers} />
            <TopPerformers officers={officers} />
            <FilterBar />
            <OfficerTable officers={officers} />
            <OperationChart officers={officers} />
          </div>
        )}

        <footer className="text-center text-[11px] text-slate-400 dark:text-slate-500 pt-4 font-mono tracking-[0.18em]">
          OFFICER · PATROL · DASHBOARD &nbsp;·&nbsp; SELF HOSTED &nbsp;·&nbsp; NO DATABASE
        </footer>
      </main>

      <Toasts />
    </div>
  );
}
