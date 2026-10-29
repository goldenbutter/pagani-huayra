"use client";
import { carData } from "@/data/carData";
import { Anchor, Arrow } from "./Primitives";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div>
          <span className="footer-wordmark">PAGANI</span>
          <span className="eyebrow">HUAYRA BC / A DIGITAL STUDY</span>
        </div>
        <nav aria-label="Footer navigation">
          {carData.navigation.map((n) => (
            <Anchor key={n.href} to={n.href}>
              {n.label}
            </Anchor>
          ))}
          <a href={carData.email}>Contact</a>
        </nav>
        <Anchor to="#top" className="back-top">
          BACK TO TOP <Arrow diagonal />
        </Anchor>
      </div>
      <div className="footer-credit">
        <a href={carData.portfolio} target="_blank" rel="noreferrer">
          Designed &amp; developed by <strong>iBithun</strong>{" "}
          <span aria-hidden="true">↗</span>
        </a>
        <span>© 2026 iBITHUN / INDEPENDENT CREATIVE CONCEPT</span>
      </div>
      <p className="concept-disclosure">
        An unofficial portfolio concept, created to explore automotive
        storytelling. Not affiliated with or endorsed by Pagani Automobili
        S.p.A. AI-generated imagery. Specifications reference the production Huayra BC Coupé. No
        vehicles are offered for sale.
      </p>
    </footer>
  );
}
