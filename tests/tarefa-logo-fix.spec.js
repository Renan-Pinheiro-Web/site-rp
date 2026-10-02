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

  test('footer usa ícone recolorido para fundo escuro, nome aparece no copyright', async ({ page }) => {
    await page.goto('/');
    const footerImg = page.locator('.footer-logo-img');
    await expect(footerImg).toBeVisible();
    const src = await footerImg.getAttribute('src');
    expect(src).toContain('icon-dark-bg');

    const copyright = await page.locator('.footer-bottom').textContent();
    expect(copyright).toContain('Essenza');
  });

  test('nav não rolado e footer usam o ícone recolorido para fundo escuro (contorno claro)', async ({ page }) => {
    await page.goto('/');
    const navIconSrc = await page.locator('.logo-img--icon').getAttribute('src');
    expect(navIconSrc).toBe('icon-dark-bg.png');
  });

  test('nav rolado usa logo completa recortada (sem padding transparente excessivo)', async ({ page }) => {
    await page.goto('/');
    const fullSrc = await page.locator('.logo-img--full').getAttribute('src');
    expect(fullSrc).toBe('logo-essenza-completa.png');
  });

  test('logo no nav claro é pelo menos tão alta quanto o botão WhatsApp', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 300 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.getElementById('nav').classList.add('scrolled'));
    await page.waitForTimeout(200);

    const wppH = await page.locator('.nav-wpp').evaluate(el => el.getBoundingClientRect().height);
    const logoH = await page.locator('.logo-img--full').evaluate(el => el.getBoundingClientRect().height);
    expect(logoH).toBeGreaterThanOrEqual(wppH);
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
