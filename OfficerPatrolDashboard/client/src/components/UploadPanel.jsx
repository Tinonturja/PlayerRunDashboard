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
    if (!file) return;
    setPending(file);
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
    upload.mutate(pending, {
      onSettled: () => setPending(null),
    });
  };

  return (
    <section className="panel-soft">
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between px-5 py-3 text-left"
        aria-expanded={!collapsed}
      >
        <div className="flex items-center gap-3">
          <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
          </svg>
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Upload Patrol Workbook</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {meta?.originalName ? (
                <>
                  <span className="font-mono">{meta.originalName}</span>
                  <span className="mx-1.5 opacity-50">·</span>
                  {formatBytes(meta.size)}
                  {ago && (
                    <>
                      <span className="mx-1.5 opacity-50">·</span>
                      Last updated {ago}
                    </>
                  )}
                </>
              ) : (
                'Drop a .xlsx file to load the dashboard'
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
        <div className="border-t border-slate-200 dark:border-slate-800 p-5 animate-slide-down">
          <div
            {...getRootProps()}
            className={`relative rounded-xl border-2 border-dashed p-6 transition-colors text-center
              ${isDragActive ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40'}
              ${isDragReject ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : ''}
            `}
          >
            <input {...getInputProps()} />
            <svg className="mx-auto h-10 w-10 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V8a4 4 0 014-4h2a4 4 0 014 4v8m-9 4h6a4 4 0 004-4v-1H4v1a4 4 0 004 4z" />
            </svg>
            <p className="mt-3 text-sm font-medium">
              {isDragActive ? 'Drop the file to upload' : 'Drag & drop your .xlsx here'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">or</p>
            <button type="button" onClick={open} className="btn mt-2">
              Browse files
            </button>

            {pending && (
              <div className="mt-5 inline-flex items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2">
                <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
                </svg>
                <span className="text-xs font-mono">{pending.name}</span>
                <span className="text-xs text-slate-500">{formatBytes(pending.size)}</span>
                <button onClick={() => setPending(null)} className="text-xs text-slate-400 hover:text-red-500" aria-label="Remove">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Only <span className="font-mono">.xlsx</span> files are accepted. Uploading replaces the current dataset.
            </p>
            <button
              onClick={startUpload}
              disabled={!pending || upload.isPending}
              className="btn-primary"
            >
              {upload.isPending ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                  Uploading…
                </>
              ) : (
                <>Upload</>
              )}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
