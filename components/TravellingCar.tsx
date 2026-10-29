"use client";
import { useEffect, useRef, useState } from "react";
import { StudioFrames } from "@/lib/studio-frames";
import { clamp01, filmState, partLabels, POSTER, smooth, type FilmId } from "@/data/studio";
import { useExperience } from "./ExperienceProvider";

type Box = { x: number; y: number; w: number; h: number };
type AnnotationState = { frame: number; box: Box; width: number; height: number; visible: boolean };
const initial: AnnotationState = { frame: 0, box: { x: 0, y: 0, w: 0, h: 0 }, width: 0, height: 0, visible: false };
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

function edgeMask() {
  const mask = document.createElement("canvas"); mask.width = 1280; mask.height = 720;
  const c = mask.getContext("2d")!;
  const horizontal = c.createLinearGradient(0, 0, 1280, 0);
  horizontal.addColorStop(0, "transparent"); horizontal.addColorStop(0.045, "#fff"); horizontal.addColorStop(0.955, "#fff"); horizontal.addColorStop(1, "transparent");
  c.fillStyle = horizontal; c.fillRect(0, 0, 1280, 720); c.globalCompositeOperation = "destination-in";
  const vertical = c.createLinearGradient(0, 0, 0, 720);
  vertical.addColorStop(0, "transparent"); vertical.addColorStop(0.05, "#fff"); vertical.addColorStop(0.86, "#fff"); vertical.addColorStop(1, "transparent");
  c.fillStyle = vertical; c.fillRect(0, 0, 1280, 720);
  return mask;
}

// Isolate the stationary front-view photograph for travelling. Border-connected
// studio pixels are removed; enclosed interior highlights remain opaque.
function travellingCutout(image: CanvasImageSource) {
  const canvas = document.createElement("canvas"); canvas.width = 1280; canvas.height = 720;
  const c = canvas.getContext("2d", { willReadFrequently: true })!;
  c.drawImage(image, 0, 0, 1280, 720);
  const pixels = c.getImageData(0, 0, 1280, 720), data = pixels.data;
  const size = 1280 * 720, visited = new Uint8Array(size), queue = new Int32Array(size);
  let head = 0, tail = 0;
  const visit = (i: number) => {
    if (i < 0 || i >= size || visited[i]) return;
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    if (Math.min(r, g, b) > 198 && Math.max(r, g, b) - Math.min(r, g, b) < 35) { visited[i] = 1; queue[tail++] = i; }
  };
  for (let x = 0; x < 1280; x++) { visit(x); visit(size - 1280 + x); }
  for (let y = 0; y < 720; y++) { visit(y * 1280); visit(y * 1280 + 1279); }
  while (head < tail) { const i = queue[head++]; if (i % 1280) visit(i - 1); if (i % 1280 < 1279) visit(i + 1); visit(i - 1280); visit(i + 1280); }
  // Keep only the car's largest connected foreground, excluding detached floor reflections.
  const foreground = new Uint8Array(size); let largest: number[] = [];
  for (let start = 0; start < size; start++) {
    if (visited[start] || foreground[start]) continue;
    const group: number[] = []; head = 0; tail = 0; queue[tail++] = start; foreground[start] = 1;
    while (head < tail) {
      const i = queue[head++]; group.push(i);
      for (const n of [i % 1280 ? i - 1 : -1, i % 1280 < 1279 ? i + 1 : -1, i - 1280, i + 1280]) {
        if (n >= 0 && n < size && !visited[n] && !foreground[n]) { foreground[n] = 1; queue[tail++] = n; }
      }
    }
    if (group.length > largest.length) largest = group;
  }
  const keep = new Uint8Array(size);
  for (const i of largest) {
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const x = i % 1280 + dx, y = Math.floor(i / 1280) + dy;
      if (x >= 0 && x < 1280 && y >= 0 && y < 720) keep[y * 1280 + x] = 1;
    }
  }
  for (let i = 0; i < size; i++) if (!keep[i]) data[i * 4 + 3] = 0;
  // A softened outer contour avoids a hard cutout edge on the travelling car.
  const matte = document.createElement("canvas"); matte.width = 1280; matte.height = 720;
  const mc = matte.getContext("2d")!;
  mc.putImageData(pixels, 0, 0);
  c.clearRect(0, 0, 1280, 720); c.drawImage(image, 0, 0, 1280, 720);
  c.globalCompositeOperation = "destination-in"; c.filter = "blur(1.1px)"; c.drawImage(matte, 0, 0); c.filter = "none"; c.globalCompositeOperation = "source-over";
  return canvas;
}

export default function TravellingCar({ selected, onSelectPart }: { selected: string; onSelectPart: (id: string) => void }) {
  const { reduced } = useExperience();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [annotations, setAnnotations] = useState<AnnotationState>(initial);
  useEffect(() => {
    const retry = () => setAttempt((n) => n + 1);
    window.addEventListener("studio-retry", retry);
    return () => window.removeEventListener("studio-retry", retry);
  }, []);
  useEffect(() => {
    if (reduced || matchMedia("(prefers-reduced-motion: reduce)").matches) { document.documentElement.dataset.studioReady = "false"; return; }
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    let alive = true, raf = 0, frame = 0, requested = -1, prepared = false, cutout: HTMLCanvasElement | null = null;
    let width = 0, height = 0, lastPaint = "", lastAnnotation = 0, failed = false, preloading = false, lastStoryFrame = "";
    const store = new StudioFrames(innerWidth < 768 ? "mobile" : "desktop");
    const mask = edgeMask(), photo = document.createElement("canvas"); photo.width = 1280; photo.height = 720;
    const pc = photo.getContext("2d")!;
    const slots = [...document.querySelectorAll<HTMLElement>("[data-car-slot]")];
    const films = [...document.querySelectorAll<HTMLElement>("[data-film]")];
    const status = (value: string) => window.dispatchEvent(new CustomEvent("studio-status", { detail: value }));
    const prepare = (image: CanvasImageSource, index: number) => {
      pc.clearRect(0, 0, 1280, 720); pc.globalCompositeOperation = "source-over"; pc.drawImage(image, 0, 0, 1280, 720);
      pc.globalCompositeOperation = "destination-in"; pc.drawImage(mask, 0, 0); pc.globalCompositeOperation = "source-over";
      if (!cutout && index === 0) cutout = travellingCutout(image);
      frame = index; prepared = true; lastPaint = "";
      document.documentElement.dataset.studioReady = "true";
    };
    const poster = new Image(); poster.onload = () => { if (alive && !prepared) prepare(poster, 0); }; poster.src = POSTER;
    const tick = (now: number) => {
      if (!alive) return;
      raf = requestAnimationFrame(tick);
      const w = innerWidth, h = innerHeight, ratio = Math.min(devicePixelRatio || 1, 1.5);
      // Download the full film only after the visitor starts exploring.
      if (!preloading && scrollY > 64 && films.some((film) => film.getBoundingClientRect().top < h + 600)) { preloading = true; store.preload(); }
      if (width !== w || height !== h) { width = w; height = h; el.width = Math.round(w * ratio); el.height = Math.round(h * ratio); lastPaint = ""; }
      const keys: (Box & { at: number; id: string })[] = [];
      for (const slot of slots) {
        const r = slot.getBoundingClientRect(), id = slot.dataset.carSlot!;
        const value = { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, id };
        const film = slot.closest<HTMLElement>("[data-film]");
        if (film) { const start = film.getBoundingClientRect().top + scrollY; keys.push({ ...value, at: start }, { ...value, at: start + film.offsetHeight - h }); }
        else keys.push({ ...value, at: id === "hero" ? 0 : slot.closest("section")!.getBoundingClientRect().top + scrollY - 78 });
      }
      if (!keys.length) return;
      let ki = 0; while (ki < keys.length - 2 && scrollY > keys[ki + 1].at) ki++;
      const a = keys[ki], b = keys[ki + 1];
      const t = clamp01((scrollY - a.at) / Math.max(1, b.at - a.at)), eased = smooth(t);
      const end = scrollY >= keys.at(-1)!.at;
      const fly = a.id === b.id || end ? 0 : Math.sin(t * Math.PI);
      const target = end ? keys.at(-1)! : { x: mix(a.x, b.x, eased), y: mix(a.y, b.y, eased), w: mix(a.w, b.w, eased), h: mix(a.h, b.h, eased) };
      const scale = Math.min(target.w / 1280, target.h / 720) * (1 + fly * 0.025);
      const centerY = target.y - fly * h * (w < 768 ? 0.025 : 0.065);
      const box = { x: target.x - 640 * scale, y: centerY - 360 * scale, w: 1280 * scale, h: 720 * scale };
      let desired = 0, blend = 0, active = "travel", p = 0;
      for (const film of films) {
        const r = film.getBoundingClientRect();
        if (r.top <= 0 && r.bottom >= h - 1) {
          active = film.dataset.film!; p = clamp01(-r.top / Math.max(1, film.offsetHeight - h));
          desired = filmState(active as FilmId, p).frame;
          blend = smooth(clamp01(Math.min(p / 0.035, (1 - p) / 0.035)));
        }
      }
      if (requested !== desired && !failed) {
        requested = desired; store.warm(desired);
        store.get(desired).then((image) => { if (alive && requested === desired) { prepare(image, desired); status("ready"); } }).catch(() => { if (alive) { failed = true; status("error"); } });
      }
      const rotation = fly * (b.x >= a.x ? -1 : 1) * (w < 768 ? 0.015 : 0.035);
      const paint = `${frame},${box.x.toFixed(2)},${box.y.toFixed(2)},${box.w.toFixed(2)},${blend.toFixed(3)},${rotation.toFixed(4)}`;
      if (prepared && paint !== lastPaint) {
        lastPaint = paint;
        ctx.setTransform(el.width / w, 0, 0, el.height / h, 0, 0); ctx.clearRect(0, 0, w, h);
        ctx.save(); ctx.translate(target.x, centerY); ctx.rotate(rotation);
        const x = -box.w / 2, y = -box.h / 2;
        if (blend < 1 && cutout) {
          ctx.globalAlpha = (1 - blend) * (1 - fly) * 0.13;
          ctx.filter = "blur(12px)"; ctx.fillStyle = "#383838";
          ctx.beginPath(); ctx.ellipse(0, box.h * 0.285, box.w * 0.29, box.h * 0.017, 0, 0, Math.PI * 2); ctx.fill(); ctx.filter = "none";
          ctx.globalAlpha = 1 - blend; ctx.drawImage(cutout, x, y, box.w, box.h);
        }
        if (blend > 0 || !cutout) { ctx.globalAlpha = cutout ? blend : 1; ctx.drawImage(photo, x, y, box.w, box.h); }
        ctx.restore();
        el.dataset.frame = String(frame); el.dataset.scene = active; el.dataset.progress = p.toFixed(4); el.dataset.dock = end ? keys.at(-1)!.id : a.id; el.dataset.x = target.x.toFixed(1); el.dataset.y = centerY.toFixed(1);
      }
      const storyFrame = `${active}:${frame}`;
      if (prepared && active !== "travel" && storyFrame !== lastStoryFrame) {
        lastStoryFrame = storyFrame;
        window.dispatchEvent(new CustomEvent("studio-frame", { detail: { id: active, frame } }));
      }
      if (now - lastAnnotation > 65) {
        lastAnnotation = now;
        const visible = active === "anatomy" && frame >= 825 && !filmState("anatomy", p).returning;
        setAnnotations((prev) => !visible && !prev.visible ? prev : { frame, box, width: w, height: h, visible });
      }
    };
    raf = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(raf); store.dispose(); document.documentElement.dataset.studioReady = "false"; };
  }, [reduced, attempt]);
  const mobile = annotations.width < 768;
  const visible = annotations.visible && !reduced;
  const explosion = clamp01((annotations.frame - 793) / 119);
  const labels = partLabels.map((part, i) => {
    const movement = part.id === "front" || part.id === "rear" ? smooth(clamp01((explosion - 0.27) / 0.58)) : part.id === "body" ? smooth(clamp01(explosion / 0.38)) : smooth(clamp01(explosion / 0.75));
    const ax = annotations.box.x + mix(part.start[0], part.end[0], movement) * annotations.box.w;
    const ay = annotations.box.y + mix(part.start[1], part.end[1], movement) * annotations.box.h;
    const lx = mobile ? 22 + (i % 2) * (annotations.width / 2) : annotations.box.x + part.label[0] * annotations.box.w;
    const ly = mobile ? annotations.height - 210 + Math.floor(i / 2) * 42 : annotations.box.y + part.label[1] * annotations.box.h;
    return { ...part, ax, ay, lx, ly, right: !mobile && i >= 3 };
  });
  return <>
    <canvas ref={canvas} className="travelling-car" aria-hidden="true" />
    <div className={`part-annotations ${visible ? "visible" : ""}`} aria-hidden={!visible} inert={!visible}>
      <svg className="part-lines" width="100%" height="100%" aria-hidden="true">
        {labels.filter((p) => !mobile || p.id === selected).map((part) => <g key={part.id} className={part.id === selected ? "selected" : ""}><path d={`M ${part.ax} ${part.ay} L ${part.right ? part.lx - 24 : part.lx + 24} ${part.ay} L ${part.lx} ${part.ly + 12}`} /><circle cx={part.ax} cy={part.ay} r={part.id === selected ? 4 : 2.5} /></g>)}
      </svg>
      {labels.map((part, i) => <button key={part.id} className={`part-label ${part.right ? "right" : ""} ${part.id === selected ? "selected" : ""}`} style={{ left: part.lx, top: part.ly }} aria-pressed={part.id === selected} aria-describedby="part-description" onClick={() => onSelectPart(part.id)} onMouseEnter={() => onSelectPart(part.id)} onFocus={() => onSelectPart(part.id)}><span>0{i + 1}</span>{part.name}</button>)}
    </div>
  </>;
}
