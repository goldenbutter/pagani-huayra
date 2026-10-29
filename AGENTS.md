<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project and approved experience

This is an independent iBithun automotive portfolio concept, not an official Pagani site or a vehicle sales service. Keep the existing disclosure and iBithun inquiry destination. Do not add checkout, real inventory, prices or customer claims.

The active design is one red Huayra BC on a `#fbfbfb` studio surface. Do not restore the white/green selector without a new request. Preserve the approved typography, white/red palette and responsive layouts. Do not use em dashes in website copy, metadata or social previews.

`RedExperience` and `TravellingCar` own the active page. One persistent canvas moves between section docks. Stage one uses frames 0–792, opening then reversing without an explosion. Stage two uses frames 0–120 and 673–912, then reverses. Both return to frame zero. Part labels belong to stage two. Preserve camera continuity and the page/video boundary blend.

## Media and source integrity

- Web assets live in `public/assets/`; the README preview and player media live in `public/media/`. Anchor local-directory exclusions in `.vercelignore` as `/assets/` and `/exports/`. An unanchored `assets/` rule also excludes runtime frames. Use `vercel deploy --dry` to verify both desktop/mobile frame directories remain included.
- Preserve originals in local `assets/source/`, edited masters in `exports/`, retired media in `assets/archive/`, and rollback evidence in `analysis/`. These local production folders are excluded from Git and Vercel uploads. Never delete them to tidy the repository.
- Do not spend image/video generation credits or regenerate accepted footage without explicit user authorization.
- The user accepted the existing generated steering-wheel side-switch. Do not claim that it is repaired. Future generations must preserve the fixed vehicle-side cockpit layout documented in `docs/prompts/vehicle-generation-master-v5.md`.
- Published media is illustrative. Exploded assemblies are not CAD-accurate technical documentation.

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
