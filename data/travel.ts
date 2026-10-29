import { clamp01, smooth } from "./studio";

// The closed-car orbit returns to its starting viewpoint at frame 432, then
// rises toward the roof. Use that continuous path for the section handoffs.
export const travelPoses: Record<string, number> = {
  hero: 0, explore: 0, story: 64, design: 300,
  anatomy: 432, specs: 488, craft: 552, finale: 432,
};

export function travelFrame(from: string, to: string, progress: number) {
  const t = clamp01(progress), a = travelPoses[from] ?? 0, b = travelPoses[to] ?? 0;
  // A restrained side-to-front turn on the first approach to the orbit film.
  const position = from === "hero" && to === "explore"
    ? 64 * Math.sin(t * Math.PI) ** 2
    : a + (b - a) * smooth(t);
  const frame = Math.round(position);
  // Exact original pose at film boundaries; frame 432 is the same viewpoint.
  return frame === 432 ? 0 : frame;
}
