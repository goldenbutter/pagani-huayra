# Reviewed prompt and reference plan

This revision incorporates the user's actual original video prompt, supplied after v2/v3 were drafted. That original prompt DOES specify a continuous camera path and explicitly forbids cuts, dissolves, morphing and teleportation. Missing continuity wording is therefore not the explanation. The visible source-video failures remain real; the precise cause inside the video generator is not established.

## Conflicts in the supplied original prompt

1. **Orbit side versus endpoint:** the video prompt mandates the RIGHT side and forbids the left side. The saved rear-image generation brief explicitly requests a REAR-LEFT view. Vehicle-left/right must be defined relative to facing forward in the car, not the viewer's screen. Resolve the reference orientation before making the orbit binding.
2. **Strict start image versus framing:** the uploaded front reference fills nearly the frame width. Reproducing that exact starting view conflicts with keeping the car at 55–65% width from the outset. Prepare a wider starting reference; do not demand two different initial compositions.
3. **Visibility versus occlusion:** requiring headlights, front bumper and rear bodywork all to remain fully visible at every angle is physically incompatible with an orbit. The complete projected silhouette must stay inside the frame, while surfaces on the far side must be allowed to disappear naturally behind the car.
4. **Timing versus opening:** the duration is stated as 8–10 seconds, but the timeline runs to 10. The camera only settles at 8.5 seconds and the last 1.5 seconds must serve as both a hold and slow door/engine opening. At an eight-second output duration the specified arrival and opening windows cannot fit at all.
5. **Endpoint identity:** the front image has 20 on the front-side panel; the rear edit deliberately moves it to the rear fender. The two still prompts also use different lens/elevation descriptions. A strict endpoint match is not an exact representation of the same unchanged car and camera setup.
6. **Livery wording:** the original video prompt adds blue/white stripes, while the red reference brief specifies red/electric-blue stripes over carbon. Use the actual reference palette without adding another stripe color.
7. **Expanded request:** the original right-side-only, no-left/no-straight-rear restrictions cannot support the newer both-sides/top-view tour. The new sequence also requires a longer choreography and an exploded endpoint instead of the old open-engine endpoint.

## Reference plan — red first

Create one consistent set, with a single approved livery map, fixed wheel design, fixed physical number location, matching white studio lighting, and sufficient framing margins. Show each view in its own image, not a collage used as a mandatory video frame.

1. Wide front three-quarter, closed car: approved starting frame, car about 60% of frame width.
2. Left profile, closed car: identity reference for this side.
3. Rear three-quarter, closed car: establishes rear geometry before anything opens.
4. Right profile, closed car: identity reference for the opposite side, preserving rather than mirroring real asymmetries.
5. Overhead, closed car: roof/hood/stripe continuity reference.
6. Elevated rear three-quarter, closed car: the camera's settled opening position.
7. SAME camera, doors open and engine cover closed: hinge-motion target.
8. SAME camera, doors and engine cover open: exposed-engine target.
9. SAME perspective, exploded assembly: the original parts separate, retaining the open-door state. The current exploded artwork's closed-door body shell is not an exact endpoint for this state.

Reference images alone do not encode the camera's movement. Which images become ordered keyframes, appearance references, or continuation endpoints depends on the actual generator and mode. Do not assume uploading nine pictures enforces nine chronological stops. Check the tool/mode before generating the complete set. Validate red before making white/green equivalents.

## Revised master prompt — expanded continuous take

Create one uninterrupted 24-second photorealistic automotive visualization of the exact Pagani Huayra BC in the approved RED reference set. One stationary car, one continuously moving camera, one white infinity-cove studio. Preserve the car geometry, wheel design, red paint, exposed carbon, red/electric-blue stripes, red calipers and the electric-blue 20 fixed to its approved physical panel. Do not relocate or duplicate markings. Vehicle-left and vehicle-right mean the car's own sides when facing forward in its cabin.

Begin from the approved wide front three-quarter frame, with the car approximately 60% of frame width. Keep the complete projected vehicle silhouette inside the frame with generous margins throughout. Natural self-occlusion is required: front lights disappear from view as the camera moves behind the car, and far-side components may be hidden by nearer bodywork. Do not try to show every surface simultaneously.

Use one fixed focal length and consistent lighting/exposure. Show perspective and reflections changing naturally with continuous camera travel. The car does not rotate or slide. The following timings are milestones within the SAME take, not separate shots:

0–6 seconds: glide from the starting front three-quarter view along the left side, around the rear, and toward the right profile. Show all intermediate camera positions, including the rear passage. Keep doors and engine cover closed.

6–9 seconds: smoothly crane upward from the right side and over the roof to a clear overhead view, showing the entire ascent. No abrupt tilt, roll or viewpoint substitution.

9–12 seconds: follow a continuous curved descent into the approved elevated rear three-quarter view and ease the camera to a stop. All panels remain closed until the camera has settled.

12–15 seconds: hold this camera position as both doors open on their existing hinges. Keep the engine cover closed.

15–18 seconds: keep the doors open and the camera stationary while the rear engine cover lifts on its existing hinges. Reveal the existing engine without changing body geometry.

18–23 seconds: from this exact pose, smoothly separate the car into an artistic exploded assembly. Keep the chassis anchored. Lift the upper body assembly with its doors remaining open; separate the existing wing and engine; move exactly four existing wheel-and-tire assemblies outward from their hubs. Every module follows a continuous path from its original position. Preserve panel relationships, materials, scale, orientation and lighting. Use controlled staggered movements with clear gaps. No part appears from nowhere. If extra framing space is necessary, use a slow continuous backward camera dolly with no lens change.

23–24 seconds: hold the finished assembly. No reset or return to the front.

Maintain one spatially continuous scene throughout. No cuts, dissolves, crossfades, superimposed cars, photograph morphs, mirrored geometry, teleporting camera, changing livery, extra wheels or disappearing parts. Clean 16:9 composition, crisp photographic materials, no text overlays or watermark. This is an elegant technical design visualization, not a violent explosion.

## Use notes

- The proposed 24-second duration is a creative plan; support for that duration in a single generation has not been verified. An eight-second setting cannot execute this timeline.
- This prompt assumes the prepared, consistent reference set exists. Do not label the existing mismatched front/rear/exploded assets as that approved set.
- For white and green, replace only the palette paragraph with the approved matching livery; retain the camera, timing and physical decal placement. Shared text does not guarantee identical generated motion.
- Do not feed timing instructions for nine ordered images into a mode that only accepts one start and one end frame. The mode-specific adaptation remains pending the user's generator details.
- A generated result must still be reviewed frame by frame. These corrections resolve contradictions; they cannot guarantee a successful complex one-take generation.
