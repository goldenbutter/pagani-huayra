import { chromium, webkit } from "playwright";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const result = [];
for (const [engine, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await launcher.launch();
  const p = await b.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  await p.goto("http://localhost:3002", { waitUntil: "networkidle" });
  await p.getByRole("button", { name: "Explore Verde", exact: true }).click();
  await p.waitForTimeout(1500);
  await p.waitForFunction(
    () =>
      document.querySelector("canvas")?.dataset.color === "green" &&
      document.querySelector(".canvas-stage")?.dataset.ready === "true",
  );
  await p
    .locator("#experience")
    .evaluate((el) =>
      window.scrollTo(0, el.offsetTop + (el.offsetHeight - innerHeight) * 0.9),
    );
  await p.waitForFunction(
    () => Number(document.querySelector("canvas")?.dataset.frame) > 214,
  );
  await p.screenshot({
    path: `analysis/verification/${engine}-phone-final-film.png`,
  });
  const state = await p.evaluate(() => ({
    frame: document.querySelector("canvas").dataset.frame,
    overflow: document.documentElement.scrollWidth > innerWidth,
    targets: [...document.querySelectorAll(".color-switch button")].map(
      (e) => e.getBoundingClientRect().height,
    ),
  }));
  assert(!state.overflow);
  assert(state.targets.every((h) => h >= 44));
  await p
    .locator("#craftsmanship")
    .evaluate((el) => window.scrollTo(0, el.offsetTop + 300));
  await p.waitForTimeout(1000);
  await p.screenshot({
    path: `analysis/verification/${engine}-phone-final-craft.png`,
  });
  result.push({ engine, ...state });
  await b.close();
}
await fs.writeFile(
  "analysis/verification/final-check.json",
  JSON.stringify(result, null, 2),
);
console.log(result);
