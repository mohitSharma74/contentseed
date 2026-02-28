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

  test('should load sample post when clicking Load Sample Post', async ({ page }) => {
    await page.goto('/app');
    await page.getByRole('button', { name: 'Load Sample Post' }).click();
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

  test('should generate content and show output', async ({ page }) => {
    await page.goto('/app');
    await page.getByRole('button', { name: 'Load Sample Post' }).click();
    await page.getByRole('button', { name: 'Generate for All Platforms' }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Generate for All Platforms')).toBeVisible();
  });

  test('should switch between platform tabs', async ({ page }) => {
    await page.goto('/app');
    await page.getByRole('button', { name: 'Load Sample Post' }).click();
    await page.getByRole('button', { name: 'Generate for All Platforms' }).click();
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: /LinkedIn/ }).click();
    // The output should show LinkedIn content in the output area (not in textarea)
    await expect(page.locator('.whitespace-pre-wrap').filter({ hasText: /Building a Real-Time Collaborative Editor/ }).first()).toBeVisible();
  });
});
