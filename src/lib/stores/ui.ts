// UI states (loading, modals, etc.)
import { writable } from "svelte/store";
import type { ViewMode } from '$lib/types/types';

export const globalLoading = writable(false);
export const globalError = writable<string | null>(null);

// For modals, dialogs, etc.
export const modal = writable<{ open: boolean; type?: string; payload?: any }>({
    open: false
});

/**
 * `true` = loading active
 * `false` = loading finished
 */
export const loading = writable(false);

/**
 * Optional helper to wrap async calls:
 * await withLoading(fetchTasks())
 */
export async function withLoading<T>(promise: Promise<T>) {
    loading.set(true);
    try {
        const result = await promise;
        return result;
    } finally {
        loading.set(false);
    }
}

// Default is "list"
const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('viewMode') : null;

export const viewMode = writable<ViewMode>((saved as ViewMode) || 'list');

// Persist changes in localStorage
viewMode.subscribe((val) => {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('viewMode', val);
    }
});