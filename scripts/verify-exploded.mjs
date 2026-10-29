import { chromium, webkit } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base = process.env.BASE_URL || "http://localhost:3002";
const report = [];
await fs.mkdir("analysis/exploded", { recursive: true });
async function ready(page, color) {
  await page.waitForFunction((color) => {
    const c = document.querySelector(".exploded-canvas");
    return (
      document.querySelector(".exploded-stage").dataset.state === "ready" &&
      c.dataset.color === color &&
      c.dataset.layerCount === "8"
    );
  }, color);
}
async function seek(page, p) {
  await page
    .locator("#experience")
    .evaluate(
      (e, p) => scrollTo(0, e.offsetTop + (e.offsetHeight - innerHeight) * p),
      p,
    );
  const expected = Math.min(1, Math.max(0, (p - 0.665) / 0.3));
  await page.waitForFunction(
    (expected) =>
      Math.abs(
        Number(document.querySelector(".exploded-canvas").dataset.separation) -
          expected,
      ) < 0.002,
    expected,
  );
  await page.waitForTimeout(80);
  return page.evaluate(() => {
    const c = document.querySelector(".exploded-canvas"),
      rect = c.getBoundingClientRect();
    const pixels = c
      .getContext("2d")
      .getImageData(0, 0, c.width, c.height).data;
    let hash = 0;
    for (let i = 0; i < pixels.length; i += 79)
      hash = (Math.imul(hash, 31) + pixels[i]) >>> 0;
    return {
      separation: c.dataset.separation,
      hash,
      frame: document.querySelector(".car-canvas").dataset.frame,
      width: c.width,
      css: rect.width,
      overflow: document.documentElement.scrollWidth > innerWidth,
    };
  });
}
for (const [engine, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await launcher.launch();
  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["phone", 390, 844],
  ]) {
    const p = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 2,
    });
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(base, { waitUntil: "networkidle" });
    for (const [color, label] of [
      ["red", "Rosso"],
      ["white", "Bianco"],
      ["green", "Verde"],
    ]) {
      await p
        .getByRole("button", { name: `Switch to ${label}`, exact: true })
        .evaluate((e) => e.click());
      await ready(p, color);
      const states = [];
      for (const progress of [0.665, 0.81, 1, 0.81, 0.665]) {
        const state = await seek(p, progress);
        assert(!state.overflow);
        assert(Math.abs(state.width / state.css - 2) < 0.02);
        states.push(state);
        if (progress === 1)
          await p.screenshot({
            path: `analysis/exploded/${engine}-${name}-${color}.png`,
          });
      }
      assert.equal(
        states[0].hash,
        states[4].hash,
        "Reverse scroll restores initial assembly",
      );
      assert.equal(
        states[1].hash,
        states[3].hash,
        "Reverse scroll restores middle assembly",
      );
      assert.notEqual(states[0].hash, states[1].hash);
      assert.notEqual(states[1].hash, states[2].hash);
      await p.waitForFunction(
        () => document.querySelector(".car-canvas").dataset.frame === "240",
      );
      await seek(p, 1);
      assert(await p.locator(".film-scene").evaluate((e) => e.inert));
      report.push({ engine, name, color, states, errors });
      console.log(`PASS exploded ${engine}/${name}/${color}`);
    }
    assert.deepEqual(errors, []);
    await p.close();
  }
  await browser.close();
}
const browser = await chromium.launch();
const p = await browser.newPage();
let blocked = true;
await p.route("**/images/exploded/red.json", (r) =>
  blocked ? r.fulfill({ status: 503, body: "unavailable" }) : r.continue(),
);
await p.goto(base, { waitUntil: "networkidle" });
await p
  .locator("#experience")
  .evaluate((e) =>
    scrollTo(0, e.offsetTop + (e.offsetHeight - innerHeight) * 0.9),
  );
await p.getByRole("button", { name: "RETRY ASSEMBLY" }).waitFor();
assert(await p.locator(".exploded-fallback").isVisible());
blocked = false;
await p.getByRole("button", { name: "RETRY ASSEMBLY" }).click();
await ready(p, "red");
for (const label of ["Bianco", "Verde", "Rosso"])
  await p
    .getByRole("button", { name: `Switch to ${label}`, exact: true })
    .click();
await ready(p, "red");
await p.setViewportSize({ width: 844, height: 390 });
const resized = await seek(p, 1);
assert(!resized.overflow);
await p.screenshot({ path: "analysis/exploded/landscape.png" });
await p.close();
const reduced = await browser.newPage({
  reducedMotion: "reduce",
  viewport: { width: 390, height: 844 },
});
let frames = 0;
reduced.on("request", (r) => {
  if (/sequences.*\.jpg$/.test(r.url())) frames++;
});
await reduced.goto(base, { waitUntil: "networkidle" });
await ready(reduced, "red");
assert.equal(
  await reduced.locator(".exploded-canvas").getAttribute("data-separation"),
  "1.0000",
);
assert.equal(frames, 0);
await reduced.close();
await browser.close();
await fs.writeFile(
  "analysis/exploded/report.json",
  JSON.stringify(
    {
      cases: report,
      retry: true,
      rapidSwitch: true,
      resize: resized,
      reducedMotion: { frames, separation: 1 },
    },
    null,
    2,
  ),
);
console.log(
  "PASS assembly failure/retry, rapid switch, landscape resize, reduced motion",
);
