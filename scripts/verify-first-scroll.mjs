import assert from "node:assert/strict";
import { chromium, webkit } from "playwright";

const browser = await (process.env.BROWSER === "webkit" ? webkit : chromium).launch();
const results = [];
try {
  for (const width of [1440, 390]) {
    for (const id of ["experience", "engineering"]) {
      const page = await browser.newPage({ isMobile: width === 390, hasTouch: width === 390, viewport: { width, height: width === 390 ? 844 : 900 } });
      await page.route(/\/assets\/studio\/.*\.webp$/, async route => {
        await new Promise(resolve => setTimeout(resolve, 180));
        await route.continue().catch(() => {});
      });
      await page.goto(process.env.BASE_URL || "http://127.0.0.1:3002", { waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => document.querySelector(".travelling-car")?.dataset.targetFrame !== undefined);
      const result = await page.evaluate(async id => {
        const film = document.getElementById(id);
        const canvas = document.querySelector(".travelling-car");
        const top = film.getBoundingClientRect().top + scrollY;
        const span = film.offsetHeight - innerHeight;
        const painted = new Set();
        let firstPaint = null;
        const start = performance.now();
        await new Promise(resolve => {
          function step(now) {
            const t = Math.min(1, (now - start) / 1800);
            window.scrollTo(0, top + span * (.04 + t * .34));
            if (Number(canvas.dataset.frame) > 0 && canvas.dataset.scene === film.dataset.film) {
              painted.add(canvas.dataset.frame);
              firstPaint ??= Math.round(now - start);
            }
            if (t < 1) requestAnimationFrame(step);
            else resolve();
          }
          requestAnimationFrame(step);
        });
        return { firstPaintMs: firstPaint, distinctFramesDuringScroll: painted.size };
      }, id);
      await page.waitForFunction(() => {
        const c = document.querySelector(".travelling-car");
        return Number(c.dataset.frame) > 0 && c.dataset.frame === c.dataset.targetFrame && c.dataset.frameQuality === "full";
      }, undefined, { timeout: 10000 });
      results.push({ width, id, ...result });
      await page.close();
    }
  }
  console.table(results);
  for (const r of results) {
    assert(r.firstPaintMs !== null && r.firstPaintMs < 1000 && r.distinctFramesDuringScroll >= 8,
      'First uninterrupted scroll should paint multiple frames: ' + JSON.stringify(r));
  }
} finally {
  await browser.close();
}
