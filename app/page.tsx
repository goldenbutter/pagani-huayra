import { ExperienceProvider } from "@/components/ExperienceProvider";
import Navbar from "@/components/Navbar";
import RedExperience from "@/components/RedExperience";
import Footer from "@/components/Footer";
export default function Home() {
  return (
    <ExperienceProvider>
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
