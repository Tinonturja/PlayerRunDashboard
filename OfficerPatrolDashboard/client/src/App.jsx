import { useEffect } from 'react';
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
      <span className="hidden sm:inline">Theme</span>
    </button>
  );
}

function Header({ hasData }) {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 grid place-items-center shadow-md shadow-emerald-900/20">
            <span className="font-mono font-bold text-white">OP</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-semibold tracking-tight truncate">
              Officers Patrol Summary Dashboard
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-mono">BANBATT-9 · UNMISS</span>
              {hasData && (
                <>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="live-dot" />
                    <span>Live</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}

function EmptyState({ hint }) {
  return (
    <div className="panel p-10 text-center">
      <div className="mx-auto h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 grid place-items-center">
        <svg className="h-6 w-6 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6h13M9 5h13M3 5h.01M3 11h.01M3 17h.01" />
        </svg>
      </div>
      <h3 className="mt-4 text-base font-semibold">No data loaded yet</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {hint || 'Upload a patrol .xlsx workbook above to populate the dashboard.'}
      </p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="panel p-6 border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100">
      <p className="text-sm font-semibold">Couldn't load data</p>
      <p className="text-xs mt-1 opacity-80">{message}</p>
    </div>
  );
}

export default function App() {
  // Hydrate theme on mount based on store value (handles 'system' updates if user changed OS theme)
  const setTheme = useUIStore((s) => s.setTheme);
  const theme = useUIStore((s) => s.theme);
  useEffect(() => { setTheme(theme); /* re-apply class on first render */ }, []); // eslint-disable-line

  const { data, isLoading, isError, error } = usePatrolData();

  const officers = data?.officers ?? [];
  const meta = data ? { uploadedAt: data.uploadedAt, originalName: data.originalName, size: data.size } : null;
  const hasData = officers.length > 0;

  return (
    <div className="min-h-screen">
      <Header hasData={hasData} />

      <main className="max-w-7xl mx-auto px-5 py-6 flex flex-col gap-5">
        <UploadPanel meta={meta} />

        {isLoading && (
          <div className="panel p-10 text-center text-sm text-slate-500 dark:text-slate-400">
            Loading patrol data…
          </div>
        )}

        {isError && !data && (
          <ErrorState message={error?.message || 'Unable to fetch /api/data'} />
        )}

        {!isLoading && !hasData && !isError && (
          <EmptyState />
        )}

        {hasData && (
          <>
            <StatCards officers={officers} />
            <TopPerformers officers={officers} />
            <FilterBar />
            <OfficerTable officers={officers} />
            <OperationChart officers={officers} />
          </>
        )}

        <footer className="text-center text-xs text-slate-400 dark:text-slate-500 pt-4">
          <span className="font-mono">officer-patrol-dashboard</span> · self-hosted · no database — just the latest .xlsx on disk
        </footer>
      </main>

      <Toasts />
    </div>
  );
}
