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

  test('accordion abre e fecha ao clicar', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const firstItem = page.locator('.faq-item').first();
    const isOpenBefore = await firstItem.evaluate(el => el.hasAttribute('open'));
    expect(isOpenBefore).toBe(false);

    await firstItem.locator('.faq-pergunta').click();
    await page.waitForTimeout(200);
    const isOpenAfter = await firstItem.evaluate(el => el.hasAttribute('open'));
    expect(isOpenAfter).toBe(true);
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
