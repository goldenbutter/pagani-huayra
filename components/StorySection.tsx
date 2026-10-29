"use client";
import { useExperience } from "./ExperienceProvider";
import { Reveal, SectionLabel } from "./Primitives";
export default function StorySection() {
  const { color } = useExperience();
  return (
    <section id="story" className="editorial-section story-section">
      <SectionLabel number="01">THE STORY</SectionLabel>
      <div className="story-grid">
        <Reveal>
          <h2 className="display-heading">
            BORN
            <br />
            FROM <span>WIND.</span>
          </h2>
          <p className="italian-caption">Una macchina. Un’emozione.</p>
        </Reveal>
        <Reveal className="story-copy">
          <span className="eyebrow">HUAYRA BC / MACCHINA VOLANTE</span>
          <p className="lead">
            Some machines are built to move you.
            <br />
            Others, to make you feel.
          </p>
          <p>
            The Huayra BC is an expression of a singular idea: art and
            engineering belong together. A sculpture shaped by the air. A
            machine brought to life by the human hand.
          </p>
          <p>
            Twenty creations. Each an intimate dialogue between material, motion
            and imagination.
          </p>
          <div className="story-facts">
            <div>
              <span>ORIGIN</span>
              <strong>MODENA, ITALY</strong>
            </div>
            <div>
              <span>CHAPTER</span>
              <strong>2017</strong>
            </div>
            <div>
              <span>EDITION</span>
              <strong>20 UNITS</strong>
            </div>
          </div>
        </Reveal>
      </div>
      <div className="story-panorama">
        <span className="panorama-word" aria-hidden="true">
          HUAYRA
        </span>
        <img
          src={color.front}
          alt={`${color.name} Huayra BC in exposed carbon and ${color.finish.toLowerCase()}`}
          width="1672"
          height="941"
          loading="lazy"
        />
        <span className="image-caption">
          FIG. 01 — THE SHAPE OF A SINGULAR VISION
        </span>
        <span className="image-caption right">{color.italian}</span>
      </div>
    </section>
  );
}
