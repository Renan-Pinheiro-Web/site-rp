const { test, expect } = require('@playwright/test');

test.describe('Tarefa 2 — Scroll suave', () => {

  test('clicar link âncora rola suavemente até a seção', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const navLink = page.locator('.nav-links a[href="#produtos"]');
    await expect(navLink).toBeVisible();
    await navLink.click();

    await page.waitForFunction(() => window.scrollY > 100, null, { timeout: 3000 });
    const scrolledY = await page.evaluate(() => window.scrollY);
    expect(scrolledY).toBeGreaterThan(100);

    await page.waitForTimeout(1500);
    const endY = await page.evaluate(() => window.scrollY);
    const targetY = await page.evaluate(() => {
      var el = document.getElementById('produtos');
      return Math.round(el.getBoundingClientRect().top + window.scrollY - 64);
    });
    expect(Math.abs(endY - targetY)).toBeLessThan(5);
  });

  test('prefers-reduced-motion desabilita animações', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForTimeout(300);

    const noTransition = await page.evaluate(() => {
      var el = document.querySelector('.reveal');
      return getComputedStyle(el).transitionDuration === '0s';
    });
    expect(noTransition).toBe(true);
  });

  test('zero overflow horizontal em todas as larguras', async ({ page }) => {
    for (const w of [375, 768, 1024, 1440]) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto('/');
      await page.waitForTimeout(300);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(w);
    }
  });
});
