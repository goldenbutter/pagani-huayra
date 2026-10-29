# Kling 4.0 — red continuous-orbit pilot

Future reuse: apply the configured [vehicle generation master v5](../vehicle-generation-master-v5.md) cockpit lock to every image and video prompt. The user reported steering-wheel side drift in this pilot after the camera-continuity review. They subsequently inspected the generated reference images and found no steering-position error, pointing to suspected drift during Kling video generation. Do not attribute the fault to the still images without further evidence. The earlier video review did not establish interior consistency. Existing media and submitted records are preserved; this prompt-only correction does not authorise a repair render.

User selected Higgsfield, Kling 4.0, 720p and 16:9. The connected catalog confirms first/end images and the live quote is 11.25 credits for one five-second output. The user subsequently allowed three seconds for shorter moves; clip04 uses three seconds, quoted at 6.75 credits. The selected account reported 1,040 credits at start. These are Higgsfield credits, separate from the earlier Flow estimate.

The planned red film uses eight linked segments (85.5 credits before retries): four quarter-orbits that return to the starting front-left composition; ascent to overhead; descent to the rear-left opening position; doors/engine opening; controlled exploded assembly. The 360° orbit finishes before the overhead excursion. The camera stops at the opening angle, and it stays there for opening and disassembly. No website motion changes are included in this stage.

Render one segment, inspect it, extract its actual final decoded frame, and use that frame as the next generation's first image. Do not submit all clips independently against generated stills. The complete orbit must visibly pass left, rear, right and front in order without cuts or dissolves. Matching endpoints alone do not prove continuous movement.

`red/render-ledger.json` records submitted job IDs, prompts, input media IDs and quoted costs. Native downloads belong in `assets/source/videos/kling4/red/`; extraction and inspection evidence belongs in `analysis/kling4/`. Store the final stitched result under `exports/kling4/`. First-generation widgets already display the jobs; do not submit duplicate jobs merely to refresh a preview.

The uploaded JPEGs are high-quality format conversions of the existing image originals; PNG originals remain preserved. Additional rear-right and front-right endpoints were generated with built-in image_gen. AI-derived geometry is not verified CAD, so the rendered outputs must be reviewed before calling the whole film complete.

## Completed red pilot

All eight clips passed sampled motion and endpoint-join review on the first attempt. The final export is `exports/kling4/pagani-red-continuous-orbit-exploded-720p.mp4`: 38.041667 seconds, 913 frames at 24 fps, 1280×720, silent, approximately 16.38 MB. It uses direct joins with one duplicate boundary frame removed from each subsequent segment. The whole export decoded without errors. The separate orbit-only preview is also in `exports/kling4/`.

Verified credit deduction: 85.5, with the account moving from 1,040 to 954.5. No retries or other-color generations were submitted. Detailed checks, checksum and chapter timings are in `exports/kling4/red-pilot-review.json`. Native source clips, reference images and submitted prompts are retained in their respective folders.

Rebuild locally with `python3 scripts/stitch-kling.py`; use `--orbit-only` for the shorter preview. Extract native endpoint frames and a review sheet with `python3 scripts/review-kling.py <video> --clip <number>`. The website was not changed during this video-production stage.

## Version 2 speed and return edit

The original 38-second film is preserved. Version 2 uses 1.6× speed to reach the requested 20–25-second range; 1.4× would still be approximately 27 seconds. `exports/kling4/pagani-red-v2-1.6x-720p.mp4` is 23.766667 seconds at 720p/30fps. `exports/kling4/pagani-red-v2-forward-reverse-720p.mp4` appends the complete reverse journey and lasts 47.5 seconds. It reassembles the car, closes the panels, retraces the camera movement and returns to the original front view. The duplicate frame at the turnaround is omitted. Both silent exports passed full decode checks, and the combined journey was visually sampled. No generation credits were used. Metadata and checksums are in `exports/kling4/pagani-red-v2-receipt.json`.
