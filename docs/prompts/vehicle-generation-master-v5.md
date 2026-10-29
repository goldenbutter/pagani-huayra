# Vehicle generation master v5: fixed cockpit and driving side

Future-generation revision, 29 October 2026. The user reported the steering wheel changing physical sides during the Pagani orbit, then checked the generated reference images and found no steering-position error in them. Based on that review, the suspected fault is interior drift introduced during Kling video generation, not an established defect in the reference images. The exact origin has not been independently isolated. Earlier identity-preservation and no-mirroring instructions did not explicitly bind cockpit handedness. Retain the image identity lock as a preventive measure, with particular emphasis on video instructions and checking intermediate frames. This revision changes guidance only. Existing project media and submitted generation records are preserved.

## Configure the vehicle once

Use a clear approved cockpit reference alongside the exterior identity reference. Do not infer driving side from a brand, market stereotype or an ambiguous exterior photograph. Resolve conflicting references before generating more views or paying for video renders.

Fill these fields once and reuse them for every angle, colour and clip:

| Field | Left-hand drive | Right-hand drive |
| --- | --- | --- |
| DRIVE_SIDE | LHD | RHD |
| DRIVER_SIDE | vehicle-left | vehicle-right |
| PASSENGER_SIDE | vehicle-right | vehicle-left |

Vehicle-left/right are defined while seated inside the car facing its nose. They are not screen-left/right. A genuine centre-drive vehicle needs its own explicitly specified layout; do not force it into LHD or RHD.

Also fill `VEHICLE`, `EXTERIOR_REFERENCE`, `COCKPIT_REFERENCE`, `LIVERY` and `VIEW_OR_ACTION`. Replace every placeholder before submission. The cockpit reference is the authority for interior layout. Correct contradictory target images before using them.

## Reusable image prompt

```text
Create a photorealistic image of [VEHICLE], using [EXTERIOR_REFERENCE] for exterior identity and [COCKPIT_REFERENCE] for the exact interior configuration. Preserve [LIVERY].

FIXED VEHICLE IDENTITY: This car is [DRIVE_SIDE]. Its ONE physical steering wheel and steering column are installed on [DRIVER_SIDE], directly in front of the driver's seat and instrument cluster. The pedal box belongs to that same driver position. The passenger position remains on [PASSENGER_SIDE]. Preserve the dashboard shape, instrument binnacle, centre tunnel and steering-column-to-driver-seat relationship from the cockpit reference. The wheel and column never migrate across the centre tunnel, change seats or appear in both positions.

Vehicle-left/right are the car's own sides when facing forward inside the cabin. The wheel's projected screen position may change with perspective; its physical installation side must not. Preserve natural occlusion through glass and behind pillars. Reflections must remain consistent with one physical steering wheel, without a second wheel or mirrored replacement cockpit.

Create the requested angle by moving the camera around the same unchanged vehicle. NEVER horizontally flip the car, mirror the cockpit, swap driver and passenger positions, or manufacture an opposite-side view by mirroring an existing image. Preserve asymmetric vehicle details. Recolouring changes only the specified paint and trim, never driving side or interior layout.

REQUESTED VIEW OR ACTION: [VIEW_OR_ACTION].

For open-door and exploded-assembly views, retain the steering wheel, steering column, dashboard and seats in their original relationships within the cockpit/chassis assembly. Opening panels or separating body modules must not rebuild, mirror or relocate the cockpit. Only the named parts move. Maintain the approved studio, lighting, proportions and materials.
```

## Reusable video prompt

```text
Animate the same [VEHICLE] between the supplied, validated first and last frames. Follow this continuous camera path or mechanical action: [VIEW_OR_ACTION]. Preserve [LIVERY] and [COCKPIT_REFERENCE] throughout every intermediate frame.

COCKPIT CONTINUITY IS MANDATORY: This exact vehicle is [DRIVE_SIDE]. Its single steering wheel, steering column, driver seat, instrument cluster and pedal box remain at their original [DRIVER_SIDE] installation. The passenger position stays on [PASSENGER_SIDE]. Keep the centre tunnel and asymmetric dashboard geometry unchanged. Do not swap driver and passenger sides, slide the steering wheel across the cabin, duplicate it, replace the interior or mirror the cockpit during the orbit, overhead move, opening, explosion or reassembly.

Vehicle-left/right are fixed to the vehicle, facing forward from inside the cabin. They are not fixed screen coordinates. Screen position, visibility and reflections change naturally with the camera; the physical driver position does not. Maintain the same hidden cockpit layout during occlusion so that it reappears correctly in the next view.

Use continuous perspective and parallax around one stationary car. No image flips, mirrored opposite-side views, cuts, dissolves, cockpit morphs or geometry substitutions. Match each accepted clip's actual final frame at the next clip's start. Preserve the original cockpit/chassis relationships during opening and exploded assembly. Do not use a contradictory target frame to force a driving-side change.

[INSERT DURATION, TIMING, FRAMING, PANEL STATES AND LIGHTING HERE.]
```

## Continuity checks before accepting future output

1. Confirm the selected driving side against a clear cockpit reference before generating the multi-view set.
2. Inspect front-left, front-right, overhead and open-door images at full resolution. Compare the steering wheel to the driver seat, centre tunnel and instrument cluster. Do not judge by its screen coordinate alone or call an obscured cockpit verified.
3. Reject mirrored or contradictory reference images before spending credits on their video segments. Apply the same check to recoloured variants.
4. Inspect video intermediate views, especially through both sides of the windshield, near side profile, overhead and during door opening. Inspect additional frames wherever cockpit visibility changes. Matching endpoints alone does not establish interior continuity.
5. If the wheel changes physical seats or sides, do not accept the clip or propagate its frame into another paid generation. Diagnose the references and prompt first. Keep retries within the authorised budget and scope.
6. Record cockpit continuity separately from camera continuity. Prompt wording reduces ambiguity but cannot guarantee a generative model's geometric consistency; inspect the output before acceptance.

Current Pagani scope: prompt guidance only. Do not regenerate or repair existing media, or spend credits, unless the user later requests that work.
