"use client";
import { colors } from "@/data/carData";
import { useExperience } from "./ExperienceProvider";
import { Arrow } from "./Primitives";
export default function ColorSelector() {
  const { select } = useExperience();
  return (
    <section className="collection" id="top" aria-labelledby="collection-title">
      <div className="collection-kicker">
        <span className="eyebrow">
          <span className="status-dot" /> THE HUAYRA BC COLLECTION
        </span>
        <span className="eyebrow collection-origin">
          MODENA, ITALY — EST. IN THE EXTRAORDINARY
        </span>
      </div>
      <div className="collection-title-row">
        <h1 id="collection-title">
          HUAYRA <span>BC</span>
        </h1>
        <div className="collection-edition">
          MACCHINA
          <br />
          VOLANTE<span>The Flying Machine.</span>
        </div>
      </div>
      <div className="collection-sub">
        <p>One vision. Three expressions.</p>
        <span className="eyebrow">
          CHOOSE YOUR MACHINE <span aria-hidden="true">↘</span>
        </span>
      </div>
      <div className="car-lineup">
        {colors.map((c) => (
          <button
            key={c.id}
            className={`car-choice car-choice-${c.id}`}
            onClick={() => select(c.id, true)}
            aria-label={`Explore ${c.name}`}
            style={{ "--choice-accent": c.accent } as React.CSSProperties}
          >
            <div className="car-choice-image">
              <img
                src={c.front}
                alt={`${c.name} Pagani Huayra BC, front three-quarter view`}
                width="1672"
                height="941"
                fetchPriority="high"
              />
            </div>
            <div className="car-choice-caption">
              <span className="choice-number">{c.number}</span>
              <div>
                <h2>{c.name}</h2>
                <span>{c.finish}</span>
              </div>
              <span className="choice-arrow">
                <Arrow diagonal />
              </span>
            </div>
          </button>
        ))}
      </div>
      <div className="collection-bottom">
        <span className="eyebrow">20 CREATIONS. UNLIMITED EMOTION.</span>
        <span className="collection-instruction">
          Select a colour. Then scroll to discover.
        </span>
        <a
          className="eyebrow concept-credit"
          href="https://portfolio.ibithun.com"
          target="_blank"
          rel="noreferrer"
        >
          A CONCEPT BY iBITHUN <Arrow diagonal />
        </a>
      </div>
    </section>
  );
}
