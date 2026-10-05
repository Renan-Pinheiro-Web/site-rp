const { test, expect } = require('@playwright/test');

const YARA = {
  slug:'yara-eau-de-parfum', name:'Yara Eau de Parfum', brand:'Lattafa',
  volume_label:'100ml', background_variant:'escuro', badge_tag:'Mais vendido',
  price:119.90, category:'árabe', is_visible:true,
  short_description:'Floral adocicado de alta fixação.',
  full_description:'Floral adocicado que fica na pele o dia inteiro. O perfume árabe feminino mais pedido do Brasil.',
  fragrance_notes:['Frutas tropicais','Baunilha','Almíscar'],
  site_product_images:[
    { image_url:'https://via.placeholder.com/600/2C2420/ffffff?text=1', display_order:1 },
    { image_url:'https://via.placeholder.com/600/C4956A/ffffff?text=2', display_order:2 },
  ],
};
const RELACIONADOS = [
  { slug:'asad-eau-de-parfum', name:'Asad Eau de Parfum', brand:'Lattafa', price:99.90, background_variant:'escuro', site_product_images:[] },
  { slug:'club-de-nuit', name:'Club de Nuit Intense Man', brand:'Armaf', price:149.90, background_variant:'claro', site_product_images:[] },
];

// Roteia as queries do Supabase conforme o que a URL pede.
async function routeOK(page) {
  await page.route('**/rest/v1/site_products**', (route) => {
    const u = route.request().url();
    // query de relacionados (tem category=eq e slug=neq)
    if (u.includes('category=eq.') && u.includes('slug=neq.')) {
      return route.fulfill({ status:200, contentType:'application/json', body: JSON.stringify(RELACIONADOS) });
    }
    // produto por slug
    if (u.includes('slug=eq.yara-eau-de-parfum')) {
      return route.fulfill({ status:200, contentType:'application/json', body: JSON.stringify([YARA]) });
    }
    // qualquer outro slug -> vazio
    return route.fulfill({ status:200, contentType:'application/json', body: '[]' });
  });
  // bloqueia o placeholder externo pra não depender de rede
  await page.route('**/via.placeholder.com/**', (route) =>
    route.fulfill({ status:200, contentType:'image/png', body: Buffer.from('') }));
}

test('detalhe: produto válido com galeria, info, relacionados', async ({ page }) => {
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));

  await routeOK(page);
  await page.goto('/produto/yara-eau-de-parfum');
  await page.waitForSelector('.pd-info h1');

  await expect(page.locator('.pd-info h1')).toHaveText('Yara Eau de Parfum');
  await expect(page.locator('.pd-preco')).toContainText('119,90');
  await expect(page.locator('.pd-info .produto-marca')).toHaveText('Lattafa');
  await expect(page.locator('.pd-info .produto-notas span')).toHaveCount(3);
  // galeria: 2 thumbs
  await expect(page.locator('.pd-thumb')).toHaveCount(2);
  // WhatsApp no padrão "Oi! Quero o {nome}"
  const wpp = await page.locator('.pd-info a.cta--wpp').getAttribute('href');
  expect(decodeURIComponent(wpp)).toContain('Oi! Quero o Yara Eau de Parfum');
  // relacionados
  await page.waitForSelector('.pd-relacionados .produto');
  await expect(page.locator('.pd-relacionados .produto')).toHaveCount(2);
  // título dinâmico
  await expect(page).toHaveTitle(/Yara Eau de Parfum — Essenza/);

  expect(errors).toEqual([]);
});

test('detalhe: produto inexistente -> mensagem amigável, sem quebrar', async ({ page }) => {
  await routeOK(page);
  await page.goto('/produto/nao-existe');
  await page.waitForSelector('.pd-erro');
  await expect(page.locator('.pd-erro h1')).toHaveText('Produto não encontrado');
  await expect(page).toHaveTitle(/não encontrado/);
});

test('detalhe: zero overflow horizontal 375 e 1440', async ({ page }) => {
  await routeOK(page);
  for (const w of [375, 1440]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto('/produto/yara-eau-de-parfum');
    await page.waitForSelector('.pd-info h1');
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(sw, `overflow em ${w}`).toBeLessThanOrEqual(w);
    await page.screenshot({ path: `test-results/detalhe-${w}.png`, fullPage: true });
  }
});
