const { test, expect } = require('@playwright/test');

test.describe('Tarefa 5 — Menu mobile fullscreen', () => {

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
  });

  test('menu abre como fullscreen overlay', async ({ page }) => {
    await page.screenshot({ path: 'test-results/tarefa5-menu-closed.png' });

    await page.click('#burger');
    await page.waitForTimeout(400);

    await page.screenshot({ path: 'test-results/tarefa5-menu-open.png' });

    const menuStyles = await page.evaluate(() => {
      var menu = document.getElementById('navMenu');
      var s = getComputedStyle(menu);
      return { position: s.position, visibility: s.visibility, opacity: s.opacity };
    });
    expect(menuStyles.position).toBe('fixed');
    expect(menuStyles.visibility).toBe('visible');
    expect(menuStyles.opacity).toBe('1');
  });

  test('body scroll trava quando menu aberto', async ({ page }) => {
    await page.click('#burger');
    await page.waitForTimeout(300);

    const overflow = await page.evaluate(() => getComputedStyle(document.body).overflow);
    expect(overflow).toBe('hidden');
  });

  test('body scroll destrava quando menu fecha', async ({ page }) => {
    await page.click('#burger');
    await page.waitForTimeout(300);
    await page.click('#burger');
    await page.waitForTimeout(300);

    const hasMenuOpen = await page.evaluate(() => document.body.classList.contains('menu-open'));
    expect(hasMenuOpen).toBe(false);
  });

  test('menu fecha ao clicar link', async ({ page }) => {
    await page.click('#burger');
    await page.waitForTimeout(300);

    await page.click('.nav-links a[href="#produtos"]');
    await page.waitForTimeout(500);

    const isOpen = await page.evaluate(() =>
      document.getElementById('navMenu').classList.contains('open')
    );
    expect(isOpen).toBe(false);
  });

  test('ícone hamburger vira X quando aberto', async ({ page }) => {
    await page.click('#burger');
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'test-results/tarefa5-x-icon.png' });

    const isActive = await page.evaluate(() =>
      document.getElementById('burger').classList.contains('active')
    );
    expect(isActive).toBe(true);
  });

  test('console sem erros', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.click('#burger');
    await page.waitForTimeout(300);
    await page.click('#burger');
    await page.waitForTimeout(300);
    expect(errors).toHaveLength(0);
  });
});
