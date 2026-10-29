"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import Lenis from "lenis";
import { colors, type Colorway, type ColorId } from "@/data/carData";

type Experience = {
  color: Colorway;
  select: (id: ColorId, enter?: boolean) => void;
  navigate: (hash: string) => void;
  reduced: boolean;
};
const Context = createContext<Experience | null>(null);
export function ExperienceProvider({ children }: { children: ReactNode }) {
  const id: ColorId = "red";
  const [reduced, setReduced] = useState(false);
  const lenis = useRef<Lenis | null>(null);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const configure = () => {
      setReduced(media.matches);
      lenis.current?.destroy();
      lenis.current = null;
      if (!media.matches)
        lenis.current = new Lenis({
          autoRaf: true,
          duration: 1.1,
          smoothWheel: true,
          syncTouch: false,
          anchors: false,
        });
    };
    configure();
    media.addEventListener("change", configure);
    return () => {
      media.removeEventListener("change", configure);
      lenis.current?.destroy();
      lenis.current = null;
    };
  }, []);
  const navigate = useCallback((hash: string) => {
    const element = document.querySelector<HTMLElement>(hash);
    if (!element) return;
    const target =
      element.getBoundingClientRect().top +
      window.scrollY -
      (hash === "#experience" || hash === "#top" ? 0 : 78);
    const focus = () => {
      element.tabIndex = -1;
      element.focus({ preventScroll: true });
    };
    if (lenis.current)
      lenis.current.scrollTo(target, { duration: 1.35, onComplete: focus });
    else {
      window.scrollTo({ top: target, behavior: "instant" });
      focus();
    }
    history.replaceState(null, "", hash);
  }, []);
  const select = useCallback(
    (value: ColorId, enter = false) => {
      void value; // This edition presents Rosso only.
      if (enter) navigate("#experience");
    },
    [navigate],
  );
  const color = colors.find((c) => c.id === id)!;
  return (
    <Context.Provider value={{ color, select, navigate, reduced }}>
      <div
        className="experience-root"
        data-color={id}
        style={
          {
            "--accent": color.accent,
            "--secondary": color.secondary,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </Context.Provider>
  );
}
export function useExperience() {
  const value = useContext(Context);
  if (!value) throw new Error("Missing ExperienceProvider");
  return value;
}
