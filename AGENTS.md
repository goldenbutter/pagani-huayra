<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project and approved experience

This is an independent iBithun automotive portfolio concept, not an official Pagani site or a vehicle sales service. Keep the existing disclosure and iBithun inquiry destination. Do not add checkout, real inventory, prices or customer claims.

The active design is one red Huayra BC on a `#fbfbfb` studio surface. Do not restore the white/green selector without a new request. Preserve the approved typography, white/red palette and responsive layouts. Do not use em dashes in website copy, metadata or social previews.

`RedExperience` and `TravellingCar` own the active page. One persistent canvas moves between section docks. Travel uses closed-car orbit views mapped in `data/travel.ts`, with cached low-resolution alpha mattes in `lib/travel-matte.ts`; keep the side/rear/overhead view changes instead of reverting to a translated front still. Film entry/exit and the finale meet at source frame zero. Preserve the bounded matte cache, reduced-motion fallback and phone departure path below the story/design paragraphs. Keep the entire rotated frame within horizontal viewport margins, including the extra scale during handoffs. In the desktop story section, preserve the separate left car column and its early arrival before the right-hand text enters the reading area; the rear wing must not overlap the copy. Run `npm run test:travel` when changing the handoffs. Stage one uses frames 0–792, opening then reversing without an explosion. Stage two uses frames 0–120 and 673–912, then reverses. Both return to frame zero. Part labels belong to stage two. Preserve camera continuity and the page/video boundary blend. Film sections use a left narrative/right car composition on desktop and stacked copy on phones. `filmStory` follows the actually painted frame through `studio-frame` events, not a timer or download target. Keep selected part descriptions in the narrative panel, and respect reduced motion for text transitions. Film descriptions must remain readable: 24–30px on laptops/monitors, 22px on tablets and 18px on portrait phones. Keep specification captions at 16px on desktop and 12px on phones; do not restore the former 4–7px caption styling. Check the short laptop viewport as well as large monitors when adjusting film typography.

Hero, story, design and specifications copy also needs readable sizing. Material captions and specification units use Rajdhani at 16px desktop and at least 14px on smaller screens. Preserve darker body text and check wrapping in both columns. Run `npm run test:editorial` after changing these sections.

## Media and source integrity

- Web assets live in `public/assets/`; the README preview and player media live in `public/media/`. Anchor local-directory exclusions in `.vercelignore` as `/assets/` and `/exports/`. An unanchored `assets/` rule also excludes runtime frames. Use `vercel deploy --dry` to verify both desktop/mobile frame directories remain included.
- Preserve originals in local `assets/source/`, edited masters in `exports/`, retired media in `assets/archive/`, and rollback evidence in `analysis/`. These local production folders are excluded from Git and Vercel uploads. Never delete them to tidy the repository.
- Do not spend image/video generation credits or regenerate accepted footage without explicit user authorization.
- The user accepted the existing generated steering-wheel side-switch. Do not claim that it is repaired. Future generations must preserve the fixed vehicle-side cockpit layout documented in `docs/prompts/vehicle-generation-master-v5.md`.
- Published media is illustrative. Exploded assemblies are not CAD-accurate technical documentation.

`CarGallery` owns the eight-view expanding gallery in the craftsmanship section. Its source images are the approved `assets/source/images/flow-v2/red/` pack, excluding drafts. Web derivatives live in `public/assets/images/gallery/`. Each view has a reviewed crop in original reference coordinates, applied through CSS without changing the source images. Preserve this tighter full-car framing in the active panel, keyboard selection, vertical phone layout and reduced-motion support. Selection must not change the section height or disturb the travelling car dock. Run `npm run test:gallery` after gallery changes.

## Vehicle facts

Use the Huayra BC Coupé, not the Roadster BC or Huayra R. Specifications live in `data/carData.ts` and reviewed sources are recorded in `docs/research/huayra-bc-specifications.md`. Preserve units: 764 CV is metric horsepower, 1,218 kg is dry weight. The engine is a twin-turbo AMG V12 and the transmission is a seven-speed Xtrac automated manual. Verify new factual claims against manufacturer sources.

## Development and verification

Node 22 or newer; use `npm ci`. Development uses port 3001, production review uses port 3002. Do not stop sibling ENERGITIX servers or alter its repository.

Run `npm run lint`, `npm run typecheck`, and `npm run build` for source changes. For motion/layout changes, run the relevant Playwright checks against a production build: `npm run test:visual` and `npm run test:a11y`. `BASE_URL` selects another preview. Review desktop and phone screenshots; automated passing checks do not establish physical-device support. Keep test evidence in ignored `analysis/`.

## Publishing targets

- GitHub: `goldenbutter/pagani-huayra`, public, production branch `main`.
- Vercel: project `pagani-huayra`, team `i-bithun`. Confirm the linked project/team before deployment or domain changes.
- Canonical hostname: `demo-pagani.ibithun.com`.
- Hostinger owns external DNS. Use the exact CNAME and verification TXT returned for this project. Preserve unrelated DNS, email records and parent-domain ownership. The user handles Hostinger records unless separately authorized.
- Vercel Analytics is integrated in the root layout for the homepage and teaser. Never claim dashboard enablement or recorded visits without verifying them.
- Follow current user authorization for releases. Do not create duplicate Vercel projects in another team or change ENERGITIX.

Keep `README.md`, `DEPLOYMENT.md` and `TESTING.md` consistent with verified publication state. Never commit credentials, generated logs, machine-specific receipts or backup archives.
