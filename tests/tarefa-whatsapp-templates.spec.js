const { test, expect } = require('@playwright/test');

test.describe('Padronização de mensagens WhatsApp', () => {

  test('número correto em todas as ocorrências, nenhum placeholder antigo', async ({ page }) => {
    const response = await page.goto('/');
    const html = await response.text();
    expect(html).not.toContain('5585999999999');
    const matches = html.match(/wa\.me\/5588993668921/g);
    expect(matches.length).toBeGreaterThanOrEqual(13);
  });

  test('botões genéricos (nav, FAB, CTA final) usam mesma mensagem', async ({ page }) => {
    await page.goto('/');
    const navHref = await page.locator('.nav-wpp').getAttribute('href');
    const fabHref = await page.locator('.fab').getAttribute('href');
    const ctaFinalHref = await page.locator('.final-cta .cta--wpp').getAttribute('href');

    const extractText = (href) => decodeURIComponent(href.split('text=')[1]);
    const navMsg = extractText(navHref);
    const fabMsg = extractText(fabHref);
    const ctaMsg = extractText(ctaFinalHref);

    expect(navMsg).toBe(fabMsg);
    expect(fabMsg).toBe(ctaMsg);
    expect(navMsg).toContain('Vi o site da Essenza');
  });

  test('mensagens de catálogo completo (hero + produtos) são idênticas', async ({ page }) => {
    await page.goto('/');
    const heroHref = await page.locator('.hero-actions .cta--wpp').getAttribute('href');
    const catalogoHref = await page.locator('.section-cta .cta--wpp').getAttribute('href');

    const extractText = (href) => decodeURIComponent(href.split('text=')[1]);
    expect(extractText(heroHref)).toBe(extractText(catalogoHref));
    expect(extractText(heroHref)).toContain('catalogo completo');
  });

  test('mensagens de produto seguem template "Oi! Quero o {nome} {volume}"', async ({ page }) => {
    await page.goto('/');
    const produtoLinks = page.locator('.produto .cta--wpp');
    const count = await produtoLinks.count();
    expect(count).toBe(5);

    for (let i = 0; i < count; i++) {
      const href = await produtoLinks.nth(i).getAttribute('href');
      const text = decodeURIComponent(href.split('text=')[1]);
      expect(text).toMatch(/^Oi! Quero o .+/);
    }
  });

  test('mensagens de categoria seguem template "Oi! Quero ver os produtos da categoria {nome}"', async ({ page }) => {
    await page.goto('/');
    const catLinks = page.locator('.cat');
    const count = await catLinks.count();
    expect(count).toBe(3);

    for (let i = 0; i < count; i++) {
      const href = await catLinks.nth(i).getAttribute('href');
      const text = decodeURIComponent(href.split('text=')[1]);
      expect(text).toMatch(/^Oi! Quero ver os produtos da categoria .+/);
    }
  });

  test('nenhum link wa.me tem espaço, traço ou parênteses no número', async ({ page }) => {
    const response = await page.goto('/');
    const html = await response.text();
    const waLinks = html.match(/wa\.me\/[^"?]+/g) || [];
    expect(waLinks.length).toBeGreaterThan(0);
    waLinks.forEach(link => {
      const number = link.replace('wa.me/', '');
      expect(number).toMatch(/^\d+$/);
    });
  });
});
