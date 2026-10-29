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

export type FilmStory = {
  key: string; number: string; label: string; title: string; emphasis: string;
  description: string; mobileDescription: string; metric: string; unit: string;
};
const stories: Record<string, FilmStory> = {
  origin: { key: "origin", number: "01", label: "THE ORIGIN", title: "A moving", emphasis: "sculpture.", description: "The Huayra BC brings sculptural form and mechanical intent together. A single car, revealed from every perspective.", mobileDescription: "Sculptural form. Mechanical intent. One unmistakable Huayra BC.", metric: "HUAYRA", unit: "BC / ART MEETS ENGINEERING" },
  form: { key: "form", number: "02", label: "THE MATERIAL", title: "Shaped by", emphasis: "purpose.", description: "A carbo-titanium monocoque at its core. Exposed weave and sculpted surfaces give the engineering a visible expression.", mobileDescription: "Carbo-titanium at its core. Engineering expressed in every surface.", metric: "C + Ti", unit: "CARBO-TITANIUM MONOCOQUE" },
  above: { key: "above", number: "03", label: "THE PERSPECTIVE", title: "Every line,", emphasis: "considered.", description: "From above, the roof, bodywork and racing stripes become one continuous composition. A different angle on the same idea.", mobileDescription: "Roof, bodywork and racing stripes. One continuous composition.", metric: "FORM", unit: "FROM EVERY PERSPECTIVE" },
  doors: { key: "doors", number: "04", label: "THE INVITATION", title: "An invitation", emphasis: "inside.", description: "The gullwing doors lift to reveal a world of leather, exposed carbon and finely machined metal. The theatre of entry.", mobileDescription: "Gullwing doors reveal leather, carbon and finely machined metal.", metric: "GULLWING", unit: "THE THEATRE OF ENTRY" },
  engine: { key: "engine", number: "05", label: "THE POWER", title: "The mechanical", emphasis: "heart.", description: "A 5,980 cc twin-turbo V12, developed by Mercedes-AMG for Pagani. The engine cover rises and the heart of the car comes into view.", mobileDescription: "The cover rises to reveal the 5,980 cc twin-turbo AMG V12.", metric: "764", unit: "CV / 1,000 NM OF TORQUE" },
  return: { key: "return", number: "06", label: "THE RETURN", title: "Everything", emphasis: "comes together.", description: "The panels close. The silhouette returns. One complete machine, ready to continue the journey.", mobileDescription: "The panels close. The silhouette returns. The journey continues.", metric: "ONE", unit: "COMPLETE MACHINE" },
  anatomy: { key: "anatomy", number: "01", label: "A CLOSER LOOK", title: "Beneath the", emphasis: "sculpture.", description: "Follow the car around its left flank. Beyond the bodywork, a second story is waiting to be revealed.", mobileDescription: "A short orbit. A closer look at the engineering beneath.", metric: "V12", unit: "ENGINEERING IN VIEW" },
  reveal: { key: "reveal", number: "02", label: "THE REVEAL", title: "Open to", emphasis: "discovery.", description: "The doors and engine cover lift once more. The cockpit, structure and powertrain begin to reveal their relationship.", mobileDescription: "Doors and engine cover lift. The architecture comes into view.", metric: "6.0", unit: "LITRE / AMG BITURBO V12" },
  exploded: { key: "exploded", number: "03", label: "EXPLODED STUDY", title: "Every part.", emphasis: "A purpose.", description: "Select a labelled component to explore its place in the whole.", mobileDescription: "Select a component to explore its place in the whole.", metric: "06", unit: "COMPONENT GROUPS TO EXPLORE" },
  reassemble: { key: "reassemble", number: "04", label: "THE RETURN", title: "One complete", emphasis: "vision.", description: "Each component returns to the whole. The body closes around its engineering, and the car is ready to move on.", mobileDescription: "Every component returns. The body closes. The car moves on.", metric: "ONE", unit: "COMPLETE MACHINE" },
};

// These chapters follow the painted source frame, not a timer or download target.
export function filmStory(id: FilmId, frame: number, returning: boolean) {
  if (returning) return stories[id === "explore" ? "return" : "reassemble"];
  if (id === "anatomy") return stories[frame >= 825 ? "exploded" : frame > 672 ? "reveal" : "anatomy"];
  return stories[frame >= 750 ? "engine" : frame > 672 ? "doors" : frame > 432 ? "above" : frame >= 80 ? "form" : "origin"];
}
export const partFacts: Record<string, { metric: string; unit: string }> = {
  body: { metric: "CARBON", unit: "SCULPTED EXTERIOR" },
  front: { metric: "20″", unit: "FRONT / ROAD CONFIGURATION" },
  chassis: { metric: "C + Ti", unit: "CARBO-TITANIUM MONOCOQUE" },
  wing: { metric: "AERO", unit: "REAR WING" },
  engine: { metric: "764", unit: "CV / 1,000 NM OF TORQUE" },
  rear: { metric: "21″", unit: "REAR / ROAD CONFIGURATION" },
};
