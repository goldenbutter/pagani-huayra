"use client";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { useExperience } from "./ExperienceProvider";
import { clamp } from "@/lib/utils";
import {
  loadExploded,
  releaseModules,
  type RenderModule,
} from "@/lib/exploded";
import {
  EXPLODE_START,
  EXPLODE_END,
  explodedChapter,
  moduleMotions,
} from "@/data/explodedData";

export default function HuayraExplodedView({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const { color, reduced } = useExperience();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [load, setLoad] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const [active, setActive] = useState(reduced);
  const activeRef = useRef(reduced);
  const opacity = useTransform(progress, (p) =>
    reduced ? 1 : clamp((p - 0.66) / 0.04),
  );
  const labelsOpacity = useTransform(progress, (p) =>
    reduced ? 1 : clamp((p - 0.86) / 0.08),
  );
  useMotionValueEvent(progress, "change", (p) => {
    const value = reduced || p >= 0.65;
    if (value !== activeRef.current) {
      activeRef.current = value;
      setActive(value);
    }
  });
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const controller = new AbortController();
    let alive = true,
      raf = 0;
    let modules: RenderModule[] = [];
    let width = 0,
      height = 0,
      last = -1,
      dirty = true;
    const draw = () => {
      if (!alive || !modules.length || !width || !height) return;
      const p = reduced
        ? 1
        : clamp(
            (progress.get() - EXPLODE_START) / (EXPLODE_END - EXPLODE_START),
          );
      if (p === last && !dirty) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, el.width, el.height);
      ctx.setTransform(el.width / width, 0, 0, el.height / height, 0, 0);
      const fit = Math.min(width / 1672, height / 941) * 0.96;
      const cameraScale = fit * (1.12 - 0.12 * p);
      ctx.translate(width / 2, height / 2);
      ctx.scale(cameraScale, cameraScale);
      ctx.translate(-836, -470.5);
      // A restrained ground cue disappears as the mechanical modules separate.
      ctx.save();
      ctx.globalAlpha = 0.07 * (1 - p);
      ctx.fillStyle = "#333";
      ctx.filter = "blur(18px)";
      ctx.beginPath();
      ctx.ellipse(830, 800, 420, 35, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      for (const motion of moduleMotions) {
        const part = modules.find((item) => item.id === motion.id);
        if (!part) continue;
        const t = clamp((p - motion.start) / (motion.end - motion.start));
        const s = t * t * (3 - 2 * t);
        const dx = motion.assembled[0] * (1 - s),
          dy = motion.assembled[1] * (1 - s);
        const scale = motion.scale + (1 - motion.scale) * s;
        ctx.save();
        ctx.translate(motion.pivot[0] + dx, motion.pivot[1] + dy);
        ctx.scale(scale, scale);
        ctx.translate(-motion.pivot[0], -motion.pivot[1]);
        ctx.drawImage(part.canvas, part.bounds[0], part.bounds[1]);
        ctx.restore();
      }
      last = p;
      dirty = false;
      el.dataset.separation = p.toFixed(4);
      el.dataset.color = color.id;
      el.dataset.layerCount = String(modules.length);
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };
    const resize = () => {
      const rect = el.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      el.width = Math.round(width * ratio);
      el.height = Math.round(height * ratio);
      dirty = true;
      schedule();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    const unsubscribe = progress.on("change", schedule);
    const timer = setTimeout(() => {
      if (alive && !modules.length) {
        controller.abort();
        setLoad("error");
      }
    }, 20000);
    const start = async () => {
      setLoad("loading");
      ctx.clearRect(0, 0, el.width, el.height);
      try {
        const loaded = await loadExploded(color.id, controller.signal);
        if (!alive) {
          releaseModules(loaded);
          return;
        }
        modules = loaded;
        resize();
        draw();
        setLoad("ready");
      } catch {
        if (alive && !controller.signal.aborted) setLoad("error");
      } finally {
        clearTimeout(timer);
      }
    };
    void start();
    return () => {
      alive = false;
      clearTimeout(timer);
      controller.abort();
      observer.disconnect();
      unsubscribe();
      cancelAnimationFrame(raf);
      releaseModules(modules);
    };
  }, [color.id, progress, reduced, attempt]);
  const isActive = reduced || active;
  return (
    <motion.div
      className="exploded-scene"
      style={{ opacity }}
      aria-hidden={!isActive}
      inert={!isActive}
    >
      <div className="phase exploded-heading">
        <div className="phase-heading">
          <span className="eyebrow">
            <span className="accent">05</span> / {explodedChapter.name}
          </span>
          <h2>{explodedChapter.title}</h2>
          <span className="phase-subtitle">{explodedChapter.subtitle}</span>
        </div>
        <div className="phase-note">
          <span className="tiny-cross">+</span>
          {explodedChapter.note}
        </div>
        <div className="phase-stat">
          <strong>{explodedChapter.metric}</strong>
          <span>{explodedChapter.unit}</span>
        </div>
        <span className="phase-detail eyebrow">
          {reduced ? "EXPLODED ASSEMBLY / STILL STUDY" : explodedChapter.detail}
        </span>
      </div>
      <div className="exploded-stage" data-state={load}>
        {load === "error" && (
          <img
            className="exploded-fallback"
            src={color.rear}
            width="1672"
            height="941"
            alt="Huayra BC with its engine exposed"
          />
        )}
        <canvas
          ref={canvas}
          className="exploded-canvas"
          role="img"
          aria-label={`${color.name} Huayra BC exploded assembly: body shell, rear wing, V12 engine, carbon chassis and four wheels separating with scroll`}
        />
        {load === "loading" && (
          <div className="assembly-status eyebrow" role="status">
            PREPARING THE ASSEMBLY
          </div>
        )}
        {load === "error" && (
          <div className="assembly-status error">
            <span>Assembly view unavailable.</span>
            <button
              className="text-link"
              onClick={() => setAttempt((a) => a + 1)}
            >
              RETRY ASSEMBLY ↗
            </button>
          </div>
        )}
      </div>
      <motion.div className="assembly-key" style={{ opacity: labelsOpacity }}>
        {explodedChapter.labels.map((label, i) => (
          <span key={label}>
            <b>0{i + 1}</b>
            {label}
          </span>
        ))}
      </motion.div>
      <span className="assembly-concept">AN EXPLODED DESIGN STUDY</span>
    </motion.div>
  );
}
