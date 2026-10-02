const { test, expect } = require('@playwright/test');

test.describe('Tarefa 1 — Nome e logo Essenza', () => {

  test('nenhuma menção a "Sua Marca" em todo o HTML', async ({ page }) => {
    await page.goto('/');
    const html = await page.content();
    expect(html).not.toContain('Sua Marca');
  });

  test('title contém "Essenza"', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title).toContain('Essenza');
  });

  test('nav tem logo com imagem (ícone sobre hero, lockup completo ao rolar)', async ({ page }) => {
    await page.goto('/');
    const icon = page.locator('.logo-img--icon');
    await expect(icon).toBeVisible();
    const iconSrc = await icon.getAttribute('src');
    expect(iconSrc).toContain('icon-dark-bg');

    const full = page.locator('.logo-img--full');
    await expect(full).toBeHidden();

    await page.evaluate(() => document.getElementById('nav').classList.add('scrolled'));
    await expect(full).toBeVisible();
    await expect(icon).toBeHidden();
  });

  test('footer tem logo com imagem', async ({ page }) => {
    await page.goto('/');
    const img = page.locator('.footer-logo-img');
    await expect(img).toBeVisible();
  });

  test('favicon não é emoji ✨', async ({ page }) => {
    await page.goto('/');
    const favicon = await page.locator('link[rel="icon"]').getAttribute('href');
    expect(favicon).not.toContain('✨');
  });

  test('JSON-LD Store name é Essenza', async ({ page }) => {
    await page.goto('/');
    const ld = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(ld);
    expect(data.name).toBe('Essenza');
  });

  test('og:site_name é Essenza', async ({ page }) => {
    await page.goto('/');
    const ogSiteName = await page.locator('meta[property="og:site_name"]').getAttribute('content');
    expect(ogSiteName).toBe('Essenza');
  });

  test('screenshots 375px, 768px, 1440px', async ({ page }) => {
    for (const w of [375, 768, 1440]) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto('/');
      await page.waitForTimeout(500);
      await page.screenshot({ path: `test-results/tarefa1-${w}px.png`, fullPage: true });
    }
  });
});
