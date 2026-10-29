"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Anchor, Arrow, Reveal, SectionLabel } from "./Primitives";
import { carData } from "@/data/carData";
import { POSTER, filmState, filmStory, partLabels, partFacts, type FilmId } from "@/data/studio";
import { useExperience } from "./ExperienceProvider";
import TravellingCar from "./TravellingCar";
import CarGallery from "./CarGallery";

export function CarSlot({ id, className = "" }: { id: string; className?: string }) {
  return <div className={`car-dock ${className}`} data-car-slot={id}>
    <img className="dock-fallback" src={POSTER} width="1280" height="720" alt="Red and exposed-carbon Pagani Huayra BC in a white studio" />
  </div>;
}
function FilmStage({ id, selected }: { id: FilmId; selected: string }) {
  const { reduced } = useExperience();
  const ref = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);
  const [retry, setRetry] = useState(false);
  const [paintedFrame, setPaintedFrame] = useState(0);
  useEffect(() => {
    const update = () => {
      const element = ref.current;
      if (element) setP(Math.max(0, Math.min(1, -element.getBoundingClientRect().top / Math.max(1, element.offsetHeight - innerHeight))));
    };
    const status = (event: Event) => setRetry((event as CustomEvent).detail === "error");
    const painted = (event: Event) => {
      const detail = (event as CustomEvent<{ id: FilmId; frame: number }>).detail;
      if (detail.id === id) setPaintedFrame(detail.frame);
    };
    window.addEventListener("studio-frame", painted);
    update(); window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update);
    window.addEventListener("studio-status", status);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); window.removeEventListener("studio-status", status); window.removeEventListener("studio-frame", painted); };
  }, [id]);
  const state = filmState(id, p);
  const anatomy = id === "anatomy";
  const chapter = filmStory(id, reduced ? anatomy ? 912 : 0 : paintedFrame, reduced ? false : state.returning);
  const story = reduced && anatomy ? { ...chapter, description: "Body shell, wing, engine, chassis and wheels, revealed in one still study.", mobileDescription: "Body, wing, engine, chassis and wheels. A still study.", unit: "COMPONENT GROUPS" } : chapter;
  const showPart = anatomy && story.key === "exploded" && !reduced;
  const part = partLabels.find((part) => part.id === selected)!;
  const fact = showPart ? partFacts[selected] : story;
  const chapterCount = anatomy ? 4 : 6;
  return <section ref={ref} id={anatomy ? "engineering" : "experience"} data-film={id} className={`studio-film split-film ${anatomy ? "anatomy-film" : "orbit-film"}`} aria-label={anatomy ? "Exploded engineering study and reassembly" : "Full orbit, opening and return"}>
    <div className="studio-pin">
      <div className="film-topline"><span className="eyebrow">{anatomy ? "02 / THE INNER WORLD" : "01 / THE MOVING SCULPTURE"}</span><span className="eyebrow">ROSSO / EXPOSED CARBON</span></div>
      <div className="studio-film-heading film-narrative" data-story={story.key} data-source-frame={paintedFrame}>
        <div className="film-chapter-index"><span className="eyebrow accent">{story.number} / {story.label}</span><span className="film-chapter-ticks" aria-hidden="true">{Array.from({ length: chapterCount }, (_, i) => <i key={i} className={i + 1 === Number(story.number) ? "current" : ""} />)}</span></div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={story.key} className="film-story-content" initial={reduced ? false : { opacity: 0, y: 12, filter: "blur(5px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={reduced ? undefined : { opacity: 0, y: -8, filter: "blur(5px)" }} transition={{ duration: reduced ? 0 : .23, ease: "easeOut" }}>
            <h2>{story.title}<br /><span>{story.emphasis}</span></h2>
            <div className="film-copy-bottom">
              <div className="film-story-description">{showPart ? <p id="part-description" aria-live="polite"><strong>{part.name}</strong>{part.detail}</p> : <p><span className="film-desktop-description">{story.description}</span><span className="film-mobile-description">{story.mobileDescription}</span></p>}</div>
              <div className="film-key-fact" data-long={fact.metric.length > 6} key={showPart ? selected : story.key}><strong>{fact.metric}</strong><span>{fact.unit}</span></div>
            </div>
          </motion.div>
        </AnimatePresence>
        <span className="film-reading-note eyebrow">{showPart ? "SELECT A PART TO EXPLORE" : reduced ? "A STILL STUDY" : "SCROLL TO CONTINUE THE STORY"}</span>
      </div>
      <CarSlot id={id} />
      {reduced && anatomy && <img className="reduced-assembly" src="/assets/studio/desktop/0912.webp" alt="Exploded red Huayra: body shell, rear wing, engine, chassis and four wheels" width="1280" height="720" />}
      {reduced && anatomy && <p className="reduced-part-key">BODY SHELL · REAR WING · V12 ENGINE · CARBON CHASSIS · FRONT &amp; REAR WHEELS</p>}
      <div className="film-bottomline"><span className="eyebrow">{reduced ? "STILL EXPERIENCE" : state.returning ? "SCROLL TO REASSEMBLE & RETURN" : "SCROLL TO DISCOVER"}</span><div className="studio-progress"><span style={{ transform: `scaleX(${p})` }} /></div><Anchor to={anatomy ? "#specs" : "#story"} className="eyebrow">{anatomy ? "THE NUMBERS" : "THE STORY"}<Arrow /></Anchor></div>
      {retry && <div className="studio-recovery" role="status">Motion could not load. You can keep exploring with stills.<button onClick={() => window.dispatchEvent(new Event("studio-retry"))}>Retry motion ↗</button></div>}
    </div>
  </section>;
}
export default function RedExperience() {
  const [selectedPart, setSelectedPart] = useState("engine");
  return <>
    <TravellingCar selected={selectedPart} onSelectPart={setSelectedPart} />
    <section id="top" className="red-hero">
      <div className="hero-kicker eyebrow"><span><i /> A STUDY IN AUTOMOTIVE ART</span><span>MODENA, ITALY / EST. 1992</span></div>
      <div className="hero-title"><h1>HUAYRA <span>BC</span></h1><span className="hero-edition eyebrow">THE FLYING<br />MACHINE.</span></div>
      <CarSlot id="hero" />
      <div className="hero-foot"><div><span className="eyebrow accent">01 / ROSSO</span><p>Emotion, in its<br /><em>purest form.</em></p></div><div className="hero-invitation"><span>A single vision. Every perspective.</span><Anchor to="#experience" className="round-link">ENTER THE EXPERIENCE <span><Arrow diagonal /></span></Anchor></div></div>
      <div className="hero-baseline eyebrow"><span>RED LACQUER. EXPOSED CARBON. UNMISTAKABLE.</span><span>AN INDEPENDENT iBITHUN CONCEPT</span></div>
    </section>
    <FilmStage id="explore" selected={selectedPart} />
    <section id="story" className="travel-section story-travel">
      <SectionLabel number="01">THE PHILOSOPHY</SectionLabel>
      <div className="travel-copy right"><Reveal><span className="eyebrow accent">ART MEETS ENGINEERING</span><h2>Made to move.<br /><span>Built to move you.</span></h2><p>Named for Benny Caiola, Pagani’s first customer. A road-going car inspired by the Zonda R and Zonda Cinque, with the track written into its character.</p><span className="signature">Passione, in rosso.</span></Reveal></div>
      <CarSlot id="story" />
      <div className="travel-bottom eyebrow"><span>01 / FORM</span><span>A MACHINE WITH A SOUL.</span></div>
    </section>
    <section id="design" className="travel-section design-travel">
      <SectionLabel number="02">THE DESIGN LANGUAGE</SectionLabel>
      <div className="travel-copy left"><Reveal><span className="eyebrow accent">THE BEAUTY OF PURPOSE</span><h2>Nothing<br /><span>without reason.</span></h2><p>Exposed carbon. Sculpted airways. A silhouette shaped by movement, even at rest.</p><div className="material-inline"><strong>C<span>+Ti</span></strong><span className="eyebrow">CARBON &amp; TITANIUM<br />A MATERIAL DIALOGUE</span></div></Reveal></div>
      <CarSlot id="design" />
      <div className="travel-bottom eyebrow"><span>02 / MATERIAL</span><span>STRENGTH IN EVERY SURFACE.</span></div>
    </section>
    <FilmStage id="anatomy" selected={selectedPart} />
    <section id="specs" className="travel-section specs-travel">
      <SectionLabel number="03">THE TECHNICAL PORTRAIT</SectionLabel>
      <div className="travel-copy right"><Reveal><span className="eyebrow accent">THE FIGURES BEHIND THE FEELING</span><h2>Precision.<br /><span>Without compromise.</span></h2><dl className="red-specs">{carData.specifications.map((s) => <div key={s.label}><dt>{s.label}</dt><dd>{s.value}<span>{s.unit}</span></dd></div>)}</dl><details className="technical-details"><summary>THE ENGINEERING DETAILS <span>+</span></summary><dl>{carData.technicalDetails.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></details><p className="spec-note">Huayra BC Coupé specifications. CV denotes metric horsepower. <a href={carData.specificationSource} target="_blank" rel="noreferrer">Source: Pagani ↗</a> · <a href="https://www.paganiofchicago.com/models/huayra-bc/" target="_blank" rel="noreferrer">Dry weight ↗</a></p></Reveal></div>
      <CarSlot id="specs" />
    </section>
    <section id="craftsmanship" className="craft-studio">
      <SectionLabel number="04">THE HUMAN TOUCH</SectionLabel>
      <div className="craft-title"><Reveal><span className="eyebrow accent">BEYOND THE SURFACE</span><h2>The details<br /><span>make the difference.</span></h2></Reveal><p>Carbon weave, precise stitching and machined metal. An entire world, considered one detail at a time.</p></div>
      <CarGallery />
      <CarSlot id="craft" />
    </section>
    <section id="inquire" className="red-finale">
      <span className="eyebrow accent">THE END OF THE DRIVE. THE START OF AN IDEA.</span><h2>Make an<br /><span>impression.</span></h2>
      <CarSlot id="finale" />
      <div className="finale-bottom"><div><span className="eyebrow">YOUR BRAND COULD FEEL LIKE THIS.</span><p>Let’s build something<br />worth experiencing.</p></div><div className="finale-links"><a href={carData.email} className="button-primary">START A CONVERSATION <Arrow diagonal /></a><a href={carData.portfolio} className="text-link" target="_blank" rel="noreferrer">EXPLORE iBITHUN <Arrow diagonal /></a><Anchor to="#top" className="text-link">TAKE ANOTHER LOOK <Arrow /></Anchor></div></div>
    </section>
  </>;
}
