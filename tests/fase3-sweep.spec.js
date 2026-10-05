const { test, expect } = require('@playwright/test');

const DESTAQUES = [
  { slug:'yara-eau-de-parfum', name:'Yara', brand:'Lattafa', volume_label:'100ml',
    background_variant:'escuro', badge_tag:'Mais vendido', price:119.90, category:'árabe',
    short_description:'Floral.', fragrance_notes:['Baunilha'], site_product_images:[] },
  { slug:'asad', name:'Asad', brand:'Lattafa', volume_label:'100ml', background_variant:'claro',
    badge_tag:null, price:99.90, category:'árabe', short_description:'Amadeirado.',
    fragrance_notes:null, site_product_images:[] },
  { slug:'club', name:'Club', brand:'Armaf', volume_label:'105ml', background_variant:'creme',
    badge_tag:null, price:149.90, category:'árabe', short_description:'Cítrico.',
    fragrance_notes:null, site_product_images:[] },
];
const DET = Object.assign({}, DESTAQUES[0], { is_visible:true, full_description:'Completo.' });

async function route(page) {
  await page.route('**/rest/v1/site_products**', (r) => {
    const u = r.request().url();
    if (u.includes('is_featured=eq.true')) return r.fulfill({ status:200, contentType:'application/json', body: JSON.stringify(DESTAQUES) });
    if (u.includes('category=eq.') && u.includes('slug=neq.')) return r.fulfill({ status:200, contentType:'application/json', body: JSON.stringify(DESTAQUES.slice(1)) });
    if (u.includes('slug=eq.yara-eau-de-parfum')) return r.fulfill({ status:200, contentType:'application/json', body: JSON.stringify([DET]) });
    return r.fulfill({ status:200, contentType:'application/json', body: '[]' });
  });
}

const WIDTHS = [375, 768, 1024, 1440];
const PAGES = [['home', '/'], ['detalhe', '/produto/yara-eau-de-parfum']];

for (const [nome, url] of PAGES) {
  for (const w of WIDTHS) {
    test(`${nome} @ ${w}: sem overflow + console limpo`, async ({ page }) => {
      const errs = [];
      page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(`[${m.type()}] ${m.text()}`); });
      page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
      await route(page);
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto(url);
      await page.waitForSelector(nome === 'home' ? '#gridProdutos .produto' : '.pd-info h1');
      await page.waitForTimeout(300);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(sw, `overflow ${nome} ${w}`).toBeLessThanOrEqual(w);
      expect(errs, `console ${nome} ${w}`).toEqual([]);
    });
  }
}
