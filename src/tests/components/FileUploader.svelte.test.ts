import { test, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import FileUploader from '$lib/components/FileUploader.svelte';

test('renders upload button', () => {
    const { container } = render(FileUploader);

    const btn = container.querySelector('button');
    expect(btn).toBeTruthy();
    expect(btn?.textContent).toContain('Upload Image');
});
