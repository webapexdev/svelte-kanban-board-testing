import { test, expect, vi } from 'vitest';
import { render, fireEvent } from 'vitest-browser-svelte';
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

    const saveBtnList = container.querySelectorAll('button');
    expect(saveBtnList[0].textContent).toContain('Upload Image'); // first button is file upload
    expect(saveBtnList[1].textContent).toContain('Save');
});

test('shows validation error if title is empty on submit', async () => {
    const { getByTestId, container } = render(TaskForm, { mode: 'new' });

    // Click Save button
    const saveBtn = getByTestId('save-btn');
    expect(saveBtn).toBeTruthy();

    // Trigger Svelte's click manually
    saveBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    // Now the error should appear
    expect(container.innerHTML).toContain('text-red-500');
});

test('renders cancel button in edit mode', () => {
    const { container } = render(TaskForm, { mode: 'edit', id: '123' });

    const cancelBtn = Array.from(container.querySelectorAll('button'))
        .find((btn) => btn.textContent?.includes('Cancel'));

    expect(cancelBtn).toBeTruthy();
});
