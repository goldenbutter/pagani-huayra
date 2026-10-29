import { FRAME_COUNT, type ColorId } from "@/data/carData";

// Preload compressed frames; keep only a small decoded working set in memory.
// Holding 720 full-resolution decoded frames would cost multiple gigabytes.
export class Sequence {
  private blobs: Blob[] = [];
  private decoded = new Map<number, ImageBitmap | HTMLImageElement>();
  private inflight = new Map<number, Promise<ImageBitmap | HTMLImageElement>>();
  private disposed = false;
  constructor(
    private color: ColorId,
    private size: "desktop" | "mobile",
    private signal: AbortSignal,
  ) {}
  async preload(onProgress: (value: number) => void) {
    let cursor = 0,
      complete = 0;
    const worker = async () => {
      while (cursor < FRAME_COUNT && !this.signal.aborted) {
        const i = cursor++;
        const response = await fetch(
          `/assets/sequences/${this.color}/${this.size}/${i + 1}.jpg`,
          { signal: this.signal, cache: "force-cache" },
        );
        if (!response.ok)
          throw new Error(`Frame ${i + 1} could not load (${response.status})`);
        this.blobs[i] = await response.blob();
        onProgress(Math.round((++complete / FRAME_COUNT) * 100));
      }
    };
    await Promise.all(Array.from({ length: 8 }, worker));
  }
  async get(index: number): Promise<ImageBitmap | HTMLImageElement> {
    if (this.disposed || this.signal.aborted)
      throw new DOMException("Disposed", "AbortError");
    const cached = this.decoded.get(index);
    if (cached) {
      this.decoded.delete(index);
      this.decoded.set(index, cached);
      return cached;
    }
    const pending = this.inflight.get(index);
    if (pending) return pending;
    const blob = this.blobs[index];
    if (!blob) throw new Error("Frame unavailable");
    const promise = (async () => {
      let result: ImageBitmap | HTMLImageElement;
      if (typeof createImageBitmap === "function")
        result = await createImageBitmap(blob);
      else
        result = await new Promise<HTMLImageElement>((resolve, reject) => {
          const url = URL.createObjectURL(blob),
            image = new Image();
          image.onload = () => {
            URL.revokeObjectURL(url);
            resolve(image);
          };
          image.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Image decode failed"));
          };
          image.src = url;
        });
      if (this.disposed) {
        if ("close" in result) result.close();
        throw new DOMException("Disposed", "AbortError");
      }
      this.decoded.set(index, result);
      while (this.decoded.size > 18) {
        const oldest = this.decoded.keys().next().value!;
        const frame = this.decoded.get(oldest)!;
        if ("close" in frame) frame.close();
        this.decoded.delete(oldest);
      }
      return result;
    })();
    this.inflight.set(index, promise);
    try {
      return await promise;
    } finally {
      this.inflight.delete(index);
    }
  }
  dispose() {
    this.disposed = true;
    for (const frame of this.decoded.values())
      if ("close" in frame) frame.close();
    this.decoded.clear();
    this.blobs = [];
    this.inflight.clear();
  }
}
