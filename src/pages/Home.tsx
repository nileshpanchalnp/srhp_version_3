import { HeroSection } from '../components/sections/HeroSection';
import { AboutSection } from '../components/sections/AboutSection';
import { FilmographySection } from '../components/sections/FilmographySection';
import { NewsSection } from '../components/sections/NewsSection';
import { ContactSection } from '../components/sections/ContactSection';
import { GenreBands, LampBridge } from '../components/transitions/Transitions';
import { SceneHud } from '../components/transitions/SceneHud';

/**
 * The hero is pinned (sticky) and everything after it scrolls over it, so the
 * Hero → About hand-off is a curtain rising rather than a scroll-away.
 * Every section in the wrapper below has an opaque ground.
 */
const Home = () => (
  <main id="main" className="bg-ink">
    <SceneHud />
    <HeroSection />
    <div className="relative z-10">
      <AboutSection />
      <GenreBands />
      <FilmographySection />
      <NewsSection />
      <LampBridge />
      <ContactSection />
    </div>
  </main>
);

export default Home;
