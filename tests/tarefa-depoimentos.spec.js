const { test, expect } = require('@playwright/test');

test.describe('Seção de depoimentos', () => {

  test('seção existe com 2 cards placeholder', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#depoimentos');
    await expect(section).toBeVisible();
    const cards = page.locator('.depoimento');
    await expect(cards).toHaveCount(2);
  });

  test('conteúdo não vazio em cada card', async ({ page }) => {
    await page.goto('/');
    const texts = await page.locator('.depoimento-texto').allTextContents();
    expect(texts).toHaveLength(2);
    texts.forEach(t => expect(t.trim().length).toBeGreaterThan(10));
  });

  test('não contém nome próprio inventado nem foto de cliente', async ({ page }) => {
    await page.goto('/');
    const autores = await page.locator('.depoimento-autor').allTextContents();
    autores.forEach(a => expect(a.toLowerCase()).toContain('espaço reservado'));

    const hasImg = await page.evaluate(() =>
      document.querySelectorAll('.depoimento img').length
    );
    expect(hasImg).toBe(0);
  });

  test('comentário HTML indica onde substituir por depoimentos reais', async ({ page }) => {
    const response = await page.goto('/');
    const html = await response.text();
    expect(html).toContain('PLACEHOLDER, SUBSTITUIR QUANDO HOUVER DEPOIMENTOS REAIS');
  });

  test('responsivo: 2 colunas desktop, 1 coluna mobile', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const colsDesktop = await page.evaluate(() =>
      getComputedStyle(document.querySelector('.depoimentos-grid')).gridTemplateColumns.split(' ').length
    );
    expect(colsDesktop).toBe(2);

    await page.setViewportSize({ width: 375, height: 900 });
    await page.reload();
    const colsMobile = await page.evaluate(() =>
      getComputedStyle(document.querySelector('.depoimentos-grid')).gridTemplateColumns.split(' ').length
    );
    expect(colsMobile).toBe(1);
  });
});
