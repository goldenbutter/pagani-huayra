# Camera continuity review — 28 October 2026

## Sources inspected

- `assets/source/videos/Pagani_Huayra_BC_studio_shot_{red,white,green}.mp4`
- User inspiration recording: `/Users/bithun/Movies/TapRecord/Video/REC-20261028142933.mp4`
- Saved front and rear image prompts in `docs/prompts/`
- Original website master prompt

The actual video-generation prompt, selected generation mode and reference-image settings were not found. Findings about visible output are direct observations; explanations of generation behavior are hypotheses.

## Observations

The original red MP4 is eight seconds, 1280 × 720, 24fps, 192 video frames. Its visible camera discontinuities predate website extraction and 240-frame interpolation.

- Red: around 3–4 seconds, a front view and rear view overlap in a dissolve-like transition. Around 5–5.5 seconds, another overlapping transition changes rear viewpoint as the doors open. This is not a continuous same-side camera orbit.
- White: around 4–5 seconds, a cropped front/side view overlaps a different rear open-door view instead of a continuous side-to-rear move.
- Green: around 4.5–5.5 seconds, a side view blends into the rear open-door view. A second blue number appears alongside the gold 20 earlier in the orbit, showing livery drift as well.
- Inspiration: in the central car sequence, approximately 2–5 seconds of the screen recording, intermediate front, side and rear views remain visually connected, and the doors/engine open from the established rear composition. The recording itself later changes website sections and has an ending edit; it is not a clean source render from which exact camera parameters can be recovered.

Approximate intervals come from sampled original frames, including quarter-second samples for the red transition. Contact sheets are in gitignored `analysis/camera-review/`.

## Prompt/reference conflicts

The saved front image brief asks for a slightly elevated front three-quarter composition and a 70mm photographic look. The rear brief asks for a NEW, high rear-left elevated view looking down into the engine, with a 55mm look. These are separate still-image compositions, not an enforced continuous camera path. The separate rear edit also explicitly moves the 20 from the front panel to the rear fender. This introduces an identity mismatch if the two images are used as exact endpoints of one video.

The website brief describes the order of cinematic phases but does not specify how a video generator must travel between views. Its phase list is not a complete continuous-shot video prompt.

The output is consistent with blending incompatible view targets, but the unavailable original video prompt/settings prevent identifying a particular instruction or generation mode as the proven cause.

## Proposed correction

Use one same-side orbit with fixed camera height, lens and distance. Show an actual side profile and then a closed rear three-quarter view. Hold that rear camera position while doors open and the engine clamshell lifts. Keep decals on their original panels. Align endpoint references before generation. Review one red take before generating the other two colors.

Replacement prompt: `docs/prompts/video-continuous-shot-v2.md`.

All three current clips would need replacement to meet the requested continuous-camera standard. More interpolated frames cannot repair the missing camera path. No existing media or website behavior was replaced as part of this review.

## Update after receiving the actual video prompt

The user subsequently supplied the original video prompt. It DOES define the front-to-side-to-rear path and explicitly prohibit cuts, dissolves, morphs and camera jumps. The earlier uncertainty about that text is now resolved; missing continuity wording is not the problem. Generator settings and selected mode remain unknown.

The supplied text contains concrete conflicts: right-side-only travel versus the saved rear-left target brief; strict close-framed image matching versus 55–65% car width; every front and rear component being visible at all times versus natural occlusion; and a ten-second timeline with opening after 8.5 seconds despite an 8–10-second duration instruction. The actual clips are eight seconds. It also describes a blue/white stripe palette inconsistent with the red/electric-blue reference brief.

Detailed review, reference plan and revised expanded prompt: `docs/prompts/video-prompt-v4-reviewed.md`. These identify likely failure pressures, not a proven internal cause of the generator's output.
