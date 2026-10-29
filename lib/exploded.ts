import type { ColorId } from "@/data/carData";
import type { ModuleId } from "@/data/explodedData";
export type RenderModule = {
  id: ModuleId;
  bounds: [number, number, number, number];
  canvas: HTMLCanvasElement;
};
type Region = {
  id: ModuleId;
  bounds: [number, number, number, number];
  runs: [number, number, number][];
};
type Plate = { width: number; height: number; layers: Region[] };
export function releaseModules(modules: RenderModule[]) {
  for (const part of modules) {
    part.canvas.width = 0;
    part.canvas.height = 0;
  }
}
export async function loadExploded(
  color: ColorId,
  signal: AbortSignal,
): Promise<RenderModule[]> {
  const [art, regions] = await Promise.all([
    fetch(`/assets/images/exploded/${color}.webp`, { signal }),
    fetch(`/assets/images/exploded/${color}.json`, { signal }),
  ]);
  if (!art.ok || !regions.ok) throw new Error("Assembly artwork unavailable");
  const [blob, plate]: [Blob, Plate] = await Promise.all([
    art.blob(),
    regions.json(),
  ]);
  if (plate.layers.length !== 8) throw new Error("Incomplete assembly");
  const url = URL.createObjectURL(blob),
    image = new Image();
  try {
    image.src = url;
    await image.decode();
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    if (
      image.naturalWidth !== plate.width ||
      image.naturalHeight !== plate.height
    )
      throw new Error("Assembly dimensions mismatch");
    const source = document.createElement("canvas");
    source.width = plate.width;
    source.height = plate.height;
    const sourceContext = source.getContext("2d", { willReadFrequently: true });
    if (!sourceContext) throw new Error("Canvas unavailable");
    sourceContext.drawImage(image, 0, 0);
    const pixels = sourceContext.getImageData(
      0,
      0,
      source.width,
      source.height,
    ).data;
    source.width = 0;
    source.height = 0;
    // Region data only partitions the existing alpha artwork. Nothing is redrawn
    // or synthesized here; the original painted pixels are retained in each part.
    return plate.layers.map((region) => {
      const [x, y, w, h] = region.bounds;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas unavailable");
      const data = context.createImageData(w, h);
      for (const [row, start, length] of region.runs) {
        const from = ((y + row) * plate.width + x + start) * 4;
        data.data.set(
          pixels.subarray(from, from + length * 4),
          (row * w + start) * 4,
        );
      }
      context.putImageData(data, 0, 0);
      return { id: region.id, bounds: region.bounds, canvas };
    });
  } finally {
    URL.revokeObjectURL(url);
    image.src = "";
  }
}
