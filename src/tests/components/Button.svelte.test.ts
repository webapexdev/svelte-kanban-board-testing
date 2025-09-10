import { test, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Button from '$lib/components/Button.svelte';

test('renders with the correct label', async () => {
    const { getByRole } = render(Button, { label: 'Click Me', color: 'blue' });

    const btn = getByRole('button');
    await expect(btn).toHaveTextContent('Click Me');
});

test('applies the correct color classes', async () => {
    const { getByRole } = render(Button, { label: 'Save', color: 'green' });

    const btn = getByRole('button');
    await expect(btn).toHaveClass(/bg-green-500/);
    await expect(btn).toHaveClass(/hover:bg-green-600/);
});