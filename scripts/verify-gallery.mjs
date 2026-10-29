import { chromium, webkit } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const base = process.env.BASE_URL || 'http://localhost:3002';
const out = 'analysis/gallery';
await fs.mkdir(out, { recursive: true });
const results = [];
for (const engine of [chromium, webkit]) {
  const browser = await engine.launch();
  for (const [name, width, height, reducedMotion] of [['desktop', 1440, 1000, 'no-preference'], ['tablet', 834, 1194, 'no-preference'], ['phone', 390, 844, 'no-preference'], ['small-reduced', 360, 740, 'reduce']]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base, { waitUntil: 'networkidle' });
    const gallery = page.locator('.car-gallery');
    const panels = gallery.getByRole('button');
    await gallery.scrollIntoViewIfNeeded();
    assert.equal(await panels.count(), 8);
    const originalHeight = await gallery.evaluate(e => e.offsetHeight);
    for (let i = 0; i < 8; i++) {
      await panels.nth(i).click();
      await page.waitForTimeout(reducedMotion === 'reduce' ? 50 : 800);
      assert.equal(await gallery.locator('[aria-pressed="true"]').count(), 1);
      assert.equal(await panels.nth(i).getAttribute('aria-pressed'), 'true');
      await panels.nth(i).locator('img').evaluate(img => img.decode());
      const geometry = await panels.nth(i).evaluate(e => {
        const img = e.querySelector('img');
        const text = e.querySelector('.gallery-caption-copy');
        return { w: e.offsetWidth, h: e.offsetHeight, imageWidth: img.naturalWidth, colour: getComputedStyle(img).filter, textFits: text.scrollWidth <= text.clientWidth + 1 };
      });
      assert(geometry.imageWidth > 0, 'Responsive image must decode');
      assert.equal(geometry.colour, 'grayscale(0)');
      assert(geometry.textFits, 'Caption must fit');
      assert(width < 768 ? geometry.h >= 280 : geometry.w > 300, 'Selected panel must expand');
      assert(Math.abs(await gallery.evaluate(e => e.offsetHeight) - originalHeight) < 2, 'Selection must preserve section/dock height');
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'No horizontal overflow');
    }
    await panels.nth(7).press('Home');
    assert.equal(await panels.nth(0).getAttribute('aria-pressed'), 'true');
    await panels.nth(0).press('ArrowRight');
    assert.equal(await panels.nth(1).getAttribute('aria-pressed'), 'true');
    assert(await panels.nth(1).evaluate(e => document.activeElement === e));
    await panels.nth(1).press('End');
    await panels.nth(7).press('ArrowRight');
    assert.equal(await panels.nth(0).getAttribute('aria-pressed'), 'true');
    await panels.nth(4).focus();
    await page.keyboard.press('Space');
    assert.equal(await panels.nth(4).getAttribute('aria-pressed'), 'true');
    if (reducedMotion === 'reduce') assert.equal(await panels.nth(4).evaluate(e => getComputedStyle(e).transitionDuration), '0s');
    await panels.nth(0).click();
    await page.waitForTimeout(850);
    await gallery.scrollIntoViewIfNeeded();
    await gallery.screenshot({ path: `${out}/${engine.name()}-${name}.png` });
    const axe = await new AxeBuilder({ page }).include('.car-gallery').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    assert.deepEqual(axe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.failureSummary) })), []);
    assert.deepEqual(errors, []);
    results.push({ engine: engine.name(), name, passed: true });
    console.log(`${engine.name()} ${name}: gallery passed`);
    await context.close();
  }
  await browser.close();
}
await fs.writeFile(`${out}/report.json`, JSON.stringify({ base, results }, null, 2));
