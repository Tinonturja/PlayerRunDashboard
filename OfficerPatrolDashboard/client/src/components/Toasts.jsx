import { useUIStore } from '../store/uiStore';

const styles = {
  success: 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100',
  error:   'border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-900/40 dark:text-red-100',
  info:    'border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-800 dark:bg-sky-900/40 dark:text-sky-100',
};

const icons = {
  success: 'M5 13l4 4L19 7',
  error:   'M6 18L18 6M6 6l12 12',
  info:    'M13 16h-1v-4h-1m1-4h.01M12 19a7 7 0 100-14 7 7 0 000 14z',
};

export default function Toasts() {
  const toasts = useUIStore((s) => s.toasts);
  const dismiss = useUIStore((s) => s.dismissToast);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-[min(380px,90vw)]">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg animate-fade-in ${styles[t.kind] || styles.info}`}
        >
          <svg className="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d={icons[t.kind] || icons.info} />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{t.title}</p>
            {t.message && <p className="text-xs opacity-80 mt-0.5 break-words">{t.message}</p>}
          </div>
          <button onClick={() => dismiss(t.id)} className="shrink-0 opacity-60 hover:opacity-100" aria-label="Dismiss">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
