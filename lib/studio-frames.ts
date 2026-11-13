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

/** The renderer requests one full-size frame at a time and retains recent shots for reverse scrolling. */
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

/** One small image covers both films, including the jump into the anatomy sequence. */
export class StudioPreview {
  private sheet = new Image();
  private tile = document.createElement("canvas");
  private ctx = this.tile.getContext("2d")!;
  constructor(onLoad: (available: boolean) => void) {
    this.sheet.onload = () => onLoad(true);
    this.sheet.onerror = () => onLoad(false);
    this.tile.width = 256;
    this.tile.height = 144;
    this.sheet.src = "/assets/studio/scrub-preview.webp";
  }
  get(index: number) {
    if (!this.sheet.complete || !this.sheet.naturalWidth) return null;
    const tile = index / 8;
    const { width, height } = this.tile;
    this.ctx.drawImage(this.sheet, (tile % 12) * width, Math.floor(tile / 12) * height,
      width, height, 0, 0, width, height);
    return this.tile;
  }
}
