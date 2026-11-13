import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  let requested;
  const started = new Promise(resolve => { requested = resolve; });
  await page.route(/\/07(09|10|11)\.webp$/, async route => {
    requested();
    await new Promise(resolve => setTimeout(resolve, 2200));
    await route.continue().catch(() => {});
  });
  await page.goto(process.env.BASE_URL || 'http://localhost:3002', { waitUntil: 'networkidle' });
  await page.locator('#experience').evaluate(el => window.scrollTo(0, el.offsetTop + (el.offsetHeight - innerHeight) * (.035 + .93 * .46 * 710 / 792)));
  await started;
  assert.equal(await page.locator('.travelling-car').getAttribute('data-frame'), '0');
  assert.equal(await page.locator('#experience .film-narrative').getAttribute('data-story'), 'origin');
  await page.waitForFunction(() => {
    const c = document.querySelector('.travelling-car').dataset;
    return c.frameQuality === 'full' && Math.abs(Number(c.frame) - 710) <= 1 &&
      document.querySelector('#experience .film-narrative').dataset.story === 'doors';
  });
  console.log('PASS: hold the sharp preceding frame and its narrative until the new frame arrives');
} finally {
  await browser.close();
}
