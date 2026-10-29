import { chromium, webkit } from "playwright";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const base = process.env.BASE_URL || "http://localhost:3002";
await fs.mkdir("analysis/verification", { recursive: true });
const report = {
  base,
  cases: [],
  errors: [],
  reducedMotion: null,
  failureRecovery: null,
  rapidSwitch: null,
};
const variants = [
  ["red", "Rosso", "#c81720", "red-carbon-blue"],
  ["white", "Bianco", "#2456bf", "pearl-white-carbon"],
  ["green", "Verde", "#006744", "emerald-carbon-gold"],
];
async function ready(page, id) {
  await page.waitForFunction(
    (id) => {
      const c = document.querySelector(".car-canvas");
      return (
        c?.dataset.color === id &&
        document.querySelector(".canvas-stage")?.dataset.ready === "true"
      );
    },
    id,
    { timeout: 45000 },
  );
}
async function seek(page, p) {
  await page.locator("#experience").evaluate((el, p) => {
    window.scrollTo(
      0,
      el.getBoundingClientRect().top +
        scrollY +
        (el.offsetHeight - innerHeight) * p,
    );
  }, p);
  const expected = Math.round(Math.min(p / 0.625, 1) * 239) + 1;
  await page.waitForFunction(
    (expected) =>
      Math.abs(
        Number(document.querySelector(".car-canvas")?.dataset.frame) - expected,
      ) <= 1,
    expected,
    { timeout: 10000 },
  );
  await page.waitForTimeout(80);
  return await page.evaluate(() => ({
    frame: Number(document.querySelector(".car-canvas").dataset.frame),
    progress: document.querySelector(".progress-number").textContent,
    overflow: document.documentElement.scrollWidth > innerWidth,
    phase: [...document.querySelectorAll(".phase")].map((p) =>
      Number(getComputedStyle(p).opacity),
    ),
  }));
}
for (const [engine, launcher, cases] of [
  [
    "chromium",
    chromium,
    [
      ["desktop", 1440, 1000, 2],
      ["laptop", 1280, 800, 1],
      ["tablet", 834, 1194, 2],
      ["phone", 390, 844, 3],
      ["small-phone", 360, 740, 2],
      ["landscape", 844, 390, 2],
    ],
  ],
  [
    "webkit",
    webkit,
    [
      ["desktop", 1440, 900, 1],
      ["phone", 390, 844, 2],
    ],
  ],
]) {
  const browser = await launcher.launch({ headless: true });
  for (const [name, width, height, dpr] of cases) {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: dpr,
      isMobile: name.includes("phone"),
      hasTouch: name.includes("phone"),
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.goto(base, { waitUntil: "networkidle" });
    await ready(page, "red");
    await page.screenshot({
      path: `analysis/verification/${engine}-${name}-opening.png`,
    });
    const results = [];
    const checkAll = name === "desktop" || name === "phone";
    for (const [id, label, accent, slug] of checkAll
      ? variants
      : [variants[2]]) {
      if (id === "red" || !checkAll) {
        await page
          .getByRole("button", { name: `Explore ${label}`, exact: true })
          .click();
        await page.waitForTimeout(1550);
      } else
        await page
          .getByRole("button", { name: `Switch to ${label}`, exact: true })
          .click();
      await ready(page, id);
      assert.equal(
        await page.locator(".experience-root").getAttribute("data-color"),
        id,
      );
      assert.equal(
        await page
          .locator(".experience-root")
          .evaluate((e) => e.style.getPropertyValue("--accent")),
        accent,
      );
      assert.match(
        await page.locator(".engine-visual img").getAttribute("src"),
        new RegExp(slug),
      );
      const states = [];
      for (const progress of [0, 0.35, 0.73, 1, 0.51, 0]) {
        const state = await seek(page, progress);
        assert(!state.overflow, `${engine}/${name}: overflow at ${progress}`);
        states.push({ at: progress, ...state });
        if (progress === 0.35 || progress === 1)
          await page.screenshot({
            path: `analysis/verification/${engine}-${name}-${id}-${progress === 1 ? "engine" : "form"}.png`,
          });
      }
      const dimensions = await page.locator(".car-canvas").evaluate((c) => ({
        buffer: c.width,
        css: c.getBoundingClientRect().width,
      }));
      assert(
        Math.abs(dimensions.buffer / dimensions.css - Math.min(dpr, 2)) < 0.02,
        "High-DPI buffer mismatch",
      );
      results.push({ id, states, dimensions });
    }
    // Test real anchors, heading fit, all images, and editorial layouts.
    for (const id of [
      "story",
      "design",
      "engineering",
      "specs",
      "craftsmanship",
      "inquire",
    ]) {
      await page
        .locator("#" + id)
        .evaluate((el) =>
          window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 78),
        );
      await page.waitForTimeout(950);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `${name} overflow in ${id}`,
      );
      const clipped = await page
        .locator("#" + id + " h2")
        .evaluateAll((nodes) =>
          nodes
            .filter((el) => el.scrollWidth > el.clientWidth + 2)
            .map((el) => el.textContent),
        );
      assert.deepEqual(clipped, [], `${name}: clipped heading ${id}`);
      if (name === "desktop" || name === "phone")
        await page.screenshot({
          path: `analysis/verification/${engine}-${name}-${id}.png`,
        });
    }
    assert.equal(
      await page.locator(".button-primary").getAttribute("href"),
      "mailto:bithun@ibithun.com?subject=Let%E2%80%99s%20build%20a%20website%20like%20the%20Huayra%20concept",
    );
    if (width < 768) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      assert(await page.locator("dialog").evaluate((e) => e.open));
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("dialog").evaluate((e) => e.open), false);
      await page.getByRole("button", { name: "Open navigation" }).click();
      await page
        .getByRole("navigation", { name: "Mobile navigation" })
        .getByRole("link", { name: "Story", exact: false })
        .click();
      await page.waitForTimeout(1500);
      assert.equal(await page.locator("dialog").evaluate((e) => e.open), false);
      assert.equal(
        await page.evaluate(() => document.activeElement.id),
        "story",
      );
    } else {
      await page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "Specs", exact: true })
        .click();
      await page.waitForTimeout(1500);
      assert.equal(
        await page.evaluate(() => document.activeElement.id),
        "specs",
      );
    }
    assert.deepEqual(errors, [], `${engine}/${name}: browser errors`);
    report.cases.push({ engine, name, width, height, dpr, results, errors });
    console.log(`PASS ${engine}/${name} (${results.length} colors)`);
    await page.close();
  }
  await browser.close();
}
const browser = await chromium.launch();
const reduced = await browser.newPage({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce",
});
let sequenceRequests = 0;
reduced.on("request", (r) => {
  if (r.url().includes("/sequences/") && r.url().endsWith(".jpg"))
    sequenceRequests++;
});
await reduced.goto(base, { waitUntil: "networkidle" });
await reduced
  .getByRole("button", { name: "Explore Verde", exact: true })
  .click();
await reduced.waitForTimeout(200);
assert.equal(
  sequenceRequests,
  0,
  "Reduced motion should not download animation frames",
);
assert.equal(
  await reduced
    .locator(".car-canvas")
    .evaluate((e) => getComputedStyle(e).opacity),
  "0",
);
report.reducedMotion = {
  sequenceRequests,
  staticPoster: await reduced.locator(".canvas-poster").getAttribute("src"),
};
await reduced.close();
const failure = await browser.newPage();
let block = true;
await failure.route("**/sequences/red/desktop/30.jpg", (route) =>
  block
    ? route.fulfill({ status: 503, body: "Simulated network failure" })
    : route.continue(),
);
await failure.goto(base);
await failure
  .getByRole("button", { name: "Explore Rosso", exact: true })
  .click();
await failure
  .getByRole("button", { name: "Explore with stills" })
  .waitFor({ timeout: 15000 });
await failure.getByRole("button", { name: "Explore with stills" }).click();
assert.equal(await failure.locator(".sequence-loader").count(), 0);
await failure.getByRole("button", { name: "Switch to Bianco" }).click();
await ready(failure, "white");
block = false;
await failure.getByRole("button", { name: "Switch to Rosso" }).click();
await ready(failure, "red");
report.failureRecovery = { fallback: true, colorSwitchRecovery: true };
await failure.close();
const rapid = await browser.newPage();
const rapidErrors = [];
rapid.on("pageerror", (e) => rapidErrors.push(e.message));
await rapid.goto(base);
await rapid.getByRole("button", { name: "Explore Rosso", exact: true }).click();
await rapid.getByRole("button", { name: "Switch to Bianco" }).click();
await rapid.getByRole("button", { name: "Switch to Verde" }).click();
await rapid.getByRole("button", { name: "Switch to Rosso" }).click();
await ready(rapid, "red");
// Wait for the selector navigation to finish before issuing a direct scroll.
await rapid.waitForFunction(() => document.activeElement?.id === "experience");
await seek(rapid, 0.7);
await rapid.setViewportSize({ width: 900, height: 700 });
await rapid.waitForTimeout(250);
const resize = await rapid.locator(".car-canvas").evaluate((c) => ({
  frame: c.dataset.frame,
  width: c.width,
  css: c.getBoundingClientRect().width,
}));
assert(Math.abs(resize.width - resize.css) < 2);
assert.deepEqual(rapidErrors, []);
report.rapidSwitch = { errors: rapidErrors, resize };
await rapid.close();
await browser.close();
await fs.writeFile(
  "analysis/verification/report.json",
  JSON.stringify(report, null, 2),
);
console.log(
  "PASS reduced motion, media failure recovery, rapid switching and resize",
);
