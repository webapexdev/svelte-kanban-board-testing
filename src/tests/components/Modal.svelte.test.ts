import { test, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Modal from '$lib/components/Modal.svelte';

test('renders modal with title when open', () => {
    const { container } = render(Modal, {
        open: true,
        title: 'My Modal',
        onClose: () => { },
    });

    expect(container.innerHTML).toContain('My Modal');
    expect(container.querySelector('h2')).toBeTruthy();
});

test('does not render modal when closed', () => {
    const { container } = render(Modal, { open: false, onClose: () => { } });

    expect(container.innerHTML).not.toContain('My Modal');
});
