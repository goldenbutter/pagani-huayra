import TyreLoader from "@/components/TyreLoader";
import { ExperienceProvider } from "@/components/ExperienceProvider";
import Navbar from "@/components/Navbar";
import RedExperience from "@/components/RedExperience";
import Footer from "@/components/Footer";
export default function Home() {
  return (
    <ExperienceProvider>
      <link rel="preload" as="image" href="/assets/studio/scrub-preview.webp" media="(prefers-reduced-motion: no-preference)" />
      <TyreLoader />
      <a className="skip-link" href="#story">
        Skip cinematic experience
      </a>
      <Navbar />
      <main>
        <RedExperience />
      </main>
      <Footer />
    </ExperienceProvider>
  );
}
