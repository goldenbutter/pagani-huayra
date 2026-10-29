/** A small, reusable alpha matte for the existing photographic orbit frames.
 * Border-connected studio white is transparent; enclosed highlights stay solid.
 * Work at preview resolution, not a full-HD flood fill on every scroll frame.
 */
export class TravelMatte {
  private width = 512;
  private height = 288;
  private size = this.width * this.height;
  private sample = document.createElement("canvas");
  private labels = new Int32Array(this.size);
  private queue = new Int32Array(this.size);
  private cache = new Map<number, ImageData>();
  readonly output = document.createElement("canvas");

  constructor(width: number) {
    this.sample.width = this.width; this.sample.height = this.height;
    this.output.width = width; this.output.height = Math.round(width * 9 / 16);
  }

  draw(image: CanvasImageSource, frame: number) {
    const c = this.sample.getContext("2d", { willReadFrequently: true })!;
    let matte = this.cache.get(frame);
    if (!matte) {
      c.clearRect(0, 0, this.width, this.height);
      c.drawImage(image, 0, 0, this.width, this.height);
      const pixels = c.getImageData(0, 0, this.width, this.height), d = pixels.data;
      const labels = this.labels, q = this.queue, w = this.width, size = this.size;
      labels.fill(0);
      let head = 0, tail = 0;
      const visit = (i: number) => {
        if (i < 0 || i >= size || labels[i]) return;
        const r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2];
        if (Math.min(r, g, b) > 198 && Math.max(r, g, b) - Math.min(r, g, b) < 35) {
          labels[i] = -1; q[tail++] = i;
        }
      };
      for (let x = 0; x < w; x++) { visit(x); visit(size - w + x); }
      for (let y = 0; y < this.height; y++) { visit(y * w); visit(y * w + w - 1); }
      while (head < tail) {
        const i = q[head++];
        if (i % w) visit(i - 1); if (i % w < w - 1) visit(i + 1);
        visit(i - w); visit(i + w);
      }
      // The car is the largest connected foreground, not the detached reflection.
      let group = 0, largest = 0, largestSize = 0;
      for (let start = 0; start < size; start++) {
        if (labels[start]) continue;
        group++; head = 0; tail = 1; q[0] = start; labels[start] = group;
        while (head < tail) {
          const i = q[head++];
          const push = (n: number) => { if (n >= 0 && n < size && !labels[n]) { labels[n] = group; q[tail++] = n; } };
          if (i % w) push(i - 1); if (i % w < w - 1) push(i + 1);
          push(i - w); push(i + w);
        }
        if (tail > largestSize) { largestSize = tail; largest = group; }
      }
      for (let i = 0; i < size; i++) {
        const keep = labels[i] === largest || (i % w > 0 && labels[i - 1] === largest) ||
          (i % w < w - 1 && labels[i + 1] === largest) || labels[i - w] === largest || labels[i + w] === largest;
        d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = 255;
        d[i * 4 + 3] = keep ? 255 : 0;
      }
      matte = pixels;
      this.cache.set(frame, matte);
      if (this.cache.size > 36) this.cache.delete(this.cache.keys().next().value!);
    }
    c.putImageData(matte, 0, 0);
    const out = this.output.getContext("2d")!;
    out.clearRect(0, 0, this.output.width, this.output.height);
    out.globalCompositeOperation = "source-over";
    out.drawImage(image, 0, 0, this.output.width, this.output.height);
    out.globalCompositeOperation = "destination-in";
    out.filter = "blur(1px)";
    out.drawImage(this.sample, 0, 0, this.output.width, this.output.height);
    out.filter = "none"; out.globalCompositeOperation = "source-over";
    return this.output;
  }
}
