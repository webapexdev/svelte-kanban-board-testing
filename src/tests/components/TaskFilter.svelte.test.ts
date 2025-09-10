import { test, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import TaskFilter from '$lib/components/TaskFilter.svelte';

test('renders status select and search input', () => {
    const { container } = render(TaskFilter, { status: '', q: '' });

    const select = container.querySelector('select');
    const input = container.querySelector('input[type="text"]');

    expect(select).toBeTruthy();
    expect(input).toBeTruthy();
});

test('shows all status options', () => {
    const { container } = render(TaskFilter);

    const options = Array.from(container.querySelectorAll('option')).map(
        (opt) => opt.textContent
    );

    expect(options).toContain('All');
    expect(options).toContain('Todo');
    expect(options).toContain('In Progress');
    expect(options).toContain('Done');
});
