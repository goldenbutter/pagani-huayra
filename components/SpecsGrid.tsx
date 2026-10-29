"use client";
import { carData } from "@/data/carData";
import { Reveal, SectionLabel } from "./Primitives";
export default function SpecsGrid() {
  return (
    <section id="specs" className="editorial-section specs-section">
      <SectionLabel number="04">THE NUMBERS</SectionLabel>
      <div className="section-heading-row">
        <Reveal>
          <h2 className="display-heading">
            PRECISION.
            <br />
            <span>IN EVERY FIGURE.</span>
          </h2>
        </Reveal>
        <p className="side-note">
          HUAYRA BC
          <br />
          TECHNICAL PORTRAIT
        </p>
      </div>
      <dl className="specs-grid">
        {carData.specifications.map((s, i) => (
          <div className="spec" key={s.label}>
            <dt>
              <span className="spec-index">0{i + 1}</span>
              {s.label}
            </dt>
            <dd>
              {s.value}
              <span>{s.unit}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="specs-footnote">
        Figures presented as supplied for this creative concept.
      </p>
    </section>
  );
}
