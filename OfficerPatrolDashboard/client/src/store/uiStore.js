import { create } from 'zustand';
import { OP_TYPES } from '../lib/colors';

// All UI-only state lives here. Server state lives in React Query.
export const useUIStore = create((set, get) => ({
  // Theme — persisted to localStorage
  theme: (typeof window !== 'undefined' && localStorage.getItem('opd.theme')) || 'system',
  setTheme: (theme) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
      root.classList.toggle('dark', isDark);
      localStorage.setItem('opd.theme', theme);
    }
    set({ theme });
  },
  toggleTheme: () => {
    const root = document.documentElement;
    const next = root.classList.contains('dark') ? 'light' : 'dark';
    get().setTheme(next);
  },

  // Search & filters
  search: '',
  setSearch: (search) => set({ search }),

  // Set of active op-type filters; empty Set means "show all ops"
  enabledOps: new Set(OP_TYPES),
  toggleOp: (op) => set((s) => {
    const next = new Set(s.enabledOps);
    next.has(op) ? next.delete(op) : next.add(op);
    return { enabledOps: next };
  }),
  resetOps: () => set({ enabledOps: new Set(OP_TYPES) }),

  showInactive: false,
  setShowInactive: (showInactive) => set({ showInactive }),

  // Row expand/collapse — stores officer ser numbers
  expanded: new Set(),
  toggleExpanded: (ser) => set((s) => {
    const next = new Set(s.expanded);
    next.has(ser) ? next.delete(ser) : next.add(ser);
    return { expanded: next };
  }),
  collapseAll: () => set({ expanded: new Set() }),

  // Operation chart metric: 'km' | 'count'
  opChartMetric: 'km',
  setOpChartMetric: (opChartMetric) => set({ opChartMetric }),

  // Toasts
  toasts: [],
  pushToast: (toast) => {
    const id = Math.random().toString(36).slice(2, 9);
    set((s) => ({ toasts: [...s.toasts, { id, ...toast }] }));
    const ttl = toast.ttl ?? 3500;
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, ttl);
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
