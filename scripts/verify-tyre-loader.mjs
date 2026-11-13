import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium, webkit } from "playwright";

const base = process.env.BASE_URL || "http://localhost:3002";
await mkdir("analysis/tyre-loader", { recursive: true });
for (const engine of [chromium, webkit]) {
  const browser = await engine.launch();
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 }, isMobile: width === 390 });
      let release;
      const pending = new Promise(resolve => { release = resolve; });
      await page.route("**/scrub-preview.webp", async route => {
        await pending;
        await route.continue().catch(() => {});
      });
      await page.goto(base, { waitUntil: "domcontentloaded" });
      const intro = page.locator(".tyre-intro");
      await page.waitForFunction(() => document.querySelector(".tyre-readout output")?.value === "55%");
      assert(await intro.isVisible());
      await page.screenshot({ path: `analysis/tyre-loader/${engine.name()}-${width}.png` });
      release();
      await intro.waitFor({ state: "hidden" });
      assert.equal(await page.locator(".tyre-readout output").textContent(), "100%");
      await page.reload();
      assert.equal(await intro.isVisible(), false);
      await page.close();
      console.log("PASS first visit, asset progress and repeat visit", engine.name(), width);
    }
    for (const scenario of ["failed", "stalled", "scroll", "reduced", "deep-link", "no-js"]) {
      const page = await browser.newPage({ reducedMotion: scenario === "reduced" ? "reduce" : "no-preference", javaScriptEnabled: scenario !== "no-js" });
      if (scenario === "failed") await page.route("**/scrub-preview.webp", route => route.abort());
      if (scenario === "stalled" || scenario === "scroll") await page.route("**/scrub-preview.webp", () => {});
      await page.goto(base + (scenario === "deep-link" ? "/#engineering" : ""), { waitUntil: "domcontentloaded" });
      if (scenario === "scroll" || scenario === "stalled") {
        await page.waitForFunction(() => document.querySelector(".tyre-readout output")?.value === "55%");
        if (scenario === "scroll") await page.mouse.wheel(0, 500);
      }
      await page.locator(".tyre-intro").waitFor({ state: "hidden", timeout: scenario === "scroll" ? 1000 : 5500 });
      await page.close();
      console.log("PASS", engine.name(), scenario);
    }
  } finally { await browser.close(); }
}
