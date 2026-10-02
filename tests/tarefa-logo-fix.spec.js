const { test, expect } = require('@playwright/test');

test.describe('Correção logo — ícone sobre fundo escuro, lockup completo claro', () => {

  test('arquivo logo sem fundo tem transparência real (não é card)', async ({ page }) => {
    // confirma que não há mais elemento de card/caixa ao redor da logo
    await page.goto('/');
    const cardExists = await page.evaluate(() =>
      !!document.querySelector('.logo-card') || !!document.querySelector('.footer-logo-card')
    );
    expect(cardExists).toBe(false);
  });

  test('nav não rolado mostra só ícone, nav rolado mostra lockup completo', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });

    const icon = page.locator('.logo-img--icon');
    const full = page.locator('.logo-img--full');

    await expect(icon).toBeVisible();
    await expect(full).toBeHidden();

    await page.evaluate(() => document.getElementById('nav').classList.add('scrolled'));
    await expect(full).toBeVisible();
    await expect(icon).toBeHidden();
  });

  test('footer usa ícone (sem texto), nome aparece no copyright', async ({ page }) => {
    await page.goto('/');
    const footerImg = page.locator('.footer-logo-img');
    await expect(footerImg).toBeVisible();
    const src = await footerImg.getAttribute('src');
    expect(src).toContain('icone');

    const copyright = await page.locator('.footer-bottom').textContent();
    expect(copyright).toContain('Essenza');
  });

  test('nenhuma caixa/retângulo de fundo visível atrás da logo', async ({ page }) => {
    await page.goto('/');
    const navBg = await page.evaluate(() => {
      var icon = document.querySelector('.logo-img--icon');
      return getComputedStyle(icon.parentElement).backgroundColor;
    });
    // .logo (pai direto) não deve ter background sólido diferente do nav
    expect(navBg).toMatch(/rgba\(0, 0, 0, 0\)|transparent/);
  });
});
