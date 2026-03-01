import { test, expect } from '@playwright/test';

test.describe('App Page', () => {
  test('should display input panel with textarea', async ({ page }) => {
    await page.goto('/app');
    await expect(page.locator('textarea')).toBeVisible();
  });

  test('should display platform tabs', async ({ page }) => {
    await page.goto('/app');
    await expect(page.getByRole('button', { name: /Twitter/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /LinkedIn/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Reddit/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Substack/ })).toBeVisible();
  });

  test('should load sample post when clicking Try Sample Post', async ({ page }) => {
    await page.goto('/app');
    await page.getByRole('button', { name: 'Try Sample Post' }).click();
    const textarea = page.locator('textarea');
    await expect(textarea).not.toBeEmpty();
    const value = await textarea.inputValue();
    expect(value).toContain('Building a Real-Time Collaborative Editor');
  });

  test('should toggle theme when clicking theme toggle', async ({ page }) => {
    await page.goto('/app');
    const html = page.locator('html');
    const initialClass = await html.getAttribute('class');
    await page.getByRole('button', { name: /Switch to/ }).click();
    const newClass = await html.getAttribute('class');
    expect(newClass).not.toBe(initialClass);
  });

  test('should display privacy indicator in header', async ({ page }) => {
    await page.goto('/app');
    await expect(page.getByText('Your data stays in your browser')).toBeVisible();
  });

  test('should load demo output when clicking Try Sample Post', async ({ page }) => {
    await page.goto('/app');
    await page.getByRole('button', { name: 'Try Sample Post' }).click();
    await expect(page.getByText('Demo Mode — Pre-generated output')).toBeVisible();
    await expect(page.getByText('Ever wondered how Google Docs handles simultaneous edits without conflicts?').first()).toBeVisible();
  });

  test('should switch between platform tabs', async ({ page }) => {
    await page.goto('/app');
    await page.getByRole('button', { name: 'Try Sample Post' }).click();
    await page.getByRole('button', { name: /LinkedIn/ }).click();
    await expect(page.getByText('Building a Real-Time Collaborative Editor with CRDTs').first()).toBeVisible();
  });
});
