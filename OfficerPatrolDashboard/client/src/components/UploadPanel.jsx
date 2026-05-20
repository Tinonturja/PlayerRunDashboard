import { useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadPatrol } from '../hooks/usePatrolData';

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function timeAgo(iso) {
  if (!iso) return null;
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 0) return 'just now';
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} minute${m === 1 ? '' : 's'} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d === 1 ? '' : 's'} ago`;
}

export default function UploadPanel({ meta }) {
  const [collapsed, setCollapsed] = useState(false);
  const [pending, setPending] = useState(null);
  const upload = useUploadPatrol();

  const onDrop = (files) => {
    const file = files?.[0];
    if (file) setPending(file);
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject, open } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    noClick: true,
    noKeyboard: true,
  });

  const ago = useMemo(() => timeAgo(meta?.uploadedAt), [meta?.uploadedAt]);

  const startUpload = () => {
    if (!pending) return;
    upload.mutate(pending, { onSettled: () => setPending(null) });
  };

  return (
    <section className="panel-cinema overflow-hidden">
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
        aria-expanded={!collapsed}
      >
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/30 grid place-items-center">
            <svg className="h-5 w-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
            </svg>
            <span className="absolute inset-0 rounded-lg blur-md bg-emerald-500/15" aria-hidden />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-[0.18em] font-mono text-slate-700 dark:text-slate-200">
              UPLOAD · WORKBOOK
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {meta?.originalName ? (
                <>
                  <span className="font-mono text-slate-400 dark:text-slate-300">{meta.originalName}</span>
                  <span className="mx-1.5 opacity-50">·</span>
                  {formatBytes(meta.size)}
                  {ago && (
                    <>
                      <span className="mx-1.5 opacity-50">·</span>
                      <span className="text-emerald-400/90">Last updated {ago}</span>
                    </>
                  )}
                </>
              ) : (
                'Drop a .xlsx file to bring this dashboard online'
              )}
            </p>
          </div>
        </div>
        <svg
          className={`h-4 w-4 text-slate-400 transition-transform ${collapsed ? '' : 'rotate-180'}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {!collapsed && (
        <div className="border-t border-slate-200 dark:border-white/[0.06] p-5 sm:p-6 animate-slide-down">
          <div
            {...getRootProps()}
            className={`relative rounded-2xl border-2 border-dashed p-8 transition-all text-center
              ${isDragActive
                ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_0_1px_rgba(16,185,129,0.4),0_0_60px_rgba(16,185,129,0.25)]'
                : 'border-slate-300 dark:border-white/10 bg-slate-50/40 dark:bg-white/[0.015]'}
              ${isDragReject ? 'border-rose-400 bg-rose-500/10' : ''}
            `}
          >
            {/* Faint corner accents */}
            <span className="absolute top-2 left-2 h-3 w-3 border-l-2 border-t-2 border-emerald-500/30 rounded-tl-md" />
            <span className="absolute top-2 right-2 h-3 w-3 border-r-2 border-t-2 border-emerald-500/30 rounded-tr-md" />
            <span className="absolute bottom-2 left-2 h-3 w-3 border-l-2 border-b-2 border-emerald-500/30 rounded-bl-md" />
            <span className="absolute bottom-2 right-2 h-3 w-3 border-r-2 border-b-2 border-emerald-500/30 rounded-br-md" />

            <input {...getInputProps()} />
            <div className="mx-auto h-14 w-14 rounded-2xl bg-emerald-500/10 grid place-items-center ring-1 ring-emerald-500/30">
              <svg className="h-7 w-7 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V8a4 4 0 014-4h2a4 4 0 014 4v8m-9 4h6a4 4 0 004-4v-1H4v1a4 4 0 004 4z" />
              </svg>
            </div>
            <p className="mt-4 text-sm font-medium">
              {isDragActive ? 'Drop the file to upload' : 'Drag & drop your .xlsx workbook here'}
            </p>
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-slate-500 dark:text-slate-500 mt-1.5">
              · OR ·
            </p>
            <button type="button" onClick={open} className="btn mt-3">
              Browse files
            </button>

            {pending && (
              <div className="mt-5 inline-flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2">
                <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
                </svg>
                <span className="text-xs font-mono text-slate-200">{pending.name}</span>
                <span className="text-xs text-slate-500">{formatBytes(pending.size)}</span>
                <button onClick={() => setPending(null)} className="text-xs text-slate-400 hover:text-rose-400" aria-label="Remove">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Only <span className="font-mono text-slate-400 dark:text-slate-300">.xlsx</span> files are accepted. Uploading replaces the current dataset.
            </p>
            <button onClick={startUpload} disabled={!pending || upload.isPending} className="btn-primary">
              {upload.isPending ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                  Uploading…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Deploy Workbook
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
