# Pagani Huayra BC studio color variants

Generated with the built-in image_gen tool. Matching the ENERGITIX asset layout, original PNGs live in assets/source/images/ and WebP site assets live in public/assets/images/.

All three images are 1672 x 941 (approximately 16:9). The original generated pixels are preserved; WebP copies use quality 95 with no resizing.

## Palettes

- Bright red / exposed carbon / electric blue: `assets/source/images/pagani-huayra-bc-red-carbon-blue.png`
- Pearl white / exposed carbon / red and blue: `assets/source/images/pagani-huayra-bc-pearl-white-carbon.png`
- Emerald green / exposed carbon / champagne gold: `assets/source/images/pagani-huayra-bc-emerald-carbon-gold.png`

## Prompts

The exact base prompt, palette instructions, edit prompts, and source filenames are recorded in docs/prompts/generation-prompts.json. The red version was generated first; the white and emerald versions used it as an edit reference to preserve composition.

## Verification

Opened all three outputs for visual review: consistent front three-quarter framing, white studio, exposed carbon, racing stripes and readable 20. Verified both file formats decode and retain their native dimensions. Asset sizes and original checksums are recorded in public/assets/asset-manifest.json.

## Rear-left open-engine series

Three additional variants preserve the front-view palettes and white studio style, with both doors raised and the engine clamshell open. The red rear view was generated from the red front reference, then its number was moved to the rear fender. White and emerald variants used that rear image as the geometry reference and their respective front images as color references.

Exact prompts: `docs/prompts/generation-prompts-rear-open.json`. All three PNGs and WebPs decode at 1672 x 941, approximately 16:9; no cropping or resizing. Visual review confirmed matching framing, palettes, exposed engine, central quad exhaust and rear-quarter 20. These are generated commercial illustrations, not verified engineering documentation.

## Scroll sequences and website assets

The supplied red, white and green clips are preserved in `assets/source/videos/`. `scripts/prepare-sequences.py` uses FFmpeg motion-compensated interpolation to produce 240 frames per color at 30 fps over eight seconds. Both desktop (1280 × 720) and mobile (768 × 432) derivatives live in `public/assets/sequences/<color>/<size>/`. The sequence manifest records source hashes and output sizes. The original 192 frames are not represented as 240 independently filmed source images.

The original clips include some ghosting and frame-edge cropping during camera movement. Those source limits remain. Rendering contains the whole supplied frame and omits only its one-pixel black right encoding edge; editorial still-image details use intentional close crops separately from the cinematic canvas.

`public/assets/images/pagani-og.jpg` is a 1200 × 630 browser-rendered social card built from the existing WebP artwork and local Orbitron font, using `scripts/generate-og.mjs`.

## Exploded assembly series

Three transparent 1672 × 941 PNG originals are preserved in `assets/source/images/exploded/`. Matching WebPs and region maps live in `public/assets/images/exploded/{red,white,green}.{webp,json}`. Exact image-generation and corrective-edit prompts are in `docs/prompts/generation-prompts-exploded.json`. Red was created from the existing car references; white and green preserve its layout while matching their corresponding palette references.

The eight modules are body shell, rear wing, engine, chassis and four wheels. `scripts/analyze-exploded.py` reads alpha connected components and records pixel runs for each module; it does not modify the artwork. It validates that all nonzero-alpha source pixels belong to exactly one module. The browser copies those regions into independent canvases and moves them on staggered scroll paths. There is no new exploded-view video or additional 240-frame sequence.

These are artistic generated assembly illustrations. Components, scale, wheel positions and body/chassis fit are conceptual, not engineering-accurate. A short dissolve bridges the supplied open-engine film and the separate assembly study. Backward scrolling reverses the separation. Reduced motion displays the final assembly as a still.

## Flow v2 red pilot references

Eight new selected PNGs live in `assets/source/images/flow-v2/red/`: wide front, left side, closed rear, right side, overhead, doors open, engine open, and open-door exploded assembly. Generated with built-in image_gen; exact generation/edit prompts are in `docs/prompts/flow-v2/image-generation-prompts.json`. Nonselected intermediates are isolated in the `drafts/` subfolder. The selected-file manifest records native 1672 × 941 dimensions, sizes and SHA-256 hashes.

These are a replacement-video pilot kit, not new website media. They correct the previous moved rear-fender number and retain an open-door shell in the exploded target. Independently generated geometry is not guaranteed identical; accepted video boundary frames must govern continuity. All eight images decode and were visually inspected. The four revised video prompts and Flow setup/budget instructions are in `docs/prompts/flow-v2/START-HERE.md`. A verified 15-file ZIP is in `exports/flow-v2/pagani-red-flow-kit.zip`.

No Flow videos or Flow credit spending were performed while preparing the kit. White and green matching reference kits are deferred until the red motion is validated. Existing source videos, frame sequences and website behavior remain unchanged.
