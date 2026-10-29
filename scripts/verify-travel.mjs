import { chromium, webkit } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const out = 'analysis/travel';
await fs.mkdir(out, { recursive: true });
const report = [];
for (const engine of [chromium, webkit]) {
  const browser = await engine.launch();
  for (const [name, width, height] of [['monitor', 1920, 1080], ['wide-browser', 1864, 1010], ['desktop', 1440, 1000], ['laptop', 1280, 800], ['phone', 390, 844], ['small-phone', 360, 740]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto(process.env.BASE_URL || 'http://localhost:3002', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.documentElement.dataset.studioReady === 'true');
    const keys = await page.evaluate(() => {
      const result = {};
      for (const e of document.querySelectorAll('[data-car-slot]')) {
        const section = e.closest('section'), id = e.dataset.carSlot;
        result[id] = { start: id === 'hero' ? 0 : section.offsetTop - (section.dataset.film ? 0 : 78), end: section.dataset.film ? section.offsetTop + section.offsetHeight - innerHeight : section.offsetTop - 78 };
      }
      return result;
    });
    const seek = async (y) => {
      await page.evaluate(y => scrollTo(0, y), y);
      await page.waitForTimeout(50);
      await page.waitForFunction(() => { const c = document.querySelector('.travelling-car'); return c.dataset.frame === c.dataset.targetFrame; });
      const sample = await page.locator('.travelling-car').evaluate(e => {
        const c = e.getContext('2d'), strip = Math.max(1, Math.floor(e.width / innerWidth * 8));
        // Inspect actual canvas alpha at both screen edges, not just DOM overflow.
        const left = c.getImageData(0, 0, strip, e.height).data;
        const right = c.getImageData(e.width - strip, 0, strip, e.height).data;
        let clipped = false;
        for (let i = 3; i < left.length; i += 4) if (left[i] > 200 || right[i] > 200) { clipped = true; break; }
        return { frame: Number(e.dataset.frame), scene: e.dataset.scene, matteMs: Number(e.dataset.matteMs), clipped, left: Number(e.dataset.left), right: Number(e.dataset.right) };
      });
      assert(!sample.clipped, `${name}: opaque car pixels touch the screen edge`);
      assert(sample.left >= 11 && sample.right <= width - 11, `${name}: rotated frame exceeds safe bounds`);
      return sample;
    };
    const samples = [];
    for (const [from, to] of [['hero', 'explore'], ['explore', 'story'], ['story', 'design'], ['design', 'anatomy'], ['anatomy', 'specs'], ['specs', 'craft'], ['craft', 'finale']]) {
      const sequence = [];
      for (const t of [.02, .15, .5, .85, .98]) {
        const y = keys[from].end + (keys[to].start - keys[from].end) * t;
        const sample = await seek(y);
        assert.equal(sample.scene, 'travel');
        assert(sample.frame <= 552, 'Travelling car must stay closed');
        sequence.push(sample.frame); samples.push(sample);
        if (t === .5) await page.screenshot({ path: `${out}/${engine.name()}-${name}-${from}-${to}.png` });
      }
      assert(new Set(sequence).size > 1, `${from}/${to} must change viewpoint`);
      const reverse = await seek(keys[from].end + (keys[to].start - keys[from].end) * .5);
      assert.equal(reverse.frame, sequence[2], 'Reverse scrolling must restore the same view');
    }
    for (const id of ['explore', 'anatomy']) {
      const start = await seek(keys[id].start + 1), end = await seek(keys[id].end - 1);
      assert.equal(start.frame, 0); assert.equal(end.frame, 0);
    }
    await seek(keys.specs.start);
    const matte = await page.locator('canvas').first().evaluate(e => {
      const data = e.getContext('2d').getImageData(0, 0, e.width, e.height).data;
      let opaque = 0, white = 0;
      for (let i = 0; i < data.length; i += 16) if (data[i + 3] > 245) {
        opaque++;
        if (Math.min(data[i], data[i + 1], data[i + 2]) > 220) white++;
      }
      return { opaque, whiteRatio: white / opaque };
    });
    assert(matte.opaque > 500, 'Travelling car must remain visible');
    assert(matte.whiteRatio < .12, 'Travelling car must not carry a white rectangular studio');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    assert.deepEqual(errors, []);
    report.push({ engine: engine.name(), name, matte, samples });
    console.log('PASS travel', engine.name(), name); await page.close();
  }
  await browser.close();
}
await fs.writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
