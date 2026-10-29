"use client";
import { useExperience } from "./ExperienceProvider";
import { Reveal, SectionLabel } from "./Primitives";
export default function DesignSection() {
  const { color } = useExperience();
  return (
    <section id="design" className="editorial-section design-section">
      <SectionLabel number="02">DESIGN LANGUAGE</SectionLabel>
      <div className="section-heading-row">
        <Reveal>
          <span className="eyebrow accent">CARBON SCULPTURE</span>
          <h2 className="display-heading">
            FORM FOLLOWS
            <br />
            <span>PERFORMANCE.</span>
          </h2>
        </Reveal>
        <p className="side-note">
          Nothing ornamental.
          <br />
          Everything intentional.
        </p>
      </div>
      <div className="design-grid">
        <div className="design-visual">
          <img
            src={color.front}
            alt="Detail of the carbon bonnet, aerodynamic surfaces and forged wheel"
            width="1672"
            height="941"
            loading="lazy"
          />
          <span className="detail-marker">
            01 <span>CARBOTANIUM™</span>
          </span>
        </div>
        <Reveal className="design-copy">
          <span className="material-number">
            C<span>+ Ti</span>
          </span>
          <h3>
            Strength, without
            <br />
            the weight.
          </h3>
          <p>
            Carbon fibre and titanium form a language of their own. Visible
            weave. Sculpted surfaces. Precision you can feel before the engine
            turns.
          </p>
          <div className="technical-list">
            <span>01 / CARBOTANIUM MONOCOQUE</span>
            <span>02 / ACTIVE AERODYNAMICS</span>
            <span>03 / EXPOSED CARBON FIBRE</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
