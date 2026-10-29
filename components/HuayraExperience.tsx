"use client";
import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { carData, colors } from "@/data/carData";
import { useExperience } from "./ExperienceProvider";
import HuayraScrollCanvas from "./HuayraScrollCanvas";
import HuayraExplodedView from "./HuayraExplodedView";
import { FILM_END } from "@/data/explodedData";
import { clamp } from "@/lib/utils";
import { Anchor, Arrow } from "./Primitives";
function Phase({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) {
  const { color, reduced } = useExperience();
  const p = carData.phases[index];
  const start = color.phaseStops[index],
    end = color.phaseStops[index + 1] ?? 1.2;
  const opacity = useTransform(progress, (v) =>
    reduced
      ? index === 3
        ? 1
        : 0
      : Math.min(
          index === 0 ? 1 : Math.max(0, (v - start) / 0.035),
          index === 3 ? 1 : Math.max(0, (end - v) / 0.035),
        ),
  );
  const y = useTransform(opacity, [0, 1], [16, 0]);
  const filter = useTransform(opacity, [0, 1], ["blur(5px)", "blur(0px)"]);
  return (
    <motion.div
      className="phase"
      style={{ opacity, y, filter }}
      aria-hidden="true"
    >
      <div className="phase-heading">
        <span className="eyebrow">
          <span className="accent">{p.number}</span> / {p.name}
        </span>
        <h2>{p.title}</h2>
        <span className="phase-subtitle">{p.subtitle}</span>
      </div>
      <div className="phase-note">
        <span className="tiny-cross">+</span>
        {p.note}
      </div>
      <div className="phase-stat">
        <strong>{p.metric}</strong>
        <span>{p.unit}</span>
      </div>
      <span className="phase-detail eyebrow">{p.detail}</span>
    </motion.div>
  );
}
export default function HuayraExperience() {
  const container = useRef<HTMLElement>(null);
  const film = useRef<HTMLDivElement>(null);
  const { color, select, reduced } = useExperience();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });
  const filmProgress = useTransform(scrollYProgress, (p) =>
    clamp(p / FILM_END),
  );
  const filmOpacity = useTransform(scrollYProgress, (p) =>
    reduced ? 0 : 1 - clamp((p - 0.64) / 0.035),
  );
  useEffect(() => {
    const sync = (p: number) => {
      if (!film.current) return;
      film.current.inert = reduced || p >= 0.675;
      film.current.setAttribute("aria-hidden", String(reduced || p >= 0.675));
    };
    sync(scrollYProgress.get());
    return scrollYProgress.on("change", sync);
  }, [reduced, scrollYProgress]);
  const percentage = useTransform(
    scrollYProgress,
    (p) =>
      `${Math.round(p * 100)
        .toString()
        .padStart(3, "0")}%`,
  );
  return (
    <section
      ref={container}
      id="experience"
      className={`cinematic ${reduced ? "reduced" : ""}`}
      aria-label="Discover the Huayra BC: origin, form, doors, engine and exploded assembly"
    >
      <div className="cinematic-pin">
        <div className="cinematic-top">
          <span className="eyebrow">THE ANATOMY OF EMOTION</span>
          <div className="color-switch" aria-label="Select car color">
            {colors.map((c) => (
              <button
                key={c.id}
                aria-label={`Switch to ${c.name}`}
                aria-pressed={color.id === c.id}
                onClick={() => select(c.id)}
              >
                <span style={{ backgroundColor: c.swatch }} />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
        <motion.div
          ref={film}
          className="film-scene"
          style={{ opacity: filmOpacity }}
        >
          <HuayraScrollCanvas progress={filmProgress} />
        </motion.div>
        <motion.div className="cinematic-hud" style={{ opacity: filmOpacity }}>
          {carData.phases.map((p, i) => (
            <Phase key={p.name} index={i} progress={filmProgress} />
          ))}
        </motion.div>
        <HuayraExplodedView progress={scrollYProgress} />
        <div className="cinematic-bottom">
          <span className="eyebrow scroll-prompt">
            SCROLL TO EXPLORE <span aria-hidden="true">↓</span>
          </span>
          <div className="film-timeline">
            <motion.div style={{ scaleX: scrollYProgress }} />
          </div>
          <motion.span className="eyebrow progress-number">
            {percentage}
          </motion.span>
          <Anchor className="skip-film eyebrow" to="#story">
            THE STORY <Arrow />
          </Anchor>
        </div>
        <div className="sr-only">
          <p>
            Chapter five: an exploded design study. The body, rear wing, engine
            and four wheels separate from the carbon chassis. Reverse scrolling
            reassembles the illustrated modules. This is a visual concept, not
            an engineering service diagram.
          </p>
          {carData.phases.map((p) => (
            <p key={p.name}>
              {p.name}. {p.title}. {p.subtitle}. {p.metric} {p.unit}. {p.detail}
              .
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
