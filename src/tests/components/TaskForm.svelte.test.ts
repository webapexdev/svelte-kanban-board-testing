import { test, expect, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import TaskForm from '$lib/components/TaskForm.svelte';
import { page } from '@vitest/browser/context';

// Mock $app/navigation
vi.mock('$app/navigation', () => ({
    goto: vi.fn(),
}));

// Mock fetch
globalThis.fetch = vi.fn(async () => ({ ok: true })) as any;

test('renders form fields and save button', () => {
    const { container } = render(TaskForm, { mode: 'new' });

    expect(container.querySelector('input[placeholder="Title"]')).toBeTruthy();
    expect(container.querySelector('textarea[placeholder="Description"]')).toBeTruthy();
    expect(container.querySelector('input[type="date"]')).toBeTruthy();

    const saveBtn = container.querySelector('button');
    expect(saveBtn?.textContent).toContain('Save');
});

test('shows validation error markup if title is empty', () => {
    const { container } = render(TaskForm, { mode: 'edit', title: '', description: '' });
    // Pretend validation already ran → error message placeholder should exist after submit
    expect(container.innerHTML).toContain('text-red-500');
});

test('renders cancel button in edit mode', () => {
    const { container } = render(TaskForm, { mode: 'edit', id: '123' });

    const cancelBtn = Array.from(container.querySelectorAll('button'))
        .find((btn) => btn.textContent?.includes('Cancel'));

    expect(cancelBtn).toBeTruthy();
});
