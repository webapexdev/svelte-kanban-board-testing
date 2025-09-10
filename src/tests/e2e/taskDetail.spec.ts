// tests/e2e/task-detail.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Task Detail Page', () => {
    test.beforeEach(async ({ page }) => {
        // Assuming a task with ID 1 exists in your backend/db
        await page.goto('/task/1');
    });

    test('renders task details', async ({ page }) => {
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Go to Dashboard' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
    });

    test('toggles edit mode', async ({ page }) => {
        await page.getByRole('button', { name: 'Edit' }).click();
        await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
        await page.getByRole('button', { name: 'Cancel' }).click();
        await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
    });

    test('shows delete confirmation modal', async ({ page }) => {
        await page.getByRole('button', { name: 'Delete' }).click();
        await expect(page.getByText('Confirm Delete')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Yes, Delete' })).toBeVisible();
        await page.getByRole('button', { name: 'Cancel' }).click();
        await expect(page.getByText('Confirm Delete')).not.toBeVisible();
    });

    test('navigates back to Dashboard', async ({ page }) => {
        await page.getByRole('button', { name: 'Go to Dashboard' }).click();
        await expect(page.locator('h1')).toHaveText('Dashboard');
    });
});
