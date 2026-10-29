"use client";
import { useExperience } from "./ExperienceProvider";
import { Reveal, SectionLabel } from "./Primitives";
export default function CraftsmanshipSection() {
  const { color } = useExperience();
  return (
    <section className="editorial-section craft-section" id="craftsmanship">
      <SectionLabel number="05">MADE, NOT MANUFACTURED</SectionLabel>
      <div className="craft-grid">
        <div className="craft-visual">
          <img
            src={color.rear}
            alt="A close study of the open cabin, carbon structure and hand-finished materials"
            width="1672"
            height="941"
            loading="lazy"
          />
          <span className="craft-caption eyebrow">THE INTIMACY OF DETAIL</span>
        </div>
        <Reveal className="craft-copy">
          <span className="eyebrow accent">MODENA, ITALY</span>
          <h2 className="display-heading">
            THE
            <br />
            HUMAN
            <br />
            <span>HAND.</span>
          </h2>
          <p className="lead">Precision has a personal signature.</p>
          <p>
            Leather, shaped and stitched. Metal, machined and polished. Carbon,
            laid with care. The extraordinary lives in the details you discover
            slowly.
          </p>
          <div className="craft-tags">
            <span>HAND ASSEMBLED</span>
            <span>20 CARS</span>
            <span>{color.interior.toUpperCase()}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
