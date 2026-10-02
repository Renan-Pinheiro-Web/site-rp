const { test, expect } = require('@playwright/test');

test.describe('Seção de FAQ', () => {

  test('seção existe com 8 perguntas', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#faq');
    await expect(section).toBeVisible();
    const items = page.locator('.faq-item');
    await expect(items).toHaveCount(8);
  });

  test('cada pergunta tem resposta não vazia', async ({ page }) => {
    await page.goto('/');
    const respostas = await page.locator('.faq-resposta').allTextContents();
    expect(respostas).toHaveLength(8);
    respostas.forEach(r => expect(r.trim().length).toBeGreaterThan(5));
  });

  test('perguntas sem informação confirmada marcam "a confirmar"', async ({ page }) => {
    await page.goto('/');
    const respostas = await page.locator('.faq-resposta').allTextContents();
    const pendentes = respostas.filter(r => r.includes('a confirmar'));
    expect(pendentes.length).toBeGreaterThanOrEqual(3);
  });

  test('não inventa prazo de entrega em dias nem valor mínimo', async ({ page }) => {
    await page.goto('/');
    const html = await page.content();
    expect(html).not.toMatch(/entrega em \d+ (dia|hora)/i);
    expect(html).not.toMatch(/pedido mínimo de R\$\s?\d/i);
  });

  test('accordion abre e fecha ao clicar, com aria-expanded correto', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const firstItem = page.locator('.faq-item').first();
    const btn = firstItem.locator('.faq-pergunta');

    expect(await firstItem.evaluate(el => el.classList.contains('open'))).toBe(false);
    expect(await btn.getAttribute('aria-expanded')).toBe('false');

    await btn.click();
    await page.waitForTimeout(350);
    expect(await firstItem.evaluate(el => el.classList.contains('open'))).toBe(true);
    expect(await btn.getAttribute('aria-expanded')).toBe('true');

    await btn.click();
    await page.waitForTimeout(350);
    expect(await firstItem.evaluate(el => el.classList.contains('open'))).toBe(false);
    expect(await btn.getAttribute('aria-expanded')).toBe('false');
  });

  test('transição anima via grid-template-rows (0fr → 1fr)', async ({ page }) => {
    await page.goto('/');
    const transition = await page.evaluate(() => {
      var wrap = document.querySelector('.faq-resposta-wrap');
      return getComputedStyle(wrap).transitionProperty;
    });
    expect(transition).toContain('grid-template-rows');

    const closedRows = await page.evaluate(() =>
      getComputedStyle(document.querySelector('.faq-resposta-wrap')).gridTemplateRows
    );
    expect(closedRows).toMatch(/^0px/);
  });

  test('prefers-reduced-motion: accordion abre sem transição', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const duration = await page.evaluate(() =>
      getComputedStyle(document.querySelector('.faq-resposta-wrap')).transitionDuration
    );
    expect(duration).toBe('0s');
  });

  test('abrir uma pergunta fecha qualquer outra aberta (só uma por vez)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const items = page.locator('.faq-item');
    const first = items.nth(0);
    const second = items.nth(1);

    await first.locator('.faq-pergunta').click();
    await page.waitForTimeout(350);
    expect(await first.evaluate(el => el.classList.contains('open'))).toBe(true);

    await second.locator('.faq-pergunta').click();
    await page.waitForTimeout(350);
    expect(await second.evaluate(el => el.classList.contains('open'))).toBe(true);
    expect(await first.evaluate(el => el.classList.contains('open'))).toBe(false);
    expect(await first.locator('.faq-pergunta').getAttribute('aria-expanded')).toBe('false');

    const openCount = await page.evaluate(() =>
      document.querySelectorAll('.faq-item.open').length
    );
    expect(openCount).toBe(1);
  });

  test('responsivo sem overflow em 375/768/1440', async ({ page }) => {
    for (const w of [375, 768, 1440]) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto('/');
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(w);
    }
  });
});
