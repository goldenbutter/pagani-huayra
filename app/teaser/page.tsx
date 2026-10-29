import type { Metadata } from "next";
import { socialImage } from "@/lib/social";
import Link from "next/link";
import "./teaser.css";
export const metadata: Metadata = {
  title: "Huayra BC: Inside the Sculpture | iBithun Concept",
  description: "Watch the red Huayra BC open, separate into an exploded study, and reassemble. An independent cinematic concept by iBithun.",
  alternates: { canonical: "/teaser" },
  openGraph: {
    title: "Huayra BC: Inside the Sculpture",
    description: "A 19-second cinematic engineering study by iBithun.",
    url: "/teaser",
    type: "website",
    siteName: "Pagani Huayra BC | iBithun Concept",
    locale: "en_US",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Huayra BC: Inside the Sculpture",
    description: "A 19-second cinematic engineering study by iBithun.",
    images: [socialImage],
  },
};
export default function TeaserPage() {
  return <main className="teaser-page">
    <header className="teaser-header"><Link href="/" className="teaser-brand">PAGANI <span>HUAYRA BC</span></Link><Link href="/">EXPLORE THE WEBSITE ↗</Link></header>
    <section className="teaser-intro"><p className="eyebrow accent">ROSSO / A CINEMATIC STUDY</p><h1>Inside the<br /><span>sculpture.</span></h1><p>A closer look. The body opens, the engineering comes into view, and every part returns to its place.</p></section>
    <figure className="teaser-film"><video controls playsInline preload="metadata" poster="/media/pagani-anatomy-poster.webp" width="1280" height="720" aria-label="Red Huayra BC opening, exploded study and reassembly"><source src="/media/pagani-anatomy-19s.mp4" type="video/mp4" />Your browser does not support this video. <a href="/media/pagani-anatomy-19s.mp4">Download the film</a>.</video><figcaption><span>00:19 / SILENT FILM / 720P</span><a href="/media/pagani-anatomy-19s.mp4" download>DOWNLOAD THE FILM ↓</a></figcaption></figure>
    <footer className="teaser-footer"><Link href="/">EXPERIENCE IT WITH SCROLL ↗</Link><a href="https://portfolio.ibithun.com" target="_blank" rel="noreferrer">DESIGNED &amp; DEVELOPED BY iBITHUN ↗</a><p>An independent portfolio concept. AI-generated imagery, not a CAD disassembly. Not affiliated with or endorsed by Pagani Automobili. No vehicles are offered for sale.</p></footer>
  </main>;
}
