const { test, expect } = require('@playwright/test');

test.describe('Tarefa 4 — Seção de confiança redesenhada', () => {

  test('seção trust tem 4 itens com ícones', async ({ page }) => {
    await page.goto('/');
    const items = page.locator('.trust-item');
    await expect(items).toHaveCount(4);

    const icons = page.locator('.trust-icon svg');
    await expect(icons).toHaveCount(4);
  });

  test('cada item tem título e descrição', async ({ page }) => {
    await page.goto('/');
    const titles = page.locator('.trust-title');
    await expect(titles).toHaveCount(4);
    const descs = page.locator('.trust-desc');
    await expect(descs).toHaveCount(4);
  });

  test('layout grid 4 colunas em desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const cols = await page.evaluate(() => {
      var grid = document.querySelector('.trust-grid');
      return getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    });
    expect(cols).toBe(4);
  });

  test('layout grid 2 colunas em mobile 768px', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 });
    await page.goto('/');
    const cols = await page.evaluate(() => {
      var grid = document.querySelector('.trust-grid');
      return getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    });
    expect(cols).toBe(2);
  });

  test('ícones SVG têm aria-hidden', async ({ page }) => {
    await page.goto('/');
    const allHidden = await page.evaluate(() => {
      var icons = document.querySelectorAll('.trust-icon');
      return Array.from(icons).every(el => el.getAttribute('aria-hidden') === 'true');
    });
    expect(allHidden).toBe(true);
  });

  test('screenshots trust section em 375px e 1440px', async ({ page }) => {
    for (const w of [375, 1440]) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto('/');
      await page.waitForTimeout(500);
      const trust = page.locator('.trust');
      await trust.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await page.screenshot({ path: `test-results/tarefa4-trust-${w}px.png`, fullPage: false });
    }
  });
});
