"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

// [left, top, width, height] in the original 1672 × 941 reference coordinates.
// Each crop includes the complete car/assembly; the original files stay intact.
const views = [
  { image: "01-front-wide", crop: [230, 195, 1210, 610], title: "First impressions", detail: "Sculpted in red and exposed carbon.", alt: "Red Huayra BC seen from the front left, with blue racing stripes and a carbon splitter" },
  { image: "02-left-wide", crop: [365, 330, 940, 345], title: "A line in motion", detail: "The silhouette, seen from the left.", alt: "Left side profile of the red Huayra BC with gunmetal wheels and rear wing" },
  { image: "03-rear-closed-wide", crop: [390, 260, 895, 470], title: "A lasting impression", detail: "Rear wing. Quad exhausts. Pure presence.", alt: "Closed rear three-quarter view of the red Huayra BC, showing its wing and four exhaust pipes" },
  { image: "04-right-wide", crop: [315, 290, 1040, 395], title: "The other side", detail: "Every curve has a counterpart.", alt: "Right side profile of the red Huayra BC in the white studio" },
  { image: "05-overhead", crop: [230, 145, 1210, 650], title: "A view from above", detail: "Carbon, colour and a different perspective.", alt: "Overhead view of the red Huayra BC with exposed carbon roof and longitudinal racing stripes" },
  { image: "06-doors-open", crop: [390, 135, 895, 600], title: "Open to discovery", detail: "An invitation into the cockpit.", alt: "Rear-left view of the red Huayra BC with both gullwing doors raised" },
  { image: "07-engine-open", crop: [390, 135, 895, 600], title: "The mechanical heart", detail: "The engine bay, uncovered.", alt: "Red Huayra BC with doors and rear engine cover open, revealing the engine bay" },
  { image: "08-exploded-open", crop: [70, 25, 1540, 795], title: "Beyond the surface", detail: "An imagined study of the parts within.", alt: "Illustrative exploded view of the red Huayra BC with body panels, wheels and engine separated" },
];

export default function CarGallery() {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  function handleKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % views.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + views.length - 1) % views.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = views.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    buttons.current[next]?.focus({ preventScroll: true });
  }

  return <div className="car-gallery" role="group" aria-label="Eight perspectives of the red Huayra BC">
    <div className="gallery-topline eyebrow"><span>EIGHT PERSPECTIVES / ONE VISION</span><span aria-hidden="true">{String(active + 1).padStart(2, "0")} / 08</span></div>
    <div className="gallery-panels">
      {views.map((view, index) => <button
        key={view.image}
        ref={(element) => { buttons.current[index] = element; }}
        type="button"
        className="gallery-panel"
        aria-pressed={active === index}
        aria-label={`${String(index + 1).padStart(2, "0")} ${view.title}: ${view.detail}`}
        onClick={() => setActive(index)}
        onKeyDown={(event) => handleKey(event, index)}
      >
        <span className="gallery-image-window" aria-hidden="true">
          <span className="gallery-image-crop" style={{
            "--crop-ratio": view.crop[2] / view.crop[3],
            "--image-width": `${1672 / view.crop[2] * 100}%`,
            "--image-left": `${-view.crop[0] / view.crop[2] * 100}%`,
            "--image-top": `${-view.crop[1] / view.crop[3] * 100}%`,
          } as CSSProperties}>
            <img src={`/assets/images/gallery/${view.image}.webp`} srcSet={`/assets/images/gallery/${view.image}-small.webp 800w, /assets/images/gallery/${view.image}.webp 1600w`} sizes="(max-width: 767px) 100vw, 60vw" width="1600" height="900" loading="lazy" decoding="async" alt={view.alt} />
          </span>
        </span>
        <span className="gallery-shade" />
        <span className="gallery-caption" aria-hidden="true">
          <span className="gallery-number">{String(index + 1).padStart(2, "0")}</span>
          <span className="gallery-caption-copy"><strong>{view.title}</strong><span>{view.detail}</span></span>
        </span>
      </button>)}
    </div>
    <div className="gallery-footnote"><span>Select a perspective to explore.</span><span>Studio studies / Rosso</span></div>
  </div>;
}
