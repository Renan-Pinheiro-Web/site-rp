const { test, expect } = require('@playwright/test');

const DESTAQUES = [
  { slug:'yara-eau-de-parfum', name:'Yara Eau de Parfum', brand:'Lattafa', volume_label:'100ml',
    background_variant:'escuro', badge_tag:'Mais vendido', price:119.90, category:'árabe',
    short_description:'Floral adocicado.', fragrance_notes:['Baunilha'], site_product_images:[] },
  { slug:'asad-eau-de-parfum', name:'Asad Eau de Parfum', brand:'Lattafa', volume_label:'100ml',
    background_variant:'escuro', badge_tag:null, price:99.90, category:'árabe',
    short_description:'Amadeirado.', fragrance_notes:null, site_product_images:[] },
];
const DETALHE = {
  slug:'yara-eau-de-parfum', name:'Yara Eau de Parfum', brand:'Lattafa', volume_label:'100ml',
  background_variant:'escuro', price:119.90, category:'árabe', is_visible:true,
  full_description:'Floral adocicado completo.', fragrance_notes:['Baunilha'], site_product_images:[],
};

// Mock que respeita o filtro is_visible: só devolve o que a query pediu.
// Nunca devolvemos produto oculto -> prova que is_visible=false some do site.
async function route(page) {
  await page.route('**/rest/v1/site_products**', (r) => {
    const u = r.request().url();
    // a aplicação SEMPRE pede is_visible=eq.true; se faltar, é bug.
    expect(u).toContain('is_visible=eq.true');
    if (u.includes('is_featured=eq.true')) {
      return r.fulfill({ status:200, contentType:'application/json', body: JSON.stringify(DESTAQUES) });
    }
    if (u.includes('category=eq.') && u.includes('slug=neq.')) {
      return r.fulfill({ status:200, contentType:'application/json', body: JSON.stringify([DESTAQUES[1]]) });
    }
    if (u.includes('slug=eq.yara-eau-de-parfum')) {
      return r.fulfill({ status:200, contentType:'application/json', body: JSON.stringify([DETALHE]) });
    }
    return r.fulfill({ status:200, contentType:'application/json', body: '[]' });
  });
}

test('home: clicar no card leva pra página de detalhe', async ({ page }) => {
  await route(page);
  await page.goto('/');
  await page.waitForSelector('#gridProdutos .produto');
  // clica no card (não no link "Quero esse")
  await page.locator('#gridProdutos .produto').first().click();
  await page.waitForURL('**/produto/yara-eau-de-parfum');
  await expect(page.locator('.pd-info h1')).toHaveText('Yara Eau de Parfum');
});

test('detalhe: clicar num relacionado navega para outro produto', async ({ page }) => {
  await route(page);
  await page.goto('/produto/yara-eau-de-parfum');
  await page.waitForSelector('.pd-relacionados .produto');
  await page.locator('.pd-relacionados .produto').first().click();
  await page.waitForURL('**/produto/asad-eau-de-parfum');
});

test('a home SEMPRE filtra por is_visible=true (produto oculto nunca aparece)', async ({ page }) => {
  // Se algum fetch esquecer is_visible=eq.true, o expect dentro do route falha.
  let featuredQueried = false;
  await page.route('**/rest/v1/site_products**', (r) => {
    const u = r.request().url();
    expect(u, 'toda query do site filtra is_visible').toContain('is_visible=eq.true');
    if (u.includes('is_featured=eq.true')) featuredQueried = true;
    r.fulfill({ status:200, contentType:'application/json', body: '[]' });
  });
  await page.goto('/');
  await page.waitForTimeout(800);
  expect(featuredQueried).toBe(true);
  // grid vazio, mas seção não quebra
  await expect(page.locator('#gridProdutos .produto')).toHaveCount(0);
  await expect(page.locator('#produtos')).toBeVisible();
});
