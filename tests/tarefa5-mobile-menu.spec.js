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

  test('clicar link no menu fecha overlay antes do scroll começar (sem corrida)', async ({ page }) => {
    await page.click('#burger');
    await page.waitForTimeout(400);

    // click link and immediately capture menu-open state across the next frames
    await page.click('.nav-links a[href="#produtos"]');

    // body.menu-open must be gone essentially immediately (closeMenu runs
    // synchronously in the click handler, before the rAF-deferred scroll)
    const menuOpenRightAfterClick = await page.evaluate(() =>
      document.body.classList.contains('menu-open')
    );
    expect(menuOpenRightAfterClick).toBe(false);

    await page.waitForTimeout(1200);
    const scrolled = await page.evaluate(() => window.scrollY);
    expect(scrolled).toBeGreaterThan(100);
  });

  test('scroll após fechar menu não gagueja no início (sem salto de velocidade)', async ({ page }) => {
    await page.click('#burger');
    await page.waitForTimeout(400);
    await page.click('.nav-links a[href="#produtos"]');

    // sample scrollY across several animation frames right after the click
    const samples = await page.evaluate(() => {
      return new Promise(resolve => {
        var vals = [];
        var n = 0;
        function step(){
          vals.push(window.scrollY);
          n++;
          if(n < 15){ requestAnimationFrame(step); }
          else { resolve(vals); }
        }
        requestAnimationFrame(step);
      });
    });

    // compute frame-to-frame deltas; the first real movement should not be
    // a tiny stutter followed by a much larger jump (sign of the race)
    const deltas = [];
    for (let i = 1; i < samples.length; i++) deltas.push(samples[i] - samples[i-1]);
    const movingDeltas = deltas.filter(d => d > 0.01);
    expect(movingDeltas.length).toBeGreaterThan(0);
    // no delta should be more than ~15x the first moving delta (that pattern
    // would indicate a stuck-then-catches-up stutter)
    const firstMoving = movingDeltas[0];
    const maxDelta = Math.max(...movingDeltas);
    expect(maxDelta).toBeLessThan(firstMoving * 20 + 5);
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
