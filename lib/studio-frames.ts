import { STUDIO_FRAMES } from "@/data/studio";

/** Prioritised compressed frame cache with a bounded decoded working set. */
export class StudioFrames {
  private blobs = new Map<number, Blob>();
  private decoded = new Map<number, ImageBitmap>();
  private pending = new Map<number, Promise<ImageBitmap>>();
  private downloads = new Map<number, Promise<Blob>>();
  private controller = new AbortController();
  private queue = new Set<number>();
  private active = 0;
  private target = 0;
  private stopped = false;
  constructor(private size: "desktop" | "mobile") {}
  private fetchFrame(index: number) {
    const blob = this.blobs.get(index);
    if (blob) return Promise.resolve(blob);
    const pending = this.downloads.get(index);
    if (pending) return pending;
    const promise = fetch(`/assets/studio/${this.size}/${String(index).padStart(4, "0")}.webp`, { signal: this.controller.signal })
      .then((response) => { if (!response.ok) throw new Error(`Frame unavailable: ${response.status}`); return response.blob(); })
      .then((value) => { if (!this.stopped) this.blobs.set(index, value); return value; })
      .finally(() => this.downloads.delete(index));
    this.downloads.set(index, promise);
    return promise;
  }
  async get(index: number) {
    this.target = index;
    const cached = this.decoded.get(index);
    if (cached) { this.decoded.delete(index); this.decoded.set(index, cached); return cached; }
    const pending = this.pending.get(index);
    if (pending) return pending;
    const promise = this.fetchFrame(index).then((blob) => createImageBitmap(blob)).then((image) => {
      if (this.stopped) { image.close(); throw new Error("Frame cache disposed"); }
      this.decoded.set(index, image);
      while (this.decoded.size > 24) {
        const oldest = this.decoded.keys().next().value!;
        this.decoded.get(oldest)?.close(); this.decoded.delete(oldest);
      }
      return image;
    }).finally(() => this.pending.delete(index));
    this.pending.set(index, promise);
    return promise;
  }
  warm(index: number) {
    this.target = index;
    for (let d = -12; d <= 24; d++) {
      const i = index + d;
      if (i >= 0 && i < STUDIO_FRAMES && !this.blobs.has(i)) this.queue.add(i);
    }
    this.pump();
  }
  preload() {
    for (let i = 0; i < STUDIO_FRAMES; i++) if (!this.blobs.has(i)) this.queue.add(i);
    this.pump();
  }
  private pump() {
    if (this.stopped) return;
    while (this.active < 4 && this.queue.size) {
      const candidates = [...this.queue];
      const i = candidates.reduce((a, b) => Math.abs(a - this.target) <= Math.abs(b - this.target) ? a : b);
      this.queue.delete(i); this.active++;
      this.fetchFrame(i).catch(() => {}).finally(() => { this.active--; this.pump(); });
    }
  }
  dispose() { this.stopped = true; this.controller.abort(); this.queue.clear(); this.blobs.clear(); this.decoded.forEach((image) => image.close()); this.decoded.clear(); }
}
