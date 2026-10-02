const { test, expect } = require('@playwright/test');

test.describe('Tarefa 6 — Caça a bugs visuais', () => {

  test('zero overflow horizontal em todas as larguras', async ({ page }) => {
    for (const w of [320, 375, 414, 768, 1024, 1440]) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto('/');
      await page.waitForTimeout(300);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth, `overflow at ${w}px`).toBeLessThanOrEqual(w);
    }
  });

  test('console limpo (zero erros e warnings)', async ({ page }) => {
    const messages = [];
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') messages.push(msg.text());
    });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    const realErrors = messages.filter(m => !m.includes('favicon') && !m.includes('third-party'));
    expect(realErrors).toHaveLength(0);
  });

  test('screenshots full-page 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/tarefa6-fullpage-375.png', fullPage: true });
  });

  test('screenshots full-page 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/tarefa6-fullpage-1440.png', fullPage: true });
  });

  test('screenshots full-page 320px (smallest)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/tarefa6-fullpage-320.png', fullPage: true });
  });
});
