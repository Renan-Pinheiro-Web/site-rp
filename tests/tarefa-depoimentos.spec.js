const { test, expect } = require('@playwright/test');

test.describe('Seção de depoimentos', () => {

  test('seção existe com 3 cards reais', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#depoimentos');
    await expect(section).toBeVisible();
    const cards = page.locator('.depoimento');
    await expect(cards).toHaveCount(3);
  });

  test('conteúdo não vazio em cada card', async ({ page }) => {
    await page.goto('/');
    const texts = await page.locator('.depoimento-texto').allTextContents();
    expect(texts).toHaveLength(3);
    texts.forEach(t => expect(t.trim().length).toBeGreaterThan(10));
  });

  test('nomes reais confirmados presentes, sem foto de cliente', async ({ page }) => {
    await page.goto('/');
    const autores = await page.locator('.depoimento-autor').allTextContents();
    expect(autores).toEqual(['Renato Pinheiro', 'Socorro Maia', 'Luan Rubens']);

    const hasImg = await page.evaluate(() =>
      document.querySelectorAll('.depoimento img').length
    );
    expect(hasImg).toBe(0);
  });

  test('cada depoimento cobre o tema correto (fidelização, custo-benefício, originalidade)', async ({ page }) => {
    await page.goto('/');
    const texts = await page.locator('.depoimento-texto').allTextContents();
    expect(texts[0].toLowerCase()).toMatch(/volt|sempre|perdi as contas/);
    expect(texts[1].toLowerCase()).toMatch(/preço|vale a pena|qualidade/);
    expect(texts[2].toLowerCase()).toMatch(/original|nota fiscal|falsificad|parecido/);
  });

  test('responsivo: 3 colunas desktop, 2 tablet, 1 mobile', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const colsDesktop = await page.evaluate(() =>
      getComputedStyle(document.querySelector('.depoimentos-grid')).gridTemplateColumns.split(' ').length
    );
    expect(colsDesktop).toBe(3);

    await page.setViewportSize({ width: 768, height: 900 });
    await page.reload();
    const colsTablet = await page.evaluate(() =>
      getComputedStyle(document.querySelector('.depoimentos-grid')).gridTemplateColumns.split(' ').length
    );
    expect(colsTablet).toBe(2);

    await page.setViewportSize({ width: 375, height: 900 });
    await page.reload();
    const colsMobile = await page.evaluate(() =>
      getComputedStyle(document.querySelector('.depoimentos-grid')).gridTemplateColumns.split(' ').length
    );
    expect(colsMobile).toBe(1);
  });

  test('screenshots em 375/768/1440px', async ({ page }) => {
    for (const w of [375, 768, 1440]) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.locator('#depoimentos').scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await page.locator('#depoimentos').screenshot({ path: `test-results/depoimentos-${w}px.png` });
    }
  });
});
