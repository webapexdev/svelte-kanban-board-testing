// tests/e2e/new-task.spec.ts
import { test, expect } from '@playwright/test';

test.describe('New Task Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/task/new');
    });

    test('renders title and form', async ({ page }) => {
        await expect(page.locator('h1')).toHaveText('New Task');
        await expect(page.getByPlaceholder('Title')).toBeVisible();
        await expect(page.getByPlaceholder('Description')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
    });

    test('navigates back to Dashboard', async ({ page }) => {
        await page.getByRole('button', { name: 'Go to Dashboard' }).click();
        await expect(page.locator('h1')).toHaveText('Dashboard');
    });
});
