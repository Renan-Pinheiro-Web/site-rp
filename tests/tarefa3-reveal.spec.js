const { test, expect } = require('@playwright/test');

test.describe('Tarefa 3 — Reveal com stagger', () => {

  test('elementos .reveal recebem .visible ao entrar na viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    const heroReveals = await page.evaluate(() => {
      var els = document.querySelectorAll('.hero .reveal');
      return Array.from(els).every(el => el.classList.contains('visible'));
    });
    expect(heroReveals).toBe(true);
  });

  test('produtos grid tem stagger (transition-delay incremental)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });

    const delays = await page.evaluate(() => {
      var els = document.querySelectorAll('.grid-produtos .reveal');
      return Array.from(els).map(el => el.style.transitionDelay);
    });
    expect(delays.length).toBeGreaterThan(1);
    expect(delays[0]).toBe('0s');
    expect(delays[1]).toBe('0.1s');
    expect(delays[2]).toBe('0.2s');
  });

  test('reveal não re-dispara ao rolar cima/baixo', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(600);

    const visibleCount1 = await page.evaluate(() =>
      document.querySelectorAll('.reveal.visible').length
    );

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(400);

    const visibleCount2 = await page.evaluate(() =>
      document.querySelectorAll('.reveal.visible').length
    );
    expect(visibleCount2).toBeGreaterThanOrEqual(visibleCount1);
  });

  test('prefers-reduced-motion mostra tudo sem animação', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const allOpaque = await page.evaluate(() => {
      var els = document.querySelectorAll('.reveal');
      return Array.from(els).every(el => {
        var s = getComputedStyle(el);
        return s.opacity === '1';
      });
    });
    expect(allOpaque).toBe(true);
    const noTransition = await page.evaluate(() => {
      var el = document.querySelector('.reveal');
      return getComputedStyle(el).transitionDuration === '0s';
    });
    expect(noTransition).toBe(true);
  });

  test('stagger não aplicado com prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/', { waitUntil: 'networkidle' });

    const hasNoDelay = await page.evaluate(() => {
      var els = document.querySelectorAll('.grid-produtos .reveal');
      return Array.from(els).every(el => !el.style.transitionDelay || el.style.transitionDelay === '0s');
    });
    expect(hasNoDelay).toBe(true);
  });
});
