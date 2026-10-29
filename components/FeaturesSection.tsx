"use client";
import { carData } from "@/data/carData";
import { useExperience } from "./ExperienceProvider";
import { Reveal, SectionLabel } from "./Primitives";
export default function FeaturesSection() {
  const { color } = useExperience();
  return (
    <section className="editorial-section features-section">
      <SectionLabel number="06">A SINGULAR CHARACTER</SectionLabel>
      <div className="feature-opening">
        <h2 className="display-heading">
          EVERY DETAIL.
          <br />
          <span>EVERY EMOTION.</span>
        </h2>
        <p>
          Four expressions of one philosophy.
          <br />
          Nothing ordinary survives.
        </p>
      </div>
      <div className="feature-editorial">
        {carData.features.map((f, i) => (
          <Reveal className={`feature-row feature-row-${i}`} key={f.number}>
            <span className="feature-number">{f.number}</span>
            <h3>{i === 2 ? color.interior.toUpperCase() : f.title}</h3>
            <p>{f.text}</p>
            <span className="feature-cross" aria-hidden="true">
              +
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
