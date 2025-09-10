// tests/e2e/page.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('renders dashboard title', async ({ page }) => {
        await expect(page.locator('h1')).toHaveText('Dashboard');
    });

    test('shows Add Task, List, and Kanban buttons', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'Add Task' })).toBeVisible();
        await expect(page.getByRole('button', { name: '' })).toHaveCount(2);
        // the other two buttons only have icons, not labels
    });

    test('switches between list and kanban view', async ({ page }) => {
        // start in list view
        await expect(page.locator('text=Status:')).toBeVisible();

        // click Kanban button (red one)
        const kanbanButton = page.locator('button', { has: page.locator('svg') }).nth(2);
        await kanbanButton.click();

        // expect kanban columns
        await expect(page.locator('h2', { hasText: 'todo' })).toBeVisible();
        await expect(page.locator('h2', { hasText: 'in progress' })).toBeVisible();
        await expect(page.locator('h2', { hasText: 'done' })).toBeVisible();
    });
});
