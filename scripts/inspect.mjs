import { chromium } from "playwright";
import fs from "node:fs/promises";
await fs.mkdir("analysis/screenshots", { recursive: true });
const browser = await chromium.launch({ headless: true });
for (const [name, width, height] of [
  ["desktop", 1440, 1000],
  ["mobile", 390, 844],
]) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://localhost:3001", { waitUntil: "networkidle" });
  await page.screenshot({ path: `analysis/screenshots/${name}-opening.png` });
  console.log(
    name,
    "errors",
    errors,
    "overflow",
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  );
  await page
    .getByRole("button", { name: "Explore Rosso", exact: true })
    .click();
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `analysis/screenshots/${name}-film.png` });
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
        window.scrollTo(
          0,
          el.getBoundingClientRect().top + window.scrollY - 80,
        ),
      );
    await page.waitForTimeout(300);
    await page.screenshot({ path: `analysis/screenshots/${name}-${id}.png` });
  }
  await page.close();
}
await browser.close();
