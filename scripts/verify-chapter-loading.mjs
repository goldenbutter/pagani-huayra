import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.route(/\/07(09|10|11)\.webp$/, async route => {
    await new Promise(resolve => setTimeout(resolve, 2200));
    await route.continue().catch(() => {});
  });
  await page.goto(process.env.BASE_URL || 'http://localhost:3002', { waitUntil: 'networkidle' });
  await page.locator('#experience').evaluate(el => window.scrollTo(0, el.offsetTop + (el.offsetHeight - innerHeight) * (.035 + .93 * .46 * 710 / 792)));
  for (const quality of ['preview', 'full']) {
    await page.waitForFunction(quality => {
      const c = document.querySelector('.travelling-car').dataset;
      return c.frameQuality === quality && Math.abs(Number(c.frame) - 710) <= (quality === 'preview' ? 4 : 1);
    }, quality);
    assert.equal(await page.locator('#experience .film-narrative').getAttribute('data-story'), 'doors');
  }
  console.log('PASS: preview and full-resolution doors frames match the narrative without another scroll');
} finally {
  await browser.close();
}
