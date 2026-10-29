export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));
export const ease = [0.16, 1, 0.3, 1] as const;
export const frameAt = (progress: number, count = 240) =>
  Math.round(clamp(progress) * (count - 1));
