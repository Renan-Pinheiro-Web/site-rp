const { test, expect } = require('@playwright/test');

// Mock dos 5 destaques, idênticos aos cards hardcoded originais, para
// provar que catalog.js renderiza o MESMO visual sem depender do banco.
// Intercepta a chamada REST do Supabase e devolve os dados mock.
const MOCK = [
  { slug: 'yara-eau-de-parfum', name: 'Yara Eau de Parfum', brand: 'Lattafa',
    volume_label: '100ml', background_variant: 'escuro', badge_tag: 'Mais vendido',
    price: 119.90, is_visible: true, is_featured: true, display_order: 1,
    short_description: 'Floral adocicado que fica na pele o dia inteiro. O perfume árabe feminino mais pedido do Brasil — quem experimenta, repete.',
    fragrance_notes: ['Frutas tropicais', 'Baunilha', 'Almíscar'], site_product_images: [] },
  { slug: 'club-de-nuit-intense-man', name: 'Club de Nuit Intense Man', brand: 'Armaf',
    volume_label: '105ml', background_variant: 'claro', badge_tag: null,
    price: 149.90, is_visible: true, is_featured: true, display_order: 2,
    short_description: 'Amadeirado cítrico com projeção que ninguém ignora. Referência no Creed Aventus por uma fração do preço.',
    fragrance_notes: null, site_product_images: [] },
  { slug: 'asad-eau-de-parfum', name: 'Asad Eau de Parfum', brand: 'Lattafa',
    volume_label: '100ml', background_variant: 'escuro', badge_tag: null,
    price: 99.90, is_visible: true, is_featured: true, display_order: 3,
    short_description: 'Especiado amadeirado com fixação absurda. O favorito masculino de quem gosta de presença e elogios.',
    fragrance_notes: null, site_product_images: [] },
  { slug: 'hidratante-corporal-nivea', name: 'Hidratante corporal', brand: 'Nivea',
    volume_label: '400ml', background_variant: 'creme', badge_tag: null,
    price: 38.90, is_visible: true, is_featured: true, display_order: 4,
    short_description: 'Hidratação profunda que dura o dia todo mesmo no calor. A marca que todo mundo confia.',
    fragrance_notes: null, site_product_images: [] },
  { slug: 'creme-para-cachos-salon-line', name: 'Creme para cachos', brand: 'Salon Line',
    volume_label: '500ml', background_variant: 'claro', badge_tag: null,
    price: 32.90, is_visible: true, is_featured: true, display_order: 5,
    short_description: 'Definição e hidratação pra quem tem cachos. A marca que o Nordeste mais usa e aprova.',
    fragrance_notes: null, site_product_images: [] },
];

async function mockSupabase(page) {
  await page.route('**/rest/v1/site_products**', (route) => {
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK) });
  });
}

for (const w of [375, 1440]) {
  test(`cards dinâmicos render ${w}`, async ({ page }) => {
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));

    await mockSupabase(page);
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto('/');
    await page.waitForSelector('#gridProdutos .produto', { timeout: 5000 });

    // conta 5 cards, primeiro é destaque
    await expect(page.locator('#gridProdutos .produto')).toHaveCount(5);
    await expect(page.locator('#gridProdutos .produto').first()).toHaveClass(/produto--destaque/);

    // sem overflow horizontal
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(sw).toBeLessThanOrEqual(w);

    await page.locator('#produtos').scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.locator('#produtos').screenshot({ path: `test-results/dinamico-produtos-${w}.png` });

    expect(errors, 'console limpo').toEqual([]);
  });
}
