"use client";
import { useEffect, useRef, useState } from "react";
import { carData } from "@/data/carData";
import { Anchor, Arrow } from "./Primitives";
import { useExperience } from "./ExperienceProvider";
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const { navigate } = useExperience();
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 30);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open) el.showModal();
    else if (el.open) el.close();
    const previous = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };
  return (
    <>
      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <Anchor to="#top" className="brand">
          <span className="brand-emblem" aria-hidden="true">
            P
          </span>
          <span>
            <strong>PAGANI</strong>
            <small>HUAYRA BC</small>
          </span>
        </Anchor>
        <nav aria-label="Main navigation" className="desktop-nav">
          {carData.navigation.map((n) => (
            <Anchor key={n.href} to={n.href}>
              {n.label}
            </Anchor>
          ))}
        </nav>
        <Anchor to="#inquire" className="nav-inquire">
          INQUIRE <Arrow diagonal />
        </Anchor>
        <button
          className="menu-toggle"
          aria-label="Open navigation"
          aria-expanded={open}
          aria-controls="mobile-menu"
          ref={trigger}
          onClick={() => setOpen(true)}
        >
          <span />
          <span />
        </button>
      </header>
      <dialog
        id="mobile-menu"
        className="mobile-menu"
        ref={dialog}
        onCancel={close}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onClose={() => setOpen(false)}
        data-lenis-prevent
      >
        <div className="menu-top">
          <span className="eyebrow">PAGANI / HUAYRA BC</span>
          <button onClick={close} aria-label="Close navigation">
            ×
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {[...carData.navigation, { label: "Inquire", href: "#inquire" }].map(
            (n, i) => (
              <a
                key={n.href}
                href={n.href}
                onClick={(e) => {
                  e.preventDefault();
                  close();
                  navigate(n.href);
                }}
              >
                <span>0{i + 1}</span>
                {n.label}
                <Arrow diagonal />
              </a>
            ),
          )}
        </nav>
        <p className="eyebrow">AN INDEPENDENT CONCEPT BY iBITHUN</p>
      </dialog>
    </>
  );
}
