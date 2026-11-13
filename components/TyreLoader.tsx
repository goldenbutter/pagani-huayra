"use client";

import { useEffect, useRef } from "react";
import "./tyre-loader.css";

const sessionKey = "huayra-studio-intro";
// Decide before the first paint. Without JavaScript the ordinary page is visible.
const firstVisit = `(() => {
  try {
    if (location.hash || scrollY || matchMedia('(prefers-reduced-motion: reduce)').matches ||
        performance.getEntriesByType('navigation')[0]?.type === 'back_forward' ||
        sessionStorage.getItem('${sessionKey}')) return;
    document.documentElement.dataset.tyreIntro = 'active';
    setTimeout(() => { delete document.documentElement.dataset.tyreIntro; }, 4000);
  } catch {}
})();`;

export default function TyreLoader() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const html = document.documentElement;
    const intro = root.current;
    if (!intro || !html.dataset.tyreIntro) return;
    const canvas = document.querySelector<HTMLCanvasElement>(".travelling-car");
    const rail = intro.querySelector<HTMLElement>(".tyre-rail")!;
    const runner = intro.querySelector<HTMLElement>(".tyre-runner")!;
    const count = intro.querySelector("output")!;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0, progress = 0, last = performance.now(), finishedAt = 0;
    function dismiss() {
      cancelAnimationFrame(raf);
      delete html.dataset.tyreIntro;
      try { sessionStorage.setItem(sessionKey, "seen"); } catch {}
    }
    function tick(now: number) {
      if (!html.dataset.tyreIntro || motion.matches || canvas?.dataset.previewSheet === "failed") {
        dismiss();
        return;
      }
      // Hydration, the painted car, and the shared scrub sheet are the three milestones.
      const target = 0.15 + (canvas?.dataset.frame !== undefined ? 0.4 : 0)
                          + (canvas?.dataset.previewSheet === "ready" ? 0.45 : 0);
      progress = Math.min(target, progress + (now - last) / 850);
      last = now;
      const distance = (rail.clientWidth - runner.offsetWidth) * progress;
      runner.style.transform = `translateX(${distance}px)`;
      runner.style.setProperty("--rotation", `${distance * 2 / runner.offsetWidth}rad`);
      rail.style.setProperty("--fill", String(progress));
      count.value = Math.round(progress * 100) + "%";
      if (progress >= 1) {
        html.dataset.tyreIntro = "leaving";
        finishedAt ||= now;
        if (now - finishedAt >= 240) { dismiss(); return; }
      }
      raf = requestAnimationFrame(tick);
    }
    const events = ["wheel", "touchstart", "keydown", "scroll", "pagehide"] as const;
    for (const name of events) window.addEventListener(name, dismiss, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      for (const name of events) window.removeEventListener(name, dismiss);
    };
  }, []);
  return <>
    <script dangerouslySetInnerHTML={{ __html: firstVisit }} />
    <div className="tyre-intro" ref={root} aria-hidden="true">
      <div className="tyre-heading"><b>PAGANI</b><span>HUAYRA BC</span></div>
      <div className="tyre-center">
        <div className="tyre-rail"><div className="tyre-runner"><div className="tyre-wheel" /></div></div>
        <div className="tyre-readout"><span>Loading the studio</span><output>0%</output></div>
      </div>
      <div className="tyre-footer">ROSSO / EXPOSED CARBON</div>
    </div>
  </>;
}
