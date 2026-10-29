# Pagani × Google Flow — red pilot kit

Future reuse: first apply the configured [vehicle generation master v5](../vehicle-generation-master-v5.md) cockpit lock to the image and video prompts. These original references and prompts predate the explicit driving-side checks; do not assume their cockpit layout is consistent merely because the camera endpoints match. Preserve the current media and generation history.

Prepared 28 October 2026 for **Google Flow / Veo 3.1 Lite**. Eight selected red PNG references and four copy-ready prompts are ready. No Flow video generation or credit spending has been performed by this preparation, and no existing website media has been replaced.

## Decision: four connected eight-second clips

The camera tour is split into two clips so that the two sides and the overhead move have time to read clearly. Opening and disassembly each get their own clip. The intended result is approximately 32 seconds before trimming boundary holds, presented as one continuous-looking scene.

| Clip | Action | First image | Last image target | Prompt |
| --- | --- | --- | --- | --- |
| A | Front-left → left flank → around rear → right profile | `01-front-wide.png` | `04-right-wide.png` | `red/A-orbit.txt` |
| B | Right profile → overhead → descend to rear-left | **Actual accepted final frame of A** | `03-rear-closed-wide.png` | `red/B-overhead.txt` |
| C | Doors open, then engine clamshell opens; camera locked | **Actual accepted final frame of B** | `07-engine-open.png` | `red/C-open.txt` |
| D | Body, wing, engine and four wheels separate; camera locked | **Actual accepted final frame of C** | `08-exploded-open.png` | `red/D-explode.txt` |

Use **Frames to Video: first and last**, 16:9, 720p, **8 seconds**, and **one output per generation**. Start with A only. Review it before paying for B. These two modes have different jobs: Frames supplies explicit endpoints; Ingredients supplies appearance references and is not an ordered storyboard. Do not upload all eight pictures and assume the model will visit them in sequence.

The other images are useful appearance/pose guides: `02-left-wide.png`, `05-overhead.png`, and `06-doors-open.png`. They are not additional mandatory intermediate frames in first/last-frame mode. The PNG numbering describes the reference catalog, not an instruction to feed all images in numeric order.

## Make the joins work

1. Generate A using its two listed images and exact prompt.
2. Scrub the result. Accept only if it physically passes the left side and rear on the way to the right, stays closed and does not change car identity. Discard a dissolve or direct shortcut across the nose.
3. Save the actual last stable frame of the accepted clip in Flow. Use that saved frame as the FIRST frame of B. Do not substitute the separately generated right-side PNG for the real handoff.
4. Repeat the same handoff for B → C → D. If trimming to an earlier stable frame, trim the preceding clip at that exact frame as well.
5. Compare each target with the accepted starting car. These are AI-generated references, not a shared 3D model: some geometry may differ. If a target would force the car to change shape, first revise the target from the actual saved frame or use Flow Extend. Do not try to hide the mismatch with a dissolve.
6. Inspect the joins at full size. A matching boundary image helps position continuity but does not guarantee matching motion, exposure or geometry. The short stationary holds are intended to make joins easier.

**Extend alternative:** Flow currently supports extension of eligible eight-second Veo clips using Lite. This may preserve scene continuity better when a hard target causes a morph. If using Extend, use the same action text but remove the sentence referring to a supplied last frame; describe that target pose instead. Do not assume Extend accepts the same image inputs as Frames. Review the resulting endpoint before continuing. An extended download may include earlier footage: check it before concatenation so the previous section is not repeated.

## Budget — based on your displayed 5 credits per output

| Allocation | Outputs | Credits |
| --- | ---: | ---: |
| Red, four clips, first pass | 4 | 20 |
| White, four clips, first pass | 4 | 20 |
| Green, four clips, first pass | 4 | 20 |
| Targeted retries across the project | 12 | 60 |
| Remaining reserve | 6 | 30 |
| Total ceiling | 30 | 150 |

The first-pass total is **60 credits**, leaving **90** available. This is a budget, not a promise that the first twelve outputs will all be usable. Google's current table lists Lite at 5 credits for Ultra and 10 for non-Ultra, for 4/6/8-second generations; the price shown in your own Flow settings is the deciding value. If it displays 10, the twelve-output first pass would cost 120 and leave only 30 for retries. Keep outputs set to one: a request producing two videos uses two generations.

Make the red motion work first. If A fails repeatedly, split its orbit into two simpler moves rather than blindly rerolling the same difficult path. One added eight-second segment costs one more generation at the displayed rate. Do not buy white/green attempts until the red path and joining method are acceptable.

## Why explosion stays on one camera angle

This pilot holds the rear camera during disassembly. Combining an orbit from back to front with parts separating adds a second difficult task to the same generation. A later frontward orbit of the already-separated assembly can be an optional extra clip after this sequence works. It is not included in the 60-credit first-pass budget.

## Reference contents

| File | State / role |
| --- | --- |
| `01-front-wide.png` | Wide front-left starting frame, everything closed |
| `02-left-wide.png` | Closed left-flank appearance reference |
| `03-rear-closed-wide.png` | Rear-left settled camera target; 20 remains on front-side panel |
| `04-right-wide.png` | Opposite flank; nose screen-right, upright readable 20 |
| `05-overhead.png` | Closed roof/stripe reference; nose screen-left |
| `06-doors-open.png` | Same rear composition, doors raised, engine cover still closed |
| `07-engine-open.png` | Same rear composition, doors and engine cover raised |
| `08-exploded-open.png` | Artistic separated assembly, doors still raised, four detached wheels |

The overhead reference's screen orientation is an appearance guide, not a requirement to flip or roll the video. The model must physically travel from the preceding camera pose. The exploded image is conceptual, not engineering-verified CAD. Minor geometric drift remains possible in independently generated images. The actual accepted frames govern continuity.

## Colors

This kit intentionally contains the **red pilot**. After its motion is approved, generate corresponding white and green references from these selected poses, retaining decal positions and panel states, then repeat the same four prompts with their palette paragraph changed. Text alone cannot recolor a red start/end image reliably, and Lite does not currently support video-to-video editing. Do not submit the red PNGs while simply asking for a white or green car.

- White: pearl-white panels, black carbon, red/electric-blue stripes, blue 20, red calipers and matching interior accents.
- Green: emerald panels, black carbon, champagne-gold/dark-green stripes, gold 20 and gold calipers, green interior accents.

## Save and return the videos

Download accepted originals without social-media recompression. Suggested filenames: `red-A-orbit.mp4`, `red-B-overhead.mp4`, `red-C-open.mp4`, `red-D-explode.mp4`. Put them in `assets/source/videos/flow-v2/red/`. Keep rejected attempts in a `rejected/` subfolder if needed, not mixed with selected files.

Flow Scenebuilder can arrange, trim and download a scene. Join matching boundary frames without dissolves; keep consistent resolution and frame rate. The final stitched film needs visual review at every boundary. Once accepted footage exists, the website can replace the old film plus separate layered-explosion chapter with one sequence, using the selected film's actual frame count. The old 240-frame count is not a requirement for this longer film.

## Verified product sources

- [Flow model features](https://support.google.com/flow/answer/16352836?hl=en): Lite first/last frames at 4/6/8 seconds; Ingredients and eligible extension at eight seconds; no Lite video-to-video editing.
- [Flow credit costs](https://support.google.com/flow/answer/16526234?co=GENIE.Platform%3DDesktop&hl=en): per-output prices and account differences; check current settings.
- [Save frames, extend and assemble scenes](https://support.google.com/flow/answer/16935718): boundary-frame reuse and scene workflow.

The Flow UI documentation is used here; API model availability is a separate product surface.
