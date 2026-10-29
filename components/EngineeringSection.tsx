"use client";
import { useExperience } from "./ExperienceProvider";
import { Reveal, SectionLabel } from "./Primitives";
export default function EngineeringSection() {
  const { color } = useExperience();
  return (
    <section id="engineering" className="editorial-section engineering-section">
      <SectionLabel number="03">BENEATH THE SCULPTURE</SectionLabel>
      <Reveal>
        <h2 className="display-heading">
          ENGINEERED
          <br />
          WITHOUT <span>COMPROMISE.</span>
        </h2>
      </Reveal>
      <div className="engine-numbers">
        <div>
          <span className="eyebrow">THE HEART</span>
          <strong>V12</strong>
          <span>BITURBO / AMG</span>
        </div>
        <div>
          <span className="eyebrow">DISPLACEMENT</span>
          <strong>
            6.0<span>L</span>
          </strong>
          <span>MECHANICAL EXPRESSION</span>
        </div>
        <p>
          Lift the sculpture.
          <br />
          Meet the soul.
          <span>
            A world of precision, laid bare. Every line, every fastener, every
            surface has a reason to be here.
          </span>
        </p>
      </div>
      <div className="engine-visual">
        <img
          src={color.rear}
          alt={`${color.name} Huayra BC with doors raised and the V12 engine exposed`}
          width="1672"
          height="941"
          loading="lazy"
        />
        <div className="engine-annotation">
          <span className="tiny-cross">+</span>
          <span>
            AMG V12 BITURBO
            <br />
            <b>745 HP / 1,000 NM</b>
          </span>
        </div>
      </div>
      <div className="section-endline">
        <span>EXPOSED. UNCOMPROMISING. EXTRAORDINARY.</span>
        <span>FIG. 02 / THE HEART OF THE MACHINE</span>
      </div>
    </section>
  );
}
