import { test, expect, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import TaskCard from '$lib/components/TaskCard.svelte';
import type { Task } from '$lib/types/types';

const mockTask: Task = {
    id: '1',
    title: 'My Task',
    description: 'Do something important',
    status: 'todo'
};

test('renders task title and description', () => {
    const { getByText } = render(TaskCard, {
        props: {
            task: mockTask,
            setDraggingId: vi.fn()
        }
    });

    expect(getByText('My Task')).toBeTruthy();
    expect(getByText('Do something important')).toBeTruthy();
});

test('calls setDraggingId on dragstart', () => {
    const setDraggingId = vi.fn();

    const { container } = render(TaskCard, {
        props: {
            task: mockTask,
            setDraggingId
        }
    });

    const card = container.querySelector('div');
    expect(card).toBeTruthy();

    card!.dispatchEvent(new Event('dragstart'));
    expect(setDraggingId).toHaveBeenCalledWith(mockTask.id);
});

test('calls setDraggingId(null) on dragend', () => {
    const setDraggingId = vi.fn();

    const { container } = render(TaskCard, {
        props: {
            task: mockTask,
            setDraggingId
        }
    });

    const card = container.querySelector('div');
    expect(card).toBeTruthy();

    card!.dispatchEvent(new Event('dragend'));
    expect(setDraggingId).toHaveBeenCalledWith(null);
});
