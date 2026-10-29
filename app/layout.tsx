import type { Metadata, Viewport } from "next";
import { socialImage } from "@/lib/social";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource-variable/orbitron";
import "@fontsource/rajdhani/400.css";
import "@fontsource/rajdhani/500.css";
import "@fontsource/rajdhani/600.css";
import "@fontsource/rajdhani/700.css";
import "lenis/dist/lenis.css";
import "./globals.css";
import "./studio.css";
import "./gallery.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://demo-pagani.ibithun.com"),
  title: "Huayra BC: The Art of Performance | iBithun Concept",
  description:
    "A red Huayra BC, two cinematic journeys and an interactive exploded study. An independent automotive portfolio concept designed and developed by iBithun.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Huayra BC: Emotion, in Rosso.",
    description: "A cinematic automotive portfolio concept by iBithun.",
    url: "/",
    type: "website",
    siteName: "Pagani Huayra BC | iBithun Concept",
    locale: "en_US",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Huayra BC: An iBithun Concept",
    description: "A cinematic automotive portfolio concept by iBithun.",
    images: [socialImage],
  },
};
export const viewport: Viewport = {
  themeColor: "#fbfbfb",
  colorScheme: "light",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}.studio-film{height:100svh;min-height:700px}.studio-pin{position:relative;min-height:700px}.studio-progress{display:none}`}</style>
        </noscript>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
