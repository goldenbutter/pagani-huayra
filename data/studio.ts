export const STUDIO_FRAMES = 913;
export const POSTER = "/assets/studio/poster.webp";
export type FilmId = "explore" | "anatomy";
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const smooth = (v: number) => v * v * (3 - 2 * v);

// Both scenes reuse the accepted source frames. Returns require no extra media.
export function filmState(id: FilmId, progress: number) {
  const p = clamp01((progress - 0.035) / 0.93);
  const holdStart = id === "explore" ? 0.46 : 0.40;
  const holdEnd = id === "explore" ? 0.53 : 0.63;
  const returning = p > holdEnd;
  const position = p < holdStart ? p / holdStart : p <= holdEnd ? 1 : (1 - p) / (1 - holdEnd);
  const step = Math.round(clamp01(position) * (id === "explore" ? 792 : 360));
  const frame = id === "explore" || step <= 120 ? step : 672 + step - 120;
  let title = "A sculpture in motion.";
  let chapter = "01 / THE ORBIT";
  if (id === "explore") {
    if (frame > 432) { title = "Another perspective."; chapter = "02 / FROM ABOVE"; }
    if (frame > 672) { title = "The theatre of entry."; chapter = "03 / OPEN TO POSSIBILITY"; }
  } else {
    title = "Beneath the sculpture."; chapter = "01 / A CLOSER LOOK";
    if (frame > 672) { title = "Meet the heart."; chapter = "02 / THE REVEAL"; }
    if (frame > 792) { title = "Every part. A purpose."; chapter = "03 / EXPLODED STUDY"; }
  }
  if (returning) { title = "Becoming whole again."; chapter = "04 / THE RETURN"; }
  return { frame, returning, title, chapter, position, progress: p };
}

export const partLabels = [
  { id: "body", name: "Body shell", detail: "The sculpted exterior lifts away to reveal the architecture beneath.", start: [0.43, 0.40], end: [0.42, 0.24], label: [0.06, 0.10] },
  { id: "front", name: "Front wheels", detail: "20-inch forged aluminium front wheels in the road configuration.", start: [0.30, 0.54], end: [0.115, 0.60], label: [0.025, 0.49] },
  { id: "chassis", name: "Carbon chassis", detail: "A carbo-titanium monocoque forms the core of the production Huayra BC.", start: [0.49, 0.66], end: [0.47, 0.68], label: [0.06, 0.94] },
  { id: "wing", name: "Rear wing", detail: "A separate aerodynamic element above the rear of the car.", start: [0.62, 0.25], end: [0.81, 0.15], label: [0.96, 0.04] },
  { id: "engine", name: "V12 engine", detail: "A 5,980 cc twin-turbo AMG V12: 764 CV and 1,000 Nm.", start: [0.55, 0.51], end: [0.77, 0.42], label: [0.98, 0.38] },
  { id: "rear", name: "Rear wheels", detail: "21-inch forged aluminium rear wheels deliver drive to the road.", start: [0.67, 0.64], end: [0.88, 0.71], label: [0.98, 0.94] },
] as const;
