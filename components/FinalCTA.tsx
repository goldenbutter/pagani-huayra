"use client";
import { useExperience } from "./ExperienceProvider";
import { carData } from "@/data/carData";
import { Anchor, Arrow, Reveal } from "./Primitives";
export default function FinalCTA() {
  const { color } = useExperience();
  return (
    <section id="inquire" className="final-cta">
      <span className="eyebrow">HUAYRA BC / MACCHINA VOLANTE</span>
      <Reveal>
        <h2>
          THE ART OF
          <br />
          <span>PERFORMANCE.</span>
        </h2>
      </Reveal>
      <img
        src={color.front}
        width="1672"
        height="941"
        loading="lazy"
        alt={`${color.name} Huayra BC`}
      />
      <div className="cta-bottom">
        <div>
          <span className="eyebrow accent">
            YOUR BRAND COULD FEEL LIKE THIS.
          </span>
          <p>
            Let’s build something
            <br />
            worth experiencing.
          </p>
        </div>
        <div className="cta-actions">
          <a className="button-primary" href={carData.email}>
            INQUIRE ABOUT A PROJECT <Arrow diagonal />
          </a>
          <a
            className="text-link"
            href={carData.portfolio}
            target="_blank"
            rel="noreferrer"
          >
            EXPLORE iBITHUN <Arrow diagonal />
          </a>
          <Anchor to="#top" className="text-link understated">
            DISCOVER ANOTHER COLOUR <Arrow />
          </Anchor>
        </div>
      </div>
    </section>
  );
}
