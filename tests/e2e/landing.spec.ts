import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should display hero heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Write once. Distribute everywhere.' })).toBeVisible();
  });

  test('should display privacy indicator', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Your data stays in your browser')).toBeVisible();
  });

  test('should navigate to app page when clicking Open App', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Open App' }).click();
    await expect(page).toHaveURL('/app');
  });

  test('should navigate to app page when clicking Try Demo', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Try Demo' }).click();
    // The Try Demo button dispatches a custom event and navigates
    await page.waitForURL('/app');
  });
});
