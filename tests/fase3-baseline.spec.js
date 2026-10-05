const { test } = require('@playwright/test');

// Captura home ANTES da mudança para destaques dinâmicos (comparação pixel).
for (const w of [375, 1440]) {
  test(`baseline home ${w}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto('/');
    await page.waitForTimeout(400);
    // só a seção de produtos (destaques), que é o que muda
    await page.locator('#produtos').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.locator('#produtos').screenshot({ path: `test-results/baseline-produtos-${w}.png` });
  });
}
