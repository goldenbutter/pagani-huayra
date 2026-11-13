type DecodedFrame = ImageBitmap | HTMLImageElement;

function release(image: DecodedFrame) {
  if ("close" in image) image.close();
}

async function decode(blob: Blob): Promise<DecodedFrame> {
  if (typeof createImageBitmap === "function") return createImageBitmap(blob);
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Retain recently displayed native frames for reverse scrolling. */
export class StudioFrames {
  private decoded = new Map<number, DecodedFrame>();
  private controller = new AbortController();
  constructor(private size: "desktop" | "mobile") {}

  async get(index: number) {
    const cached = this.decoded.get(index);
    if (cached) {
      this.decoded.delete(index);
      this.decoded.set(index, cached);
      return cached;
    }
    const url = `/assets/studio/${this.size}/${String(index).padStart(4, "0")}.webp`;
    const response = await fetch(url, { signal: this.controller.signal });
    if (!response.ok) throw new Error(`Frame unavailable: ${response.status}`);
    const image = await decode(await response.blob());
    if (this.controller.signal.aborted) {
      release(image);
      throw new Error("Frame cache disposed");
    }
    this.decoded.set(index, image);
    if (this.decoded.size > 24) {
      const oldest = this.decoded.keys().next().value!;
      release(this.decoded.get(oldest)!);
      this.decoded.delete(oldest);
    }
    return image;
  }

  dispose() {
    this.controller.abort();
    this.decoded.forEach(release);
    this.decoded.clear();
  }
}
