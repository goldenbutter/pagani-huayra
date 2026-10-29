import { chromium, webkit } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const out = 'analysis/editorial'; await fs.mkdir(out, { recursive: true });
const report = [];
for (const engine of [chromium, webkit]) {
  const browser = await engine.launch();
  for (const [name, width, height] of [['monitor', 1920, 1080], ['laptop', 1440, 900], ['compact', 1280, 800], ['tablet', 834, 1194], ['phone', 390, 844], ['small', 360, 740]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(process.env.BASE_URL || 'http://localhost:3002', { waitUntil: 'networkidle' });
    for (const id of ['top', 'story', 'design', 'specs']) {
      await page.locator(`#${id}`).evaluate(e => scrollTo(0, Math.max(0, e.offsetTop - 78)));
      await page.waitForTimeout(900);
      const result = await page.locator(`#${id}`).evaluate(e => {
        const size = selector => { const el = e.querySelector(selector); return el ? parseFloat(getComputedStyle(el).fontSize) : null; };
        const clipped = [...e.querySelectorAll('p,dt,dd,.eyebrow,.round-link,.hero-invitation>span,summary')].filter(n => n.scrollWidth > n.clientWidth + 1).map(n => n.className || n.tagName);
        const foot = e.querySelector('.hero-foot'), baseline = e.querySelector('.hero-baseline');
        const copy = e.querySelector('.travel-copy'), bottom = e.querySelector('.travel-bottom');
        return { clipped, overflow: document.documentElement.scrollWidth > innerWidth + 1,
          units: size('.red-specs dd span'), material: size('.material-inline>.eyebrow'), body: size('.travel-copy p'), invitation: size('.hero-invitation>span'),
          heroClear: !foot || foot.getBoundingClientRect().bottom < baseline.getBoundingClientRect().top,
          copyClear: !bottom || copy.getBoundingClientRect().bottom < bottom.getBoundingClientRect().top,
        };
      });
      assert.deepEqual(result.clipped, [], `${name}/${id} text clips`);
      assert(!result.overflow); assert(result.heroClear, `${name} hero footer collides`); assert(result.copyClear, `${name}/${id} copy collides with section footer`);
      if (id === 'top') assert(result.invitation >= (width < 768 ? 18 : 22));
      if (id === 'design') { assert(result.material >= 14); assert(result.body >= (width < 768 ? 20 : width <= 1100 ? 22 : 24)); }
      if (id === 'specs') assert(result.units >= 14);
      await page.screenshot({ path: `${out}/${engine.name()}-${name}-${id}.png` });
    }
    await page.locator('.technical-details summary').click();
    assert(await page.locator('.technical-details').getAttribute('open') !== null);
    assert(await page.evaluate(() => document.querySelector('.technical-details').getBoundingClientRect().bottom < document.querySelector('#craftsmanship').getBoundingClientRect().top));
    await page.locator('.finale-bottom').scrollIntoViewIfNeeded();
    const closing = await page.locator('.finale-bottom').evaluate(e => {
      const links = [...e.querySelectorAll('a')];
      return links.map(a => ({ size: parseFloat(getComputedStyle(a).fontSize), clipped: a.scrollWidth > a.clientWidth + 1 }));
    });
    assert(closing.every(a => a.size >= (width < 768 ? 10 : 12) && !a.clipped));
    await page.screenshot({ path: `${out}/${engine.name()}-${name}-closing.png` });
    await page.locator('.footer').scrollIntoViewIfNeeded();
    const footer = await page.locator('.footer').evaluate(e => ({
      caption: parseFloat(getComputedStyle(e.querySelector('.footer-main .eyebrow')).fontSize),
      back: parseFloat(getComputedStyle(e.querySelector('.back-top')).fontSize),
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
    }));
    assert(footer.caption >= 14 && footer.back >= (width < 768 ? 10 : 12) && !footer.overflow);
    await page.screenshot({ path: `${out}/${engine.name()}-${name}-footer.png` });
    report.push({ engine: engine.name(), name, passed: true }); console.log('PASS editorial', engine.name(), name); await page.close();
  }
  await browser.close();
}
await fs.writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
