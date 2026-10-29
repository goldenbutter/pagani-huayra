/** The original 500vh of film travel remains intact inside the extended hero. */
export const FILM_END = 0.625;
export const EXPLODE_START = 0.665;
export const EXPLODE_END = 0.965;
export type ModuleId =
  | "body"
  | "wing"
  | "engine"
  | "chassis"
  | "wheel-far-front"
  | "wheel-near-front"
  | "wheel-near-rear"
  | "wheel-far-rear";
export type ModuleMotion = {
  id: ModuleId;
  pivot: [number, number];
  assembled: [number, number];
  scale: number;
  start: number;
  end: number;
};
// Coordinates are measured in the generated 1672 × 941 plate. The camera is fixed;
// each intact module travels from its conceptual assembly position to its artwork position.
export const moduleMotions: ModuleMotion[] = [
  {
    id: "wheel-far-front",
    pivot: [165, 140],
    assembled: [370, 270],
    scale: 1,
    start: 0.06,
    end: 0.72,
  },
  {
    id: "wheel-far-rear",
    pivot: [1520, 740],
    assembled: [-340, -140],
    scale: 1,
    start: 0.12,
    end: 0.78,
  },
  {
    id: "chassis",
    pivot: [820, 650],
    assembled: [0, -110],
    scale: 1,
    start: 0.1,
    end: 0.8,
  },
  {
    id: "engine",
    pivot: [1290, 450],
    assembled: [-380, 120],
    scale: 1,
    start: 0.25,
    end: 0.92,
  },
  {
    id: "body",
    pivot: [760, 185],
    assembled: [50, 285],
    scale: 1.12,
    start: 0.02,
    end: 0.66,
  },
  {
    id: "wing",
    pivot: [1390, 130],
    assembled: [-370, 250],
    scale: 1,
    start: 0.12,
    end: 0.72,
  },
  {
    id: "wheel-near-front",
    pivot: [210, 340],
    assembled: [170, 160],
    scale: 1,
    start: 0.04,
    end: 0.65,
  },
  {
    id: "wheel-near-rear",
    pivot: [180, 750],
    assembled: [480, -150],
    scale: 1,
    start: 0.16,
    end: 0.83,
  },
];
export const explodedChapter = {
  number: "05",
  name: "ANATOMY",
  title: "BEYOND THE SURFACE.",
  subtitle: "EVERY PART. ONE EXTRAORDINARY WHOLE.",
  note: "The art of taking it apart.",
  metric: "08",
  unit: "MODULES / ONE VISION",
  detail: "SCROLL BACK TO REASSEMBLE",
  labels: ["CARBON BODY", "V12 POWERTRAIN", "FORGED WHEELS", "CARBON CORE"],
};
