"use client";
import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";
import { Sequence } from "@/lib/sequence";
import { frameAt } from "@/lib/utils";
import { useExperience } from "./ExperienceProvider";
import { Arrow } from "./Primitives";

export default function HuayraScrollCanvas({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const { color, reduced } = useExperience();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [load, setLoad] = useState({ percent: 0, ready: false, error: false });
  const [attempt, setAttempt] = useState(0);
  const [skip, setSkip] = useState(false);
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d", { alpha: false });
    if (!ctx) return;
    let mounted = true,
      ready = false,
      busy = false,
      drawn = -1,
      dirty = true,
      raf = 0;
    let width = 0,
      height = 0,
      dpr = 1;
    const controller = new AbortController();
    const sequence = new Sequence(
      color.id,
      matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop",
      controller.signal,
    );
    const draw = async () => {
      if (!mounted || !ready || busy) return;
      const index = frameAt(progress.get());
      if (drawn === index && !dirty) return;
      busy = true;
      try {
        const frame = await sequence.get(index);
        if (!mounted) return;
        // If scrolling jumped while decoding, render the newest request next.
        // Keep the old image visible rather than clear the canvas between frames.
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, el.width, el.height);
        ctx.setTransform(el.width / width, 0, 0, el.height / height, 0, 0);
        const scale = Math.min(width / frame.width, height / frame.height);
        const dw = frame.width * scale,
          dh = frame.height * scale;
        // The supplied films have a one-pixel black encoding edge at the right.
        // Omit that border only; retain the complete photographic car framing.
        ctx.drawImage(
          frame,
          0,
          0,
          frame.width - 1,
          frame.height,
          (width - dw) / 2,
          (height - dh) / 2,
          dw,
          dh,
        );
        drawn = index;
        dirty = false;
        el.dataset.frame = String(index + 1);
        el.dataset.color = color.id;
      } catch (error) {
        if (mounted && !controller.signal.aborted) {
          ready = false;
          console.error("Sequence decode failed", error);
          setLoad((s) => ({ ...s, ready: false, error: true }));
        }
      } finally {
        busy = false;
        if (mounted && ready && (frameAt(progress.get()) !== drawn || dirty))
          raf = requestAnimationFrame(() => {
            void draw();
          });
      }
    };
    const requestDraw = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        void draw();
      });
    };
    const resize = () => {
      const rect = el.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(devicePixelRatio || 1, 2);
      el.width = Math.round(width * dpr);
      el.height = Math.round(height * dpr);
      dirty = true;
      requestDraw();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    const unsubscribe = progress.on("change", requestDraw);
    const start = async () => {
      setLoad({ percent: 0, ready: false, error: false });
      setSkip(false);
      if (reduced || matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setLoad({ percent: 100, ready: true, error: false });
        return;
      }
      const timeout = setTimeout(() => {
        if (mounted && !ready) {
          controller.abort();
          setLoad({ percent: 0, ready: false, error: true });
        }
      }, 45000);
      try {
        await sequence.preload((percent) => {
          if (mounted && !controller.signal.aborted)
            setLoad({ percent, ready: false, error: false });
        });
        if (!mounted || controller.signal.aborted) return;
        ready = true;
        resize();
        await draw();
        if (mounted) setLoad({ percent: 100, ready: true, error: false });
      } catch {
        if (mounted && !controller.signal.aborted) {
          controller.abort();
          setLoad((s) => ({ ...s, error: true }));
        }
      } finally {
        clearTimeout(timeout);
      }
    };
    void start();
    return () => {
      mounted = false;
      controller.abort();
      observer.disconnect();
      unsubscribe();
      cancelAnimationFrame(raf);
      sequence.dispose();
    };
  }, [color.id, progress, reduced, attempt]);
  return (
    <>
      <div
        className="canvas-stage"
        aria-label={`${color.name} Huayra BC cinematic sequence`}
        data-ready={load.ready}
      >
        <img
          className="canvas-poster"
          src={reduced ? color.rear : color.front}
          alt={`${color.name} Huayra BC ${reduced ? "with the engine exposed" : "in a white studio"}`}
          width="1672"
          height="941"
        />
        <canvas
          ref={canvas}
          className={`car-canvas ${load.ready && !reduced && !skip ? "visible" : ""}`}
          aria-hidden="true"
        />
      </div>
      {!load.ready && !skip && (
        <div
          className="sequence-loader"
          role="status"
          aria-live="polite"
          aria-label={
            load.error
              ? "The film could not load"
              : `Loading ${color.name} film`
          }
        >
          <span className="loader-brand">PAGANI</span>
          <span className="eyebrow">
            HUAYRA BC / {color.name.toUpperCase()}
          </span>
          <div className="loader-track">
            <span style={{ transform: `scaleX(${load.percent / 100})` }} />
          </div>
          <span className="eyebrow">
            {load.error
              ? "THE FILM IS TEMPORARILY UNAVAILABLE"
              : `LOADING ${load.percent}%`}
          </span>
          {load.error && (
            <div className="loader-actions">
              <button
                className="text-link"
                onClick={() => setAttempt((n) => n + 1)}
              >
                Try again <Arrow />
              </button>
              <button className="text-link" onClick={() => setSkip(true)}>
                Explore with stills <Arrow />
              </button>
            </div>
          )}
        </div>
      )}
      {reduced && (
        <span className="motion-note">STILL EXPERIENCE / REDUCED MOTION</span>
      )}
    </>
  );
}
