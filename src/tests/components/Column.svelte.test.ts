import { test, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Column from '$lib/components/Column.svelte';

const tasks = [
    { id: '1', title: 'Task One', status: 'todo' },
    { id: '2', title: 'Task Two', status: 'done' },
];

test('renders column title', () => {
    const { container } = render(Column, {
        col: 'todo',
        tasks,
        moveTask: () => { },
        draggingId: null,
        setDraggingId: () => { },
    });

    expect(container.querySelector('h2')?.textContent).toContain('todo');
});

test('shows only tasks with matching status', () => {
    const { container } = render(Column, {
        col: 'todo',
        tasks,
        moveTask: () => { },
        draggingId: null,
        setDraggingId: () => { },
    });

    expect(container.innerHTML).toContain('Task One');
    expect(container.innerHTML).not.toContain('Task Two');
});
