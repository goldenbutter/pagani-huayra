# Verification: 29 October 2026

## Build and asset checks

ESLint, TypeScript and the Next.js production build pass. The homepage is statically prerendered. All 1,826 film WebPs decode successfully with the expected numbered filenames and desktop/mobile dimensions. The red-only social preview was regenerated and visually inspected.

## Production browser checks

The scroll interaction suite passed against http://localhost:3002 in these eight configurations:

| Engine | Viewport |
| --- | --- |
| Chromium | 1440 × 1000 |
| Chromium | 1280 × 800 |
| Chromium | 834 × 1194 |
| Chromium | 390 × 844 |
| Chromium | 360 × 740 |
| Chromium | 844 × 390 |
| WebKit | 1440 × 900 |
| WebKit | 390 × 844 |

Checks covered the initial loading budget, one persistent car canvas, no colour selector, orbit/opening endpoints, absence of explosion in the first film, return to assembled frame zero, alternating section docks, second-film explosion and reversal, all six interactive part labels, source-backed technical fields, expandable details, phone menu dismissal, project email destination, no legacy media requests, no horizontal overflow and no browser page errors.

Additional checks passed for reduced motion, simulated frame request failure and retry, and resizing an exploded scene from desktop to phone. Reduced motion requested one exploded still at initial load rather than preloading a film.

After the final specifications layout refinement, a focused Chromium/WebKit suite at desktop, tablet and phone widths passed navigation/focus, keyboard details expansion, expanded-content fit, car placement and overflow checks. These six cases verify the final production build. The broad eight-layout suite preceded only that final desktop specifications dock adjustment; other motion behaviour was unchanged.

Visual inspection covered desktop and phone hero, story, design, open-car and exploded scenes, the small-phone and landscape label layouts, and final desktop/phone specifications. The footage retains studio reflections while feathered boundaries blend with the page. A background cutout is used for travel between scenes.

## Accessibility

Four axe-core WCAG A/AA scans passed without detected violations: desktop and phone reduced-motion pages, plus desktop and phone exploded states. Contrast was corrected for the phone signature text. Labels have keyboard focus and pressed-state feedback; native details and mobile dialog controls were exercised.

This is automated testing and browser emulation, not a complete accessibility audit. Physical iPhone/Android testing and real-network performance testing remain unperformed.

## Evidence and reproduction

- `analysis/studio-verification/report.json`: eight-layout interaction results
- `analysis/studio-verification/navigation.json`: final navigation/specifications checks
- `analysis/studio-verification/accessibility.json`: four axe scans
- `analysis/studio-verification/media.json`: all-frame decode/dimension checks
- `analysis/studio-verification/*.png`: review captures
- `analysis/studio-build.log`: production build
- `analysis/rollback/pre-red-studio-site-20261029.tar.gz`: source before this update

Run `npm run test:visual` and `npm run test:a11y` with the production preview running. `BASE_URL` can select a different preview. Legacy verification scripts describe the archived three-colour version and are not the active npm test entry points.

## Limits

The existing AI footage still has accepted interior/geometric drift, including the steering-wheel issue identified by the user. The site does not correct or validate generated mechanics. Source lighting and reflections can vary within the film; matching the surface and feathering its border do not relight the source. The film is 720p. No generation credits were spent on this website update.

Originals and inactive colours are preserved outside the public site. The initial local-build review did not publish the site. The subsequent publication checks are recorded below; physical-device certification remains unperformed.


## Publication update: 29 October 2026

The public `goldenbutter/pagani-huayra` repository and iBithun Vercel project are configured. The root Analytics integration, canonical domain, film player and README assets passed lint, typecheck and production build.

`node scripts/verify-release.mjs` passed locally in Chromium and WebKit at 1440 × 1000 and 390 × 844. It verified the 18.77-second video's duration and real playback, homepage/teaser metadata, horizontal fit, zero player axe violations, the homepage exploded frame and absence of page errors. A production run uses the public Vercel mirror. Evidence is in ignored `analysis/release/` and `analysis/release-production.log`.

Custom-domain HTTPS and analytics collection require separate verification after the user adds Hostinger records and enables Web Analytics. Their configuration and current status are in `DEPLOYMENT.md`.
